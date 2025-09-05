import { BoundingBox } from "@/hooks/useBoundingBox";

/**
 * Crop a portion of an image into a base64 string based on bounding box in pixels.
 */
export const cropImageToBase64 = (
  image: HTMLImageElement,
  box: BoundingBox,
): string => {
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const canvas = document.createElement("canvas");
  canvas.width = box.width * scaleX;
  canvas.height = box.height * scaleY;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get 2D context");
  }
  ctx.drawImage(
    image,
    box.x * scaleX,
    box.y * scaleY,
    box.width * scaleX,
    box.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  return canvas.toDataURL("image/png");
};
