"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { classNames } from "@/utils/style";

const PIXEL_SIZE = 10;

export const PhotoBlurTool = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const baseCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"brush" | "rect">("brush");
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number }>();
  const [history, setHistory] = useState<string[]>([]);

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
      canvas.width = img.width;
      canvas.height = img.height;
      baseCanvas.width = img.width;
      baseCanvas.height = img.height;
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
        canvas.width = img.width;
        canvas.height = img.height;
        baseCanvas.width = img.width;
        baseCanvas.height = img.height;
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
    const tw = Math.max(1, Math.floor(w / PIXEL_SIZE));
    const th = Math.max(1, Math.floor(h / PIXEL_SIZE));
    temp.width = tw;
    temp.height = th;
    const tctx = temp.getContext("2d")!;
    tctx.imageSmoothingEnabled = false;
    tctx.drawImage(baseCanvas, x, y, w, h, 0, 0, tw, th);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(temp, 0, 0, tw, th, x, y, w, h);
    // update baseCanvas
    bctx.drawImage(canvas, 0, 0);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const pos = getPos(e);
    setIsDrawing(true);
    setStartPos(pos);
    if (mode === "brush") {
      pixelateRect(
        pos.x - PIXEL_SIZE / 2,
        pos.y - PIXEL_SIZE / 2,
        PIXEL_SIZE,
        PIXEL_SIZE,
      );
      saveHistory();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const pos = getPos(e);
    if (mode === "brush") {
      pixelateRect(
        pos.x - PIXEL_SIZE / 2,
        pos.y - PIXEL_SIZE / 2,
        PIXEL_SIZE,
        PIXEL_SIZE,
      );
    } else if (mode === "rect" && startPos && overlayRef.current) {
      const ctx = overlayRef.current.getContext("2d")!;
      overlayRef.current.width = canvasRef.current.width;
      overlayRef.current.height = canvasRef.current.height;
      ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
      ctx.strokeStyle = "red";
      ctx.setLineDash([4, 2]);
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
    <div className="flex w-full flex-col items-start space-y-4">
      <Input type="file" accept="image/*" onChange={handleFile} />
      <div className="flex space-x-2">
        <Button
          type="button"
          variant={mode === "brush" ? "primary" : "outline"}
          onClick={() => setMode("brush")}
        >
          Brush
        </Button>
        <Button
          type="button"
          variant={mode === "rect" ? "primary" : "outline"}
          onClick={() => setMode("rect")}
        >
          Box
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={undo}
          disabled={history.length <= 1}
        >
          Undo
        </Button>
        <Button type="button" variant="outline" onClick={download}>
          Download
        </Button>
      </div>
      <div className="relative w-full">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className={classNames("border", !history.length && "hidden")}
        />
        <canvas
          ref={overlayRef}
          className="pointer-events-none absolute left-0 top-0"
        />
        <canvas ref={baseCanvasRef} className="hidden" />
      </div>
    </div>
  );
};
