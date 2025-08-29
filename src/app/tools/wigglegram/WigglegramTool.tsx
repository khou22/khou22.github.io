"use client";

import { useRef, useState, useCallback } from "react";
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
        ctx.drawImage(extractedFrames[frameIndex].canvas, 0, 0);
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
  }, [extractedFrames, animationSpeed]);

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

  // Re-extract frames when settings change
  const handleSettingsChange = useCallback(() => {
    if (originalImage) {
      extractFrames(originalImage);
      setPreviewVideo(null); // Clear previous video
    }
  }, [originalImage, extractFrames]);

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

      {/* Frame Preview */}
      {extractedFrames.length > 0 && (
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
