import { NextRequest } from "next/server";
import { getPhotoIDFromURLComponent } from "@/utils/cdn/cdnAssets";
import { photoPricing } from "@/constants/photoPricing";
import { getSnipcartProduct } from "@/utils/snipcart";

interface RouteParams {
  params: { photo_id: string; pricing_id: string };
}

export async function GET(
  _request: NextRequest,
  { params: { photo_id: photoIdURLComponent, pricing_id } }: RouteParams,
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

  const variant = photoPricing.find((p) => p.id === pricing_id);
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

  const product = getSnipcartProduct(photoID, variant);
  return new Response(JSON.stringify(product, null, 2), { status: 200 });
}
