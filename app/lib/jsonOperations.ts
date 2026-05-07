import { isJSONValid } from "./fileOperations";

export function replaceImageProperty(
  jsonFile: string,
  imagesCid: string,
  index: string,
  imageExtension: string
) {
  if (isJSONValid(jsonFile)) {
    const json = JSON.parse(jsonFile);
    json.image = "ipfs://" + imagesCid + "/" + index + imageExtension;
    return JSON.stringify(json, null, 2);
  } else {
    console.error("Invalid JSON");
    return JSON.stringify("{error: 'Invalid JSON'}", null, 2);
  }
}

export function replaceAnimationProperty(
  jsonFile: string,
  imagesCid: string,
  index: string,
  imageExtension: string,
  previewExtension: string
) {
  if (isJSONValid(jsonFile)) {
    const json = JSON.parse(jsonFile);
    json.image = "ipfs://" + imagesCid + "/" + index + previewExtension;
    json.animation_url = "ipfs://" + imagesCid + "/" + index + imageExtension;
    return JSON.stringify(json, null, 2);
  } else {
    console.error("Invalid JSON");
    return JSON.stringify("{error: 'Invalid JSON'}", null, 2);
  }
}

export function replaceMetaverseProperty(
  jsonFile: string,
  imagesCid: string,
  index: string,
  imageExtension: string,
  previewExtension: string
) {
  if (isJSONValid(jsonFile)) {
    const json = JSON.parse(jsonFile);
    json.image = "ipfs://" + imagesCid + "/" + index + previewExtension;
    json.vrm_url = "ipfs://" + imagesCid + "/" + index + imageExtension;
    return JSON.stringify(json, null, 2);
  } else {
    console.error("Invalid JSON");
    return JSON.stringify("{error: 'Invalid JSON'}", null, 2);
  }
}
