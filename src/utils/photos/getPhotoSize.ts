import imageSize from "image-size";
import { PhotoIdType } from "../cdn/cdnAssets";
import { _generatedCdnAssets } from "../cdn/cdnAssets.generated";
import path from "path";

type PhotoSize = {
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
  const filePath = path.join(
    process.cwd(),
    "docs",
    decodeURIComponent(_generatedCdnAssets[photoID].path),
  );
  const size = await imageSize(filePath);
  return {
    width: size.width,
    height: size.height,
  };
};
