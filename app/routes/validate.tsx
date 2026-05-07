import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Form,
  NavLink,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import * as fsSync from "fs";
import fs from "fs/promises";
import path from "path";
import { useRef } from "react";
import { MdHelpOutline, MdOutlineCheck, MdWarningAmber } from "react-icons/md";
import { ClientOnly } from "remix-utils/client-only";
import { ErrorHandler } from "~/components/error-block";
import { ANIMATED_EXTENSIONS, METAVERSE_EXTENSIONS } from "~/lib/constants";
import {
  filterAndDeleteMetadataFiles,
  getFileType,
  isJSONValid,
  processFilesOnValidate,
  sortMetadata,
  walkDirectory,
} from "~/lib/fileOperations";
import { FileError, validateFiles } from "~/lib/validation";
import {
  deleteIsImage,
  getDirectory,
  setIsImage,
  setIsMetadata,
  setIsValidated,
} from "~/models/note.server";
import { getSession } from "~/session.server";
import { getUploadsDirectory } from "~/utils";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": any;
    }
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request);
  const userId = session.get("userId");
  await setIsValidated(userId, true);
  return redirect(`/storage`);
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error({ error });
  return <ErrorHandler error={error} type={isRouteErrorResponse(error)} />;
}

const NODE_ENV = process.env.NODE_ENV || "production";

export async function loader({ request }: LoaderFunctionArgs) {
  const errors = [] as FileError[];
  const session = await getSession(request);

  let userId = await session.get("userId");
  console.log({ userId });

  if (!userId) {
    console.error(
      "Attempting to validate files but no user ID found. Redirecting to homepage."
    );
    throw redirect("/", 302);
  }

  const directory = await getDirectory(userId);
  console.log({ directory });

  const imagesPath = path.join(
    getUploadsDirectory(directory, NODE_ENV),
    "images"
  );
  const jsonsPath = path.join(getUploadsDirectory(directory, NODE_ENV), "json");
  console.log({ directory, imagesPath, jsonsPath });

  try {
    // Check if directory exists
    await fsSync.promises.access(imagesPath);
  } catch (error) {
    console.log("Directory doesn't exist");
    // Directory doesn't exist, create it
    await deleteIsImage(userId);
    try {
      fsSync.mkdirSync(imagesPath, { recursive: true });
    } catch (err) {
      console.error(`Error creating directory: ${err}`);
    }
  }

  try {
    // Check if directory exists
    await fsSync.promises.access(jsonsPath);
  } catch (error) {
    console.log("Directory doesn't exist");
    // Directory doesn't exist, create it
    await deleteIsImage(userId);
    try {
      fsSync.mkdirSync(jsonsPath, { recursive: true });
    } catch (err) {
      console.error(`Error creating directory: ${err}`);
    }
  }

  // Recursively read the directory and its subdirectories
  const allFiles = await walkDirectory(imagesPath);
  const allJsons = await walkDirectory(jsonsPath);
  let files = allFiles.map((file) => path.basename(file));
  let isAnimated = false;
  let isMetaverse = false;
  const imageExtension = getFileType(files[0]);
  if (ANIMATED_EXTENSIONS.includes(imageExtension)) {
    isAnimated = true;
  }
  if (METAVERSE_EXTENSIONS.includes(imageExtension)) {
    isMetaverse = true;
  }
  const {
    fileNames: mediaFiles,
    invalid,
    imageType,
    previewType,
  } = processFilesOnValidate(files);

  let metadataFiles = [] as { filename: string; content: string }[];

  if (mediaFiles.length >= 1) {
    await setIsImage(userId, true);

    if (allJsons.length >= 1) {
      await setIsMetadata(userId, true);
    }
    // Loop through all metadata files
    for (const file of allJsons) {
      const content = await fs.readFile(file, "utf8"); // Make sure to import fs and use fs.promises.readFile

      metadataFiles.push({ filename: path.basename(file), content });
    }

    // Delete Hidden files from MacOSX!
    metadataFiles = filterAndDeleteMetadataFiles(metadataFiles);

    // In your loader function, sort the mediaFiles and metadataFiles arrays
    metadataFiles.sort(sortMetadata);

    // check if image directory exists
    try {
      await fs.access(imagesPath);
      await fs.access(jsonsPath);
    } catch (error) {
      console.error(
        `The directory ${imagesPath} OR ${jsonsPath} does not exist.`
      );
      errors.push({
        type: "error",
        message: `The directory ${imagesPath} OR ${jsonsPath} does not exist.`,
      });
    }

    if (!allJsons.length || !allFiles.length) {
      console.error("\nNo files found!\n");
      errors.push({
        type: "error",
        message: "No files found.",
      });
    }

    try {
      errors.push(...(await validateFiles(jsonsPath, imagesPath)));
    } catch (error) {
      console.error(`Error validating metadata: ${error}`);
      errors.push({ type: "error", message: "Error validating metadata." });
    }
  }

  return {
    invalid,
    userId,
    directory,
    imageType,
    previewType,
    isAnimated,
    isMetaverse,
    mediaFiles,
    metadataFiles,
    errors,
  };
}

export default function ValidatePage() {
  const loadData = useLoaderData<typeof loader>();

  const {
    mediaFiles,
    directory,
    isAnimated,
    isMetaverse,
    errors,
    metadataFiles: jsons,
  } = loadData;
  const mediaCount = mediaFiles.length;
  const metadataCount = jsons.length;
  const directoryStruct =
    NODE_ENV === "development"
      ? `/tempdata/${directory}/images`
      : `/public/uploads/${directory}/images`;

  const errorMap = new Map<
    string,
    {
      message: string;
      type: string;
      files: { name: string; type: string }[];
      count: number;
    }
  >();

  errors.forEach((error) => {
    const key = `${error.type}-${error.message}`;
    if (errorMap.has(key)) {
      const existingError = errorMap.get(key)!;
      existingError.count += 1;
      if (error.file) {
        existingError.files.push({
          name: error.file.name,
          type: error.file.type,
        });
      }
    } else {
      errorMap.set(key, {
        message: error.message,
        type: error.type,
        files: error.file
          ? [{ name: error.file.name, type: error.file.type }]
          : [],
        count: 1,
      });
    }
  });

  const errorCards = Array.from(errorMap.values());

  const hasFatalErrors = errors.some((error) => error.type === "error");
  const mediaErrors = errors.some(
    (error) => error.dataType === "image" && error.type === "error"
  );
  const metadataErrors = errors.some(
    (error) => error.dataType === "metadata" && error.type === "error"
  );

  return (
    <>
      <main className="grid grid-cols-3 overflow-hidden border-x">
        <div className="col-span-1 flex flex-col gap-4 border-r p-6 text-white">
          <h1 className="text-sm text-[--clr-primary-light-x]">
            {!hasFatalErrors && "LOOKING GOOD!"}
            {hasFatalErrors && "HOLD ON!"}
          </h1>
          <p className="text-[--clr-primary]">
            {!hasFatalErrors &&
              "All clear! Your collection's media is good to go."}
            {hasFatalErrors &&
              "Hmm, we spotted some issues with your collection."}
          </p>
          {!hasFatalErrors && (
            <>
              <p>Happy with what you see? Hit 'CONTINUE' when you're ready.</p>
              <p>
                If you've made a mistake or just want to start over, simply hit
                'RE-UPLOAD'.
              </p>
            </>
          )}
          {hasFatalErrors && (
            <p>When you're ready, you can try again by pressing 'RE-UPLOAD'.</p>
          )}
          <div className="flex flex-col gap-2 pt-8">
            {mediaErrors && (
              <div className="flex justify-between rounded border border-[#d62d6f] p-4">
                <div className="flex flex-col">
                  <h3 className="font-semibold text-[#d62d6f]">
                    ISSUES DETECTED
                  </h3>
                  <p className="text-[--clr-primary]">
                    {mediaCount} media files
                  </p>
                </div>
                <MdWarningAmber className="h-full w-9 text-[#d62d6f]" />
              </div>
            )}
            {metadataErrors && (
              <div className="flex justify-between rounded border border-[#d62d6f] p-4">
                <div className="flex flex-col">
                  <h3 className="font-semibold text-[#d62d6f]">
                    ISSUES DETECTED
                  </h3>
                  <p className="text-[--clr-primary]">
                    {jsons.length} metadata files
                  </p>
                </div>
                <MdWarningAmber className="h-full w-9 text-[#d62d6f]" />
              </div>
            )}
            {!mediaErrors && (
              <div className="flex items-center justify-between rounded border border-[#17654a] p-4">
                <p className="text-[--clr-primary]">{mediaCount} media files</p>
                <MdOutlineCheck className="h-full w-9 text-[#17654a]" />
              </div>
            )}
            {!metadataErrors && (
              <div className="flex items-center justify-between rounded border border-[#17654a] p-4">
                <p className="text-[--clr-primary]">
                  {jsons.length} metadata files
                </p>
                <MdOutlineCheck className="h-full w-9 text-[#17654a]" />
              </div>
            )}

            {errorCards.map((error, index) => {
              return (
                <div key={index}>
                  <ErrorCard error={error} />
                </div>
              );
            })}
          </div>
        </div>
        <div className="col-span-2 grid grid-cols-2 overflow-hidden">
          <div className="min-h-16 col-span-2 flex border-b text-white">
            <div className="min-h-16 flex w-1/2 items-center border-r pl-4">
              <p className="px-1 py-4">MEDIA ({mediaCount.toLocaleString()})</p>
            </div>
            <div className="min-h-16 flex w-1/2 flex-grow items-center pl-4">
              <p className="px-1 py-4">
                METADATA ({metadataCount.toLocaleString()})
              </p>
            </div>
          </div>
          <ClientOnly fallback={null}>
            {() => (
              <MediaScrollArea
                mediaFiles={mediaFiles}
                isAnimated={isAnimated}
                isMetaverse={isMetaverse}
                directoryStruct={directoryStruct}
              />
            )}
          </ClientOnly>
          <MetadataScrollArea metadataFiles={jsons} />
        </div>
      </main>
      <footer className="rounded-b-2xl border p-2 text-white">
        <Form method="POST" className="flex h-16 justify-between">
          <div className="flex items-center px-4 py-2">
            {errors.length > 0 ? "Issues detected in collection!" : ""}
          </div>
          <div className="flex items-center gap-4 p-2">
            <NavLink to="/">
              <div className="button hover:text-black">RE-UPLOAD</div>
            </NavLink>
            <button type="submit" className="button">
              CONTINUE →
            </button>
          </div>
        </Form>
      </footer>
    </>
  );
}

function MediaScrollArea({
  mediaFiles,
  isAnimated,
  isMetaverse,
  directoryStruct,
  aspectRatio = 16 / 9,
}: {
  mediaFiles: string[];
  isAnimated: boolean;
  isMetaverse: boolean;
  directoryStruct: string;
  aspectRatio?: number;
}) {
  const imagesPerRow = 5;
  const viewportWidth = window.innerWidth;
  const imageWidth = viewportWidth / imagesPerRow;
  const imageHeight = imageWidth / aspectRatio;

  const parentRef = useRef(null);
  const rowVirtualizer = useVirtualizer({
    count: mediaFiles.length / imagesPerRow + 1,
    getScrollElement: () => parentRef.current,
    estimateSize: () => imageHeight,
    overscan: 5,
  });

  return (
    <>
      <div ref={parentRef} className="h-full w-full overflow-y-scroll py-2">
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={virtualRow.index}
              className="flex gap-2 px-2 pb-2"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {Array.from({ length: imagesPerRow }).map((_, index) => {
                if (mediaFiles[virtualRow.index * imagesPerRow + index]) {
                  const fileName =
                    mediaFiles[virtualRow.index * imagesPerRow + index];
                  return (
                    <ImageCard
                      key={fileName}
                      fileName={fileName}
                      src={`${directoryStruct}/${fileName}`}
                    />
                  );
                }
                // on the final row, fill up the remaining spots with empty divs
                // to keep the grid layout consistent
                return <div key={index} className="flex h-full w-full"></div>;
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ImageCard({ fileName, src }: { fileName: string; src: string }) {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="rounded-t bg-[--clr-primary] py-1 text-center">
        <h3 className="text-[--clr-ink-on-heavy]">{fileName}</h3>
      </div>
      <img src={src} alt={fileName} className="h-full rounded-b object-cover" />
    </div>
  );
}

function MetadataScrollArea({
  metadataFiles,
}: {
  metadataFiles: { filename: string; content: string }[];
}) {
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: metadataFiles.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 128,
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-full w-full overflow-y-scroll pt-2">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const index = virtualRow.index;
          const json = metadataFiles[index];

          if (json && "content" in json) {
            const validJSONres = isJSONValid(json.content.replace(/\n/g, ""));

            const parsedJSON = validJSONres.valid
              ? JSON.parse(json.content.replace(/\n/g, ""))
              : null;

            return (
              <div
                className="px-2 pb-2"
                key={index}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="flex h-full w-full overflow-hidden rounded border">
                  <div className="sticky top-0 flex h-full w-8 flex-none">
                    <div className="flex h-full items-center justify-center pl-2 text-xs">
                      <h3>{index + 1}</h3>
                    </div>
                  </div>
                  <div className="w-full overflow-x-auto overflow-y-auto">
                    <ClientOnly fallback={null}>
                      {() =>
                        validJSONres.error ? (
                          <pre>{`${validJSONres.error}`}</pre>
                        ) : null
                      }
                    </ClientOnly>
                    <pre>
                      {parsedJSON
                        ? JSON.stringify(parsedJSON, null, 2)
                        : `Invalid JSON: ${json.content}`}
                    </pre>
                  </div>
                </div>
              </div>
            );
          }
          return false;
        })}
      </div>
    </div>
  );
}

function ErrorCard({
  error,
}: {
  error: {
    message: string;
    type: string;
    files: { name: string; type: string }[];
    count: number;
  };
}) {
  return (
    <div className="flex flex-col rounded border p-4">
      <div className="flex w-full items-center justify-between gap-2">
        {error.type === "error" && (
          <MdWarningAmber className="h-full w-9 text-[#d62d6f]" />
        )}
        {error.type === "warning" && (
          <MdHelpOutline className="h-full w-9 text-[#ad830a]" />
        )}
        <div className="w-4/6">
          <p>{error.message.toUpperCase()}</p>
          {error.type === "warning" && (
            <p className="pt-1 text-[--clr-primary-light-x]">
              Is this intentional?
            </p>
          )}
        </div>
        <p className="w-1/6 text-right text-xl text-[--clr-primary]">
          x{error.count}
        </p>
      </div>
    </div>
  );
}
