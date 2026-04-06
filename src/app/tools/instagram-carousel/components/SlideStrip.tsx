"use client";

import { useRef, useCallback, useState } from "react";
import { Slide, CarouselSettings } from "../types";
import { ASPECT_RATIOS } from "../constants";

interface SlideStripProps {
  slides: Slide[];
  activeSlideId: string | null;
  settings: CarouselSettings;
  onSelectSlide: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onAddSlides: (files: File[]) => void;
  onDeleteSlide: (id: string) => void;
}

const THUMB_HEIGHT = 100;

export function SlideStrip({
  slides,
  activeSlideId,
  settings,
  onSelectSlide,
  onReorder,
  onAddSlides,
  onDeleteSlide,
}: SlideStripProps) {
  const aspect = ASPECT_RATIOS[settings.aspectRatioKey];
  const thumbWidth = THUMB_HEIGHT * aspect.ratio;
  const paddingFraction = settings.paddingPercent / 100;

  // Drag-to-reorder state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragData = useRef<{ id: string; startIndex: number } | null>(null);

  const handleDragStart = useCallback(
    (e: React.DragEvent, index: number) => {
      dragData.current = { id: slides[index].id, startIndex: index };
      setDragIndex(index);
      e.dataTransfer.effectAllowed = "move";
      // Required for Firefox
      e.dataTransfer.setData("text/plain", slides[index].id);
    },
    [slides],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setOverIndex(index);
    },
    [],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault();
      if (dragData.current) {
        onReorder(dragData.current.startIndex, dropIndex);
      }
      setDragIndex(null);
      setOverIndex(null);
      dragData.current = null;
    },
    [onReorder],
  );

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setOverIndex(null);
    dragData.current = null;
  }, []);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (files.length > 0) onAddSlides(files);
      e.target.value = "";
    },
    [onAddSlides],
  );

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          onClick={() => onSelectSlide(slide.id)}
          className={`group relative shrink-0 cursor-grab overflow-hidden rounded-md border-2 transition-all active:cursor-grabbing ${
            slide.id === activeSlideId
              ? "border-blue-500 shadow-md"
              : "border-gray-200 hover:border-gray-300 dark:border-gray-600"
          } ${dragIndex === index ? "opacity-40" : ""} ${
            overIndex === index && dragIndex !== index
              ? "ring-2 ring-blue-400 ring-offset-1"
              : ""
          }`}
          style={{
            width: thumbWidth,
            height: THUMB_HEIGHT,
          }}
        >
          {/* Thumbnail preview */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: settings.borderColor }}
          >
            <div
              className="absolute overflow-hidden"
              style={{
                inset: `${paddingFraction * 100}%`,
                backgroundColor: settings.backgroundColor,
              }}
            >
              {slide.imageUrl && (
                <img
                  src={slide.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              )}
              {!slide.imageUrl && (
                <div className="flex h-full items-center justify-center text-xs text-gray-400">
                  Empty
                </div>
              )}
            </div>
          </div>

          {/* Slide number */}
          <div className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
            {index + 1}
          </div>

          {/* Delete button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteSlide(slide.id);
            }}
            className="absolute right-1 top-1 hidden rounded-full bg-black/60 p-0.5 text-white transition-colors hover:bg-red-600 group-hover:block"
          >
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}

      {/* Add slides button */}
      <label
        className="flex shrink-0 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-gray-400 transition-colors hover:border-gray-400 hover:text-gray-500 dark:border-gray-600"
        style={{ width: thumbWidth, height: THUMB_HEIGHT }}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        <span className="text-[10px]">Add</span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
      </label>
    </div>
  );
}
