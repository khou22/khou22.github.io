import { sfx } from './audio';
import type { CharDef } from './characters';
import { DT, VIEW_H, VIEW_W } from './constants';
import { Input } from './input';
import { BattleScene } from './scenes/battle';
import { MenuScene } from './scenes/menu';
import { SelectScene } from './scenes/select';
import { Stage } from './stage';

type SceneName = 'menu' | 'select' | 'battle';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// Render at device pixel ratio for crisp text on Retina displays.
function resize(): void {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const scale = Math.min(window.innerWidth / VIEW_W, window.innerHeight / VIEW_H);
  canvas.width = Math.round(VIEW_W * dpr);
  canvas.height = Math.round(VIEW_H * dpr);
  canvas.style.width = `${Math.round(VIEW_W * scale)}px`;
  canvas.style.height = `${Math.round(VIEW_H * scale)}px`;
}
window.addEventListener('resize', resize);
resize();

const input = new Input();
input.onAnyKey = () => sfx.ensure();
window.addEventListener('pointerdown', () => sfx.ensure());

const stage = new Stage();
let sceneName: SceneName = 'menu';
let menu = new MenuScene();
let select: SelectScene | null = null;
let battle: BattleScene | null = null;
let lastMatch: { p1: CharDef; p2: CharDef; p2IsCpu: boolean } | null = null;

function tick(): void {
  input.pollGamepads();

  if (input.wasPressed('KeyM')) sfx.toggleMute();

  switch (sceneName) {
    case 'menu': {
      const result = menu.update(input);
      if (result) {
        select = new SelectScene(result.mode);
        sceneName = 'select';
      }
      break;
    }
    case 'select': {
      const result = select!.update(input);
      if (result === 'back') {
        menu = new MenuScene();
        sceneName = 'menu';
      } else if (result) {
        lastMatch = result;
        battle = new BattleScene(stage, result.p1, result.p2, result.p2IsCpu);
        sceneName = 'battle';
      }
      break;
    }
    case 'battle': {
      const result = battle!.update(input);
      if (result === 'menu') {
        battle = null;
        menu = new MenuScene();
        sceneName = 'menu';
      } else if (result === 'rematch' && lastMatch) {
        battle = new BattleScene(
          stage,
          lastMatch.p1,
          lastMatch.p2,
          lastMatch.p2IsCpu,
        );
      }
      break;
    }
  }

  input.clearPressed();
}

function render(): void {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  switch (sceneName) {
    case 'menu':
      menu.draw(ctx);
      break;
    case 'select':
      select!.draw(ctx, stage);
      break;
    case 'battle':
      battle!.draw(ctx);
      break;
  }
}

// Fixed 60hz simulation, rendered at display refresh (120hz on ProMotion).
let last = performance.now();
let accumulator = 0;

function frame(now: number): void {
  accumulator += Math.min((now - last) / 1000, 0.25);
  last = now;
  let steps = 0;
  while (accumulator >= DT && steps < 5) {
    tick();
    accumulator -= DT;
    steps++;
  }
  if (steps === 5) accumulator = 0; // Don't spiral after a long tab-out.
  render();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
