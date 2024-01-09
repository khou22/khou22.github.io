import { NextRequest } from "next/server";
import { siteMetadata } from "@/constants/siteMetadata";
import {
  getCdnAsset,
  getPhotoIDFromURLComponent,
  getPhotoName,
  getPhotoThumbnail,
} from "@/utils/cdn/cdnAssets";
import { PAGES } from "@/utils/pages";
import {
  getProductDescription,
  getProductID,
  photoPricing,
} from "@/constants/photoPricing";

/**
 * Data required for Snipcart validation.
 */
export interface ISnipcartProduct {
  id: string;
  name: string;
  price: number;
  url: string;
  description: string;
  image: string;
}

interface RouteParams {
  params: { photo_id: string; variant_id: string };
}

export async function GET(
  _request: NextRequest,
  { params: { photo_id: photoIdURLComponent, variant_id } }: RouteParams,
) {
  const photoID = getPhotoIDFromURLComponent(photoIdURLComponent);
  if (!photoID) {
    return new Response(
      JSON.stringify(
        {
          error: `Photo ID "${photoID}" not found`,
        },
        null,
        2,
      ),
      { status: 404 },
    );
  }

  const variant = photoPricing.find((p) => p.id === variant_id);
  if (!variant) {
    return new Response(
      JSON.stringify(
        { error: `Product variant "${variant}" not found` },
        null,
        2,
      ),
      { status: 500 },
    );
  }

  let img = getCdnAsset(photoID);
  const thumbnail = getPhotoThumbnail(photoID);
  if (thumbnail) {
    img = getCdnAsset(thumbnail);
  }

  const product: ISnipcartProduct = {
    id: getProductID(photoID, variant),
    price: variant.price,
    name: getPhotoName(photoID),
    url: `${siteMetadata.siteUrl}${PAGES.PHOTOGRAPHY.PHOTO(photoID)}`,
    description: getProductDescription(photoID, variant),
    image: img,
  };

  return new Response(JSON.stringify(product, null, 2), { status: 200 });
}
