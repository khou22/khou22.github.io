import { _generatedCdnAssets } from "../cdn/cdnAssets.generated";

const photoRegex = /.*\.(jpg|jpeg|png)$/;

/**
 * Get a list of all CDN asset keys for photos.
 */
export const getPhotoIDs = (): (keyof typeof _generatedCdnAssets)[] => {
  const allPhotos = Object.entries(_generatedCdnAssets)
    .filter(([id, filePath]) => {
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
