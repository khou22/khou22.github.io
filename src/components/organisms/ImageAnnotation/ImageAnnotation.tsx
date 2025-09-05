"use client";

import { useRef } from "react";
import { ImageAnnotationProps } from "./types";
import { useBoundingBox } from "@/hooks/useBoundingBox";
import { cropImageToBase64 } from "@/utils/image/cropImage";

export const ImageAnnotation = ({
  imageUrl,
  onBoundingBoxSelection,
}: ImageAnnotationProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { box, begin, update, end } = useBoundingBox();

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    begin(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!box) return;
    const rect = e.currentTarget.getBoundingClientRect();
    update(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMouseUp = () => {
    if (!imgRef.current || !containerRef.current) {
      end();
      return;
    }
    const finalBox = end();
    if (!finalBox || finalBox.width === 0 || finalBox.height === 0) return;

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    onBoundingBoxSelection({
      x: finalBox.x / containerWidth,
      y: finalBox.y / containerHeight,
      width: finalBox.width / containerWidth,
      height: finalBox.height / containerHeight,
      imageBase64: cropImageToBase64(imgRef.current, finalBox),
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <img
        ref={imgRef}
        src={imageUrl}
        alt=""
        className="pointer-events-none select-none"
      />
      {box && (
        <div
          className="pointer-events-none absolute border-2 border-blue-500 bg-blue-500/20"
          style={{ left: box.x, top: box.y, width: box.width, height: box.height }}
        />
      )}
    </div>
  );
};
