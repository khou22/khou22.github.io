import { PhotoIdType } from "../cdn/cdnAssets";
import { _generatedCdnAssets } from "../cdn/cdnAssets.generated";

const photoRegex = /.*\.(jpg|jpeg|png)$/;

/**
 * Get a list of all CDN asset keys for photos.
 */
export const getPhotoIDs = (): PhotoIdType[] => {
  const allPhotos = Object.entries(_generatedCdnAssets)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .filter(([id, { path: filePath }]) => {
      if (!filePath.startsWith("/photography/")) {
        return false;
      }
      const extension = filePath.split(".").pop();
      if (!extension) {
        return false;
      }

      // If the path is not a photo, return false.
      if (!photoRegex.test(filePath)) {
        return false;
      }

      // Also filter out .placeholder.ext files
      return !filePath.endsWith(`.placeholder.${extension}`);
    })
    .map(([id, _filePath]) => id as keyof typeof _generatedCdnAssets);

  return allPhotos;
};
