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
 * Get the name of a photo (ie. file name without the extension).
 */
export const getPhotoName = (photoID: PhotoIdType) => {
  return _generatedCdnAssets[photoID].name;
};
