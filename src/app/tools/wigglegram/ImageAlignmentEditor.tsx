"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import {
  ImageAlignmentEditorProps,
  AlignmentOffsets,
  DragLayer,
} from "./types";
import { AutoAlignTool } from "./AutoAlignTool";

export const ImageAlignmentEditor = ({
  extractedFrames,
  layerState,
  onAlignmentChange,
  onBaseFrameChange,
}: ImageAlignmentEditorProps) => {
  // Internal canvas ref
  const editorCanvasRef = useRef<HTMLCanvasElement>(null);

  // Internal alignment state management
  const [baseFrameIndex, setBaseFrameIndex] = useState(1);
  const [alignmentOffsets, setAlignmentOffsets] = useState<AlignmentOffsets>({
    left: { x: 0, y: 0 },
    right: { x: 0, y: 0 },
  });
  const [isDragging, setIsDragging] = useState<DragLayer>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  );

  // Emit changes to parent
  useEffect(() => {
    onAlignmentChange?.(alignmentOffsets);
  }, [alignmentOffsets, onAlignmentChange]);

  useEffect(() => {
    onBaseFrameChange?.(baseFrameIndex);
  }, [baseFrameIndex, onBaseFrameChange]);
  // Editor canvas drawing function
  const drawEditorCanvas = useCallback(() => {
    const canvas = editorCanvasRef.current;
    if (!canvas || extractedFrames.length === 0) return;

    const ctx = canvas.getContext("2d")!;
    const baseFrame = extractedFrames[baseFrameIndex];
    if (!baseFrame) return;

    // Set canvas size to match base frame
    canvas.width = baseFrame.canvas.width;
    canvas.height = baseFrame.canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw base frame
    ctx.drawImage(baseFrame.canvas, 0, 0);

    // Draw left frame overlay (semi-transparent)
    if (baseFrameIndex > 0 && layerState.visibility.left) {
      const leftFrame = extractedFrames[baseFrameIndex - 1];
      ctx.globalAlpha = layerState.selected === "left" ? 0.7 : 0.5;
      ctx.drawImage(
        leftFrame.canvas,
        alignmentOffsets.left.x,
        alignmentOffsets.left.y,
      );
    }

    // Draw right frame overlay (semi-transparent)
    if (
      baseFrameIndex < extractedFrames.length - 1 &&
      layerState.visibility.right
    ) {
      const rightFrame = extractedFrames[baseFrameIndex + 1];
      ctx.globalAlpha = layerState.selected === "right" ? 0.7 : 0.5;
      ctx.drawImage(
        rightFrame.canvas,
        alignmentOffsets.right.x,
        alignmentOffsets.right.y,
      );
    }

    // Reset alpha
    ctx.globalAlpha = 1.0;
  }, [
    extractedFrames,
    baseFrameIndex,
    alignmentOffsets,
    layerState.visibility,
    layerState.selected,
    editorCanvasRef,
  ]);

  // Mouse event handlers for dragging
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = editorCanvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Determine which overlay is being clicked
      const leftFrame =
        baseFrameIndex > 0 ? extractedFrames[baseFrameIndex - 1] : null;
      const rightFrame =
        baseFrameIndex < extractedFrames.length - 1
          ? extractedFrames[baseFrameIndex + 1]
          : null;

      // Check if click is within left frame bounds
      if (
        leftFrame &&
        layerState.visibility.left &&
        !layerState.locked.left &&
        x >= alignmentOffsets.left.x &&
        x <= alignmentOffsets.left.x + leftFrame.canvas.width &&
        y >= alignmentOffsets.left.y &&
        y <= alignmentOffsets.left.y + leftFrame.canvas.height
      ) {
        setIsDragging("left");
        setDragStart({
          x: x - alignmentOffsets.left.x,
          y: y - alignmentOffsets.left.y,
        });
      }
      // Check if click is within right frame bounds
      else if (
        rightFrame &&
        layerState.visibility.right &&
        !layerState.locked.right &&
        x >= alignmentOffsets.right.x &&
        x <= alignmentOffsets.right.x + rightFrame.canvas.width &&
        y >= alignmentOffsets.right.y &&
        y <= alignmentOffsets.right.y + rightFrame.canvas.height
      ) {
        setIsDragging("right");
        setDragStart({
          x: x - alignmentOffsets.right.x,
          y: y - alignmentOffsets.right.y,
        });
      }
    },
    [
      extractedFrames,
      baseFrameIndex,
      alignmentOffsets,
      layerState.visibility,
      layerState.locked,
      setIsDragging,
      setDragStart,
      editorCanvasRef,
    ],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDragging || !dragStart) return;

      const canvas = editorCanvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newX = x - dragStart.x;
      const newY = y - dragStart.y;

      // Get frame dimensions for boundary checking
      const frameIndex =
        isDragging === "left" ? baseFrameIndex - 1 : baseFrameIndex + 1;
      const frame = extractedFrames[frameIndex];
      if (!frame) return;

      // Constrain to canvas bounds
      const maxX = canvas.width - frame.canvas.width;
      const maxY = canvas.height - frame.canvas.height;
      const constrainedX = Math.max(
        -frame.canvas.width + 50,
        Math.min(maxX + frame.canvas.width - 50, newX),
      );
      const constrainedY = Math.max(
        -frame.canvas.height + 50,
        Math.min(maxY + frame.canvas.height - 50, newY),
      );

      setAlignmentOffsets({
        ...alignmentOffsets,
        [isDragging]: { x: constrainedX, y: constrainedY },
      });
    },
    [
      isDragging,
      dragStart,
      extractedFrames,
      baseFrameIndex,
      alignmentOffsets,
      setAlignmentOffsets,
      editorCanvasRef,
    ],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
    setDragStart(null);
  }, []);

  // Touch event handlers for mobile support
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const touch = e.touches[0];
      const canvas = editorCanvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      // Similar logic to handleMouseDown
      const leftFrame =
        baseFrameIndex > 0 ? extractedFrames[baseFrameIndex - 1] : null;
      const rightFrame =
        baseFrameIndex < extractedFrames.length - 1
          ? extractedFrames[baseFrameIndex + 1]
          : null;

      if (
        leftFrame &&
        layerState.visibility.left &&
        !layerState.locked.left &&
        x >= alignmentOffsets.left.x &&
        x <= alignmentOffsets.left.x + leftFrame.canvas.width &&
        y >= alignmentOffsets.left.y &&
        y <= alignmentOffsets.left.y + leftFrame.canvas.height
      ) {
        setIsDragging("left");
        setDragStart({
          x: x - alignmentOffsets.left.x,
          y: y - alignmentOffsets.left.y,
        });
      } else if (
        rightFrame &&
        layerState.visibility.right &&
        !layerState.locked.right &&
        x >= alignmentOffsets.right.x &&
        x <= alignmentOffsets.right.x + rightFrame.canvas.width &&
        y >= alignmentOffsets.right.y &&
        y <= alignmentOffsets.right.y + rightFrame.canvas.height
      ) {
        setIsDragging("right");
        setDragStart({
          x: x - alignmentOffsets.right.x,
          y: y - alignmentOffsets.right.y,
        });
      }
    },
    [
      extractedFrames,
      baseFrameIndex,
      alignmentOffsets,
      layerState.visibility,
      layerState.locked,
      setIsDragging,
      setDragStart,
      editorCanvasRef,
    ],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      if (!isDragging || !dragStart) return;

      const touch = e.touches[0];
      const canvas = editorCanvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      const newX = x - dragStart.x;
      const newY = y - dragStart.y;

      const frameIndex =
        isDragging === "left" ? baseFrameIndex - 1 : baseFrameIndex + 1;
      const frame = extractedFrames[frameIndex];
      if (!frame) return;

      // Constrain to canvas bounds
      const maxX = canvas.width - frame.canvas.width;
      const maxY = canvas.height - frame.canvas.height;
      const constrainedX = Math.max(
        -frame.canvas.width + 50,
        Math.min(maxX + frame.canvas.width - 50, newX),
      );
      const constrainedY = Math.max(
        -frame.canvas.height + 50,
        Math.min(maxY + frame.canvas.height - 50, newY),
      );

      setAlignmentOffsets({
        ...alignmentOffsets,
        [isDragging]: { x: constrainedX, y: constrainedY },
      });
    },
    [
      isDragging,
      dragStart,
      extractedFrames,
      baseFrameIndex,
      alignmentOffsets,
      setAlignmentOffsets,
      editorCanvasRef,
    ],
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(null);
    setDragStart(null);
  }, [setIsDragging, setDragStart]);

  // Effect to redraw canvas when relevant state changes
  useEffect(() => {
    drawEditorCanvas();
  }, [drawEditorCanvas]);

  return (
    <div className="w-full space-y-6">
      <div className="rounded-lg border p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Alignment Editor</h3>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Base Frame:
            </label>
            <select
              value={baseFrameIndex}
              onChange={(e) => onBaseFrameChange?.(parseInt(e.target.value))}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {extractedFrames.map((_, index) => (
                <option key={index} value={index}>
                  Frame {index + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full overflow-auto rounded-lg border border-gray-300">
          <div className="relative inline-block">
            <canvas
              ref={editorCanvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="block h-auto max-w-full cursor-crosshair"
              style={{ touchAction: "none" }}
            />
            <AutoAlignTool
              canvasRef={editorCanvasRef}
              extractedFrames={extractedFrames}
              baseFrameIndex={baseFrameIndex}
              onAlignment={setAlignmentOffsets}
            />
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-600">
          Drag the semi-opaque overlay frames to align them with the base frame.
          Use the layer controls on the right to manage visibility and locking.
        </p>
      </div>
    </div>
  );
};
