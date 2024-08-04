export enum PhotoPrintMaterial {
  PhotoPaper = "Photo Paper",
  GlossyMetal = "Glossy Metal",
}

/**
 * Photo pricing variant.
 */
export type PhotoPriceVariant = {
  /**
   * Unique ID (must include size and material)
   */
  id: string;
  /**
   * Human readable name for Snipcart purposes.
   */
  name: string;
  price: number;
  material: PhotoPrintMaterial;
  widthInches: number;
  heightInches: number;
  inStock: boolean;
};

/**
 * Photo pricing.
 */
export const photoPricing: PhotoPriceVariant[] = [
  {
    id: "4x6-photo-paper",
    name: "4x6",
    price: 8.00,
    material: PhotoPrintMaterial.PhotoPaper,
    widthInches: 4,
    heightInches: 6,
    inStock: true,
  },
  {
    id: "8x10-photo-paper",
    name: "8x10",
    price: 29.00,
    material: PhotoPrintMaterial.PhotoPaper,
    widthInches: 8,
    heightInches: 10,
    inStock: true,
  },
  {
    id: "11x14-photo-paper",
    name: "11x14",
    price: 49.00,
    material: PhotoPrintMaterial.PhotoPaper,
    widthInches: 11,
    heightInches: 14,
    inStock: true,
  },
  {
    id: "12x18-photo-paper",
    name: "16x20",
    price: 79.00,
    material: PhotoPrintMaterial.PhotoPaper,
    widthInches: 12,
    heightInches: 18,
    inStock: true,
  },
  {
    id: "11x14-metal",
    name: "11x14 Metal",
    price: 149.00,
    material: PhotoPrintMaterial.GlossyMetal,
    widthInches: 11,
    heightInches: 14,
    inStock: true,
  },
  {
    id: "16x20-metal",
    name: "16x20 Metal",
    price: 299.00,
    material: PhotoPrintMaterial.GlossyMetal,
    widthInches: 16,
    heightInches: 20,
    inStock: true,
  },
];
