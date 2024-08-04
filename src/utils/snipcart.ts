import {
  PhotoIdType,
  getCdnAsset,
  getPhotoThumbnail,
  getPhotoName,
} from "./cdn/cdnAssets";
import { PAGES } from "./pages";
import { PhotoPriceVariant } from "@/constants/photoPricing";
import { siteMetadata } from "@/constants/siteMetadata";

/**
 * Data required for Snipcart validation.
 */
export interface ISnipcartProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;

  /**
   * JSON URL that will be used to validate the Snipcart product
   *
   * Docs: https://docs.snipcart.com/v3/setup/order-validation#json-crawler
   */
  url: string;
}

/**
 * Get unique product metadata for e-commerce for a given photo + size/price.
 */
export const getSnipcartProduct = (
  photoID: PhotoIdType,
  price: PhotoPriceVariant,
): ISnipcartProduct => {
  let img = getCdnAsset(photoID);
  const thumbnail = getPhotoThumbnail(photoID);
  if (thumbnail) {
    img = getCdnAsset(thumbnail);
  }

  return {
    id: `${photoID}_${price.id}`,
    price: price.price,
    name: `${getPhotoName(photoID)} (${price.name})`,
    url: `${siteMetadata.siteUrl}${PAGES.PHOTOGRAPHY.PRODUCT_VALIDATION(photoID)}`,
    description: `High quality ${price.name} photo print of ${getPhotoName(
      photoID,
    )} on ${price.material}.`,
    image: img,
  };
};
