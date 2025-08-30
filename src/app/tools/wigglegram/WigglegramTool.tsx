"use client";

import { useRef, useState, useCallback, useEffect } from "react";

// Import types first
import {
  ExtractedFrame,
  AlignmentOffsets,
  DragLayer,
  FrameArrangement,
  CropParameters,
} from "./types";

// Import components and utilities
import { VideoPreview } from "./VideoPreview";
import { SimpleFrameEditor } from "./SimpleFrameEditor";
import { ImageAlignmentEditor } from "./ImageAlignmentEditor";
import { LayerControlPanel } from "./LayerControlPanel";

// Import external dependencies
import { Button } from "@/components/ui/button";
import { classNames } from "@/utils/style";

export const WigglegramTool = () => {
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(
    null,
  );
  const [extractedFrames, setExtractedFrames] = useState<ExtractedFrame[]>([]);
  const [numFrames, setNumFrames] = useState(3);
  const [frameArrangement, setFrameArrangement] =
    useState<FrameArrangement>("horizontal");
  const [animationSpeed, setAnimationSpeed] = useState(200);
  const [isDragOver, setIsDragOver] = useState(false);

  // Alignment editor state (simplified - most state now managed by ImageAlignmentEditor)
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [alignmentOffsets, setAlignmentOffsets] = useState<AlignmentOffsets>({
    left: { x: 0, y: 0 },
    right: { x: 0, y: 0 },
  });
  const [baseFrameIndex, setBaseFrameIndex] = useState(1);

  // Layer state (managed by LayerControlPanel, received via callback)
  const [layerState, setLayerState] = useState({
    visibility: { left: true, right: true },
    locked: { left: false, right: false },
    selected: null as DragLayer,
  });

  // Video crop state
  const [cropParameters, setCropParameters] = useState<CropParameters | null>(
    null,
  );

  const extractFrames = useCallback(
    (img: HTMLImageElement) => {
      const frames: ExtractedFrame[] = [];

      for (let i = 0; i < numFrames; i++) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        if (frameArrangement === "horizontal") {
          const frameWidth = img.width / numFrames;
          canvas.width = frameWidth;
          canvas.height = img.height;

          ctx.drawImage(
            img,
            i * frameWidth,
            0,
            frameWidth,
            img.height,
            0,
            0,
            frameWidth,
            img.height,
          );
        } else {
          const frameHeight = img.height / numFrames;
          canvas.width = img.width;
          canvas.height = frameHeight;

          ctx.drawImage(
            img,
            0,
            i * frameHeight,
            img.width,
            frameHeight,
            0,
            0,
            img.width,
            frameHeight,
          );
        }

        frames.push({
          canvas,
          dataUrl: canvas.toDataURL("image/png"),
        });
      }

      setExtractedFrames(frames);
    },
    [numFrames, frameArrangement],
  );

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setOriginalImage(img);
          extractFrames(img);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    },
    [extractFrames],
  );

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith("image/"));

    if (imageFile) {
      processFile(imageFile);
    }
  };

  // Reset alignment offsets when frames change
  const resetAlignmentOffsets = useCallback(() => {
    setAlignmentOffsets({ left: { x: 0, y: 0 }, right: { x: 0, y: 0 } });
  }, []);

  // Reset all layer states
  const resetAllLayers = useCallback(() => {
    setLayerState({
      visibility: { left: true, right: true },
      locked: { left: false, right: false },
      selected: null,
    });
    resetAlignmentOffsets();
  }, [resetAlignmentOffsets]);

  // Update base frame index when number of frames changes
  const updateBaseFrameIndex = useCallback(() => {
    const middleIndex = Math.floor(numFrames / 2);
    setBaseFrameIndex(middleIndex);
  }, [numFrames]);

  // Effect to update base frame index when number of frames changes
  useEffect(() => {
    updateBaseFrameIndex();
  }, [updateBaseFrameIndex]);

  const handleSettingsChange = useCallback(() => {
    if (originalImage) {
      extractFrames(originalImage);
      resetAlignmentOffsets();
    }
  }, [originalImage, extractFrames, resetAlignmentOffsets]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-start space-y-6 p-4">
      {/* Upload Area */}
      {!originalImage && (
        <div
          className={classNames(
            "flex w-full flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed py-12 text-center transition-colors",
            isDragOver
              ? "border-blue-400 bg-blue-50 text-blue-600"
              : "border-gray-300 text-gray-500",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isDragOver ? (
            "Drop your wigglegram image here"
          ) : (
            <>
              <p>Upload a multi-frame image to create your wigglegram</p>
              <p className="text-sm text-gray-400">
                Supports images with multiple frames arranged horizontally or
                vertically
              </p>
              <Button
                onClick={() => fileUploadRef.current?.click()}
                variant="outline"
              >
                Upload Image
              </Button>
            </>
          )}

          <input
            type="file"
            ref={fileUploadRef}
            onChange={handleFile}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>
      )}

      {/* Component-based UI */}
      {originalImage && (
        <>
          <SimpleFrameEditor
            extractedFrames={extractedFrames}
            numFrames={numFrames}
            frameArrangement={frameArrangement}
            animationSpeed={animationSpeed}
            onNumFramesChange={(value) => {
              setNumFrames(value);
              setTimeout(handleSettingsChange, 0);
            }}
            onFrameArrangementChange={(value) => {
              setFrameArrangement(value);
              setTimeout(handleSettingsChange, 0);
            }}
            onAnimationSpeedChange={setAnimationSpeed}
            onModeToggle={setIsEditorMode}
            isEditorMode={isEditorMode}
          />

          {extractedFrames.length > 0 && (
            <>
              {isEditorMode && (
                <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <ImageAlignmentEditor
                      extractedFrames={extractedFrames}
                      layerState={layerState}
                      onAlignmentChange={setAlignmentOffsets}
                      onBaseFrameChange={setBaseFrameIndex}
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <LayerControlPanel
                      alignmentOffsets={alignmentOffsets}
                      onLayerStateChange={setLayerState}
                      onResetAlignment={resetAlignmentOffsets}
                      onResetAllLayers={resetAllLayers}
                    />
                  </div>
                </div>
              )}

              <VideoPreview
                extractedFrames={extractedFrames}
                animationSpeed={animationSpeed}
                alignmentOffsets={alignmentOffsets}
                isEditorMode={isEditorMode}
                baseFrameIndex={baseFrameIndex}
                cropParameters={cropParameters}
                onCropParametersChange={setCropParameters}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

// Remove the old functions that are no longer needed - they're now in child components
