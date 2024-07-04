import { PhotoIdType } from "../cdn/cdnAssets";
import { _generatedCdnAssets } from "../cdn/cdnAssets.generated";

export type PhotoSize = {
  width: number | undefined;
  height: number | undefined;
};

/**
 * Retrieves the size of a photo identified by the given photo ID.
 *
 * @param {PhotoIdType} photoID - The ID of the photo.
 * @return {Promise<PhotoSize>} A Promise that resolves to the size of the photo.
 */
export const getPhotoSize = async (
  photoID: PhotoIdType,
): Promise<PhotoSize> => {
  const [width, height] = _generatedCdnAssets[photoID].dimensions;
  return {
    width: width ?? undefined,
    height: height ?? undefined,
  };
};
