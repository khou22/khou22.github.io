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
      setBox({
        x: canvas.width * 0.25,
        y: canvas.height * 0.25,
        width: canvas.width * 0.5,
        height: canvas.height * 0.5,
      });
    }
  }, [canvasRef, box]);

  if (!box) return null;

  const handleAlign = async () => {
    const base = extractedFrames[baseFrameIndex];
    if (!base) return;
    const newOffsets: AlignmentOffsets = {
      left: { x: 0, y: 0 },
      right: { x: 0, y: 0 },
    };
    const leftFrame = extractedFrames[baseFrameIndex - 1];
    if (leftFrame) {
      newOffsets.left = await autoAlign(base.canvas, leftFrame.canvas, box);
    }
    const rightFrame = extractedFrames[baseFrameIndex + 1];
    if (rightFrame) {
      newOffsets.right = await autoAlign(base.canvas, rightFrame.canvas, box);
    }
    onAlignment(newOffsets);
  };

  const canvas = canvasRef.current;
  const width = canvas?.width || 0;
  const height = canvas?.height || 0;

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
