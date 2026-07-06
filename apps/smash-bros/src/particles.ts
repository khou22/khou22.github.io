import { rand, TAU } from './math';

type ParticleKind = 'spark' | 'dust' | 'ring' | 'ember' | 'trail';

interface Particle {
  kind: ParticleKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  rot: number;
}

export class Particles {
  list: Particle[] = [];

  private add(p: Particle): void {
    if (this.list.length < 600) this.list.push(p);
  }

  hitSparks(x: number, y: number, angleRad: number, power: number): void {
    const n = Math.min(18, 6 + Math.floor(power / 14));
    for (let i = 0; i < n; i++) {
      const a = angleRad + rand(-0.8, 0.8);
      const sp = rand(3, 7 + power / 22);
      this.add({
        kind: 'spark',
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: rand(8, 18),
        maxLife: 18,
        size: rand(2, 4.5),
        color: power > 110 ? '#ffef7a' : '#ffffff',
        rot: a,
      });
    }
    this.add({
      kind: 'ring',
      x,
      y,
      vx: 0,
      vy: 0,
      life: 12,
      maxLife: 12,
      size: 8 + power / 8,
      color: '#ffffff',
      rot: 0,
    });
  }

  dust(x: number, y: number, dir: number): void {
    for (let i = 0; i < 4; i++) {
      this.add({
        kind: 'dust',
        x: x + rand(-8, 8),
        y: y - rand(0, 6),
        vx: -dir * rand(0.5, 2.2),
        vy: -rand(0.2, 1.4),
        life: rand(10, 22),
        maxLife: 22,
        size: rand(3, 7),
        color: 'rgba(200,200,230,0.55)',
        rot: 0,
      });
    }
  }

  koBlast(x: number, y: number, angleRad: number, color: string): void {
    for (let i = 0; i < 42; i++) {
      const a = angleRad + rand(-0.55, 0.55);
      const sp = rand(4, 20);
      this.add({
        kind: 'spark',
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: rand(18, 42),
        maxLife: 42,
        size: rand(3, 8),
        color: i % 3 === 0 ? '#ffffff' : color,
        rot: a,
      });
    }
    for (let i = 0; i < 3; i++) {
      this.add({
        kind: 'ring',
        x,
        y,
        vx: 0,
        vy: 0,
        life: 22 + i * 6,
        maxLife: 22 + i * 6,
        size: 20 + i * 16,
        color,
        rot: 0,
      });
    }
  }

  ember(x: number, y: number, color: string): void {
    this.add({
      kind: 'ember',
      x: x + rand(-6, 6),
      y: y + rand(-6, 6),
      vx: rand(-0.6, 0.6),
      vy: rand(-1.2, -0.3),
      life: rand(12, 26),
      maxLife: 26,
      size: rand(2, 4),
      color,
      rot: rand(0, TAU),
    });
  }

  update(): void {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const p = this.list[i];
      p.life--;
      if (p.life <= 0) {
        this.list.splice(i, 1);
        continue;
      }
      p.x += p.vx;
      p.y += p.vy;
      if (p.kind === 'spark') {
        p.vx *= 0.92;
        p.vy = p.vy * 0.92 + 0.15;
      } else if (p.kind === 'dust') {
        p.vx *= 0.95;
        p.vy *= 0.95;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    for (const p of this.list) {
      const t = p.life / p.maxLife;
      ctx.globalAlpha = Math.min(1, t * 1.6);
      if (p.kind === 'ring') {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 3 * t;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1.8 - t), 0, TAU);
        ctx.stroke();
      } else if (p.kind === 'spark') {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size * t;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 1.6, p.y - p.vy * 1.6);
        ctx.stroke();
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * t, 0, TAU);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }
}
