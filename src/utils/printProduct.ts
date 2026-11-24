import {
  PhotoIdType,
  getCdnAsset,
  getPhotoThumbnail,
  getPhotoName,
} from "./cdn/cdnAssets";
import { PhotoPriceVariant } from "@/constants/photoPricing";

/**
 * Provider-neutral product metadata for a photo print (photo + size/material
 * variant). Used to build Stripe Checkout line items and cart UI.
 */
export interface PrintProduct {
  /**
   * Unique product ID in the form `${photoID}_${variant.id}`.
   */
  id: string;
  name: string;
  /**
   * Price in dollars (source of truth: `photoPricing`).
   */
  price: number;
  description: string;
  /**
   * Absolute CDN URL of the photo (thumbnail when available).
   */
  image: string;
}

/**
 * Get unique product metadata for e-commerce for a given photo + size/price.
 */
export const getPrintProduct = (
  photoID: PhotoIdType,
  price: PhotoPriceVariant,
): PrintProduct => {
  let img = getCdnAsset(photoID);
  const thumbnail = getPhotoThumbnail(photoID);
  if (thumbnail) {
    img = getCdnAsset(thumbnail);
  }

  return {
    id: `${photoID}_${price.id}`,
    price: price.price,
    name: `${getPhotoName(photoID)} (${price.name})`,
    description: `High quality ${price.name} photo print of ${getPhotoName(
      photoID,
    )} on ${price.material}.`,
    image: img,
  };
};
