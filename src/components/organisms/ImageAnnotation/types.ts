export interface BoundingBoxSelection {
  /** left position as percentage of image width */
  x: number;
  /** top position as percentage of image height */
  y: number;
  /** width as percentage of image width */
  width: number;
  /** height as percentage of image height */
  height: number;
  /** base64 encoded PNG of the cropped region */
  imageBase64: string;
}

export interface ImageAnnotationProps {
  imageUrl: string;
  onBoundingBoxSelection: (selection: BoundingBoxSelection) => void;
}
