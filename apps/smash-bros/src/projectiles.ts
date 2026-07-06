import type { ProjectileSpec } from './characters';
import type { Fighter } from './fighter';
import { BLAST } from './constants';
import { TAU } from './math';

export class Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  dead = false;

  constructor(
    public owner: Fighter,
    public spec: ProjectileSpec,
    x: number,
    y: number,
    facing: 1 | -1,
  ) {
    this.x = x;
    this.y = y;
    this.vx = spec.speed * facing;
    this.vy = spec.vy;
    this.life = spec.lifetime;
  }

  update(): void {
    this.life--;
    this.vy += this.spec.gravity;
    this.x += this.vx;
    this.y += this.vy;
    if (
      this.life <= 0 ||
      this.x < BLAST.left ||
      this.x > BLAST.right ||
      this.y > BLAST.bottom ||
      this.y < BLAST.top
    ) {
      this.dead = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D, time: number): void {
    const r = this.spec.radius;
    ctx.save();
    ctx.translate(this.x, this.y);
    const g = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r * 1.6);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.4, this.spec.color);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.6, 0, TAU);
    ctx.fill();
    ctx.fillStyle = this.spec.color;
    ctx.beginPath();
    ctx.arc(0, 0, r * (0.8 + 0.2 * Math.sin(time * 0.4)), 0, TAU);
    ctx.fill();
    ctx.restore();
  }
}
