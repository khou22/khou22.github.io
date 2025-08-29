"use client";

import { useRef, useState, useCallback, useEffect } from "react";

// Import types first
import {
  ExtractedFrame,
  AlignmentOffsets,
  LayerState,
  DragLayer,
  FrameArrangement,
} from "./types/wigglegram";

// Import components and utilities
import { VideoPreview } from "./components/VideoPreview";
import { SimpleFrameEditor } from "./components/SimpleFrameEditor";
import { ImageAlignmentEditor } from "./components/ImageAlignmentEditor";
import { LayerControlPanel } from "./components/LayerControlPanel";
import { generateVideo, downloadVideo } from "./utils/videoGenerator";

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Alignment editor state
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [baseFrameIndex, setBaseFrameIndex] = useState(1);
  const [alignmentOffsets, setAlignmentOffsets] = useState<AlignmentOffsets>({
    left: { x: 0, y: 0 },
    right: { x: 0, y: 0 },
  });
  const [isDragging, setIsDragging] = useState<DragLayer>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const editorCanvasRef = useRef<HTMLCanvasElement>(null);

  // Layer control state
  const [layerVisibility, setLayerVisibility] = useState<LayerState>({
    left: true,
    right: true,
  });
  const [layerLocked, setLayerLocked] = useState<LayerState>({
    left: false,
    right: false,
  });
  const [selectedLayer, setSelectedLayer] = useState<DragLayer>(null);

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

  const handleGenerateVideo = useCallback(async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    setProgress(0);
    setProgressMessage("");

    try {
      // Transform extractedFrames into the new format expected by videoGenerator
      const frames = extractedFrames.map((frame, index) => {
        let offsets = { left: { x: 0, y: 0 }, right: { x: 0, y: 0 } };

        // Apply alignment offsets if in editor mode
        if (isEditorMode) {
          if (index === baseFrameIndex - 1 && baseFrameIndex > 0) {
            // Left frame
            offsets = { ...offsets, left: alignmentOffsets.left };
          } else if (
            index === baseFrameIndex + 1 &&
            baseFrameIndex < extractedFrames.length - 1
          ) {
            // Right frame
            offsets = { ...offsets, right: alignmentOffsets.right };
          }
        }

        return {
          data: frame,
          offsets,
        };
      });

      const blob = await generateVideo({
        frames,
        animationSpeed,
        onProgress: (progress, message) => {
          setProgress(progress);
          setProgressMessage(message);
        },
      });

      // Create video URL from blob and set preview
      const videoUrl = URL.createObjectURL(blob);
      setPreviewVideo(videoUrl);

      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
        setProgressMessage("");
      }, 500);
    } catch (error) {
      console.error("Video generation failed:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to generate video. Please try again.",
      );
      setIsGenerating(false);
      setProgress(0);
      setProgressMessage("");
    }
  }, [
    extractedFrames,
    animationSpeed,
    isEditorMode,
    baseFrameIndex,
    alignmentOffsets,
  ]);

  const handleDownloadVideo = useCallback(() => {
    if (!previewVideo) return;
    downloadVideo(previewVideo);
  }, [previewVideo]);

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
    setLayerVisibility({ left: true, right: true });
    setLayerLocked({ left: false, right: false });
    setSelectedLayer(null);
    resetAlignmentOffsets();
  }, [resetAlignmentOffsets]);

  // Update base frame index when number of frames changes
  const updateBaseFrameIndex = useCallback(() => {
    const middleIndex = Math.floor(numFrames / 2);
    setBaseFrameIndex(middleIndex);
  }, [numFrames]);

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
    if (baseFrameIndex > 0 && layerVisibility.left) {
      const leftFrame = extractedFrames[baseFrameIndex - 1];
      ctx.globalAlpha = selectedLayer === "left" ? 0.7 : 0.5;
      ctx.drawImage(
        leftFrame.canvas,
        alignmentOffsets.left.x,
        alignmentOffsets.left.y,
      );
    }

    // Draw right frame overlay (semi-transparent)
    if (baseFrameIndex < extractedFrames.length - 1 && layerVisibility.right) {
      const rightFrame = extractedFrames[baseFrameIndex + 1];
      ctx.globalAlpha = selectedLayer === "right" ? 0.7 : 0.5;
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
    layerVisibility,
    selectedLayer,
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
        layerVisibility.left &&
        !layerLocked.left &&
        x >= alignmentOffsets.left.x &&
        x <= alignmentOffsets.left.x + leftFrame.canvas.width &&
        y >= alignmentOffsets.left.y &&
        y <= alignmentOffsets.left.y + leftFrame.canvas.height
      ) {
        setIsDragging("left");
        setSelectedLayer("left");
        setDragStart({
          x: x - alignmentOffsets.left.x,
          y: y - alignmentOffsets.left.y,
        });
      }
      // Check if click is within right frame bounds
      else if (
        rightFrame &&
        layerVisibility.right &&
        !layerLocked.right &&
        x >= alignmentOffsets.right.x &&
        x <= alignmentOffsets.right.x + rightFrame.canvas.width &&
        y >= alignmentOffsets.right.y &&
        y <= alignmentOffsets.right.y + rightFrame.canvas.height
      ) {
        setIsDragging("right");
        setSelectedLayer("right");
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
      layerVisibility,
      layerLocked,
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

      setAlignmentOffsets((prev) => ({
        ...prev,
        [isDragging]: { x: constrainedX, y: constrainedY },
      }));
    },
    [isDragging, dragStart, extractedFrames, baseFrameIndex],
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
        layerVisibility.left &&
        !layerLocked.left &&
        x >= alignmentOffsets.left.x &&
        x <= alignmentOffsets.left.x + leftFrame.canvas.width &&
        y >= alignmentOffsets.left.y &&
        y <= alignmentOffsets.left.y + leftFrame.canvas.height
      ) {
        setIsDragging("left");
        setSelectedLayer("left");
        setDragStart({
          x: x - alignmentOffsets.left.x,
          y: y - alignmentOffsets.left.y,
        });
      } else if (
        rightFrame &&
        layerVisibility.right &&
        !layerLocked.right &&
        x >= alignmentOffsets.right.x &&
        x <= alignmentOffsets.right.x + rightFrame.canvas.width &&
        y >= alignmentOffsets.right.y &&
        y <= alignmentOffsets.right.y + rightFrame.canvas.height
      ) {
        setIsDragging("right");
        setSelectedLayer("right");
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
      layerVisibility,
      layerLocked,
    ],
  );

  // Effect to update base frame index when number of frames changes
  useEffect(() => {
    updateBaseFrameIndex();
  }, [updateBaseFrameIndex]);

  // Effect to redraw canvas when relevant state changes
  useEffect(() => {
    if (isEditorMode) {
      drawEditorCanvas();
    }
  }, [
    isEditorMode,
    drawEditorCanvas,
    alignmentOffsets,
    baseFrameIndex,
    extractedFrames,
  ]);

  const handleSettingsChange = useCallback(() => {
    if (originalImage) {
      extractFrames(originalImage);
      setPreviewVideo(null);
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
                      baseFrameIndex={baseFrameIndex}
                      alignmentOffsets={alignmentOffsets}
                      isDragging={isDragging}
                      dragStart={dragStart}
                      layerVisibility={layerVisibility}
                      layerLocked={layerLocked}
                      selectedLayer={selectedLayer}
                      onBaseFrameChange={setBaseFrameIndex}
                      onAlignmentOffsetsChange={setAlignmentOffsets}
                      onDraggingChange={setIsDragging}
                      onDragStartChange={setDragStart}
                      editorCanvasRef={editorCanvasRef}
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <LayerControlPanel
                      layerVisibility={layerVisibility}
                      layerLocked={layerLocked}
                      selectedLayer={selectedLayer}
                      alignmentOffsets={alignmentOffsets}
                      onLayerVisibilityChange={setLayerVisibility}
                      onLayerLockedChange={setLayerLocked}
                      onSelectedLayerChange={setSelectedLayer}
                      onResetAlignment={resetAlignmentOffsets}
                      onResetAllLayers={resetAllLayers}
                    />
                  </div>
                </div>
              )}

              <VideoPreview
                previewVideo={previewVideo}
                isGenerating={isGenerating}
                progress={progress}
                progressMessage={progressMessage}
                errorMessage={errorMessage}
                onGenerateVideo={handleGenerateVideo}
                onDownloadVideo={handleDownloadVideo}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

// Remove the old functions that are no longer needed - they're now in child components
