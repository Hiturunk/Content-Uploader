//Give final instructions to user then redirect to scatter.art's mint page w/ URI
import type { ActionFunctionArgs } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useActionData,
  useRouteError,
} from "@remix-run/react";
import fs from "fs";
import { File } from "nft.storage";
import path from "path";
import { useState } from "react";
import { DMenu } from "~/components/elements";
import { storeNFT } from "~/components/nftdotstorage";
import { ANIMATED_EXTENSIONS, METAVERSE_EXTENSIONS } from "~/lib/constants";
import { ErrorHandler } from "~/components/error-block";
import {
  getFileType,
  getFileTypeMIME,
  removeJsonExtensions,
} from "~/lib/fileOperations";
import {
  replaceAnimationProperty,
  replaceImageProperty,
  replaceMetaverseProperty,
} from "~/lib/jsonOperations";
import {
  addPreviousUpload,
  getApiKey,
  getDirectory,
  getSelectedProvider,
  getUserDetails,
  setIsImage,
  setIsMetadata,
  setIsUpload,
  setIsValidated,
  writeApiKey,
} from "~/models/note.server";
import { getSession } from "~/session.server";
import { getUploadsDirectory } from "~/utils";

export function ErrorBoundary() {
  const error = useRouteError();
  return <ErrorHandler error={error} type={isRouteErrorResponse(error)} />;
}

export async function loader({ request }: { request: Request }) {
  try {
    const session = await getSession(request);
    let userId = await session.get("userId");
    let provider = await getSelectedProvider(userId);
    let apiKey = await getApiKey(userId, provider);
    return {
      userId,
      apiKey,
    };
  } catch (error) {
    console.log("Error in Loader on Deploy.tsx:" + error);
    return {
      userId: "Error",
      apiKey: "Error",
    };
  }
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const session = await getSession(request);
    let userId = await session.get("userId");
    const userDetails = await getUserDetails(userId);
    if (!userDetails || !userDetails.isImage || !userDetails.isMetadata) {
      throw new Error("User details not found");
    }
    const isImage = userDetails.isImage.isTrue;
    const isMetadata = userDetails.isMetadata.isTrue;
    console.log("User is Uploading Images?:" + isImage);
    console.log("User is Uploading Metadata?:" + isMetadata);
    const directoryName = await getDirectory(userId);
    const NODE_ENV = process.env.NODE_ENV || "production";
    const uploadsDirectory = getUploadsDirectory(directoryName, NODE_ENV);
    const formdata = await request.formData();
    const apiKeyFromForm = formdata.get("apiKey");
    const provider = await getSelectedProvider(userId);
    if (apiKeyFromForm !== null) {
      await writeApiKey(userId, provider, apiKeyFromForm.toString());
      console.log(await getApiKey(userId, provider));
    }

    let imagesArray = [];
    let jsonsArray = [];
    let imagesCid = "";
    let metadataCid = "";
    let imageType = "";
    let previewType = "";
    let imageTypes = [];
    if (!apiKeyFromForm) {
      throw new Error("No API Key provided.");
    }
    console.log("User is uploading from directory:" + uploadsDirectory);
    const imagesPath = path.join(uploadsDirectory, "images");
    //Check if imagesPath exists
    if (isImage === true) {
      const files = fs.readdirSync(imagesPath);

      for (const file of files) {
        const filePath = path.join(imagesPath, file);
        const fileStats = fs.statSync(filePath);

        if (!fileStats.isDirectory()) {
          const fileContent = fs.readFileSync(filePath);
          const type = getFileTypeMIME(file);
          let imageType = getFileType(file);
          imagesArray.push(new File([fileContent], file, { type }));
          imageTypes.push(imageType);
          // Remove the file
          fs.unlinkSync(filePath);
        }
      }

      imageType = imageTypes[0];
      previewType = imageTypes[0];
      for (let i = 0; i < imageTypes.length; i++) {
        if (ANIMATED_EXTENSIONS.includes(imageTypes[i])) {
          imageType = imageTypes[i];
        }
        if (METAVERSE_EXTENSIONS.includes(imageTypes[i])) {
          imageType = imageTypes[i];
        } else {
          previewType = imageTypes[i];
        }
      }
      try {
        //fs.rmdirSync(path.join(uploadsDirectory, "images"));
      } catch (error) {
        console.error("Error deleting images directory:", error);
      }
      console.log("uploading images to nft.storage");
      imagesCid = await storeNFT(imagesArray, apiKeyFromForm.toString());
    }
    //Check if jsonPath exists
    const jsonPath = path.join(uploadsDirectory, "json");
    if (isMetadata === true) {
      await removeJsonExtensions(jsonPath)
        .then(() => {
          console.log("Successfully removed .json extensions.");
        })
        .catch((err: { message: any }) => {
          console.error(`Error: ${err.message}`);
        });
      const jsons = fs.readdirSync(jsonPath);
      for (const json of jsons) {
        const filePath = path.join(jsonPath, json);
        const fileStats = fs.statSync(filePath);
        if (isImage === true) {
          if (
            ANIMATED_EXTENSIONS.includes(imageType) &&
            !fileStats.isDirectory()
          ) {
            const fileContent = fs.readFileSync(filePath);
            let updatedContent = replaceAnimationProperty(
              fileContent.toString(),
              imagesCid,
              json,
              imageType,
              previewType
            );
            const type = getFileType(json);
            jsonsArray.push(new File([updatedContent], json, { type }));
          } else if (
            METAVERSE_EXTENSIONS.includes(imageType) &&
            !fileStats.isDirectory()
          ) {
            const fileContent = fs.readFileSync(filePath);
            let updatedContent = replaceMetaverseProperty(
              fileContent.toString(),
              imagesCid,
              json,
              imageType,
              previewType
            );
            const type = getFileType(json);
            jsonsArray.push(new File([updatedContent], json, { type }));
          } else if (!fileStats.isDirectory()) {
            const fileContent = fs.readFileSync(filePath);
            const updatedContent = replaceImageProperty(
              fileContent.toString(),
              imagesCid,
              json,
              imageType
            );
            const type = getFileType(json);
            jsonsArray.push(new File([updatedContent], json, { type }));
          }
        }
      }
      imagesArray = [];

      metadataCid = await storeNFT(jsonsArray, apiKeyFromForm.toString());

      console.log("User #" + userId + " finished uploading files.");
      console.log("BaseURI:" + metadataCid);
    }
    fs.rmdirSync(uploadsDirectory, { recursive: true });
    await addPreviousUpload(
      "nft-dot-storage upload",
      userId,
      metadataCid,
      imagesCid,
      [],
      imageTypes.length
    );
    await setIsImage(userId, false);
    await setIsMetadata(userId, false);
    await setIsValidated(userId, false);
    await setIsUpload(userId, false);
    console.log("User #" + userId + " finished uploading files.");

    //await logout(request);
    imagesCid = imagesCid.toString();
    metadataCid = metadataCid.toString();
    return {
      apiKeyFromForm,
      provider,
      imagesCid,
      metadataCid,
    };
  } catch (error) {
    console.error("Error uploading files:", error);
    console.log("This is the error:" + error);
    throw new Error("Error uploading files:" + error);
  }
}
type LoadDataType = {
  body: string;
  provider: string;
  imagesCid: string;
  metadataCid: string;
  // Add other properties if needed
};
export default function Page() {
  const loadData = useActionData<LoadDataType>();
  let metadataCid = "";
  let imagesCid = "";
  let baseURI = "LOADING...";
  let gateway = baseURI;

  if (loadData) {
    metadataCid = loadData.metadataCid;
    imagesCid = loadData.imagesCid;
    gateway = "https://cloud.instareveal.art/ipfs/" + metadataCid;
  }
  const baseURIStruct = "ipfs://" + metadataCid + "/";

  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(baseURIStruct);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  const [copiedGateway, setCopiedGateway] = useState(false);
  const handleCopyGateway = () => {
    navigator.clipboard.writeText(gateway);
    setCopiedGateway(true);
    setTimeout(() => {
      setCopiedGateway(false);
    }, 2000);
  };
  const containerStyle =
    "flex flex-col justify-center items-stretch h-full w-full";
  const topRowStyle = "flex justify-between";
  const divStyle =
    "shadow-lg rounded-lg border-2 p-4 w-1/3 mx-5 my-5 break-all text-left text-xs";
  const bottomRowStyle =
    "flex justify-between justify-center border-2 border-white rounded my-10 mx-10";
  const bottomRow1Style =
    "flex justify-between justify-center border-2 border-white rounded mb-10 mt-1 mx-10 text-center";
  const headerStyle = "border-b-2 border-white w-full";
  const footerStyle = "border-t-2 border-white";

  async function handleSubmit() {}

  return (
    <div className="text-1xl h-full w-full rounded-b border-x border-b text-center tracking-tight">
      <Form onSubmit={handleSubmit} method="POST" className="h-full">
        <div className={containerStyle}>
          <div className={topRowStyle}>
            <div className={divStyle}>
              <p className={headerStyle}>01 Deploy Images</p>
              <div className="my-10">CID: {imagesCid}</div>
              <p className={footerStyle}>✓COMPLETE</p>
            </div>
            <div className="mx-5 my-5 w-1/3 break-all rounded-lg border-2 p-4 text-center text-xs shadow-lg">
              <p className={headerStyle}>02 Apply Images to Metadata</p>
              <p className="my-10">100%</p>
              <p className={footerStyle}>✓COMPLETE</p>
            </div>
            <div className={divStyle}>
              <p className={headerStyle}>03 Deploy Metadata</p>
              <div className="my-10">CID: {metadataCid}</div>
              <p className={footerStyle}>✓COMPLETE</p>
            </div>
          </div>
          <div className={`${bottomRowStyle}`}>
            <div className="w-1/3 border-r-2 p-10">Base URI:</div>
            <div className="overflow-x-auto p-10"> {baseURIStruct}</div>
            <div className="border-l-2 p-10">
              <button
                type="button"
                onClick={handleCopy}
                className="ml-2 hover:text-blue-500"
              >
                {copied ? "✓" : "📋"}
              </button>
            </div>
          </div>
          <div className={`${bottomRow1Style}`}>
            <div className="w-1/3 border-r-2 p-10">Gateway:</div>
            <div className="overflow-x-auto p-10"> {gateway}</div>
            <div className="border-l-2 p-10">
              <button
                type="button"
                onClick={handleCopyGateway}
                className="ml-2 hover:text-blue-500"
              >
                {copiedGateway ? "✓" : "📋"}
              </button>
            </div>
          </div>
        </div>
      </Form>
      <DMenu />
    </div>
  );
}
