import { useState } from "react";

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Hook to manage a draggable bounding box over an image.
 */
export const useBoundingBox = () => {
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [box, setBox] = useState<BoundingBox | null>(null);

  const begin = (x: number, y: number) => {
    setStart({ x, y });
    setBox({ x, y, width: 0, height: 0 });
  };

  const update = (x: number, y: number) => {
    if (!start) return;
    const newBox: BoundingBox = {
      x: Math.min(x, start.x),
      y: Math.min(y, start.y),
      width: Math.abs(x - start.x),
      height: Math.abs(y - start.y),
    };
    setBox(newBox);
  };

  const end = () => {
    setStart(null);
    const finalBox = box;
    setBox(null);
    return finalBox;
  };

  return { box, begin, update, end };
};
