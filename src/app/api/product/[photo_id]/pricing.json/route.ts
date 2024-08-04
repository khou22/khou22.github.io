import { NextRequest } from "next/server";
import { getPhotoIDFromURLComponent } from "@/utils/cdn/cdnAssets";
import { photoPricing } from "@/constants/photoPricing";
import { getSnipcartProduct } from "@/utils/snipcart";

export interface ISnipcartValidationResponse {
  /**
   * The ID of the product
   */
  id: string;

  /**
   * The price of the product
   */
  price: number;

  /**
   * The custom fields of the product
   */
  customFields: [];

  /**
   * The URL of the product JSON.
   */
  url: string;
}

interface RouteParams {
  params: { photo_id: string; };
}

export async function GET(
  _request: NextRequest,
  {
    params: {
      photo_id: photoIdURLComponent,
    },
  }: RouteParams,
) {
  const photoID = getPhotoIDFromURLComponent(photoIdURLComponent);
  if (!photoID) {
    console.log(`Photo ID "${photoID}" not found`);
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

  const productVariants = photoPricing.map((p) => {
    const product = getSnipcartProduct(photoID, p);

    const productVariant: ISnipcartValidationResponse = {
      id: product.id,
      price: product.price,
      customFields: [],
      url: product.url,
    };

    return productVariant
  })

  // Return JSON array of product variants
  return new Response(JSON.stringify(productVariants, null, 2), { status: 200 });
}
