import { VIEW_W, VIEW_H, STAGE } from './constants';
import { clamp, lerp, rand } from './math';

export interface CamTarget {
  x: number;
  y: number;
}

/** Melee-style dynamic camera: frames all live fighters, zooms with the action. */
export class Camera {
  x = 0;
  y = -140;
  zoom = 0.9;
  private shakeMag = 0;
  private shakeFrames = 0;

  shake(mag: number, frames: number): void {
    this.shakeMag = Math.max(this.shakeMag, mag);
    this.shakeFrames = Math.max(this.shakeFrames, frames);
  }

  update(targets: CamTarget[]): void {
    let minX = -320;
    let maxX = 320;
    let minY = -300;
    let maxY = 80;
    for (const t of targets) {
      minX = Math.min(minX, t.x);
      maxX = Math.max(maxX, t.x);
      minY = Math.min(minY, t.y - 90);
      maxY = Math.max(maxY, t.y);
    }
    const padX = 200;
    const padY = 150;
    const w = maxX - minX + padX * 2;
    const h = maxY - minY + padY * 2;
    const targetZoom = clamp(Math.min(VIEW_W / w, VIEW_H / h), 0.52, 1.05);
    const cx = clamp((minX + maxX) / 2, STAGE.left - 220, STAGE.right + 220);
    const cy = clamp((minY + maxY) / 2 - 40, -430, 140);

    this.x = lerp(this.x, cx, 0.075);
    this.y = lerp(this.y, cy, 0.075);
    this.zoom = lerp(this.zoom, targetZoom, 0.06);

    if (this.shakeFrames > 0) {
      this.shakeFrames--;
      if (this.shakeFrames === 0) this.shakeMag = 0;
    }
  }

  apply(ctx: CanvasRenderingContext2D): void {
    const sx = this.shakeFrames > 0 ? rand(-this.shakeMag, this.shakeMag) : 0;
    const sy = this.shakeFrames > 0 ? rand(-this.shakeMag, this.shakeMag) : 0;
    ctx.translate(VIEW_W / 2, VIEW_H / 2);
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.x + sx, -this.y + sy);
  }
}
