import find from "lodash/find";

import { _generatedCdnAssets } from "./cdnAssets.generated";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://khou22.github.io"
    : "http://localhost:4000";

export type PhotoIdType = keyof typeof _generatedCdnAssets;

/**
 * Get the URL of an asset from the CDN.
 */
export const getCdnAsset = (assetName: PhotoIdType) => {
  return `${baseUrl}${_generatedCdnAssets[assetName].path}`;
};

/**
 * Get all photography photo IDs.
 */
export const getAllPhotographyPhotoIDs = (): PhotoIdType[] => {
  const photoKeys = Object.keys(_generatedCdnAssets).filter(
    (key) =>
      key.startsWith("photography/") &&
      key.endsWith("_jpg") &&
      !key.endsWith("placeholder_jpg"),
  );
  return photoKeys as PhotoIdType[];
};

/**
 * Get the name of a photo (ie. file name without the extension).
 */
export const getPhotoName = (photoID: PhotoIdType) => {
  return _generatedCdnAssets[photoID].name;
};

export const getPhotoPath = (photoID: PhotoIdType) => {
  return decodeURIComponent(_generatedCdnAssets[photoID].path);
};

/**
 * Returns whether the photoID is valid.
 */
export const isPhotoID = (photoIdStr: string): boolean => {
  return Object.keys(_generatedCdnAssets).includes(photoIdStr);
};

/**
 * Cast a string to a photo ID if it is a valid photo ID.
 */
export const castPhotoID = (photoIdStr: string): PhotoIdType | null => {
  if (!photoIdStr || !isPhotoID(photoIdStr)) {
    console.warn(`Invalid photo ID: ${photoIdStr}`);
    return null;
  }
  return photoIdStr as PhotoIdType;
};

/**
 * Get the URL component of a photo ID (ie. the file name from the full path)
 */
export const getPhotoURLComponent = (photoID: PhotoIdType) => {
  const fileName = photoID.split("/").pop();

  if (!fileName) {
    console.warn(`Photo ID '${photoID}' does not start with "photography/"`);
    return photoID;
  }
  return fileName;
};

/**
 * Get the photo ID from a URL component.
 */
export const getPhotoIDFromURLComponent = (urlComponent: string) => {
  // Get the photo ID that ends with the url component.
  const photoID = find(
    Object.keys(_generatedCdnAssets) as PhotoIdType[],
    (fullID) => fullID.endsWith(urlComponent),
  );

  if (!photoID) {
    throw new Error(`Could not parse photo ID from ${urlComponent}`);
  }

  return castPhotoID(photoID);
};

/**
 * Get the thumbnail version of a photo ID.
 */
export const getPhotoThumbnail = (photoID: PhotoIdType): PhotoIdType | null => {
  // If it's already a thumbnail, return it.
  if (photoID.endsWith("_placeholder_jpg")) return photoID;

  // Throw an error if it's not a jpeg.
  if (!photoID.endsWith("_jpg")) {
    throw new Error(`Photo ID '${photoID}' is not a JPEG`);
  }

  // If it's not a /photography/photoID_jpg, throw an error.
  if (!photoID.startsWith("photography/")) {
    throw new Error(`Photo ID '${photoID}' does not start with "photography/"`);
  }

  // Replace the ending `_jpg` with `_placeholder_jpg`
  const thumbnailID = photoID.replace("_jpg", "_placeholder_jpg");
  return castPhotoID(thumbnailID);
};

/**
 * Check if a photo ID is a thumbnail.
 */
export const isThumbnail = (photoID: PhotoIdType): boolean => {
  return photoID.endsWith("_placeholder_jpg");
};

/**
 * Get the original version of a thumbnail.
 */
export const getPhotoForThumbnail = (
  thumbnailID: PhotoIdType,
): PhotoIdType | null => {
  const photoID = thumbnailID.replace("_placeholder_jpg", "_jpg");
  if (!photoID || !isPhotoID(photoID)) {
    throw new Error(`Could not parse photo ID from ${thumbnailID}`);
  }
  return castPhotoID(photoID);
};

/**
 * Convert a path to a photo ID. This is the same key generation used by the Python generation script.
 */
export const pathToPhotoID = (photoPath: string): string => {
  let sanitizedPath = photoPath.replace(/[^a-zA-Z0-9/]+/g, "_");

  // If the path starts with "/photography/", replace with "photography/"
  if (sanitizedPath.startsWith("/photography/")) {
    sanitizedPath = sanitizedPath.replace("/photography/", "photography/");
  }

  if (sanitizedPath.includes(" ") || sanitizedPath.includes(".")) {
    throw new Error("new photo ID cannot contain slashes or dots");
  }

  if (!sanitizedPath.startsWith("photography/")) {
    throw new Error("new photo ID must start with photography/");
  }

  return sanitizedPath;
};
