"use client";

import { useState, useEffect } from "react";
import {
  LayerControlPanelProps,
  LayerState,
  DragLayer,
} from "../types/wigglegram";
import { Button } from "@/components/ui/button";

export const LayerControlPanel = ({
  alignmentOffsets,
  onLayerStateChange,
  onResetAlignment,
  onResetAllLayers,
}: LayerControlPanelProps) => {
  // Internal layer state management
  const [layerVisibility, setLayerVisibility] = useState<LayerState>({
    left: true,
    right: true,
  });
  const [layerLocked, setLayerLocked] = useState<LayerState>({
    left: false,
    right: false,
  });
  const [selectedLayer, setSelectedLayer] = useState<DragLayer>(null);

  // Emit state changes to parent
  useEffect(() => {
    onLayerStateChange?.({
      visibility: layerVisibility,
      locked: layerLocked,
      selected: selectedLayer,
    });
  }, [layerVisibility, layerLocked, selectedLayer, onLayerStateChange]);
  const handleToggleVisibility = (layer: "left" | "right") => {
    setLayerVisibility({
      ...layerVisibility,
      [layer]: !layerVisibility[layer],
    });
  };

  const handleToggleLocked = (layer: "left" | "right") => {
    setLayerLocked({
      ...layerLocked,
      [layer]: !layerLocked[layer],
    });
  };

  const handleSelectLayer = (layer: "left" | "right") => {
    setSelectedLayer(selectedLayer === layer ? null : layer);
  };

  const handleResetAllLayers = () => {
    setLayerVisibility({ left: true, right: true });
    setLayerLocked({ left: false, right: false });
    setSelectedLayer(null);
    onResetAllLayers?.();
  };

  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg font-semibold">Layer Controls</h3>

      {/* Left Frame Controls */}
      <div className="rounded-lg border border-gray-300 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="font-medium text-gray-700">Left Frame</h4>
          <div className="flex gap-1">
            <button
              onClick={() => handleToggleVisibility("left")}
              className={`rounded p-1 text-xs ${
                layerVisibility.left
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
              title={layerVisibility.left ? "Hide layer" : "Show layer"}
            >
              {layerVisibility.left ? "👁️" : "🙈"}
            </button>
            <button
              onClick={() => handleToggleLocked("left")}
              className={`rounded p-1 text-xs ${
                layerLocked.left
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-500"
              }`}
              title={layerLocked.left ? "Unlock layer" : "Lock layer"}
            >
              {layerLocked.left ? "🔒" : "🔓"}
            </button>
          </div>
        </div>
        <button
          onClick={() => handleSelectLayer("left")}
          className={`w-full rounded px-2 py-1 text-left text-xs ${
            selectedLayer === "left"
              ? "bg-blue-200 text-blue-800"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {selectedLayer === "left" ? "Selected" : "Click to select"}
        </button>
        <div className="mt-1 text-xs text-gray-500">
          Offset: ({alignmentOffsets.left.x}, {alignmentOffsets.left.y})
        </div>
      </div>

      {/* Right Frame Controls */}
      <div className="rounded-lg border border-gray-300 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="font-medium text-gray-700">Right Frame</h4>
          <div className="flex gap-1">
            <button
              onClick={() => handleToggleVisibility("right")}
              className={`rounded p-1 text-xs ${
                layerVisibility.right
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
              title={layerVisibility.right ? "Hide layer" : "Show layer"}
            >
              {layerVisibility.right ? "👁️" : "🙈"}
            </button>
            <button
              onClick={() => handleToggleLocked("right")}
              className={`rounded p-1 text-xs ${
                layerLocked.right
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-500"
              }`}
              title={layerLocked.right ? "Unlock layer" : "Lock layer"}
            >
              {layerLocked.right ? "🔒" : "🔓"}
            </button>
          </div>
        </div>
        <button
          onClick={() => handleSelectLayer("right")}
          className={`w-full rounded px-2 py-1 text-left text-xs ${
            selectedLayer === "right"
              ? "bg-blue-200 text-blue-800"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {selectedLayer === "right" ? "Selected" : "Click to select"}
        </button>
        <div className="mt-1 text-xs text-gray-500">
          Offset: ({alignmentOffsets.right.x}, {alignmentOffsets.right.y})
        </div>
      </div>

      {/* Global Controls */}
      <div className="space-y-2">
        <Button
          onClick={onResetAlignment}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Reset Alignment
        </Button>
        <Button
          onClick={handleResetAllLayers}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Reset All Layers
        </Button>
      </div>

      {/* Instructions */}
      <div className="rounded-lg bg-blue-50 p-3">
        <h5 className="mb-1 text-sm font-medium text-blue-900">
          Instructions:
        </h5>
        <ul className="space-y-1 text-xs text-blue-800">
          <li>• Drag frames on canvas to align</li>
          <li>• Toggle visibility to see individual layers</li>
          <li>• Lock layers to prevent accidental movement</li>
          <li>• Select layers for visual highlighting</li>
        </ul>
      </div>
    </div>
  );
};
