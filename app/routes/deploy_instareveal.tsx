//Give final instructions to user then redirect to scatter.art's mint page w/ URI
import type { ActionFunctionArgs } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useActionData,
  useRouteError,
} from "@remix-run/react";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import { useState } from "react";
import { DMenu } from "~/components/elements";
import { ANIMATED_EXTENSIONS, METAVERSE_EXTENSIONS } from "~/lib/constants";
import { ErrorHandler } from "~/components/error-block";
import { getFileType, getFileTypeMIME } from "~/lib/fileOperations";
import {
  replaceAnimationProperty,
  replaceImageProperty,
  replaceMetaverseProperty,
} from "~/lib/jsonOperations";
import {
  addPreviousUpload,
  getApiKey,
  getSelectedProvider,
  getUserDetails,
  setIsImage,
  setIsMetadata,
  setIsUpload,
  setIsValidated,
  writeApiKey,
} from "~/models/note.server";
import { authenticate, getSession } from "~/session.server";
import { getUploadsDirectory } from "~/utils";

const INSTAREVEAL_API = process.env.INSTAREVEAL_API;
const { spawn } = require("child_process");

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
    console.log("failure in loader on deployment for Instareveal", error);
    return {
      userId: "ERROR",
      apiKey: "ERROR",
    };
  }
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const userData = await authenticate(request);

    if (!userData.id || !userData.directory) {
      throw new Error("Invalid session");
    }

    const { directory: directoryName, id: userId } = userData;

    const NODE_ENV = process.env.NODE_ENV || "production";

    const uploadsDirectory = getUploadsDirectory(directoryName, NODE_ENV);
    const formdata = await request.formData();

    const provider = await getSelectedProvider(userId);
    let apiKey = await getApiKey(userId, provider);
    const apiKeyFromForm = formdata.get("apiKey") ?? "";
    const collectionFromForm = formdata.get("collection") ?? "";
    const contractFromForm = formdata.get("contract") ?? "";
    if (typeof contractFromForm === "string") {
      const regexPattern = /^0x[a-fA-F0-9]{40}$/; // Regex for validation
      if (!regexPattern.test(contractFromForm)) {
        // If the contract does not match the pattern, throw an error
        throw new Error(
          "Contract address must start with 0x and be exactly 40 characters long."
        );
      }
    } else {
      // If contractFromForm is not a string, you may want to handle this as well
      throw new Error("Contract address is not a valid string.");
    }
    if (apiKeyFromForm !== null) {
      writeApiKey(userId, provider, apiKeyFromForm.toString());
    }

    let imagesArray = [];
    let imagesCid = "REPLACEME";
    let metadataCid = "";
    console.log("User #" + userId + " started uploading files.");
    const zipFileName = directoryName.replace(/[^a-zA-Z0-9]/g, "") + ".zip";
    const zipFilePath = path.join(uploadsDirectory, zipFileName);
    const imagesPath = path.join(uploadsDirectory, "images");
    const userDetails = await getUserDetails(userId);
    if (!userDetails || !userDetails.isImage || !userDetails.isMetadata) {
      throw new Error("User details not found");
    }
    const isImage = userDetails.isImage.isTrue;
    const isMetadata = userDetails.isMetadata.isTrue;
    let imageType = "";
    let previewType = "";
    let imageTypes = [];

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
    }
    //Check if jsonPath exists
    const jsonPath = path.join(uploadsDirectory, "json");
    if (isMetadata === true) {
      const jsons = fs.readdirSync(jsonPath);
      for (const json of jsons) {
        const filePath = path.join(jsonPath, json);
        const fileStats = fs.statSync(filePath);
        if (isImage === true) {
          console.log(imageType);
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
            fs.writeFileSync(filePath, updatedContent);
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
            fs.writeFileSync(filePath, updatedContent);
          } else if (!fileStats.isDirectory()) {
            const fileContent = fs.readFileSync(filePath);
            const updatedContent = replaceImageProperty(
              fileContent.toString(),
              imagesCid,
              json,
              imageType
            );
            fs.writeFileSync(filePath, updatedContent);

            // Remove the file
          }
        }
      }
      imagesArray = [];
      const zipProcess = spawn("zip", ["-r", zipFileName, "images/", "json/"], {
        cwd: uploadsDirectory,
      });

      const baseURI = await new Promise<string | null>((resolve, reject) => {
        zipProcess.stdout.on("data", (data: any) => {
          console.log(`stdout: ${data}`);
        });

        zipProcess.stderr.on("data", (data: any) => {
          console.error(`stderr: ${data}`);
        });
        zipProcess.on("close", async (code: number) => {
          if (code === 0) {
            console.log(zipFilePath);
            // Create a ReadStream for the file
            const file = fs.createReadStream(zipFilePath);
            // Prepare the request data
            const formData = new FormData();
            // Append the file to FormData with the correct filename and content type
            formData.append("uploadfile", file, {
              filename: zipFileName,
              contentType: getFileTypeMIME(".zip"), // You need to implement getFileTypeMIME() function
            });

            formData.append("apiKey", apiKeyFromForm);
            console.log(apiKey);
            console.log("User ID:", userId);
            console.log("API Key:", apiKeyFromForm);

            // Make the HTTP request using axios
            const apiUrl = INSTAREVEAL_API + "/fileUpload/";
            try {
              axios
                .post(apiUrl, formData, {
                  headers: formData.getHeaders(),
                  maxBodyLength: Infinity,
                  maxContentLength: Infinity,
                })
                .catch((error) => {
                  throw new Error("Error Uploading: " + error.message);
                });
            } catch (error) {
              console.error("Unhandled Error:", error);
              reject(error);
            }
            console.log("User #" + userId + " finished uploading files.");
            console.log("Submarining Content...");
            const submarineUrl = INSTAREVEAL_API + "/runsubmarine";
            const requestData = {
              name: collectionFromForm.toString(),
              apiKey: apiKeyFromForm,
              zip: zipFileName,
              address: contractFromForm.toString(),
            };
            console.log(requestData);
            try {
              await axios
                .post<{
                  data: { baseURI: string };
                  error: { code: number; message: string };
                }>(submarineUrl, requestData)
                .then((response) => {
                  console.log("Submarined! Response Data:", response.data);

                  // Assign response.data.baseURI to baseURI
                  const baseURI = response.data.data.baseURI.toString();

                  console.log("Base URI:", baseURI);
                  resolve(baseURI);
                  console.log("response finished");
                })
                .catch((error) => {
                  console.error("Error while making request:", error);
                  throw new Error(
                    "Submarine failed with response: " +
                      JSON.stringify(error.response.data.error)
                  );
                });
            } catch (error) {
              console.error("Unhandled Error:", error);
              reject(error);
            }
          }
        });
      });

      if (!baseURI) {
        throw new Error("Submarine failed");
      }
      if (baseURI) {
        const baseURIParts = baseURI.toString().split(",");
        const baseURIParts1 = baseURIParts[0].split("://");
        const cleanedBaseURI = baseURIParts1[1];
        const baseURIStructured = "ipfs://" + cleanedBaseURI;
        console.log("Cleaned Base URI:", cleanedBaseURI);

        console.log("Base URI:", baseURI);
        fs.rmdirSync(uploadsDirectory, { recursive: true });
        await addPreviousUpload(
          collectionFromForm.toString(),
          userId,
          baseURIStructured,
          imagesCid,
          [],
          imageTypes.length
        );
        await setIsImage(userId, false);
        await setIsMetadata(userId, false);
        await setIsUpload(userId, false);
        await setIsValidated(userId, false);
        console.log("User #" + userId + " finished uploading files.");
        return {
          apiKey,
          provider,
          imagesCid,
          metadataCid,
          cleanedBaseURI,
        };
      } else {
        return {
          apiKey,
          provider,
          imagesCid,
          metadataCid,
          cleanedBaseURI: "ERROR",
        };
      }
    }
  } catch (error: any) {
    console.error("General Try/Catch error of the entire block on D.", error);
    throw new Error("General Try/Catch error of the entire block on D.", error);
  }
}
type LoadDataType = {
  body: string;
  provider: string;
  imagesCid: string;
  metadataCid: string;
  cleanedBaseURI: string;
  // Add other properties if needed
};
export default function Page() {
  const loadData = useActionData<LoadDataType>();
  let baseURI = "LOADING...";
  let gateway = baseURI;

  if (loadData) {
    baseURI = loadData.cleanedBaseURI;
    gateway = "https://cloud.instareveal.art/ipfs/" + baseURI;
  }
  const baseURIStruct = "ipfs://" + baseURI;

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
  const containerStyle = "flex flex-col justify-center items-stretch h-full";
  const topRowStyle = "flex justify-between";
  const divStyle =
    "shadow-lg rounded-lg border-2 p-4 w-1/3 mx-5 my-5 break-all text-left text-xs";
  const bottomRowStyle =
    "flex justify-between justify-center border-2 border-white rounded mt-10 mx-10 text-center";
  const bottomRow1Style =
    "flex justify-between justify-center border-2 border-white rounded mb-10 mt-1 mx-10 text-center";
  const headerStyle = "border-b-2 border-white w-full";
  const footerStyle = "border-t-2 border-white";

  async function handleSubmit() {}

  return (
    <div className="text-1xl h-full w-full rounded-2xl text-center tracking-tight">
      <Form onSubmit={handleSubmit} method="POST" className="h-full">
        <div className={containerStyle}>
          <div className={topRowStyle}>
            <div className={divStyle}>
              <p className={headerStyle}>01 Deploy Images</p>
              <div className="my-10 text-center">✓</div>
              <p className={footerStyle}>✓COMPLETE</p>
            </div>
            <div className="mx-5 my-5 w-1/3 break-all rounded-lg border-2 p-4 text-center text-xs shadow-lg">
              <p className={headerStyle}>02 Apply Images to Metadata</p>
              <p className="my-10">100%</p>
              <p className={footerStyle}>✓COMPLETE</p>
            </div>
            <div className={divStyle}>
              <p className={headerStyle}>03 Deploy Metadata</p>
              <div className="my-10 text-center">✓</div>
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
