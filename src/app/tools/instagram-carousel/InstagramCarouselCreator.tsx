"use client";

import { useState, useCallback } from "react";
import { Slide, CarouselSettings, TextOverlay } from "./types";
import { DEFAULT_SETTINGS, DEFAULT_TEXT_OVERLAY } from "./constants";
import { GlobalSettings } from "./components/GlobalSettings";
import { CanvasEditor } from "./components/CanvasEditor";
import { SlideStrip } from "./components/SlideStrip";
import { TextControls } from "./components/TextControls";
import { ExportButton } from "./components/ExportButton";

function createSlide(imageUrl: string | null = null): Slide {
  return {
    id: crypto.randomUUID(),
    imageUrl,
    imageNaturalWidth: 0,
    imageNaturalHeight: 0,
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    texts: [],
  };
}

function loadImageDimensions(
  url: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () =>
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = url;
  });
}

export function InstagramCarouselCreator() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [activeSlideId, setActiveSlideId] = useState<string | null>(null);
  const [settings, setSettings] = useState<CarouselSettings>(DEFAULT_SETTINGS);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

  const activeSlide = slides.find((s) => s.id === activeSlideId) ?? null;

  // --- Slide management ---
  const addSlides = useCallback(async (files: File[]) => {
    const newSlides: Slide[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      const url = URL.createObjectURL(file);
      const dims = await loadImageDimensions(url);
      newSlides.push({
        ...createSlide(url),
        imageNaturalWidth: dims.width,
        imageNaturalHeight: dims.height,
      });
    }
    if (newSlides.length === 0) return;
    setSlides((prev) => [...prev, ...newSlides]);
    setActiveSlideId((prev) => prev ?? newSlides[0].id);
  }, []);

  const deleteSlide = useCallback(
    (id: string) => {
      setSlides((prev) => {
        const next = prev.filter((s) => s.id !== id);
        if (activeSlideId === id) {
          const idx = prev.findIndex((s) => s.id === id);
          const newActive =
            next[Math.min(idx, next.length - 1)]?.id ?? null;
          // We need to set this outside the setSlides callback
          setTimeout(() => setActiveSlideId(newActive), 0);
        }
        return next;
      });
      setSelectedTextId(null);
    },
    [activeSlideId],
  );

  const updateSlide = useCallback(
    (updates: Partial<Slide>) => {
      if (!activeSlideId) return;
      setSlides((prev) =>
        prev.map((s) => (s.id === activeSlideId ? { ...s, ...updates } : s)),
      );
    },
    [activeSlideId],
  );

  const reorderSlides = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return;
      setSlides((prev) => {
        const next = [...prev];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        return next;
      });
    },
    [],
  );

  // --- Image upload for active slide ---
  const uploadImageToActive = useCallback(
    async (file: File) => {
      if (!activeSlideId || !file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      const dims = await loadImageDimensions(url);
      setSlides((prev) =>
        prev.map((s) =>
          s.id === activeSlideId
            ? {
                ...s,
                imageUrl: url,
                imageNaturalWidth: dims.width,
                imageNaturalHeight: dims.height,
                offsetX: 0,
                offsetY: 0,
                scale: 1,
              }
            : s,
        ),
      );
    },
    [activeSlideId],
  );

  // --- Text overlay management ---
  const addText = useCallback(() => {
    if (!activeSlideId) return;
    const newText: TextOverlay = {
      id: crypto.randomUUID(),
      text: "Text",
      x: 0.5,
      y: 0.5,
      ...DEFAULT_TEXT_OVERLAY,
    };
    setSlides((prev) =>
      prev.map((s) =>
        s.id === activeSlideId
          ? { ...s, texts: [...s.texts, newText] }
          : s,
      ),
    );
    setSelectedTextId(newText.id);
  }, [activeSlideId]);

  const updateText = useCallback(
    (textId: string, updates: Partial<TextOverlay>) => {
      if (!activeSlideId) return;
      setSlides((prev) =>
        prev.map((s) =>
          s.id === activeSlideId
            ? {
                ...s,
                texts: s.texts.map((t) =>
                  t.id === textId ? { ...t, ...updates } : t,
                ),
              }
            : s,
        ),
      );
    },
    [activeSlideId],
  );

  const deleteText = useCallback(
    (textId: string) => {
      if (!activeSlideId) return;
      setSlides((prev) =>
        prev.map((s) =>
          s.id === activeSlideId
            ? { ...s, texts: s.texts.filter((t) => t.id !== textId) }
            : s,
        ),
      );
    },
    [activeSlideId],
  );

  // --- Initial state: no slides yet ---
  if (slides.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4">
        <label className="flex h-64 w-full max-w-md cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 transition-colors hover:border-blue-400 hover:text-blue-500">
          <svg
            className="h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
            />
          </svg>
          <span className="text-sm font-medium">
            Upload images to get started
          </span>
          <span className="text-xs">Drag & drop or click to browse</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              addSlides(Array.from(e.target.files ?? []));
              e.target.value = "";
            }}
          />
        </label>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Global settings */}
      <GlobalSettings settings={settings} onChange={setSettings} />

      {/* Canvas editor */}
      {activeSlide && (
        <CanvasEditor
          slide={activeSlide}
          settings={settings}
          selectedTextId={selectedTextId}
          onSelectText={setSelectedTextId}
          onUpdateSlide={updateSlide}
          onUpdateText={updateText}
          onUploadImage={uploadImageToActive}
        />
      )}

      {/* Text controls */}
      {activeSlide && (
        <div className="mx-auto w-full max-w-lg">
          <TextControls
            texts={activeSlide.texts}
            selectedTextId={selectedTextId}
            onSelectText={setSelectedTextId}
            onUpdateText={updateText}
            onAddText={addText}
            onDeleteText={deleteText}
          />
        </div>
      )}

      {/* Slide strip */}
      <div className="mx-auto w-full max-w-2xl">
        <SlideStrip
          slides={slides}
          activeSlideId={activeSlideId}
          settings={settings}
          onSelectSlide={setActiveSlideId}
          onReorder={reorderSlides}
          onAddSlides={addSlides}
          onDeleteSlide={deleteSlide}
        />
      </div>

      {/* Export */}
      <div className="flex justify-center">
        <ExportButton slides={slides} settings={settings} />
      </div>
    </div>
  );
}
