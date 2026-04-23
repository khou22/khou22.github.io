import { NextRequest, NextResponse } from 'next/server';
import { photoPricing } from '@/constants/photoPricing';
import { getPhotoName, getCdnAsset, PhotoIdType } from '@/utils/cdn/cdnAssets';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items = body.items;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ items: [] });
    }

    const hydratedItems = items.map((item: any) => {
      const pricing = photoPricing.find((p) => p.id === item.variantId);
      if (!pricing) return null;

      return {
        ...item,
        name: getPhotoName(item.productId as PhotoIdType),
        variantName: pricing.name,
        price: pricing.price,
        image: getCdnAsset(item.productId as PhotoIdType),
      };
    }).filter(Boolean);

    return NextResponse.json({ items: hydratedItems });
  } catch (error) {
    console.error('Failed to hydrate cart', error);
    return NextResponse.json({ error: 'Failed to hydrate cart' }, { status: 500 });
  }
}
