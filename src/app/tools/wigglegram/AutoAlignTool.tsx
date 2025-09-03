"use client";

import { useEffect, useState } from "react";
import { ExtractedFrame, AlignmentOffsets, BoundingBox } from "./types";
import { BoundingBoxSelector } from "./BoundingBoxSelector";
import { autoAlign } from "./autoAlign";
import { Button } from "@/components/ui/button";

interface AutoAlignToolProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  extractedFrames: ExtractedFrame[];
  baseFrameIndex: number;
  onAlignment: (offsets: AlignmentOffsets) => void;
}

export const AutoAlignTool = ({
  canvasRef,
  extractedFrames,
  baseFrameIndex,
  onAlignment,
}: AutoAlignToolProps) => {
  const [box, setBox] = useState<BoundingBox | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && !box) {
      const rect = canvas.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height) * 0.25;
      setBox({
        x: (rect.width - size) / 2,
        y: (rect.height - size) / 2,
        width: size,
        height: size,
      });
    }
  }, [canvasRef, box]);

  if (!box) return null;

  const handleAlign = async () => {
    const canvasEl = canvasRef.current;
    const base = extractedFrames[baseFrameIndex];
    if (!canvasEl || !base) return;

    const rect = canvasEl.getBoundingClientRect();
    const scaleX = base.canvas.width / rect.width;
    const scaleY = base.canvas.height / rect.height;
    const scaledBox: BoundingBox = {
      x: Math.round(box.x * scaleX),
      y: Math.round(box.y * scaleY),
      width: Math.round(box.width * scaleX),
      height: Math.round(box.height * scaleY),
    };

    const newOffsets: AlignmentOffsets = {
      left: { x: 0, y: 0 },
      right: { x: 0, y: 0 },
    };
    const leftFrame = extractedFrames[baseFrameIndex - 1];
    if (leftFrame) {
      newOffsets.left = await autoAlign(base.canvas, leftFrame.canvas, scaledBox);
    }
    const rightFrame = extractedFrames[baseFrameIndex + 1];
    if (rightFrame) {
      newOffsets.right = await autoAlign(base.canvas, rightFrame.canvas, scaledBox);
    }
    onAlignment(newOffsets);
  };

  const canvas = canvasRef.current;
  const width = canvas?.clientWidth || 0;
  const height = canvas?.clientHeight || 0;

  return (
    <>
      <BoundingBoxSelector
        box={box}
        onChange={setBox}
        containerWidth={width}
        containerHeight={height}
      />
      <div className="absolute bottom-2 right-2">
        <Button size="sm" onClick={handleAlign}>
          Align
        </Button>
      </div>
    </>
  );
};
