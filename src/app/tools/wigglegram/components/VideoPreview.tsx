"use client";

import { useState, useRef, useCallback } from "react";
import { VideoPreviewProps } from "../types/wigglegram";
import { generateVideo, downloadVideo } from "../utils/videoGenerator";
import { VideoCropSelector } from "./VideoCropSelector";
import { Button } from "@/components/ui/button";

export const VideoPreview = ({
  extractedFrames,
  animationSpeed,
  alignmentOffsets,
  isEditorMode,
  baseFrameIndex,
  cropParameters,
  onCropParametersChange,
  onVideoGenerated,
}: VideoPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCropSelector, setShowCropSelector] = useState(false);

  // Internal state for video generation
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleToggleCrop = () => {
    if (showCropSelector) {
      setShowCropSelector(false);
      onCropParametersChange?.(null);
    } else {
      setShowCropSelector(true);
    }
  };

  const handleCropChange = (crop: any) => {
    onCropParametersChange?.(crop);
  };

  const handleApplyCrop = () => {
    setShowCropSelector(false);
    handleRegenerateWithCrop();
  };

  // Internal video generation handler
  const handleGenerateVideo = useCallback(async () => {
    if (extractedFrames.length === 0) return;

    try {
      setIsGenerating(true);
      setErrorMessage(null);
      setProgress(0);
      setProgressMessage("Starting video generation...");

      // Transform extractedFrames into the format expected by videoGenerator
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
        cropParameters: cropParameters || undefined,
        onProgress: (progress, message) => {
          setProgress(progress);
          setProgressMessage(message);
        },
      });

      // Create video URL from blob and set preview
      const videoUrl = URL.createObjectURL(blob);
      setPreviewVideo(videoUrl);
      onVideoGenerated?.(videoUrl);

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
    cropParameters,
    onVideoGenerated,
  ]);

  const handleRegenerateWithCrop = useCallback(async () => {
    if (!cropParameters) return;

    // Clear existing video and regenerate with crop
    setPreviewVideo(null);
    await handleGenerateVideo();
  }, [cropParameters, handleGenerateVideo]);

  const handleDownloadVideo = useCallback(() => {
    if (!previewVideo) return;
    downloadVideo(previewVideo);
  }, [previewVideo]);
  return (
    <div className="w-full space-y-6">
      {/* Generate Video Section */}
      <div className="rounded-lg border p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Generate Video</h3>
          <Button
            onClick={handleGenerateVideo}
            disabled={isGenerating}
            className="min-w-[120px]"
          >
            {isGenerating ? "Generating..." : "Generate Video"}
          </Button>
        </div>

        {/* Progress Display */}
        {isGenerating && (
          <div className="mb-4">
            <div className="mb-1 flex justify-between text-sm text-gray-600">
              <span>{progressMessage}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {errorMessage && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        )}
      </div>

      {/* Video Preview Section */}
      {previewVideo && (
        <div className="rounded-lg border p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Preview</h3>
            <div className="flex gap-2">
              <Button
                onClick={handleToggleCrop}
                variant={showCropSelector ? "default" : "outline"}
                className="min-w-[100px]"
              >
                {showCropSelector ? "Cancel Crop" : "Crop Video"}
              </Button>
              <Button
                onClick={handleDownloadVideo}
                variant="outline"
                className="min-w-[120px]"
              >
                Download Video
              </Button>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative inline-block">
              <video
                ref={videoRef}
                src={previewVideo}
                controls={!showCropSelector}
                loop
                className="h-auto max-w-full rounded-lg border border-gray-300 shadow-sm"
                style={{ maxHeight: "400px" }}
              >
                Your browser does not support the video tag.
              </video>

              {/* Crop Selector Overlay */}
              {showCropSelector && videoRef.current && (
                <VideoCropSelector
                  videoElement={videoRef.current}
                  onCropChange={handleCropChange}
                  initialCrop={cropParameters || undefined}
                />
              )}
            </div>
          </div>

          {/* Crop Controls */}
          {showCropSelector && (
            <div className="mt-4 flex justify-center gap-2">
              <Button
                onClick={handleApplyCrop}
                disabled={!cropParameters}
                className="min-w-[120px]"
              >
                Apply Crop & Regenerate
              </Button>
              <Button
                onClick={() => {
                  setShowCropSelector(false);
                  onCropParametersChange?.(null);
                }}
                variant="outline"
                className="min-w-[100px]"
              >
                Cancel
              </Button>
            </div>
          )}

          <p className="mt-4 text-center text-sm text-gray-600">
            {showCropSelector
              ? "Drag to move the crop area, resize using corner handles, then click Apply to regenerate."
              : cropParameters
                ? "Video has been cropped. Download or crop again to adjust."
                : "Your wigglegram is ready! Click the download button to save it."}
          </p>
        </div>
      )}
    </div>
  );
};
