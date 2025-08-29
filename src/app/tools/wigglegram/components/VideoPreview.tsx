"use client";

import { VideoPreviewProps } from "../types/wigglegram";
import { Button } from "@/components/ui/button";

export const VideoPreview = ({
  previewVideo,
  isGenerating,
  progress,
  progressMessage,
  errorMessage,
  onGenerateVideo,
  onDownloadVideo,
}: VideoPreviewProps) => {
  return (
    <div className="w-full space-y-6">
      {/* Generate Video Section */}
      <div className="rounded-lg border p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Generate Video</h3>
          <Button
            onClick={onGenerateVideo}
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
            <Button
              onClick={onDownloadVideo}
              variant="outline"
              className="min-w-[120px]"
            >
              Download Video
            </Button>
          </div>

          <div className="flex justify-center">
            <video
              src={previewVideo}
              controls
              loop
              className="h-auto max-w-full rounded-lg border border-gray-300 shadow-sm"
              style={{ maxHeight: "400px" }}
            >
              Your browser does not support the video tag.
            </video>
          </div>

          <p className="mt-4 text-center text-sm text-gray-600">
            Your wigglegram is ready! Click the download button to save it.
          </p>
        </div>
      )}
    </div>
  );
};
