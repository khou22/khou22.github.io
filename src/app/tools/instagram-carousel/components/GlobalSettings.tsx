"use client";

import { CarouselSettings } from "../types";
import { ASPECT_RATIOS } from "../constants";
import { Label } from "@/components/ui/label";

interface GlobalSettingsProps {
  settings: CarouselSettings;
  onChange: (settings: CarouselSettings) => void;
}

export function GlobalSettings({ settings, onChange }: GlobalSettingsProps) {
  const update = <K extends keyof CarouselSettings>(
    key: K,
    value: CarouselSettings[K],
  ) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
      {/* Aspect Ratio */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
        <select
          id="aspect-ratio"
          className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
          value={settings.aspectRatioKey}
          onChange={(e) => update("aspectRatioKey", e.target.value)}
        >
          {Object.entries(ASPECT_RATIOS).map(([key, config]) => (
            <option key={key} value={key}>
              {config.label}
            </option>
          ))}
        </select>
      </div>

      {/* Background Color */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="bg-color">Background</Label>
        <div className="flex items-center gap-2">
          <input
            id="bg-color"
            type="color"
            className="h-8 w-8 shrink-0 cursor-pointer rounded border border-gray-300"
            value={settings.backgroundColor}
            onChange={(e) => update("backgroundColor", e.target.value)}
          />
          <input
            type="text"
            className="w-full min-w-0 rounded-md border border-gray-300 px-2 py-1.5 text-xs uppercase dark:border-gray-600 dark:bg-gray-800"
            value={settings.backgroundColor}
            onChange={(e) => update("backgroundColor", e.target.value)}
          />
        </div>
      </div>

      {/* Border Color */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="border-color">Border Color</Label>
        <div className="flex items-center gap-2">
          <input
            id="border-color"
            type="color"
            className="h-8 w-8 shrink-0 cursor-pointer rounded border border-gray-300"
            value={settings.borderColor}
            onChange={(e) => update("borderColor", e.target.value)}
          />
          <input
            type="text"
            className="w-full min-w-0 rounded-md border border-gray-300 px-2 py-1.5 text-xs uppercase dark:border-gray-600 dark:bg-gray-800"
            value={settings.borderColor}
            onChange={(e) => update("borderColor", e.target.value)}
          />
        </div>
      </div>

      {/* Padding */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="padding">Padding ({settings.paddingPercent}%)</Label>
        <input
          id="padding"
          type="range"
          min={0}
          max={20}
          step={0.5}
          className="mt-1 w-full accent-blue-600"
          value={settings.paddingPercent}
          onChange={(e) => update("paddingPercent", parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
}
