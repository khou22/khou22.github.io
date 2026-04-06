"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  Stage,
  Layer,
  Rect,
  Image as KonvaImage,
  Text as KonvaText,
  Group,
  Transformer,
} from "react-konva";
import Konva from "konva";
import { Slide, CarouselSettings, TextOverlay } from "../types";
import { ASPECT_RATIOS } from "../constants";

// ---------------------------------------------------------------------------
// Hook: load an HTMLImageElement from a URL (needed by Konva <Image>)
// ---------------------------------------------------------------------------
function useLoadedImage(url: string | null): HTMLImageElement | null {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    if (!url) {
      setImg(null);
      return;
    }
    const el = new window.Image();
    el.onload = () => setImg(el);
    el.src = url;
    return () => {
      el.onload = null;
    };
  }, [url]);
  return img;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface CanvasEditorProps {
  slide: Slide;
  settings: CarouselSettings;
  selectedTextId: string | null;
  onSelectText: (id: string | null) => void;
  onUpdateSlide: (updates: Partial<Slide>) => void;
  onUpdateText: (textId: string, updates: Partial<TextOverlay>) => void;
  onUploadImage: (file: File) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function CanvasEditor({
  slide,
  settings,
  selectedTextId,
  onSelectText,
  onUpdateSlide,
  onUpdateText,
  onUploadImage,
}: CanvasEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const imageNodeRef = useRef<Konva.Image | null>(null);
  const transformerRef = useRef<Konva.Transformer | null>(null);
  const textNodeRefs = useRef<Map<string, Konva.Text>>(new Map());
  const [imageSelected, setImageSelected] = useState(false);

  const aspect = ASPECT_RATIOS[settings.aspectRatioKey];
  const image = useLoadedImage(slide.imageUrl);

  // ---- Responsive stage sizing ----
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const w = Math.min(el.clientWidth, 500);
      setStageSize({ width: w, height: w / aspect.ratio });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [aspect.ratio]);

  // ---- Prevent page scroll over the canvas ----
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const prevent = (e: WheelEvent) => e.preventDefault();
    el.addEventListener("wheel", prevent, { passive: false });
    return () => el.removeEventListener("wheel", prevent);
  }, []);

  // ---- Reset selection when switching slides ----
  useEffect(() => {
    setImageSelected(false);
  }, [slide.id]);

  // ---- Derived dimensions ----
  const { width: stageW, height: stageH } = stageSize;
  const padding = (settings.paddingPercent / 100) * stageW;
  const innerW = stageW - 2 * padding;
  const innerH = stageH - 2 * padding;

  const fitScale =
    image && image.naturalWidth > 0
      ? Math.min(
          innerW / image.naturalWidth,
          innerH / image.naturalHeight,
        )
      : 1;
  const displayScale = fitScale * slide.scale;
  const imgW = image ? image.naturalWidth * displayScale : 0;
  const imgH = image ? image.naturalHeight * displayScale : 0;
  const imgX = padding + (innerW - imgW) / 2 + slide.offsetX * innerW;
  const imgY = padding + (innerH - imgH) / 2 + slide.offsetY * innerH;

  // ---- Attach / detach Transformer ----
  useEffect(() => {
    const tr = transformerRef.current;
    if (!tr) return;
    if (imageSelected && imageNodeRef.current) {
      tr.nodes([imageNodeRef.current]);
    } else {
      tr.nodes([]);
    }
    tr.getLayer()?.batchDraw();
  }, [imageSelected, slide.id]);

  // ---- Handlers ----
  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      const name = (e.target as Konva.Node).name?.() ?? "";
      if (
        e.target === e.target.getStage() ||
        name === "bg" ||
        name === "inner-bg"
      ) {
        setImageSelected(false);
        onSelectText(null);
      }
    },
    [onSelectText],
  );

  const handleImageClick = useCallback(() => {
    setImageSelected(true);
    onSelectText(null);
  }, [onSelectText]);

  const handleImageDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      if (innerW === 0) return;
      const node = e.target;
      const centerX = padding + innerW / 2 - imgW / 2;
      const centerY = padding + innerH / 2 - imgH / 2;
      onUpdateSlide({
        offsetX: (node.x() - centerX) / innerW,
        offsetY: (node.y() - centerY) / innerH,
      });
    },
    [padding, innerW, innerH, imgW, imgH, onUpdateSlide],
  );

  const handleImageTransformEnd = useCallback(
    (e: Konva.KonvaEventObject<Event>) => {
      const node = e.target as Konva.Image;
      if (!image) return;
      const newScaleX = node.scaleX();
      const newWidthPx = node.width() * newScaleX;
      const newScale = newWidthPx / (image.naturalWidth * fitScale);
      const newImgW = image.naturalWidth * fitScale * newScale;
      const newImgH = image.naturalHeight * fitScale * newScale;
      const centerX = padding + innerW / 2 - newImgW / 2;
      const centerY = padding + innerH / 2 - newImgH / 2;

      // Reset Konva's own scale so we track it ourselves
      node.scaleX(1);
      node.scaleY(1);
      node.width(newImgW);
      node.height(newImgH);

      onUpdateSlide({
        scale: Math.max(0.05, newScale),
        offsetX: (node.x() - centerX) / innerW,
        offsetY: (node.y() - centerY) / innerH,
      });
    },
    [image, fitScale, padding, innerW, innerH, onUpdateSlide],
  );

  const handleTextClick = useCallback(
    (id: string) => {
      setImageSelected(false);
      onSelectText(id);
    },
    [onSelectText],
  );

  const handleTextDragEnd = useCallback(
    (textId: string, e: Konva.KonvaEventObject<DragEvent>) => {
      if (innerW === 0) return;
      const node = e.target;
      onUpdateText(textId, {
        x: (node.x() - padding) / innerW,
        y: (node.y() - padding) / innerH,
      });
    },
    [padding, innerW, innerH, onUpdateText],
  );

  // ---- File drop ----
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file?.type.startsWith("image/")) onUploadImage(file);
    },
    [onUploadImage],
  );

  // ---- Render ----

  // Placeholder while measuring
  if (stageW === 0) {
    return (
      <div
        ref={containerRef}
        className="mx-auto w-full"
        style={{ maxWidth: 500, aspectRatio: `${aspect.ratio}` }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full"
      style={{ maxWidth: 500, touchAction: "none" }}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <Stage
        width={stageW}
        height={stageH}
        onClick={handleStageClick}
        onTap={handleStageClick}
      >
        <Layer>
          {/* Border / padding background */}
          <Rect
            name="bg"
            x={0}
            y={0}
            width={stageW}
            height={stageH}
            fill={settings.borderColor}
            cornerRadius={8}
          />

          {/* Clipped inner area */}
          <Group
            clipX={padding}
            clipY={padding}
            clipWidth={innerW}
            clipHeight={innerH}
          >
            {/* Inner background */}
            <Rect
              name="inner-bg"
              x={padding}
              y={padding}
              width={innerW}
              height={innerH}
              fill={settings.backgroundColor}
            />

            {/* Image */}
            {image && (
              <KonvaImage
                ref={(node) => {
                  imageNodeRef.current = node;
                }}
                image={image}
                x={imgX}
                y={imgY}
                width={imgW}
                height={imgH}
                draggable
                onClick={handleImageClick}
                onTap={handleImageClick}
                onDragEnd={handleImageDragEnd}
                onTransformEnd={handleImageTransformEnd}
              />
            )}

            {/* Text overlays */}
            {slide.texts.map((text) => {
              const fontSize = (text.fontSize / 100) * innerW;
              return (
                <KonvaText
                  key={text.id}
                  ref={(node) => {
                    if (node) textNodeRefs.current.set(text.id, node);
                    else textNodeRefs.current.delete(text.id);
                  }}
                  x={padding + text.x * innerW}
                  y={padding + text.y * innerH}
                  text={text.text}
                  fontSize={fontSize}
                  fontFamily={text.fontFamily}
                  fill={text.color}
                  fontStyle={text.fontWeight >= 600 ? "bold" : "normal"}
                  draggable
                  onClick={() => handleTextClick(text.id)}
                  onTap={() => handleTextClick(text.id)}
                  onDragEnd={(e) => handleTextDragEnd(text.id, e)}
                  stroke={
                    text.id === selectedTextId ? "#3b82f6" : undefined
                  }
                  strokeWidth={text.id === selectedTextId ? 0.5 : 0}
                />
              );
            })}
          </Group>

          {/* Transformer for image resize handles */}
          <Transformer
            ref={(node) => {
              transformerRef.current = node;
            }}
            keepRatio
            enabledAnchors={[
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
            ]}
            rotateEnabled={false}
            borderStroke="#3b82f6"
            borderStrokeWidth={1.5}
            anchorStroke="#3b82f6"
            anchorFill="#ffffff"
            anchorSize={10}
            anchorCornerRadius={2}
            boundBoxFunc={(_oldBox, newBox) => {
              if (newBox.width < 10 || newBox.height < 10) return _oldBox;
              return newBox;
            }}
          />
        </Layer>
      </Stage>

      {/* Upload overlay when no image */}
      {!slide.imageUrl && (
        <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-2 text-gray-400 transition-colors hover:text-gray-500">
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
    </div>
  );
}
