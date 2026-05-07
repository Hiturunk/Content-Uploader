// Alternate solution: https://discord.com/channels/770287896669978684/1045022925771784332/1045110138794680370

import {
  Form,
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "@remix-run/react";
import axios from "axios";
import type { File } from "nft.storage";
import React, { useState } from "react";
import type { Accept } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import DocsLink from "~/components/docs-link";
import { AMenu } from "~/components/elements";
import { ErrorHandler } from "~/components/error-block";
import { bytesToSize } from "~/utils";

// The 'fs' builtin module on Node.js provides access to the file system

export function ErrorBoundary() {
  const error = useRouteError();
  // console.error({ error });

  return <ErrorHandler error={error} type={isRouteErrorResponse(error)} />;
}

//DropZone Props
const acceptOptions: Accept = {
  "application/zip": [".zip"],
  "image/png": [".png"],
  "image/jpeg": [".jpg"],
  "application/x-rar-compressed": [".rar"],
  "application/x-7z-compressed": [".7z"],
  "audio/mpeg": [".mp3"],
  "video/mp4": [".mp4"],
  "model/gltf+json": [".glb"],
  "text/html": [".html"],
  "application/json": [".json"],
};

export default function Index() {
  const [files, setFiles] = useState<File[]>([]); // explicitly set the type of `files` to `File[]`
  const [isuploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [inputted, setInputted] = useState(false);
  const navigate = useNavigate();

  const acceptOptionsAsString = Object.keys(acceptOptions)
    .map((key) => `${key},${acceptOptions[key]}`)
    .join(",");

  const { getRootProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      console.log("Drop");
      setFiles(acceptedFiles);
      setInputted(true);
    },
    accept: acceptOptions,
  });

  const filesList = files.map((file) => (
    <li key={file.name}>
      {file.name} ({bytesToSize(file.size)})
    </li>
  ));

  async function onSubmit(event: any) {
    event.preventDefault();
    setFormSubmitted(true); // Set form as submitted
    const FD = new FormData();
    files.forEach((file) => {
      FD.append("File", file);
    });

    for (let [key, val] of FD.entries()) {
      console.log(key, val);
    }

    setIsUploading(true);
    axios
      .post("/", FD, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent?.total) {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent?.total || 1) * 99
            );
            setProgress(progress);
          }
        },
      })
      .then((response) => {
        setProgress(100);
        navigate("/validate"); // replace '/validate' with the path you want to navigate to
      })
      .catch((e) => {
        //setIsUploading(false);
        console.error(e);
        throw new Error(e.toString());
      });
  }

  // Handle file upload
  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const fileList = event.target.files;
    const updatedFiles = Array.from(fileList || []).map((file) => file);
    setFiles(updatedFiles);
  }

  return (
    <div className="flex h-full w-full flex-col rounded-b-2xl border-x border-b">
      <Form
        action="upload"
        onSubmit={onSubmit}
        className="uploader relative flex flex-grow flex-col items-center"
        encType="multipart/form-data"
        id="uploader"
      >
        <div className="flex h-full w-full">
          <div className="flex w-1/3 flex-col border-r pt-6">
            <div className="flex-grow px-6">
              <h1 className="text-sm text-[--clr-primary-light-x]">
                ADDING YOUR COLLECTION MEDIA
              </h1>
              <div className="mt-3 flex flex-col gap-6">
                <p className="text-[--clr-primary]">
                  Let's get started, just drag and drop your archive to begin.
                </p>
                <p>Zip it up! One .zip file is all we need.</p>
              </div>
            </div>

            <div>
              <DocsLink
                title="Supported media types"
                href="https://docs.scatter.art/docs/creators/image-sizes"
              />
              <DocsLink
                title="Metadata Standard"
                href="https://docs.scatter.art/docs/creators/metadata-standard"
              />
              <DocsLink
                title="Image sizes"
                href="https://docs.scatter.art/docs/creators/image-sizes"
              />
              <DocsLink
                title="Interactive NFTs"
                href="https://docs.scatter.art/docs/creators/image-sizes#interactive-nfts"
              />
            </div>
          </div>
          <div className="flex w-2/3">
            <div className="relative h-full w-full rounded-lg p-6">
              {isuploading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="flex h-48 w-48 items-center justify-center rounded-lg">
                    {progress}%{progress === 100 && <p>...FINALIZING...</p>}
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <label htmlFor="File">
                    {files.length === 0 && ( // Only render the elements if files.length is 0
                      <div className="flex h-full w-full flex-col items-center justify-center text-center font-semibold">
                        <span className="text-[--clr-primary]">
                          DRAG/DROP ARCHIVE (.ZIP)
                        </span>
                        <div className="mt-2">
                          <div className="button">OR, BROWSE</div>
                        </div>
                      </div>
                    )}
                    {files.length > 0 && (
                      <div className="flex h-full w-full flex-col items-center justify-center text-center text-lg font-semibold text-gray-600">
                        <span>UPLOAD READY TO BEGIN.</span>
                      </div>
                    )}
                    {files.length > 0 && (
                      <ul className="mt-4 text-sm text-white">{filesList}</ul>
                    )}
                  </label>
                  <div {...getRootProps()}>
                    <input
                      id="File"
                      name="eFile"
                      type="file"
                      accept={acceptOptionsAsString}
                      onChange={handleFileUpload}
                      className="hidden"
                      multiple
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-auto w-full">
          <AMenu formSubmitted={formSubmitted} inputted={inputted} />
        </div>
      </Form>
    </div>
  );
}
