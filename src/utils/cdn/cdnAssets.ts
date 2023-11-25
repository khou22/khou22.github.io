import { _generatedCdnAssets } from "./cdnAssets.generated";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://khou22.github.io"
    : "http://localhost:4000";

/**
 * Get the URL of an asset from the CDN.
 */
export const getCdnAsset = (assetName: keyof typeof _generatedCdnAssets) => {
  return `${baseUrl}${_generatedCdnAssets[assetName]}`;
};
