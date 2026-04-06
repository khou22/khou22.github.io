"use client";

import { TextOverlay } from "../types";
import { FONT_OPTIONS } from "../constants";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TextControlsProps {
  texts: TextOverlay[];
  selectedTextId: string | null;
  onSelectText: (id: string | null) => void;
  onUpdateText: (id: string, updates: Partial<TextOverlay>) => void;
  onAddText: () => void;
  onDeleteText: (id: string) => void;
}

export function TextControls({
  texts,
  selectedTextId,
  onSelectText,
  onUpdateText,
  onAddText,
  onDeleteText,
}: TextControlsProps) {
  const selected = texts.find((t) => t.id === selectedTextId) ?? null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onAddText}>
          + Add Text
        </Button>
        {selected && (
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700"
            onClick={() => {
              onDeleteText(selected.id);
              onSelectText(null);
            }}
          >
            Delete
          </Button>
        )}
      </div>

      {texts.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {texts.map((t) => (
            <button
              key={t.id}
              className={`rounded px-2 py-0.5 text-xs transition-colors ${
                t.id === selectedTextId
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
              }`}
              onClick={() =>
                onSelectText(t.id === selectedTextId ? null : t.id)
              }
            >
              {t.text.slice(0, 20) || "Empty"}
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
          <div className="col-span-2 flex flex-col gap-1 sm:col-span-3">
            <Label htmlFor="text-content">Text</Label>
            <Input
              id="text-content"
              value={selected.text}
              onChange={(e) =>
                onUpdateText(selected.id, { text: e.target.value })
              }
              placeholder="Enter text..."
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="text-font">Font</Label>
            <select
              id="text-font"
              className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
              value={selected.fontFamily}
              onChange={(e) =>
                onUpdateText(selected.id, { fontFamily: e.target.value })
              }
            >
              {FONT_OPTIONS.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="text-size">Size ({selected.fontSize}%)</Label>
            <input
              id="text-size"
              type="range"
              min={1}
              max={20}
              step={0.5}
              className="mt-1 accent-blue-600"
              value={selected.fontSize}
              onChange={(e) =>
                onUpdateText(selected.id, {
                  fontSize: parseFloat(e.target.value),
                })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="text-weight">
              Weight ({selected.fontWeight})
            </Label>
            <input
              id="text-weight"
              type="range"
              min={100}
              max={900}
              step={100}
              className="mt-1 accent-blue-600"
              value={selected.fontWeight}
              onChange={(e) =>
                onUpdateText(selected.id, {
                  fontWeight: parseInt(e.target.value),
                })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="text-color">Color</Label>
            <div className="flex items-center gap-2">
              <input
                id="text-color"
                type="color"
                className="h-8 w-8 shrink-0 cursor-pointer rounded border border-gray-300"
                value={selected.color}
                onChange={(e) =>
                  onUpdateText(selected.id, { color: e.target.value })
                }
              />
              <span className="text-xs uppercase text-gray-500">
                {selected.color}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
