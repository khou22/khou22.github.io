"use client";

import { SimpleFrameEditorProps } from "./types";
import { Button } from "@/components/ui/button";

export const SimpleFrameEditor = ({
  extractedFrames,
  numFrames,
  frameArrangement,
  animationSpeed,
  repeatCount,
  onNumFramesChange,
  onFrameArrangementChange,
  onAnimationSpeedChange,
  onRepeatCountChange,
  onModeToggle,
  isEditorMode,
}: SimpleFrameEditorProps) => {
  // Calculate estimated duration
  const totalFrames = numFrames * 2 * repeatCount; // Snake animation doubles frames per repeat
  const estimatedDuration = (totalFrames * animationSpeed) / 1000; // Convert to seconds
  return (
    <div className="w-full space-y-6">
      {/* Settings Panel */}
      <div className="rounded-lg border p-6">
        <h3 className="mb-4 text-lg font-semibold">
          Frame Extraction Settings
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Number of Frames */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Number of frames
            </label>
            <select
              value={numFrames}
              onChange={(e) => onNumFramesChange(parseInt(e.target.value))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value={2}>2 frames</option>
              <option value={3}>3 frames</option>
              <option value={4}>4 frames</option>
              <option value={5}>5 frames</option>
              <option value={6}>6 frames</option>
            </select>
          </div>

          {/* Frame Arrangement */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Frame arrangement
            </label>
            <select
              value={frameArrangement}
              onChange={(e) =>
                onFrameArrangementChange(
                  e.target.value as "horizontal" | "vertical",
                )
              }
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
          </div>

          {/* Animation Speed */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Animation speed: {animationSpeed}ms
            </label>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={animationSpeed}
              onChange={(e) => onAnimationSpeedChange(parseInt(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>Fast (50ms)</span>
              <span>Slow (1000ms)</span>
            </div>
          </div>

          {/* Repeat Count */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Repeats: {repeatCount}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={repeatCount}
              onChange={(e) => onRepeatCountChange(parseInt(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>1x</span>
              <span>10x</span>
            </div>
          </div>
        </div>

        {/* Duration Estimation */}
        <div className="mt-4 rounded-md bg-blue-50 p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-blue-900">
              Estimated Duration:{" "}
              <strong>{estimatedDuration.toFixed(1)}s</strong>
            </span>
            <span className="text-blue-700">
              {totalFrames} frames • {repeatCount} repeat
              {repeatCount !== 1 ? "s" : ""}
            </span>
          </div>
          <p className="mt-1 text-xs text-blue-600">
            Snake animation plays forward then backward for each repeat
          </p>
        </div>

        {/* Mode Toggle */}
        {extractedFrames.length > 0 && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-700">
                  Editing Mode
                </h4>
                <p className="text-sm text-gray-500">
                  {isEditorMode
                    ? "Using alignment editor for precise frame positioning"
                    : "Using simple mode for quick video generation"}
                </p>
              </div>
              <Button
                onClick={() => onModeToggle(!isEditorMode)}
                variant={isEditorMode ? "default" : "outline"}
                className="min-w-[140px]"
              >
                {isEditorMode ? "Switch to Simple" : "Use Alignment Editor"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Extracted Frames Preview */}
      {extractedFrames.length > 0 && !isEditorMode && (
        <div className="rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-semibold">Extracted Frames</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {extractedFrames.map((frame, index) => (
              <div key={index} className="space-y-2">
                <div className="relative">
                  <img
                    src={frame.dataUrl}
                    alt={`Frame ${index + 1}`}
                    className="h-auto w-full rounded-lg border border-gray-300 shadow-sm"
                  />
                  <div className="absolute left-1 top-1 rounded bg-black bg-opacity-75 px-1.5 py-0.5 text-xs text-white">
                    {index + 1}
                  </div>
                </div>
                <p className="text-center text-xs text-gray-500">
                  {frame.canvas.width} × {frame.canvas.height}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
