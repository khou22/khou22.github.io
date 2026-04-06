"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Slide, CarouselSettings } from "../types";
import { ASPECT_RATIOS } from "../constants";
import { Button } from "@/components/ui/button";

interface ExportButtonProps {
  slides: Slide[];
  settings: CarouselSettings;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function renderSlide(
  slide: Slide,
  settings: CarouselSettings,
): Promise<Blob> {
  const aspect = ASPECT_RATIOS[settings.aspectRatioKey];
  const { exportWidth: w, exportHeight: h } = aspect;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Border / padding area
  ctx.fillStyle = settings.borderColor;
  ctx.fillRect(0, 0, w, h);

  // Inner area
  const padding = (settings.paddingPercent / 100) * w;
  const innerW = w - 2 * padding;
  const innerH = h - 2 * padding;
  ctx.fillStyle = settings.backgroundColor;
  ctx.fillRect(padding, padding, innerW, innerH);

  // Image
  if (slide.imageUrl) {
    const img = await loadImage(slide.imageUrl);
    const fitScale = Math.min(
      innerW / img.naturalWidth,
      innerH / img.naturalHeight,
    );
    const displayScale = fitScale * slide.scale;
    const imgW = img.naturalWidth * displayScale;
    const imgH = img.naturalHeight * displayScale;
    const imgX = padding + (innerW - imgW) / 2 + slide.offsetX * innerW;
    const imgY = padding + (innerH - imgH) / 2 + slide.offsetY * innerH;

    ctx.save();
    ctx.beginPath();
    ctx.rect(padding, padding, innerW, innerH);
    ctx.clip();
    ctx.drawImage(img, imgX, imgY, imgW, imgH);
    ctx.restore();
  }

  // Text overlays
  ctx.save();
  ctx.beginPath();
  ctx.rect(padding, padding, innerW, innerH);
  ctx.clip();
  for (const text of slide.texts) {
    const fontSize = (text.fontSize / 100) * innerW;
    ctx.font = `${text.fontWeight} ${fontSize}px ${text.fontFamily}`;
    ctx.fillStyle = text.color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text.text, padding + text.x * innerW, padding + text.y * innerH);
  }
  ctx.restore();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Export failed"))),
      "image/png",
      1.0,
    );
  });
}

export function ExportButton({ slides, settings }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = useCallback(async () => {
    if (slides.length === 0) {
      toast.error("No slides to export");
      return;
    }

    setExporting(true);
    try {
      for (let i = 0; i < slides.length; i++) {
        const blob = await renderSlide(slides[i], settings);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `carousel-${i + 1}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
      toast.success(`Exported ${slides.length} slide${slides.length > 1 ? "s" : ""}`);
    } catch {
      toast.error("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  }, [slides, settings]);

  return (
    <Button onClick={handleExport} disabled={exporting || slides.length === 0}>
      {exporting ? "Exporting..." : `Export ${slides.length} Slide${slides.length !== 1 ? "s" : ""}`}
    </Button>
  );
}
