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
    price: 59,
    widthInches: 11,
    heightInches: 14,
    inStock: true,
  },
];
