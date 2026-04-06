"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Slide, CarouselSettings, TextOverlay } from "../types";
import { ASPECT_RATIOS } from "../constants";

interface CanvasEditorProps {
  slide: Slide;
  settings: CarouselSettings;
  selectedTextId: string | null;
  onSelectText: (id: string | null) => void;
  onUpdateSlide: (updates: Partial<Slide>) => void;
  onUpdateText: (textId: string, updates: Partial<TextOverlay>) => void;
  onUploadImage: (file: File) => void;
}

interface DragState {
  type: "image" | "text";
  textId?: string;
  startX: number;
  startY: number;
  startOffsetX: number;
  startOffsetY: number;
  pointerId: number;
}

export function CanvasEditor({
  slide,
  settings,
  selectedTextId,
  onSelectText,
  onUpdateSlide,
  onUpdateText,
  onUploadImage,
}: CanvasEditorProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [innerSize, setInnerSize] = useState({ width: 0, height: 0 });
  const dragRef = useRef<DragState | null>(null);

  // Track inner area size for responsive image positioning
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setInnerSize({ width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const aspect = ASPECT_RATIOS[settings.aspectRatioKey];
  const paddingFraction = settings.paddingPercent / 100;

  // Image display calculations
  const { imageUrl, imageNaturalWidth, imageNaturalHeight, scale } = slide;
  const fitScale =
    imageNaturalWidth > 0
      ? Math.min(
          innerSize.width / imageNaturalWidth,
          innerSize.height / imageNaturalHeight,
        )
      : 1;
  const displayScale = fitScale * scale;
  const imgW = imageNaturalWidth * displayScale;
  const imgH = imageNaturalHeight * displayScale;
  const imgBaseX = (innerSize.width - imgW) / 2;
  const imgBaseY = (innerSize.height - imgH) / 2;
  const imgOffsetX = slide.offsetX * innerSize.width;
  const imgOffsetY = slide.offsetY * innerSize.height;

  // --- Image drag handlers ---
  const handleImagePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLImageElement>) => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      onSelectText(null);
      dragRef.current = {
        type: "image",
        startX: e.clientX,
        startY: e.clientY,
        startOffsetX: slide.offsetX,
        startOffsetY: slide.offsetY,
        pointerId: e.pointerId,
      };
    },
    [slide.offsetX, slide.offsetY, onSelectText],
  );

  const handleImagePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLImageElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.type !== "image" || drag.pointerId !== e.pointerId)
        return;
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      if (innerSize.width > 0 && innerSize.height > 0) {
        onUpdateSlide({
          offsetX: drag.startOffsetX + dx / innerSize.width,
          offsetY: drag.startOffsetY + dy / innerSize.height,
        });
      }
    },
    [innerSize.width, innerSize.height, onUpdateSlide],
  );

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  // --- Zoom via wheel ---
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.stopPropagation();
      const delta = -e.deltaY * 0.002;
      onUpdateSlide({ scale: Math.max(0.1, slide.scale + delta * slide.scale) });
    },
    [slide.scale, onUpdateSlide],
  );

  // --- Text drag handlers ---
  const handleTextPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>, text: TextOverlay) => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      onSelectText(text.id);
      dragRef.current = {
        type: "text",
        textId: text.id,
        startX: e.clientX,
        startY: e.clientY,
        startOffsetX: text.x,
        startOffsetY: text.y,
        pointerId: e.pointerId,
      };
    },
    [onSelectText],
  );

  const handleTextPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.type !== "text" || drag.pointerId !== e.pointerId)
        return;
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      if (innerSize.width > 0 && innerSize.height > 0 && drag.textId) {
        onUpdateText(drag.textId, {
          x: drag.startOffsetX + dx / innerSize.width,
          y: drag.startOffsetY + dy / innerSize.height,
        });
      }
    },
    [innerSize.width, innerSize.height, onUpdateText],
  );

  // --- Drop zone ---
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file?.type.startsWith("image/")) {
        onUploadImage(file);
      }
    },
    [onUploadImage],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div
      className="relative mx-auto w-full"
      style={{ maxWidth: "500px", aspectRatio: `${aspect.ratio}` }}
      onWheel={handleWheel}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Border / padding area */}
      <div
        className="absolute inset-0 overflow-hidden rounded-lg"
        style={{ backgroundColor: settings.borderColor }}
      >
        {/* Inner content area */}
        <div
          ref={innerRef}
          className="absolute overflow-hidden"
          style={{
            inset: `${paddingFraction * 100}%`,
            backgroundColor: settings.backgroundColor,
          }}
          onClick={() => onSelectText(null)}
        >
          {/* Image layer */}
          {imageUrl && innerSize.width > 0 && (
            <img
              src={imageUrl}
              alt=""
              draggable={false}
              className="absolute cursor-grab select-none active:cursor-grabbing"
              style={{
                left: imgBaseX,
                top: imgBaseY,
                width: imgW,
                height: imgH,
                transform: `translate(${imgOffsetX}px, ${imgOffsetY}px)`,
                willChange: "transform",
              }}
              onPointerDown={handleImagePointerDown}
              onPointerMove={handleImagePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            />
          )}

          {/* Empty state */}
          {!imageUrl && (
            <label className="flex h-full cursor-pointer flex-col items-center justify-center gap-2 text-gray-400 transition-colors hover:text-gray-500">
              <svg
                className="h-10 w-10"
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
              <span className="text-sm">Upload image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onUploadImage(file);
                  e.target.value = "";
                }}
              />
            </label>
          )}

          {/* Text overlays */}
          {slide.texts.map((text) => (
            <div
              key={text.id}
              className={`absolute cursor-move select-none whitespace-nowrap ${
                text.id === selectedTextId
                  ? "outline outline-2 outline-blue-500"
                  : ""
              }`}
              style={{
                left: `${text.x * 100}%`,
                top: `${text.y * 100}%`,
                transform: "translate(-50%, -50%)",
                fontSize: `${(text.fontSize / 100) * innerSize.width}px`,
                fontFamily: text.fontFamily,
                color: text.color,
                fontWeight: text.fontWeight,
                textShadow: "0 1px 3px rgba(0,0,0,0.15)",
                touchAction: "none",
              }}
              onPointerDown={(e) => handleTextPointerDown(e, text)}
              onPointerMove={handleTextPointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {text.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
