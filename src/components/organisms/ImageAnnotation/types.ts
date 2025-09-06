export interface BoundingBoxSelection {
  // Left position as percentage of image width
  x: number;

  // Top position as percentage of image height
  y: number;

  // Width as percentage of image width
  width: number;

  // Height as percentage of image height
  height: number;

  // Original image width in pixels.
  originalWidthPx: number;

  // Original image height in pixels.
  originalHeightPx: number;

  // Base64 encoded PNG of the cropped region
  imageBase64: string;
}

export interface ImageAnnotationProps {
  imageUrl: string;
  onBoundingBoxSelection: (selection: BoundingBoxSelection) => void;
}
