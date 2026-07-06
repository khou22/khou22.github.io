import { sfx } from '../audio';
import { VIEW_H, VIEW_W } from '../constants';
import type { Input } from '../input';
import { Stage } from '../stage';

export type MenuResult = { mode: '1p' | '2p' } | null;

const ITEMS = [
  { id: '1p', label: '1P  VS  CPU' },
  { id: '2p', label: '2P  VERSUS' },
  { id: 'controls', label: 'CONTROLS' },
] as const;

export class MenuScene {
  private index = 0;
  private time = 0;
  private showControls = false;
  private stage = new Stage();

  update(input: Input): MenuResult {
    this.time++;

    if (this.showControls) {
      if (
        input.startPressed() ||
        input.backPressed() ||
        input.anyPressed(['KeyF', 'Comma', 'Space'])
      ) {
        sfx.back();
        this.showControls = false;
      }
      return null;
    }

    if (input.anyPressed(['ArrowUp', 'KeyW'])) {
      this.index = (this.index + ITEMS.length - 1) % ITEMS.length;
      sfx.menuMove();
    }
    if (input.anyPressed(['ArrowDown', 'KeyS'])) {
      this.index = (this.index + 1) % ITEMS.length;
      sfx.menuMove();
    }
    if (input.startPressed() || input.anyPressed(['KeyF', 'Comma', 'Space'])) {
      const item = ITEMS[this.index];
      sfx.confirm();
      if (item.id === 'controls') {
        this.showControls = true;
        return null;
      }
      return { mode: item.id };
    }
    return null;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.stage.drawBackground(ctx, this.time, Math.sin(this.time * 0.004) * 260, 0);

    // Title
    ctx.save();
    ctx.textAlign = 'center';
    const cx = VIEW_W / 2;
    const wob = Math.sin(this.time * 0.03) * 4;

    ctx.font = 'italic 900 30px sans-serif';
    ctx.fillStyle = '#8f96d9';
    ctx.fillText('AN ORIGINAL TRIBUTE TO THE GOLDEN AGE OF PLATFORM FIGHTERS', cx, 138);

    ctx.font = 'italic 900 110px sans-serif';
    const grad = ctx.createLinearGradient(0, 160, 0, 280);
    grad.addColorStop(0, '#ffe27a');
    grad.addColorStop(0.5, '#ff9d3d');
    grad.addColorStop(1, '#e84c3d');
    ctx.fillStyle = grad;
    ctx.shadowColor = 'rgba(255, 160, 60, 0.55)';
    ctx.shadowBlur = 34;
    ctx.fillText('SUPER  MASH', cx, 245 + wob * 0.4);

    ctx.font = 'italic 900 64px sans-serif';
    ctx.fillStyle = '#7df9ff';
    ctx.shadowColor = 'rgba(90, 200, 255, 0.6)';
    ctx.shadowBlur = 26;
    ctx.fillText('M E L E E', cx, 318 + wob);
    ctx.shadowBlur = 0;

    if (this.showControls) {
      this.drawControls(ctx);
      ctx.restore();
      return;
    }

    // Menu items
    ctx.font = '700 34px sans-serif';
    ITEMS.forEach((item, i) => {
      const y = 430 + i * 62;
      const selected = i === this.index;
      if (selected) {
        const pulse = 0.6 + 0.4 * Math.sin(this.time * 0.12);
        ctx.fillStyle = `rgba(255, 230, 120, ${0.14 + pulse * 0.1})`;
        this.roundRect(ctx, cx - 220, y - 38, 440, 54, 12);
        ctx.fill();
        ctx.fillStyle = '#ffe27a';
        ctx.fillText('▶', cx - 250, y);
        ctx.fillText('◀', cx + 250, y);
      }
      ctx.fillStyle = selected ? '#ffffff' : '#9aa0cf';
      ctx.fillText(item.label, cx, y);
    });

    ctx.font = '500 17px sans-serif';
    ctx.fillStyle = '#6c72a8';
    ctx.fillText(
      'W/S or ↑/↓ to choose  ·  ENTER to confirm  ·  M to mute',
      cx,
      VIEW_H - 46,
    );
    ctx.fillText(
      'A fan-made original — not affiliated with or endorsed by Nintendo.',
      cx,
      VIEW_H - 22,
    );
    ctx.restore();
  }

  private drawControls(ctx: CanvasRenderingContext2D): void {
    const cx = VIEW_W / 2;
    ctx.fillStyle = 'rgba(8, 8, 22, 0.86)';
    this.roundRect(ctx, cx - 470, 360, 940, 290, 18);
    ctx.fill();
    ctx.strokeStyle = 'rgba(140, 150, 230, 0.5)';
    ctx.lineWidth = 2;
    this.roundRect(ctx, cx - 470, 360, 940, 290, 18);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = '800 26px sans-serif';
    ctx.fillStyle = '#ffe27a';
    ctx.fillText('CONTROLS', cx, 400);

    ctx.font = '600 20px sans-serif';
    const rows: Array<[string, string, string]> = [
      ['', 'PLAYER 1', 'PLAYER 2'],
      ['Move', 'A / D', '← / →'],
      ['Jump (x2)', 'W', '↑'],
      ['Crouch / Fast-fall', 'S', '↓'],
      ['Attack (+ direction)', 'F', ','],
      ['Special (+ direction)', 'G', '.'],
      ['Shield / Roll', 'H', '/'],
    ];
    rows.forEach(([label, p1, p2], i) => {
      const y = 438 + i * 27;
      ctx.fillStyle = '#9aa0cf';
      ctx.textAlign = 'right';
      ctx.fillText(label, cx - 120, y);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#e84c3d';
      ctx.fillText(p1, cx + 60, y);
      ctx.fillStyle = '#4c8fe8';
      ctx.fillText(p2, cx + 300, y);
    });
    ctx.textAlign = 'center';
    ctx.font = '500 16px sans-serif';
    ctx.fillStyle = '#6c72a8';
    ctx.fillText(
      'Gamepads supported: stick = move, A = attack, B = special, Y = jump, triggers = shield, Start = pause',
      cx,
      634,
    );
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
