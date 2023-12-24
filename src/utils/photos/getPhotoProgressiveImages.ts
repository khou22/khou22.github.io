import { PhotoIdType, getCdnAsset, getPhotoThumbnail } from "../cdn/cdnAssets";

/**
 * Construct an error of photo URLs starting with the thumbnail and ending with the highest
 * resolution image. These URLs are ready to be used as `img.src` attributes.
 */
export const getPhotoProgressiveImages = (photoID: PhotoIdType): string[] => {
  const images: string[] = [];
  const thumbnailID = getPhotoThumbnail(photoID);
  if (thumbnailID && thumbnailID !== photoID) {
    images.push(getCdnAsset(thumbnailID));
  }
  images.push(getCdnAsset(photoID));
  return images;
};
