import { siteMetadata } from "./siteMetadata";
import { ISnipcartProduct } from "@/models/snipcart";
import {
  PhotoIdType,
  getCdnAsset,
  getPhotoName,
  getPhotoThumbnail,
} from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";

/**
 * Photo pricing variant.
 */
export type PhotoPriceVariant = {
  id: string;
  name: string;
  price: number;
  widthInches: number;
  heightInches: number;
  inStock: boolean;
};

/**
 * Photo pricing.
 */
export const photoPricing: PhotoPriceVariant[] = [
  {
    id: "4x6",
    name: "4x6",
    price: 8,
    widthInches: 4,
    heightInches: 6,
    inStock: true,
  },
  {
    id: "8x10",
    name: "8x10",
    price: 39,
    widthInches: 8,
    heightInches: 10,
    inStock: true,
  },
  {
    id: "11x14",
    name: "11x14",
    price: 49,
    widthInches: 11,
    heightInches: 14,
    inStock: true,
  },
  {
    id: "12x18",
    name: "12x18",
    price: 59,
    widthInches: 12,
    heightInches: 18,
    inStock: true,
  },
];

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
    url: `${siteMetadata.siteUrl}${PAGES.PHOTOGRAPHY.PHOTO(photoID)}`,
    description: `High quality ${price.name} photo print of ${getPhotoName(
      photoID,
    )}.`,
    image: img,
  };
};
