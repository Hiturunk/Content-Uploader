// Alternate solution: https://discord.com/channels/770287896669978684/1045022925771784332/1045110138794680370
import {
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";

import * as fs from "fs";
import path from "path";
import { authenticate, logout } from "~/session.server";

import { spawn } from "child_process";
import { categorizeFiles, walkDirectoryFlatten } from "~/lib/fileOperations";
import { getDirectory, setIsUpload } from "~/models/note.server";
import { getUploadsDirectory } from "~/utils";
function pray() {
  console.log("For God so loved the world that he gave his only begotten son.");
}

export async function API_Upload(request: Request) {
  const { id } = await authenticate(request);

  if (!id) {
    throw logout(request);
  }

  console.log(`\nUser ${id} initiating upload...\n`);

  const directoryName = await getDirectory(id);

  const NODE_ENV = process.env.NODE_ENV || "production";

  const uploadsDirectory = getUploadsDirectory(directoryName, NODE_ENV);

  console.log({ NODE_ENV, directoryName, uploadsDirectory });

  try {
    // Check if directory exists
    await fs.promises.access(uploadsDirectory);
  } catch (error) {
    // Directory doesn't exist, create it
    try {
      fs.mkdirSync(uploadsDirectory, { recursive: true });
    } catch (err) {
      console.error(`Error creating directory: ${err}`);
    }
  }

  // const fileResolver = (): string => `${uploadsDirectory}/`;

  const uploadHandler = unstable_createFileUploadHandler({
    directory: uploadsDirectory,
    avoidFileConflicts: true,
    file: ({ filename }) => filename,
    maxPartSize: 30000000000, // 30GB
  });

  await unstable_parseMultipartFormData(request, uploadHandler);

  const zipFiles = fs.readdirSync(uploadsDirectory).filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return ext === ".zip" || ext === ".7z" || ext === ".rar";
  });

  let zipPath = "imageZip.zip"; // default file name if no archive is found
  if (zipFiles.length > 0) {
    zipPath = path.join(uploadsDirectory, zipFiles[0]); // takes the first archive file found
    console.log(`Found archive file: ${zipPath}`);
  } else {
    console.log("No archive files found in directory");
  }

  // Wrap the extraction logic in a Promise
  const extractionPromise = new Promise((resolve, reject) => {
    const ls = spawn("7za", ["x", zipPath, `-o${uploadsDirectory}`, "-y"]);

    ls.stdout.on("data", (data: string) => {
      console.log(`stdout: ${data}`);
    });

    ls.stderr.on("data", (data: string) => {
      console.error(`stderr: ${data}`);
    });

    ls.on("close", (code: number) => {
      if (code === 0) {
        resolve("unzip");
      } else {
        reject(new Error(`File extraction failed with code ${code}`));
      }
    });
  });
  try {
    await extractionPromise; // Then start the "unzip" process
  } catch (error) {
    console.error("File extraction error:", error);
  }

  // Delete the zip file
  try {
    await fs.promises.unlink(zipPath);
    //await fs.promises.unlink(fixedZipPath);
  } catch (error) {
    console.error("File extraction error:", error);
  }

  console.log(zipPath + " was deleted");

  await walkDirectoryFlatten(uploadsDirectory);
  await categorizeFiles(uploadsDirectory);
  console.log("User #" + id + " began uploading...");
  setTimeout(pray, 1000);
  await setIsUpload(id, true);
  return new Response(null, { status: 200, statusText: "OK" });
}
