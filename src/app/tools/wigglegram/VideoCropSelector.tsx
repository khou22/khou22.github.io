"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { VideoCropSelectorProps, CropParameters } from "./types";

export const VideoCropSelector = ({
  videoElement,
  onCropChange,
  initialCrop,
}: VideoCropSelectorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const onCropChangeRef = useRef(onCropChange);
  const [cropBox, setCropBox] = useState<CropParameters | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [videoDimensions, setVideoDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  // Keep callback ref updated
  useEffect(() => {
    onCropChangeRef.current = onCropChange;
  }, [onCropChange]);

  // Initialize crop box from initial crop or default to center 80% of video
  useEffect(() => {
    if (!videoElement) return;

    const updateDimensions = () => {
      const rect = videoElement.getBoundingClientRect();
      setVideoDimensions({ width: rect.width, height: rect.height });

      if (initialCrop) {
        // Scale initial crop to current video display size
        const scaleX = rect.width / videoElement.videoWidth;
        const scaleY = rect.height / videoElement.videoHeight;
        setCropBox({
          x: initialCrop.x * scaleX,
          y: initialCrop.y * scaleY,
          width: initialCrop.width * scaleX,
          height: initialCrop.height * scaleY,
        });
      } else {
        // Default crop: 80% of video centered
        const defaultWidth = rect.width * 0.8;
        const defaultHeight = rect.height * 0.8;
        setCropBox({
          x: (rect.width - defaultWidth) / 2,
          y: (rect.height - defaultHeight) / 2,
          width: defaultWidth,
          height: defaultHeight,
        });
      }
    };

    // Initial setup
    if (videoElement.videoWidth > 0) {
      updateDimensions();
    } else {
      videoElement.addEventListener("loadedmetadata", updateDimensions);
    }

    // Handle window resize
    window.addEventListener("resize", updateDimensions);

    return () => {
      videoElement.removeEventListener("loadedmetadata", updateDimensions);
      window.removeEventListener("resize", updateDimensions);
    };
  }, [videoElement, initialCrop]);

  // Convert display crop to actual video crop coordinates
  const getActualCropParameters = useCallback(
    (displayCrop: CropParameters): CropParameters => {
      if (!videoElement || videoDimensions.width === 0) return displayCrop;

      const scaleX = videoElement.videoWidth / videoDimensions.width;
      const scaleY = videoElement.videoHeight / videoDimensions.height;

      return {
        x: Math.round(displayCrop.x * scaleX),
        y: Math.round(displayCrop.y * scaleY),
        width: Math.round(displayCrop.width * scaleX),
        height: Math.round(displayCrop.height * scaleY),
      };
    },
    [videoElement, videoDimensions],
  );

  // Update parent when crop changes
  useEffect(() => {
    if (cropBox) {
      const actualCrop = getActualCropParameters(cropBox);
      onCropChangeRef.current(actualCrop);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cropBox, getActualCropParameters]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, action: "drag" | string) => {
      e.preventDefault();
      e.stopPropagation();

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });

      if (action === "drag") {
        setIsDragging(true);
      } else {
        setIsResizing(action);
      }
    },
    [],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!cropBox || !dragStart || (!isDragging && !isResizing)) return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      const deltaX = currentX - dragStart.x;
      const deltaY = currentY - dragStart.y;

      let newCrop = { ...cropBox };

      if (isDragging) {
        // Drag the entire crop box
        newCrop.x = Math.max(
          0,
          Math.min(videoDimensions.width - cropBox.width, cropBox.x + deltaX),
        );
        newCrop.y = Math.max(
          0,
          Math.min(videoDimensions.height - cropBox.height, cropBox.y + deltaY),
        );
      } else if (isResizing) {
        // Resize from specific corner/edge
        switch (isResizing) {
          case "nw": // Top-left corner
            newCrop.x = Math.max(0, cropBox.x + deltaX);
            newCrop.y = Math.max(0, cropBox.y + deltaY);
            newCrop.width = Math.max(50, cropBox.width - deltaX);
            newCrop.height = Math.max(50, cropBox.height - deltaY);
            break;
          case "ne": // Top-right corner
            newCrop.y = Math.max(0, cropBox.y + deltaY);
            newCrop.width = Math.max(
              50,
              Math.min(
                videoDimensions.width - cropBox.x,
                cropBox.width + deltaX,
              ),
            );
            newCrop.height = Math.max(50, cropBox.height - deltaY);
            break;
          case "sw": // Bottom-left corner
            newCrop.x = Math.max(0, cropBox.x + deltaX);
            newCrop.width = Math.max(50, cropBox.width - deltaX);
            newCrop.height = Math.max(
              50,
              Math.min(
                videoDimensions.height - cropBox.y,
                cropBox.height + deltaY,
              ),
            );
            break;
          case "se": // Bottom-right corner
            newCrop.width = Math.max(
              50,
              Math.min(
                videoDimensions.width - cropBox.x,
                cropBox.width + deltaX,
              ),
            );
            newCrop.height = Math.max(
              50,
              Math.min(
                videoDimensions.height - cropBox.y,
                cropBox.height + deltaY,
              ),
            );
            break;
        }
      }

      setCropBox(newCrop);
      setDragStart({ x: currentX, y: currentY });
    },
    [cropBox, dragStart, isDragging, isResizing, videoDimensions],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(null);
    setDragStart(null);
  }, []);

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  if (!cropBox) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 cursor-crosshair"
      style={{ pointerEvents: "auto" }}
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      {/* Crop area (transparent hole) */}
      <div
        className="absolute border-2 border-dashed border-white bg-transparent"
        style={{
          left: cropBox.x,
          top: cropBox.y,
          width: cropBox.width,
          height: cropBox.height,
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onMouseDown={(e) => handleMouseDown(e, "drag")}
      >
        {/* Corner resize handles */}
        <div
          className="absolute -left-1 -top-1 h-3 w-3 cursor-nw-resize border border-gray-400 bg-white"
          onMouseDown={(e) => handleMouseDown(e, "nw")}
        />
        <div
          className="absolute -right-1 -top-1 h-3 w-3 cursor-ne-resize border border-gray-400 bg-white"
          onMouseDown={(e) => handleMouseDown(e, "ne")}
        />
        <div
          className="absolute -bottom-1 -left-1 h-3 w-3 cursor-sw-resize border border-gray-400 bg-white"
          onMouseDown={(e) => handleMouseDown(e, "sw")}
        />
        <div
          className="absolute -bottom-1 -right-1 h-3 w-3 cursor-se-resize border border-gray-400 bg-white"
          onMouseDown={(e) => handleMouseDown(e, "se")}
        />
      </div>

      {/* Crop info overlay */}
      <div className="absolute left-2 top-2 rounded bg-black bg-opacity-75 px-2 py-1 text-xs text-white">
        {Math.round(cropBox.width)} × {Math.round(cropBox.height)}
      </div>
    </div>
  );
};
