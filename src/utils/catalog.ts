import {
  PhotoIdType,
  getCdnAsset,
  getPhotoThumbnail,
  getPhotoName,
} from "./cdn/cdnAssets";
import { PAGES } from "./pages";
import { photoPricing } from "@/constants/photoPricing";
import { siteMetadata } from "@/constants/siteMetadata";

export interface CatalogProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  isDigital: boolean;
  url: string;
}

/**
 * Get core product details from the catalog.
 */
export function getProductDetails(
  photoID: PhotoIdType,
  variantId: string,
): CatalogProduct | null {
  const variant = photoPricing.find((v) => v.id === variantId);
  if (!variant) {
    return null;
  }

  let img = getCdnAsset(photoID);
  const thumbnail = getPhotoThumbnail(photoID);
  if (thumbnail) {
    img = getCdnAsset(thumbnail);
  }

  const isDigital = false;
  return {
    id: `${photoID}_${variant.id}`,
    price: variant.price,
    name: `${getPhotoName(photoID)} (${variant.name})`,
    isDigital,
    url: `${siteMetadata.siteUrl}${PAGES.PHOTOGRAPHY.PRODUCT_VALIDATION(
      photoID,
    )}`,
    description: `High quality ${variant.name} photo print of ${getPhotoName(photoID)} on ${variant.material}.`,
    image: img,
  };
}
