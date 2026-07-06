import { STAGE, VIEW_W, VIEW_H } from './constants';
import { rand, TAU } from './math';

interface Star {
  x: number;
  y: number;
  depth: number; // 0..1, deeper = slower parallax
  size: number;
  phase: number;
  speed: number;
}

/**
 * "FINAL VOID" — a Final Destination style stage: one flat floating platform
 * drifting through space, with a parallax starfield and nebula behind it.
 */
export class Stage {
  private stars: Star[] = [];
  private shooting = { x: 0, y: 0, vx: 0, vy: 0, life: 0, timer: 240 };

  constructor() {
    for (let i = 0; i < 170; i++) {
      this.stars.push({
        x: rand(0, VIEW_W),
        y: rand(0, VIEW_H),
        depth: rand(0.1, 1),
        size: rand(0.6, 2.4),
        phase: rand(0, TAU),
        speed: rand(0.01, 0.05),
      });
    }
  }

  /** Screen-space background. Parallax follows the camera slightly. */
  drawBackground(
    ctx: CanvasRenderingContext2D,
    time: number,
    camX: number,
    camY: number,
  ): void {
    // Deep space gradient
    const grad = ctx.createLinearGradient(0, 0, 0, VIEW_H);
    grad.addColorStop(0, '#05030f');
    grad.addColorStop(0.5, '#0d0a24');
    grad.addColorStop(1, '#1a0f33');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    // Nebula blobs
    const nebulae: Array<[number, number, number, string]> = [
      [VIEW_W * 0.22, VIEW_H * 0.3, 260, 'rgba(88, 47, 160, 0.16)'],
      [VIEW_W * 0.78, VIEW_H * 0.62, 300, 'rgba(40, 90, 180, 0.13)'],
      [VIEW_W * 0.55, VIEW_H * 0.18, 200, 'rgba(190, 60, 130, 0.10)'],
    ];
    for (const [nx, ny, r, color] of nebulae) {
      const px = nx - camX * 0.03;
      const py = ny - camY * 0.03;
      const g = ctx.createRadialGradient(px, py, 0, px, py, r);
      g.addColorStop(0, color);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(px - r, py - r, r * 2, r * 2);
    }

    // Stars with twinkle + parallax
    for (const s of this.stars) {
      const px =
        (((s.x - camX * 0.05 * s.depth) % VIEW_W) + VIEW_W) % VIEW_W;
      const py =
        (((s.y - camY * 0.05 * s.depth) % VIEW_H) + VIEW_H) % VIEW_H;
      const tw = 0.45 + 0.55 * Math.abs(Math.sin(time * s.speed + s.phase));
      ctx.globalAlpha = tw * (0.35 + 0.65 * s.depth);
      ctx.fillStyle = '#dfe6ff';
      ctx.beginPath();
      ctx.arc(px, py, s.size, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Occasional shooting star
    const sh = this.shooting;
    sh.timer--;
    if (sh.timer <= 0 && sh.life <= 0) {
      sh.x = rand(VIEW_W * 0.2, VIEW_W * 0.9);
      sh.y = rand(0, VIEW_H * 0.35);
      sh.vx = rand(-9, -5);
      sh.vy = rand(2, 4);
      sh.life = 40;
      sh.timer = rand(300, 900);
    }
    if (sh.life > 0) {
      sh.life--;
      sh.x += sh.vx;
      sh.y += sh.vy;
      ctx.globalAlpha = Math.min(1, sh.life / 20);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(sh.x, sh.y);
      ctx.lineTo(sh.x - sh.vx * 5, sh.y - sh.vy * 5);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  /** World-space platform. */
  drawPlatform(ctx: CanvasRenderingContext2D, time: number): void {
    const L = STAGE.left;
    const R = STAGE.right;
    const Y = STAGE.surfaceY;
    const T = STAGE.thickness;
    const keelY = Y + T + 70;

    // Under-glow
    const g = ctx.createRadialGradient(0, Y + T, 40, 0, Y + T, 480);
    g.addColorStop(0, 'rgba(110, 70, 220, 0.35)');
    g.addColorStop(1, 'rgba(110, 70, 220, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(-520, Y - 60, 1040, 560);

    // Hull
    ctx.beginPath();
    ctx.moveTo(L, Y);
    ctx.lineTo(R, Y);
    ctx.lineTo(R - 70, Y + T);
    ctx.lineTo(120, keelY);
    ctx.lineTo(-120, keelY);
    ctx.lineTo(L + 70, Y + T);
    ctx.closePath();
    const hull = ctx.createLinearGradient(0, Y, 0, keelY);
    hull.addColorStop(0, '#5b5f8f');
    hull.addColorStop(0.25, '#3c3f68');
    hull.addColorStop(1, '#191a30');
    ctx.fillStyle = hull;
    ctx.fill();

    // Deck surface
    const deck = ctx.createLinearGradient(0, Y, 0, Y + 16);
    deck.addColorStop(0, '#c9cdf2');
    deck.addColorStop(1, '#8e93c9');
    ctx.fillStyle = deck;
    ctx.fillRect(L, Y, R - L, 12);

    // Pulsing energy trim along the deck edge
    const pulse = 0.55 + 0.45 * Math.sin(time * 0.045);
    ctx.strokeStyle = `rgba(120, 220, 255, ${0.5 + 0.4 * pulse})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(L, Y + 13);
    ctx.lineTo(R, Y + 13);
    ctx.stroke();

    // Glowing core in the hull
    ctx.save();
    ctx.globalAlpha = 0.5 + 0.3 * pulse;
    const core = ctx.createRadialGradient(0, Y + T, 6, 0, Y + T, 60);
    core.addColorStop(0, '#b78bff');
    core.addColorStop(1, 'rgba(120, 70, 220, 0)');
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(0, Y + T, 60, 0, TAU);
    ctx.fill();
    ctx.restore();

    // Hull panel lines
    ctx.strokeStyle = 'rgba(210, 220, 255, 0.12)';
    ctx.lineWidth = 2;
    for (let i = 1; i <= 4; i++) {
      const yy = Y + (T + 60) * (i / 5);
      const inset = 70 * (i / 5) + Math.abs(yy - Y) * 0.35;
      ctx.beginPath();
      ctx.moveTo(L + inset, yy);
      ctx.lineTo(R - inset, yy);
      ctx.stroke();
    }
  }
}
