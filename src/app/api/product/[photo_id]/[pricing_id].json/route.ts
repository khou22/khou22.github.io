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
  params: { photo_id: string; pricing_id: string };
}

export async function GET(
  _request: NextRequest,
  { params: { photo_id: photoIdURLComponent, pricing_id: pricingIdURLComponent } }: RouteParams,
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

  // Remove '.json' from pricingIdURLComponent
  const pricingId = pricingIdURLComponent.replace(/\.json$/, "");

  const variant = photoPricing.find((p) => p.id === pricingId);
  if (!variant) {
    console.log(`Product variant "${variant}" not found`);
    return new Response(
      JSON.stringify(
        { error: `Product variant "${variant}" not found` },
        null,
        2,
      ),
      { status: 500 },
    );
  }

  const product = getSnipcartProduct(photoID, variant);

  const response: ISnipcartValidationResponse = {
    id: product.id,
    price: product.price,
    customFields: [],
    url: product.url,
  };

  return new Response(JSON.stringify(response, null, 2), { status: 200 });
}
