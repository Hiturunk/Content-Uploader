import crypto from "crypto";
import fs from "fs";
import path from "path";
import {
  ANIMATED_EXTENSIONS,
  IMAGE_EXTENSIONS,
  METAVERSE_EXTENSIONS,
} from "./constants";

function md5(filePath: string): string {
  const hash = crypto.createHash("md5");
  const fileBuffer = fs.readFileSync(filePath);
  hash.update(fileBuffer);
  return hash.digest("hex");
}

export interface FileError {
  type: "warning" | "error";
  message: string;
  dataType?: "image" | "metadata";
  file?: {
    type: "image" | "metadata";
    name: string;
  };
}

export function validateFiles(
  pathToJsonFiles: string,
  pathToImageFiles: string
): FileError[] {
  const errors: FileError[] = [];
  const duplicateImages: { [key: string]: string[] } = {};
  let validJson = true;
  const malformedJson: string[] = [];
  const uniqueAttributes: { [key: string]: string } = {};
  const duplicateAttributes: { [key: string]: string[] } = {};
  const imageFiles = fs
    .readdirSync(pathToImageFiles)
    .filter((file) => fs.statSync(path.join(pathToImageFiles, file)).isFile());
  const jsonFiles = fs
    .readdirSync(pathToJsonFiles)
    .filter(
      (file) =>
        fs.statSync(path.join(pathToJsonFiles, file)).isFile() &&
        (file.endsWith(".json") || isNumeric(file))
    );
  const image_name_errors = new Set<string>();

  imageFiles.forEach((imageFile) => {
    const filePath = path.join(pathToImageFiles, imageFile);
    const fileHash = md5(filePath);
    if (duplicateImages[fileHash]) {
      duplicateImages[fileHash].push(imageFile);
      errors.push({
        type: "error",
        message: "Duplicate image found",
        dataType: "image",
        file: { type: "image", name: imageFile },
      });
    } else {
      duplicateImages[fileHash] = [imageFile];
    }
  });

  jsonFiles.forEach((jsonFile) => {
    const filePath = path.join(pathToJsonFiles, jsonFile);
    if (jsonFile === ".DS_Store") {
      return;
    }
    try {
      const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const attributes = jsonData.attributes;
      const attributesStr = JSON.stringify(attributes, null, 2);

      if (uniqueAttributes[attributesStr]) {
        if (!duplicateAttributes[attributesStr]) {
          duplicateAttributes[attributesStr] = [];
        }
        duplicateAttributes[attributesStr].push(jsonFile);
        errors.push({
          type: "warning",
          message: "JSON files with the same attributes found",
          dataType: "metadata",
          file: { type: "metadata", name: jsonFile },
        });
      } else {
        uniqueAttributes[attributesStr] = jsonFile;
      }

      let expectedImageName = jsonFile;
      if (jsonFile.includes(".json")) {
        expectedImageName = jsonFile.split(".").slice(0, -1).join(".");
      }
      const expectedImageExts = [
        ...IMAGE_EXTENSIONS,
        ...ANIMATED_EXTENSIONS,
        ...METAVERSE_EXTENSIONS,
      ];
      let imageFound = false;
      for (const ext of expectedImageExts) {
        if (imageFiles.includes(`${expectedImageName}${ext}`)) {
          imageFound = true;
          break;
        }
      }
      if (!imageFound) {
        image_name_errors.add(jsonFile);
        errors.push({
          type: "error",
          message: `Missing media for metadata file ${jsonFile}`,
          dataType: "image",
          file: { type: "metadata", name: jsonFile },
        });
      }
    } catch (error) {
      validJson = false;
      malformedJson.push(jsonFile);
      errors.push({
        type: "error",
        message: "Malformed JSON file",
        dataType: "metadata",
        file: { type: "metadata", name: jsonFile },
      });
    }
  });
  console.log({ validJson });
  return errors;
}

function isNumeric(str: string) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str as any) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}
