import { PhotoIdType } from "../cdn/cdnAssets";
import { _generatedCdnAssets } from "../cdn/cdnAssets.generated";

const photoRegex = /.*\.(jpg|jpeg|png)$/;

/**
 * Get a list of all photo IDs for the store.
 */
export const getStorePhotoIDs = (): PhotoIdType[] => {
  return Object.entries(_generatedCdnAssets)
    .filter(([_, { path }]) => {
      if (!path.startsWith("/media/store/")) return false;
      const extension = path.split(".").pop();
      if (!extension) return false;
      if (!photoRegex.test(path)) return false;
      return true;
    })
    .map(([id]) => id as PhotoIdType);
};
