import fs from "fs";
import path from "path";
import { ANIMATED_EXTENSIONS, METAVERSE_EXTENSIONS } from "./constants";

export async function readFilesFromDirectory(directoryPath: string) {
  try {
    const files = await fs.promises.readdir(directoryPath);
    const filesData = [];

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const fileStats = await fs.promises.stat(filePath);

      if (!fileStats.isDirectory()) {
        const fileContent = await fs.promises.readFile(filePath, "utf-8");

        filesData.push({
          name: file,
          content: fileContent,
        });
      }
    }

    // Sort the filesData array based on the numerical value in the file names
    filesData.sort((a, b) => {
      const numberA = parseInt(a.name.split(".")[0]); // Assuming the file names are in the format "number-fileName"
      const numberB = parseInt(b.name.split(".")[0]);
      return numberA - numberB;
    });

    return filesData;
  } catch (error) {
    console.error("Error reading files from directory:", error);
    return [];
  }
}

export async function isDirectory(path: fs.PathLike) {
  try {
    const stats = await fs.promises.lstat(path);
    return stats.isDirectory();
  } catch (e) {
    console.error(`Error checking if path is a directory: ${e}`);
    return false;
  }
}

export function getFileTypeMIME(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();
  switch (extension) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".bmp":
      return "image/bmp";
    case ".svg":
      return "image/svg+xml";
    case ".zip":
      return "application/zip";
    default:
      return "application/octet-stream";
  }
}

export function getFileType(filePath: unknown): string {
  if (typeof filePath !== "string") {
    return "";
  }

  const extension = path.extname(filePath).toLowerCase();
  return extension;
}

export function getJSONFromText(text: string): unknown {
  try {
    JSON.parse(text);
  } catch (e) {
    return null;
  }
  return JSON.parse(text);
}

export function getTextFromJSON(json: unknown): string {
  try {
    JSON.stringify(json);
  } catch (e) {
    return "";
  }
  return JSON.stringify(json);
}

export function isJSONValid(jsonString: string): {
  valid: boolean;
  error?: string;
} {
  try {
    JSON.parse(jsonString);
    return { valid: true };
  } catch (error: any) {
    return { valid: false, error: error.toString() };
  }
}

export async function deleteDirectory(directoryPath: string) {
  const files = await fs.promises.readdir(directoryPath);
  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stats = await fs.promises.lstat(filePath);
    if (stats.isDirectory()) {
      // Recursively delete subdirectories
      await deleteDirectory(filePath);
    } else {
      // Delete files within the directory
      await fs.promises.unlink(filePath);
    }
  }
  // Finally, delete the empty directory itself
  await fs.promises.rmdir(directoryPath);
}

export function validateFilename(filename: unknown): boolean {
  if (typeof filename !== "string") {
    return false;
  }

  const regex = /^\d+\.\w+$/;
  return regex.test(filename);
}

export function bufferToBlob(buffer: BlobPart, name: string, type: string) {
  // Create a Blob from the buffer with the specified type
  const blob = new Blob([buffer], { type });

  // Get the current timestamp as number
  const lastModified = Date.now();

  // Create a File object from the Blob, setting the name and last modified date
  const file = new File([blob], name, { lastModified });

  return file;
}

//

// Helper function to recursively walk the directory
export async function walkDirectory(dir: string): Promise<string[]> {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  let files: string[] = [];

  for (let entry of entries) {
    const res = path.resolve(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== "__MACOSX") {
        // Skip the __MACOSX directory
        const subFiles = await walkDirectory(res);
        files = files.concat(subFiles);
      }
    } else {
      // We want to ensure all files have lowercase extensions.
      const ext = path.extname(res);
      if (ext) {
        const newExt = ext.toLowerCase();
        const newPath = res.slice(0, -ext.length) + newExt;

        await fs.promises.rename(res, newPath);
        files.push(newPath);
      } else {
        files.push(res);
      }
    }
  }

  return files;
}

export async function walkDirectoryFlatten(userDir: string): Promise<void> {
  // This function will be used to move files and remove directories
  async function processDirectory(dir: string) {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        // Recursively handle all subdirectories first
        await processDirectory(fullPath);
        // After moving all files from the subdirectory, it can be removed
        await fs.promises.rmdir(fullPath);
      } else {
        // Move the file to the user directory, but only if it doesn't exist already
        const targetPath = path.join(userDir, entry.name);
        if (!fs.existsSync(targetPath)) {
          await fs.promises.rename(fullPath, targetPath);
        }
      }
    }
  }

  // Start the process with the user's directory
  await processDirectory(userDir);
}

export async function clearDirectory(directory: string) {
  if (!fs.existsSync(directory)) {
    console.error(`The directory ${directory} does not exist.`);
    fs.mkdirSync(directory, { recursive: true });
    console.log(`Directory created: ${directory}`);
    return;
  }

  fs.rmdirSync(directory, { recursive: true });
  fs.mkdirSync(directory, { recursive: true });

  return true;
}

export async function clearDirectoryOld(directory: string) {
  try {
    await fs.promises.access(directory);
  } catch (error) {
    console.error(`The directory ${directory} does not exist.`);
    return;
  }

  let files = await fs.promises.readdir(directory);
  if (files.length > 0) {
    for (let file of files) {
      let filePath = path.join(directory, file);
      let stat = await fs.promises.lstat(filePath);

      if (stat.isDirectory()) {
        // Recursively clear subdirectories
        await clearDirectoryOld(filePath);
      } else {
        // Remove files
        await fs.promises.unlink(filePath);
      }
    }
  }

  // Remove the main directory after clearing its contents
  await fs.promises.rmdir(directory);
}

//function to see if directory exists and has files using fs.promises.access
export async function checkIfDirectoryExists(directory: fs.PathLike) {
  try {
    await fs.promises.access(directory);
  } catch (error) {
    console.error(`The directory ${directory} does not exist.`);
    return 1;
  }
}

//Slug generation on Scatter in library for inspiration

export function findAvailableSlug(getCollection: Function) {
  return async function findAvailableSlugInner(
    slug: string,
    counter: number = 0
  ): Promise<string> {
    try {
      console.log({ slug, counter });

      const collection = await getCollection(
        slug + (counter === 0 ? "" : `-${counter}`)
      );

      console.log({ collection });

      if (collection) {
        console.log("match found", counter);
        return findAvailableSlugInner(slug, counter + 1);
      } else {
        console.log("no match found", counter);
        return slug + (counter === 0 ? "" : `-${counter}`);
      }
    } catch (error) {
      console.error(slug, error);
      return slug + (counter === 0 ? "" : `-${counter}`);
    }
  };
}

export async function generateUniqueSlug(str: string, getCollection: Function) {
  const slug = toSlug(str);
  const availableSlug = await findAvailableSlug(getCollection)(slug);
  return availableSlug;
}

export function toSlug(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function removeJsonExtensions(
  directoryPath: string
): Promise<void> {
  try {
    // Ensure the directory exists
    const stat = await fs.promises.stat(directoryPath);
    if (!stat.isDirectory()) {
      throw new Error(`${directoryPath} is not a directory.`);
    }

    // Read the directory
    const files: string[] = await fs.promises.readdir(directoryPath);

    // Create a list of rename promises
    const renamePromises: Promise<void>[] = files.map(async (file) => {
      if (path.extname(file) === ".json") {
        const oldPath = path.join(directoryPath, file);
        const newPath = path.join(directoryPath, path.basename(file, ".json"));

        // Rename the file to remove the .json extension
        await fs.promises.rename(oldPath, newPath);
      }
    });

    // Wait for all rename operations to finish
    await Promise.all(renamePromises);
  } catch (err) {
    throw new Error(
      `Failed to remove JSON extensions: ${(err as Error).message}`
    );
  }
}

export async function categorizeFiles(folderPath: string): Promise<void> {
  const imagesFolderPath = path.join(folderPath, "images");
  const jsonFolderPath = path.join(folderPath, "json");

  if (!fs.existsSync(imagesFolderPath)) {
    fs.mkdirSync(imagesFolderPath);
  }

  if (!fs.existsSync(jsonFolderPath)) {
    fs.mkdirSync(jsonFolderPath);
  }

  const files = fs.readdirSync(folderPath);
  const imageExtensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".bmp",
    ".webp",
    ".tiff",
    ".html",
    ".webm",
    ".mp3",
    ".mp4",
    ".gltf",
    ".m4v",
    ".ogv",
    ".ogg",
    ".wav",
    ".oga",
    ".glb",
    ".gltf",
    ".gif",
  ];

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const extname = path.extname(file).toLowerCase();

    if (fs.statSync(filePath).isFile()) {
      if (imageExtensions.includes(extname)) {
        fs.renameSync(filePath, path.join(imagesFolderPath, file));
      } else {
        // Check if the file has a .json extension and strip it
        if (extname === ".json") {
          const newName = path.basename(file, extname); // Strip the extension
          fs.renameSync(filePath, path.join(jsonFolderPath, newName));
        } else {
          fs.renameSync(filePath, path.join(jsonFolderPath, file));
        }
      }
    }
  }
}

//We need to put the files in numerical order.
// Sort function for filenames (images)
export function sortFileNames(a: string, b: string) {
  if (!a || !b) return 0; // handle undefined or null values

  const numA = parseInt(a.split(".")[0], 10);
  const numB = parseInt(b.split(".")[0], 10);

  // Handle NaN values
  if (isNaN(numA) && isNaN(numB)) return 0;
  if (isNaN(numA)) return 1;
  if (isNaN(numB)) return -1;

  return numA - numB;
}

// Sort function for metadata
type MetadataFile = {
  filename: string;
};
export function sortMetadata(a: MetadataFile, b: MetadataFile) {
  if (!a || !b) return 0; // handle undefined or null values

  const numA = parseInt(a.filename);
  const numB = parseInt(b.filename);

  // Handle NaN values
  if (isNaN(numA) && isNaN(numB)) return 0;
  if (isNaN(numA)) return 1;
  if (isNaN(numB)) return -1;

  return numA - numB;
}

export function sortMetadataFiles(
  metadataFiles: { filename: string; content: string }[]
) {
  return metadataFiles.sort((a, b) => {
    const contentA = isJSONValid(a.content) ? JSON.parse(a.content) : {};
    const contentB = isJSONValid(b.content) ? JSON.parse(b.content) : {};
    return sortMetadata(contentA, contentB);
  });
}

export function filterAndDeleteFiles(files: any[]) {
  return files.filter((file) => {
    if (file === ".DS_Store" || file.startsWith("_") || file.startsWith(".")) {
      fs.promises.unlink(path.basename(file)).catch(console.error);
    }
  });
}

export function filterAndDeleteMetadataFiles(
  files: { filename: string; content: string }[]
) {
  // Check if files is defined and is an array
  if (!Array.isArray(files)) {
    console.error("Invalid input: files must be an array");
    return [];
  }

  // Filter out unwanted filenames
  const filteredFiles = files.filter((file) => {
    // Check if file is an object and file.filename is a string
    if (typeof file === "object" && typeof file.filename === "string") {
      const filename = file.filename;
      if (
        filename === ".DS_Store" ||
        filename.startsWith("_") ||
        filename.startsWith(".")
      ) {
        fs.promises.unlink(path.join(__dirname, filename)).catch(console.error);
        return false; // Exclude this file from the new array
      }
    } else {
      console.error("Invalid file object:", file);
    }
    return true; // Include this file in the new array
  });

  // Return the filtered array
  return filteredFiles;
}

export function processFilesOnValidate(files: string[]) {
  const fileNames: string[] = [];
  const imageTypes: string[] = [];
  const invalids: string[] = [];
  let invalid = false;
  let imageType: string | null = null;
  let previewType: string | null = null;

  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    fileNames.push(fileName);

    if (validateFilename(fileName)) {
      let fileType = getFileType(files[i]);
      imageTypes.push(fileType);

      if (ANIMATED_EXTENSIONS.includes(fileType)) {
        imageType = fileType;
      }
      if (METAVERSE_EXTENSIONS.includes(fileType)) {
        imageType = fileType;
      } else {
        previewType = fileType;
      }
    } else {
      invalid = true;
      invalids.push(fileName);
    }
  }
  fileNames.sort(sortFileNames);

  return { fileNames, imageTypes, invalid, invalids, imageType, previewType };
}
