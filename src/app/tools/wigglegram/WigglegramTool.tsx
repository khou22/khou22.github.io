"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { classNames } from "@/utils/style";

interface ExtractedFrame {
  canvas: HTMLCanvasElement;
  dataUrl: string;
}

export const WigglegramTool = () => {
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(
    null,
  );
  const [extractedFrames, setExtractedFrames] = useState<ExtractedFrame[]>([]);
  const [numFrames, setNumFrames] = useState(3);
  const [frameArrangement, setFrameArrangement] = useState<
    "horizontal" | "vertical"
  >("horizontal");
  const [animationSpeed, setAnimationSpeed] = useState(200); // milliseconds
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Alignment editor state
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [baseFrameIndex, setBaseFrameIndex] = useState(1); // Default to middle frame
  const [alignmentOffsets, setAlignmentOffsets] = useState<{
    left: { x: number; y: number };
    right: { x: number; y: number };
  }>({ left: { x: 0, y: 0 }, right: { x: 0, y: 0 } });
  const [isDragging, setIsDragging] = useState<"left" | "right" | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const editorCanvasRef = useRef<HTMLCanvasElement>(null);

  // Layer control state
  const [layerVisibility, setLayerVisibility] = useState<{
    left: boolean;
    right: boolean;
  }>({ left: true, right: true });
  const [layerLocked, setLayerLocked] = useState<{
    left: boolean;
    right: boolean;
  }>({ left: false, right: false });
  const [selectedLayer, setSelectedLayer] = useState<"left" | "right" | null>(
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

  const generateVideo = useCallback(async () => {
    if (extractedFrames.length === 0) return;

    setIsGenerating(true);
    setProgress(0);
    setProgressMessage("Setting up video recorder...");
    setErrorMessage(null);

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      canvas.width = extractedFrames[0].canvas.width;
      canvas.height = extractedFrames[0].canvas.height;

      setProgress(20);
      setProgressMessage("Initializing video stream...");

      const stream = canvas.captureStream(1000 / animationSpeed);

      // Try MP4 first, fallback to WebM
      let mimeType = "video/mp4";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm;codecs=vp9";
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = "video/webm";
        }
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        setProgressMessage("Finalizing video...");
        setProgress(100);
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setPreviewVideo(url);
        setTimeout(() => {
          setIsGenerating(false);
          setProgress(0);
          setProgressMessage("");
        }, 500);
      };

      setProgress(40);
      setProgressMessage("Recording video frames...");
      mediaRecorder.start();

      // Animate through frames
      let frameIndex = 0;
      let cycleCount = 0;
      const totalCycles = 3;
      const animateFrames = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Apply alignment offsets if in editor mode
        if (isEditorMode) {
          // Draw frame with alignment offset
          let offsetX = 0;
          let offsetY = 0;

          if (frameIndex === baseFrameIndex - 1 && baseFrameIndex > 0) {
            // Left frame
            offsetX = alignmentOffsets.left.x;
            offsetY = alignmentOffsets.left.y;
          } else if (
            frameIndex === baseFrameIndex + 1 &&
            baseFrameIndex < extractedFrames.length - 1
          ) {
            // Right frame
            offsetX = alignmentOffsets.right.x;
            offsetY = alignmentOffsets.right.y;
          }
          // Base frame uses no offset (0, 0)

          ctx.drawImage(extractedFrames[frameIndex].canvas, offsetX, offsetY);
        } else {
          // Simple mode - no offsets
          ctx.drawImage(extractedFrames[frameIndex].canvas, 0, 0);
        }

        frameIndex = (frameIndex + 1) % extractedFrames.length;

        if (frameIndex === 0) {
          cycleCount++;
          const progressPercent = 40 + (cycleCount / totalCycles) * 50;
          setProgress(progressPercent);
          setProgressMessage(`Recording... cycle ${cycleCount}/${totalCycles}`);

          if (cycleCount >= totalCycles) {
            setTimeout(() => mediaRecorder.stop(), animationSpeed);
            return;
          }
        }

        setTimeout(animateFrames, animationSpeed);
      };

      animateFrames();
    } catch (error) {
      console.error("Error generating video:", error);
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

  const downloadVideo = useCallback(() => {
    if (!previewVideo) return;

    const link = document.createElement("a");
    link.href = previewVideo;
    link.download = "wigglegram.mp4";
    link.click();
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

  // Re-extract frames when settings change
  const handleSettingsChange = useCallback(() => {
    if (originalImage) {
      extractFrames(originalImage);
      setPreviewVideo(null); // Clear previous video
      resetAlignmentOffsets(); // Reset alignment when frames change
    }
  }, [originalImage, extractFrames, resetAlignmentOffsets]);

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

      setAlignmentOffsets((prev) => ({
        ...prev,
        [isDragging]: { x: constrainedX, y: constrainedY },
      }));
    },
    [isDragging, dragStart, extractedFrames, baseFrameIndex],
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(null);
    setDragStart(null);
  }, []);

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

      {/* Settings Panel */}
      {originalImage && (
        <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-4 text-lg font-semibold">Frame Settings</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Number of Frames:</label>
              <select
                value={numFrames}
                onChange={(e) => {
                  setNumFrames(Number(e.target.value));
                  setTimeout(handleSettingsChange, 0);
                }}
                className="rounded border border-gray-300 px-3 py-2"
              >
                {[2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} frames
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Frame Arrangement:</label>
              <select
                value={frameArrangement}
                onChange={(e) => {
                  setFrameArrangement(
                    e.target.value as "horizontal" | "vertical",
                  );
                  setTimeout(handleSettingsChange, 0);
                }}
                className="rounded border border-gray-300 px-3 py-2"
              >
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Animation Speed: {animationSpeed}ms
              </label>
              <input
                type="range"
                min="50"
                max="500"
                step="50"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              onClick={() => fileUploadRef.current?.click()}
              variant="outline"
              size="sm"
            >
              Upload Different Image
            </Button>
          </div>
        </div>
      )}

      {/* Editor Mode Toggle */}
      {extractedFrames.length > 0 && (
        <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-4 text-lg font-semibold">Alignment Mode</h3>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => setIsEditorMode(false)}
              variant={!isEditorMode ? "primary" : "outline"}
              size="sm"
            >
              Simple Mode
            </Button>
            <Button
              onClick={() => setIsEditorMode(true)}
              variant={isEditorMode ? "primary" : "outline"}
              size="sm"
            >
              Alignment Editor
            </Button>
          </div>

          {/* Base Frame Selector */}
          {isEditorMode && (
            <div className="mt-4 flex flex-col gap-2">
              <label className="text-sm font-medium">Base Frame:</label>
              <select
                value={baseFrameIndex}
                onChange={(e) => setBaseFrameIndex(Number(e.target.value))}
                className="w-fit rounded border border-gray-300 px-3 py-2"
              >
                {extractedFrames.map((_, index) => (
                  <option key={index} value={index}>
                    Frame {index + 1}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Alignment Editor */}
      {extractedFrames.length > 0 && isEditorMode && (
        <div className="w-full">
          <h3 className="mb-4 text-lg font-semibold">Drag to Align Frames</h3>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Canvas Column */}
            <div className="lg:col-span-2">
              <div className="relative rounded border border-gray-300 shadow-lg">
                <canvas
                  ref={editorCanvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className="h-auto w-full cursor-grab active:cursor-grabbing"
                  style={{ maxWidth: "100%" }}
                />
              </div>
            </div>

            {/* Layer Control Panel */}
            <div className="lg:col-span-1">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h4 className="mb-3 font-semibold">Layers</h4>

                {/* Base Frame */}
                <div className="mb-3 rounded border bg-white p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Base Frame {baseFrameIndex + 1}
                    </span>
                    <span className="rounded bg-blue-100 px-2 py-1 text-xs text-gray-500">
                      Base
                    </span>
                  </div>
                </div>

                {/* Left Frame */}
                {baseFrameIndex > 0 && (
                  <div
                    className={`mb-3 rounded border p-3 ${
                      selectedLayer === "left"
                        ? "border-blue-300 bg-blue-50"
                        : "bg-white"
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Left Frame {baseFrameIndex}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() =>
                            setLayerVisibility((prev) => ({
                              ...prev,
                              left: !prev.left,
                            }))
                          }
                          className={`rounded p-1 text-xs ${
                            layerVisibility.left
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                          title={
                            layerVisibility.left ? "Hide layer" : "Show layer"
                          }
                        >
                          {layerVisibility.left ? "👁️" : "🙈"}
                        </button>
                        <button
                          onClick={() =>
                            setLayerLocked((prev) => ({
                              ...prev,
                              left: !prev.left,
                            }))
                          }
                          className={`rounded p-1 text-xs ${
                            layerLocked.left
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                          title={
                            layerLocked.left ? "Unlock layer" : "Lock layer"
                          }
                        >
                          {layerLocked.left ? "🔒" : "🔓"}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setSelectedLayer(
                          selectedLayer === "left" ? null : "left",
                        )
                      }
                      className={`w-full rounded px-2 py-1 text-left text-xs ${
                        selectedLayer === "left"
                          ? "bg-blue-200 text-blue-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {selectedLayer === "left"
                        ? "Selected"
                        : "Click to select"}
                    </button>
                    <div className="mt-1 text-xs text-gray-500">
                      Offset: ({alignmentOffsets.left.x},{" "}
                      {alignmentOffsets.left.y})
                    </div>
                  </div>
                )}

                {/* Right Frame */}
                {baseFrameIndex < extractedFrames.length - 1 && (
                  <div
                    className={`mb-3 rounded border p-3 ${
                      selectedLayer === "right"
                        ? "border-blue-300 bg-blue-50"
                        : "bg-white"
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Right Frame {baseFrameIndex + 2}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() =>
                            setLayerVisibility((prev) => ({
                              ...prev,
                              right: !prev.right,
                            }))
                          }
                          className={`rounded p-1 text-xs ${
                            layerVisibility.right
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                          title={
                            layerVisibility.right ? "Hide layer" : "Show layer"
                          }
                        >
                          {layerVisibility.right ? "👁️" : "🙈"}
                        </button>
                        <button
                          onClick={() =>
                            setLayerLocked((prev) => ({
                              ...prev,
                              right: !prev.right,
                            }))
                          }
                          className={`rounded p-1 text-xs ${
                            layerLocked.right
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                          title={
                            layerLocked.right ? "Unlock layer" : "Lock layer"
                          }
                        >
                          {layerLocked.right ? "🔒" : "🔓"}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setSelectedLayer(
                          selectedLayer === "right" ? null : "right",
                        )
                      }
                      className={`w-full rounded px-2 py-1 text-left text-xs ${
                        selectedLayer === "right"
                          ? "bg-blue-200 text-blue-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {selectedLayer === "right"
                        ? "Selected"
                        : "Click to select"}
                    </button>
                    <div className="mt-1 text-xs text-gray-500">
                      Offset: ({alignmentOffsets.right.x},{" "}
                      {alignmentOffsets.right.y})
                    </div>
                  </div>
                )}

                {/* Controls */}
                <div className="mt-4 space-y-2">
                  <Button
                    onClick={() => resetAlignmentOffsets()}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Reset Alignment
                  </Button>
                  <Button
                    onClick={() => {
                      setLayerVisibility({ left: true, right: true });
                      setLayerLocked({ left: false, right: false });
                      setSelectedLayer(null);
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Reset All Layers
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Frame Preview */}
      {extractedFrames.length > 0 && !isEditorMode && (
        <div className="w-full">
          <h3 className="mb-4 text-lg font-semibold">Extracted Frames</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {extractedFrames.map((frame, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <img
                  src={frame.dataUrl}
                  alt={`Frame ${index + 1}`}
                  className="h-auto w-full rounded border border-gray-300 shadow-sm"
                />
                <span className="text-xs text-gray-500">Frame {index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Animation Controls */}
      {extractedFrames.length > 0 && (
        <div className="w-full">
          <h3 className="mb-4 text-lg font-semibold">Generate Video</h3>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={generateVideo}
              disabled={isGenerating}
              variant="primary"
            >
              {isGenerating ? "Generating..." : "Generate Video"}
            </Button>
          </div>

          {/* Progress Bar */}
          {isGenerating && (
            <div className="mt-4 w-full">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-600">{progressMessage}</span>
                <span className="text-gray-600">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-500 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Generation Failed
                  </h3>
                  <p className="mt-1 text-sm text-red-700">{errorMessage}</p>
                  <div className="mt-3">
                    <Button
                      onClick={() => setErrorMessage(null)}
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-700 hover:bg-red-100"
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview and Download */}
      {previewVideo && (
        <div className="w-full">
          <h3 className="mb-4 text-lg font-semibold">Preview & Download</h3>
          <div className="flex flex-col items-center gap-4">
            <video
              src={previewVideo}
              controls
              autoPlay
              loop
              muted
              className="max-h-96 rounded border border-gray-300 shadow-lg"
            >
              Your browser does not support the video tag.
            </video>
            <Button onClick={downloadVideo} variant="primary">
              Download Video
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
