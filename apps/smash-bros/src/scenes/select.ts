import { sfx } from '../audio';
import { ROSTER, type CharDef } from '../characters';
import { STOCKS_DEFAULT, VIEW_H, VIEW_W } from '../constants';
import { Fighter } from '../fighter';
import type { Input } from '../input';
import { Stage } from '../stage';

export interface SelectResult {
  p1: CharDef;
  p2: CharDef;
  p2IsCpu: boolean;
}

/**
 * Character select. In 1P mode, P1 picks their fighter and then the CPU's.
 * In 2P mode each player drives their own cursor.
 */
export class SelectScene {
  private time = 0;
  private cursors = [0, 1];
  private locked = [false, false];
  private previews: Fighter[] = [];

  constructor(private mode: '1p' | '2p') {
    this.rebuildPreviews();
  }

  private rebuildPreviews(): void {
    this.previews = ROSTER.map(
      (def, i) => new Fighter(def, i, false, 1, 0, 1),
    );
  }

  /** Which cursor does keyboard-set `player` currently drive? */
  private cursorOwner(player: number): number | null {
    if (this.mode === '2p') return this.locked[player] ? null : player;
    // 1P mode: P1 controls picks own char first, then the CPU's.
    if (player !== 0) return null;
    if (!this.locked[0]) return 0;
    if (!this.locked[1]) return 1;
    return null;
  }

  update(input: Input): SelectResult | 'back' | null {
    this.time++;

    if (input.backPressed()) {
      sfx.back();
      return 'back';
    }

    for (let player = 0; player < 2; player++) {
      const slot = this.cursorOwner(player);
      const f = input.sample(player);
      if (slot === null) {
        // Allow un-confirming with shield.
        if (f.shieldP) {
          const mine = this.mode === '2p' ? player : this.locked[1] ? 1 : 0;
          if (this.locked[mine]) {
            this.locked[mine] = false;
            sfx.back();
          }
        }
        continue;
      }
      if (f.leftP) {
        this.cursors[slot] =
          (this.cursors[slot] + ROSTER.length - 1) % ROSTER.length;
        sfx.menuMove();
      }
      if (f.rightP) {
        this.cursors[slot] = (this.cursors[slot] + 1) % ROSTER.length;
        sfx.menuMove();
      }
      if (f.attackP) {
        this.locked[slot] = true;
        sfx.confirm();
      }
    }

    if (this.locked[0] && this.locked[1] && input.startPressed()) {
      sfx.go();
      return {
        p1: ROSTER[this.cursors[0]],
        p2: ROSTER[this.cursors[1]],
        p2IsCpu: this.mode === '1p',
      };
    }
    return null;
  }

  draw(ctx: CanvasRenderingContext2D, stage: Stage): void {
    stage.drawBackground(ctx, this.time, 0, 0);
    const cx = VIEW_W / 2;

    ctx.textAlign = 'center';
    ctx.font = 'italic 900 44px sans-serif';
    ctx.fillStyle = '#ffe27a';
    ctx.fillText('CHOOSE  YOUR  FIGHTER', cx, 70);

    const p2Label = this.mode === '1p' ? 'CPU' : 'P2';
    ctx.font = '600 20px sans-serif';
    ctx.fillStyle = '#9aa0cf';
    const step = !this.locked[0]
      ? this.mode === '1p'
        ? 'P1 — pick your fighter'
        : 'P1: A/D + F   ·   P2: ←/→ + ,'
      : !this.locked[1]
        ? this.mode === '1p'
          ? `Now pick the ${p2Label}'s fighter`
          : 'Waiting for P2…'
        : 'Press ENTER to fight!';
    ctx.fillText(step, cx, 104);

    // Character cards
    const cardW = 250;
    const cardH = 330;
    const gap = 30;
    const totalW = ROSTER.length * cardW + (ROSTER.length - 1) * gap;
    const startX = cx - totalW / 2;

    ROSTER.forEach((def, i) => {
      const x = startX + i * (cardW + gap);
      const y = 140;
      const p1Here = this.cursors[0] === i;
      const p2Here = this.cursors[1] === i;

      // Card background
      ctx.fillStyle = 'rgba(20, 20, 46, 0.85)';
      this.roundRect(ctx, x, y, cardW, cardH, 14);
      ctx.fill();

      // Cursor borders
      if (p1Here || p2Here) {
        ctx.lineWidth = 4;
        if (p1Here && p2Here) {
          ctx.strokeStyle = '#e84c3d';
          this.roundRect(ctx, x - 3, y - 3, cardW + 6, cardH + 6, 16);
          ctx.stroke();
          ctx.strokeStyle = '#4c8fe8';
          this.roundRect(ctx, x + 3, y + 3, cardW - 6, cardH - 6, 12);
          ctx.stroke();
        } else {
          ctx.strokeStyle = p1Here ? '#e84c3d' : '#4c8fe8';
          this.roundRect(ctx, x - 2, y - 2, cardW + 4, cardH + 4, 15);
          ctx.stroke();
        }
      }

      // Fighter preview (idle pose)
      const preview = this.previews[i];
      ctx.save();
      ctx.translate(x + cardW / 2, y + 195);
      ctx.scale(1.25, 1.25);
      preview.draw(ctx, this.time);
      ctx.restore();

      // Name + tagline
      ctx.textAlign = 'center';
      ctx.font = '900 30px sans-serif';
      ctx.fillStyle = def.color;
      ctx.fillText(def.name, x + cardW / 2, y + 246);
      ctx.font = '500 14px sans-serif';
      ctx.fillStyle = '#9aa0cf';
      ctx.fillText(def.tagline, x + cardW / 2, y + 268);

      // Stat bars
      const stats: Array<[string, number]> = [
        ['SPD', def.runSpeed / 7.5],
        ['PWR', def.moves.ftilt.damage / 16],
        ['WGT', def.weight / 130],
      ];
      stats.forEach(([label, v], si) => {
        const sy = y + 284 + si * 15;
        ctx.textAlign = 'left';
        ctx.font = '700 10px sans-serif';
        ctx.fillStyle = '#6c72a8';
        ctx.fillText(label, x + 18, sy + 8);
        ctx.fillStyle = 'rgba(120,130,200,0.25)';
        ctx.fillRect(x + 52, sy, cardW - 70, 8);
        ctx.fillStyle = def.color;
        ctx.fillRect(x + 52, sy, (cardW - 70) * Math.min(1, v), 8);
      });

      // Locked tags
      const tagY = y + 26;
      if (this.locked[0] && this.cursors[0] === i) {
        this.tag(ctx, x + 14, tagY, 'P1', '#e84c3d');
      }
      if (this.locked[1] && this.cursors[1] === i) {
        this.tag(ctx, x + cardW - 58, tagY, p2Label, '#4c8fe8');
      }
    });

    // Bottom bar: stage + rules
    ctx.textAlign = 'center';
    ctx.font = '700 22px sans-serif';
    ctx.fillStyle = '#7df9ff';
    ctx.fillText('STAGE:  FINAL  DESTINATION', cx, VIEW_H - 108);
    ctx.font = '600 17px sans-serif';
    ctx.fillStyle = '#9aa0cf';
    ctx.fillText(`STOCK BATTLE — ${STOCKS_DEFAULT} LIVES`, cx, VIEW_H - 80);

    if (this.locked[0] && this.locked[1]) {
      const pulse = 0.6 + 0.4 * Math.sin(this.time * 0.15);
      ctx.font = '900 34px sans-serif';
      ctx.fillStyle = `rgba(255, 226, 122, ${pulse})`;
      ctx.fillText('PRESS  ENTER  TO  FIGHT!', cx, VIEW_H - 34);
    } else {
      ctx.font = '500 15px sans-serif';
      ctx.fillStyle = '#6c72a8';
      ctx.fillText(
        'Attack to confirm  ·  Shield to un-confirm  ·  ESC for menu',
        cx,
        VIEW_H - 34,
      );
    }
  }

  private tag(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    label: string,
    color: string,
  ): void {
    ctx.fillStyle = color;
    this.roundRect(ctx, x, y - 16, 44, 24, 6);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + 22, y + 1);
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ): void {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
}
