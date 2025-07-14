"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { classNames } from "@/utils/style";

const DEFAULT_PIXEL_SIZE = 20;
const DEFAULT_BRUSH_SIZE = 40;

export const PhotoBlurTool = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const baseCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"brush" | "rect">("brush");
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number }>();
  const [history, setHistory] = useState<string[]>([]);
  const [pixelSize, setPixelSize] = useState(DEFAULT_PIXEL_SIZE);
  const [brushSize, setBrushSize] = useState(DEFAULT_BRUSH_SIZE);
  const [currentMousePos, setCurrentMousePos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [lastBrushPos, setLastBrushPos] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: Math.floor(
        ((e.clientX - rect.left) / rect.width) *
          (canvasRef.current?.width || 0),
      ),
      y: Math.floor(
        ((e.clientY - rect.top) / rect.height) *
          (canvasRef.current?.height || 0),
      ),
    };
  };

  const saveHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setHistory((h) => [...h, canvas.toDataURL()]);
  };

  const loadFromDataUrl = (url: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const baseCanvas = baseCanvasRef.current!;
      const overlay = overlayRef.current!;

      // Calculate display dimensions while maintaining aspect ratio
      const maxWidth = Math.min(800, window.innerWidth - 64); // Leave some margin
      const maxHeight = Math.min(600, window.innerHeight - 200); // Leave space for controls

      let displayWidth = img.width;
      let displayHeight = img.height;

      // Scale down if image is too large
      if (displayWidth > maxWidth || displayHeight > maxHeight) {
        const aspectRatio = img.width / img.height;
        if (displayWidth > displayHeight) {
          displayWidth = maxWidth;
          displayHeight = maxWidth / aspectRatio;
          if (displayHeight > maxHeight) {
            displayHeight = maxHeight;
            displayWidth = maxHeight * aspectRatio;
          }
        } else {
          displayHeight = maxHeight;
          displayWidth = maxHeight * aspectRatio;
          if (displayWidth > maxWidth) {
            displayWidth = maxWidth;
            displayHeight = maxWidth / aspectRatio;
          }
        }
      }

      // Set canvas dimensions (internal resolution)
      canvas.width = img.width;
      canvas.height = img.height;
      baseCanvas.width = img.width;
      baseCanvas.height = img.height;
      overlay.width = img.width;
      overlay.height = img.height;

      // Set display size via CSS
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;
      overlay.style.width = `${displayWidth}px`;
      overlay.style.height = `${displayHeight}px`;

      const ctx = canvas.getContext("2d")!;
      const bctx = baseCanvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      bctx.drawImage(img, 0, 0);
    };
    img.src = url;
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current!;
        const baseCanvas = baseCanvasRef.current!;
        const overlay = overlayRef.current!;

        // Calculate display dimensions while maintaining aspect ratio
        const maxWidth = Math.min(800, window.innerWidth - 64);
        const maxHeight = Math.min(600, window.innerHeight - 200);

        let displayWidth = img.width;
        let displayHeight = img.height;

        // Scale down if image is too large
        if (displayWidth > maxWidth || displayHeight > maxHeight) {
          const aspectRatio = img.width / img.height;
          if (displayWidth > displayHeight) {
            displayWidth = maxWidth;
            displayHeight = maxWidth / aspectRatio;
            if (displayHeight > maxHeight) {
              displayHeight = maxHeight;
              displayWidth = maxHeight * aspectRatio;
            }
          } else {
            displayHeight = maxHeight;
            displayWidth = maxHeight * aspectRatio;
            if (displayWidth > maxWidth) {
              displayWidth = maxWidth;
              displayHeight = maxWidth / aspectRatio;
            }
          }
        }

        // Set canvas dimensions (internal resolution)
        canvas.width = img.width;
        canvas.height = img.height;
        baseCanvas.width = img.width;
        baseCanvas.height = img.height;
        overlay.width = img.width;
        overlay.height = img.height;

        // Set display size via CSS
        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;
        overlay.style.width = `${displayWidth}px`;
        overlay.style.height = `${displayHeight}px`;

        const ctx = canvas.getContext("2d")!;
        const bctx = baseCanvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        bctx.drawImage(img, 0, 0);
        setHistory([canvas.toDataURL()]);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const pixelateRect = (x: number, y: number, w: number, h: number) => {
    const canvas = canvasRef.current;
    const baseCanvas = baseCanvasRef.current;
    if (!canvas || !baseCanvas) return;
    const ctx = canvas.getContext("2d")!;
    const bctx = baseCanvas.getContext("2d")!;
    const temp = document.createElement("canvas");
    const tw = Math.max(1, Math.floor(w / pixelSize));
    const th = Math.max(1, Math.floor(h / pixelSize));
    temp.width = tw;
    temp.height = th;
    const tctx = temp.getContext("2d")!;
    tctx.imageSmoothingEnabled = false;
    tctx.drawImage(baseCanvas, x, y, w, h, 0, 0, tw, th);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(temp, 0, 0, tw, th, x, y, w, h);
    bctx.drawImage(canvas, 0, 0);
  };

  const drawBrushIndicator = (x: number, y: number) => {
    const overlay = overlayRef.current;
    if (!overlay || !canvasRef.current) return;
    const ctx = overlay.getContext("2d")!;
    overlay.width = canvasRef.current.width;
    overlay.height = canvasRef.current.height;
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
    ctx.stroke();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const pos = getPos(e);
    setIsDrawing(true);
    setStartPos(pos);
    setCurrentMousePos(pos);
    setLastBrushPos(pos);
    if (mode === "brush") {
      pixelateRect(
        pos.x - brushSize / 2,
        pos.y - brushSize / 2,
        brushSize,
        brushSize,
      );
      drawBrushIndicator(pos.x, pos.y);
      // Don't save history here - wait until mouse up for complete stroke
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getPos(e);
    setCurrentMousePos(pos);

    if (!isDrawing || !canvasRef.current) {
      // Show brush indicator even when not drawing
      if (mode === "brush") {
        drawBrushIndicator(pos.x, pos.y);
      }
      return;
    }

    if (mode === "brush") {
      // Apply blur along the path from last position to current position
      if (lastBrushPos) {
        const distance = Math.sqrt(
          Math.pow(pos.x - lastBrushPos.x, 2) +
            Math.pow(pos.y - lastBrushPos.y, 2),
        );
        const steps = Math.max(1, Math.floor(distance / (brushSize * 0.3))); // Overlap for smooth stroke

        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const interpX = lastBrushPos.x + (pos.x - lastBrushPos.x) * t;
          const interpY = lastBrushPos.y + (pos.y - lastBrushPos.y) * t;

          pixelateRect(
            interpX - brushSize / 2,
            interpY - brushSize / 2,
            brushSize,
            brushSize,
          );
        }
      } else {
        // First brush stroke
        pixelateRect(
          pos.x - brushSize / 2,
          pos.y - brushSize / 2,
          brushSize,
          brushSize,
        );
      }

      setLastBrushPos(pos);
      drawBrushIndicator(pos.x, pos.y);
    } else if (mode === "rect" && startPos && overlayRef.current) {
      const ctx = overlayRef.current.getContext("2d")!;
      overlayRef.current.width = canvasRef.current.width;
      overlayRef.current.height = canvasRef.current.height;
      ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
      ctx.strokeStyle = "#ff0000";
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 4]);
      ctx.strokeRect(
        startPos.x,
        startPos.y,
        pos.x - startPos.x,
        pos.y - startPos.y,
      );
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setLastBrushPos(null);
    const pos = getPos(e);
    if (mode === "rect" && startPos) {
      const x = Math.min(startPos.x, pos.x);
      const y = Math.min(startPos.y, pos.y);
      const w = Math.abs(pos.x - startPos.x);
      const h = Math.abs(pos.y - startPos.y);
      pixelateRect(x, y, w, h);
      if (overlayRef.current) {
        const ctx = overlayRef.current.getContext("2d")!;
        ctx.clearRect(
          0,
          0,
          overlayRef.current.width,
          overlayRef.current.height,
        );
      }
      saveHistory();
    } else if (mode === "brush") {
      // Save history after brush stroke is complete
      saveHistory();
      if (overlayRef.current) {
        // Clear brush indicator when done drawing
        const ctx = overlayRef.current.getContext("2d")!;
        ctx.clearRect(
          0,
          0,
          overlayRef.current.width,
          overlayRef.current.height,
        );
      }
    }
  };

  const handleMouseLeave = () => {
    setCurrentMousePos(null);
    setLastBrushPos(null);
    if (overlayRef.current) {
      const ctx = overlayRef.current.getContext("2d")!;
      ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
    }
  };

  const undo = () => {
    if (history.length <= 1) return;
    const newHist = history.slice(0, -1);
    loadFromDataUrl(newHist[newHist.length - 1]);
    setHistory(newHist);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "edited.png";
    link.click();
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-start space-y-4 p-4">
      <div className="w-full">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="max-w-sm"
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          <Button
            type="button"
            variant={mode === "brush" ? "primary" : "outline"}
            onClick={() => setMode("brush")}
            size="sm"
          >
            Brush
          </Button>
          <Button
            type="button"
            variant={mode === "rect" ? "primary" : "outline"}
            onClick={() => setMode("rect")}
            size="sm"
          >
            Box
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Blur Amount:</label>
          <input
            type="range"
            min="2"
            max="30"
            value={pixelSize}
            onChange={(e) => setPixelSize(Number(e.target.value))}
            className="w-20"
          />
          <span className="w-8 text-sm text-gray-600">{pixelSize}</span>
        </div>

        {mode === "brush" && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Brush Size:</label>
            <input
              type="range"
              min="5"
              max="100"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-20"
            />
            <span className="w-8 text-sm text-gray-600">{brushSize}</span>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={undo}
            disabled={history.length <= 1}
            size="sm"
          >
            Undo
          </Button>
          <Button type="button" variant="outline" onClick={download} size="sm">
            Download
          </Button>
        </div>
      </div>
      <div className="relative flex w-full justify-center">
        <div className="relative inline-block">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className={classNames(
              "h-auto max-w-full cursor-crosshair rounded-lg border border-gray-300 shadow-sm",
              !history.length && "hidden",
            )}
            style={{ display: history.length ? "block" : "none" }}
          />
          <canvas
            ref={overlayRef}
            className="pointer-events-none absolute left-0 top-0 h-auto max-w-full"
          />
          <canvas ref={baseCanvasRef} className="hidden" />
        </div>
      </div>
      {!history.length && (
        <div className="w-full py-12 text-center text-gray-500">
          Upload an image to start editing
        </div>
      )}
    </div>
  );
};
