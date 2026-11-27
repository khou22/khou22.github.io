import { BoundingBox } from "./types";

function downscaleCanvas(
  canvas: HTMLCanvasElement,
  scale: number,
): HTMLCanvasElement {
  const scaled = document.createElement("canvas");
  scaled.width = Math.round(canvas.width * scale);
  scaled.height = Math.round(canvas.height * scale);
  const ctx = scaled.getContext("2d")!;
  ctx.drawImage(canvas, 0, 0, scaled.width, scaled.height);
  return scaled;
}

function computeEdges(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;
  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const gray = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    gray[i] = data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114;
  }
  const edges = new Float32Array(width * height);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const gx = gray[idx + 1] - gray[idx - 1];
      const gy = gray[idx + width] - gray[idx - width];
      edges[idx] = Math.sqrt(gx * gx + gy * gy);
    }
  }
  return { data: edges, width, height };
}

function edgeDifference(
  base: { data: Float32Array; width: number; height: number },
  target: { data: Float32Array; width: number; height: number },
  box: BoundingBox,
  dx: number,
  dy: number,
) {
  let score = 0;
  let count = 0;
  for (let y = 0; y < box.height; y++) {
    const by = box.y + y;
    const ty = by + dy;
    if (ty < 0 || ty >= target.height) continue;
    for (let x = 0; x < box.width; x++) {
      const bx = box.x + x;
      const tx = bx + dx;
      if (tx < 0 || tx >= target.width) continue;
      const bIdx = by * base.width + bx;
      const tIdx = ty * target.width + tx;
      const diff = base.data[bIdx] - target.data[tIdx];
      score += diff * diff;
      count++;
    }
  }
  return count === 0 ? Number.POSITIVE_INFINITY : score / count;
}

export async function autoAlign(
  baseCanvas: HTMLCanvasElement,
  targetCanvas: HTMLCanvasElement,
  box: BoundingBox,
) {
  const maxDim = 200;
  const scale = Math.min(
    maxDim / baseCanvas.width,
    maxDim / baseCanvas.height,
    1,
  );
  const baseScaled = downscaleCanvas(baseCanvas, scale);
  const targetScaled = downscaleCanvas(targetCanvas, scale);
  const scaledBox: BoundingBox = {
    x: Math.round(box.x * scale),
    y: Math.round(box.y * scale),
    width: Math.round(box.width * scale),
    height: Math.round(box.height * scale),
  };
  const baseEdges = computeEdges(baseScaled);
  const targetEdges = computeEdges(targetScaled);
  const maxRadius = 20;
  let bestScore = Number.POSITIVE_INFINITY;
  let bestOffset = { x: 0, y: 0 };
  for (let r = 0; r <= maxRadius; r++) {
    for (let dx = -r; dx <= r; dx++) {
      for (let dy = -r; dy <= r; dy++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const score = edgeDifference(baseEdges, targetEdges, scaledBox, dx, dy);
        if (score < bestScore) {
          bestScore = score;
          bestOffset = { x: dx, y: dy };
        }
      }
    }
  }
  return { x: bestOffset.x / scale, y: bestOffset.y / scale };
}
