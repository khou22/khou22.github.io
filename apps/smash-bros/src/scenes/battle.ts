import { CpuController } from '../ai';
import { sfx } from '../audio';
import { Camera } from '../camera';
import type { CharDef } from '../characters';
import {
  SPAWN_POINTS,
  STOCKS_DEFAULT,
  VIEW_H,
  VIEW_W,
} from '../constants';
import { Fighter } from '../fighter';
import { emptyFrame, type Input } from '../input';
import { clamp, dist, lerp } from '../math';
import { Particles } from '../particles';
import { Projectile } from '../projectiles';
import { Stage } from '../stage';

type Phase = 'countdown' | 'fight' | 'gameSet' | 'results';

export type BattleResult = 'menu' | 'rematch' | null;

export class BattleScene {
  private fighters: Fighter[];
  private cpu: CpuController | null;
  private projectiles: Projectile[] = [];
  private particles = new Particles();
  private camera = new Camera();
  private time = 0;
  private phase: Phase = 'countdown';
  private phaseTimer = 3 * 48; // ~2.4s of 3..2..1
  private lastCount = 4;
  private paused = false;
  private winner: Fighter | null = null;
  private hudPercentScale = [1, 1];

  constructor(
    private stage: Stage,
    p1: CharDef,
    p2: CharDef,
    private p2IsCpu: boolean,
  ) {
    this.fighters = [
      new Fighter(p1, 0, false, STOCKS_DEFAULT, SPAWN_POINTS[0].x, SPAWN_POINTS[0].facing),
      new Fighter(p2, 1, p2IsCpu, STOCKS_DEFAULT, SPAWN_POINTS[1].x, SPAWN_POINTS[1].facing),
    ];
    this.cpu = p2IsCpu ? new CpuController(5) : null;
  }

  update(input: Input): BattleResult {
    this.time++;

    if (input.backPressed()) {
      sfx.back();
      return 'menu';
    }

    if (this.phase === 'results') {
      if (input.startPressed()) {
        sfx.confirm();
        return 'menu';
      }
      if (input.anyPressed(['KeyR'])) {
        sfx.confirm();
        return 'rematch';
      }
      this.particles.update();
      return null;
    }

    if (input.startPressed() && this.phase === 'fight') {
      this.paused = !this.paused;
      sfx.confirm();
    }
    if (this.paused) return null;

    if (this.phase === 'countdown') {
      this.phaseTimer--;
      const count = Math.ceil(this.phaseTimer / 48);
      if (count !== this.lastCount && count > 0) {
        this.lastCount = count;
        sfx.countdown();
      }
      if (this.phaseTimer <= 0) {
        this.phase = 'fight';
        sfx.go();
      }
      this.camera.update(this.fighters.filter((f) => f.alive));
      return null;
    }

    if (this.phase === 'gameSet') {
      this.phaseTimer--;
      this.particles.update();
      this.camera.update(this.fighters.filter((f) => f.alive));
      if (this.phaseTimer <= 0) this.phase = 'results';
      return null;
    }

    // ---- fight ----
    const events = {
      onJump: (fi: Fighter) => {
        sfx.jump();
        if (fi.onGround) this.particles.dust(fi.x, fi.y, fi.facing);
      },
      onLand: (fi: Fighter) => {
        this.particles.dust(fi.x, fi.y, fi.facing);
      },
      onFootstep: (fi: Fighter) => {
        this.particles.dust(fi.x, fi.y, fi.facing);
      },
      onProjectile: (fi: Fighter, move: (typeof fi.def.moves)['nspec']) => {
        const spec = move.projectile!;
        this.projectiles.push(
          new Projectile(
            fi,
            spec,
            fi.x + fi.facing * 30,
            fi.y + move.hy,
            fi.facing,
          ),
        );
        sfx.whiff();
      },
    };

    for (const f of this.fighters) {
      const frame = !f.alive
        ? emptyFrame()
        : f.isCpu && this.cpu
          ? this.cpu.frame(f, this.fighters[1 - f.playerIndex])
          : input.sample(f.playerIndex);
      f.update(frame, events);
      f.regenShield();
    }

    this.resolveHits();
    this.updateProjectiles();
    this.checkKOs();
    this.particles.update();
    this.camera.update(
      this.fighters.filter((f) => f.alive && f.state !== 'respawn'),
    );

    // Wisp trail embers
    for (const f of this.fighters) {
      if (f.def.style === 'wisp' && f.alive && Math.random() < 0.15) {
        this.particles.ember(f.x, f.y - f.def.height * 0.5, f.def.color2);
      }
    }

    return null;
  }

  private resolveHits(): void {
    for (const attacker of this.fighters) {
      const hb = attacker.activeHitbox();
      if (!hb || !attacker.alive) continue;
      for (const victim of this.fighters) {
        if (victim === attacker || !victim.alive) continue;
        if (victim.state === 'respawn' || victim.invincible > 0) continue;
        if (attacker.hitVictims.has(victim)) continue;
        const vx = victim.x;
        const vy = victim.y - victim.def.height * 0.45;
        if (dist(hb.x, hb.y, vx, vy) > hb.r + victim.def.size) continue;

        attacker.hitVictims.add(victim);
        const m = hb.move;
        const result = victim.takeHit(
          m.damage,
          m.angle,
          m.bkb,
          m.kbg,
          attacker.facing,
        );
        if (result.shielded) {
          sfx.shieldHit();
          attacker.hitlag = 6;
          if (victim.state === 'stunned') sfx.shieldBreak();
        } else {
          attacker.damageDealt += m.damage;
          attacker.hitlag = Math.floor(m.damage / 3) + 3;
          sfx.hit(result.kb);
          this.particles.hitSparks(vx, vy, result.angleRad, result.kb);
          this.camera.shake(clamp(result.kb / 22, 2, 14), 8);
        }
      }
    }
  }

  private updateProjectiles(): void {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.update();
      if (p.dead) {
        this.projectiles.splice(i, 1);
        continue;
      }
      for (const victim of this.fighters) {
        if (victim === p.owner || !victim.alive) continue;
        if (victim.state === 'respawn' || victim.invincible > 0) continue;
        const vx = victim.x;
        const vy = victim.y - victim.def.height * 0.45;
        if (dist(p.x, p.y, vx, vy) > p.spec.radius + victim.def.size) continue;
        const result = victim.takeHit(
          p.spec.damage,
          p.spec.angle,
          p.spec.bkb,
          p.spec.kbg,
          (p.vx >= 0 ? 1 : -1) as 1 | -1,
        );
        if (result.shielded) {
          sfx.shieldHit();
        } else {
          p.owner.damageDealt += p.spec.damage;
          sfx.hit(result.kb);
          this.particles.hitSparks(vx, vy, result.angleRad, result.kb);
        }
        this.projectiles.splice(i, 1);
        break;
      }
    }
  }

  private checkKOs(): void {
    for (const f of this.fighters) {
      const ko = f.checkBlastZones();
      if (!ko) continue;
      sfx.ko();
      const other = this.fighters[1 - f.playerIndex];
      other.koCount++;
      const bx = clamp(ko.x, -1150, 1150);
      const by = clamp(ko.y, -820, 600);
      this.particles.koBlast(bx, by, ko.angleRad + Math.PI, f.def.color);
      this.camera.shake(16, 16);

      if (!f.alive) {
        this.winner = other;
        this.phase = 'gameSet';
        this.phaseTimer = 110;
        sfx.gameEnd();
      }
    }
  }

  // ------------------------------------------------------------------

  draw(ctx: CanvasRenderingContext2D): void {
    this.stage.drawBackground(ctx, this.time, this.camera.x, this.camera.y);

    ctx.save();
    this.camera.apply(ctx);
    this.stage.drawPlatform(ctx, this.time);
    for (const f of this.fighters) {
      if (f.state === 'respawn') this.drawRespawnPad(ctx, f);
      f.draw(ctx, this.time);
    }
    for (const p of this.projectiles) p.draw(ctx, this.time);
    this.particles.draw(ctx);
    ctx.restore();

    this.drawHud(ctx);

    if (this.phase === 'countdown') {
      const count = Math.ceil(this.phaseTimer / 48);
      const t = (this.phaseTimer % 48) / 48;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = `italic 900 ${140 + (1 - t) * 40}px sans-serif`;
      ctx.fillStyle = `rgba(255, 226, 122, ${0.35 + t * 0.65})`;
      ctx.shadowColor = 'rgba(255,160,60,0.6)';
      ctx.shadowBlur = 30;
      ctx.fillText(String(Math.max(1, count)), VIEW_W / 2, VIEW_H / 2 + 40);
      ctx.restore();
    } else if (this.phase === 'fight' && this.time < 3 * 48 + 50) {
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = 'italic 900 120px sans-serif';
      ctx.fillStyle = '#7df9ff';
      ctx.shadowColor = 'rgba(90,200,255,0.7)';
      ctx.shadowBlur = 36;
      ctx.fillText('GO!', VIEW_W / 2, VIEW_H / 2 + 30);
      ctx.restore();
    }

    if (this.phase === 'gameSet') {
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);
      ctx.textAlign = 'center';
      ctx.font = 'italic 900 110px sans-serif';
      ctx.fillStyle = '#ffe27a';
      ctx.shadowColor = 'rgba(255,160,60,0.6)';
      ctx.shadowBlur = 30;
      ctx.fillText('GAME!', VIEW_W / 2, VIEW_H / 2 + 30);
      ctx.restore();
    }

    if (this.phase === 'results') this.drawResults(ctx);

    if (this.paused) {
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);
      ctx.textAlign = 'center';
      ctx.font = '900 70px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('PAUSED', VIEW_W / 2, VIEW_H / 2);
      ctx.font = '600 22px sans-serif';
      ctx.fillStyle = '#9aa0cf';
      ctx.fillText(
        'ENTER to resume  ·  ESC to quit to menu',
        VIEW_W / 2,
        VIEW_H / 2 + 46,
      );
      ctx.restore();
    }
  }

  private drawRespawnPad(ctx: CanvasRenderingContext2D, f: Fighter): void {
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = 'rgba(140, 190, 255, 0.4)';
    ctx.beginPath();
    ctx.ellipse(f.x, f.y + 8, 56, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(160, 210, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  private drawHud(ctx: CanvasRenderingContext2D): void {
    const positions = [VIEW_W * 0.3, VIEW_W * 0.7];
    this.fighters.forEach((f, i) => {
      const x = positions[i];
      const y = VIEW_H - 84;

      // Percent pop animation
      const targetScale = 1;
      this.hudPercentScale[i] = lerp(this.hudPercentScale[i], targetScale, 0.12);
      if (f.hitlag > 0) this.hudPercentScale[i] = 1.35;

      ctx.save();
      // Card
      ctx.fillStyle = 'rgba(10, 10, 26, 0.72)';
      ctx.beginPath();
      ctx.roundRect(x - 130, y - 34, 260, 96, 14);
      ctx.fill();
      ctx.strokeStyle = f.def.color + '88';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Tag
      ctx.fillStyle = i === 0 ? '#e84c3d' : f.isCpu ? '#8a8fa8' : '#4c8fe8';
      ctx.beginPath();
      ctx.roundRect(x - 130, y - 34, 64, 26, 8);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(i === 0 ? 'P1' : f.isCpu ? 'CPU' : 'P2', x - 98, y - 15);

      // Name
      ctx.textAlign = 'left';
      ctx.font = '800 17px sans-serif';
      ctx.fillStyle = f.def.color;
      ctx.fillText(f.def.name, x - 56, y - 14);

      // Stocks
      for (let s = 0; s < STOCKS_DEFAULT; s++) {
        ctx.beginPath();
        ctx.arc(x - 112 + s * 26, y + 44, 9, 0, Math.PI * 2);
        if (s < f.stocks) {
          ctx.fillStyle = f.def.color;
          ctx.fill();
          ctx.strokeStyle = '#ffffff66';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          ctx.strokeStyle = 'rgba(255,255,255,0.18)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // Percent — hotter as it climbs
      const p = f.percent;
      const heat = Math.min(1, p / 150);
      const r = 255;
      const g = Math.round(255 - heat * 190);
      const b = Math.round(255 - heat * 230);
      ctx.textAlign = 'right';
      ctx.font = `900 ${Math.round(44 * this.hudPercentScale[i])}px sans-serif`;
      ctx.fillStyle = f.alive ? `rgb(${r},${g},${b})` : '#555a75';
      ctx.shadowColor = 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = 6;
      ctx.fillText(`${Math.round(p)}%`, x + 118, y + 28);
      ctx.restore();
    });
  }

  private drawResults(ctx: CanvasRenderingContext2D): void {
    const w = this.winner;
    ctx.save();
    ctx.fillStyle = 'rgba(4, 4, 14, 0.82)';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    ctx.textAlign = 'center';

    if (w) {
      ctx.font = 'italic 900 34px sans-serif';
      ctx.fillStyle = '#9aa0cf';
      ctx.fillText('THE  WINNER  IS…', VIEW_W / 2, 200);

      ctx.font = 'italic 900 96px sans-serif';
      ctx.fillStyle = w.def.color;
      ctx.shadowColor = w.def.color;
      ctx.shadowBlur = 40;
      ctx.fillText(w.def.name + '!', VIEW_W / 2, 300);
      ctx.shadowBlur = 0;

      // Winner pose — neutralize world position/state so it draws centered.
      w.x = 0;
      w.y = 0;
      w.vx = 0;
      w.vy = 0;
      w.state = 'idle';
      w.onGround = true;
      w.invincible = 0;
      w.hitlag = 0;
      ctx.save();
      ctx.translate(VIEW_W / 2, 470);
      ctx.scale(1.6, 1.6);
      w.draw(ctx, this.time);
      ctx.restore();

      const loser = this.fighters[1 - w.playerIndex];
      ctx.font = '600 20px sans-serif';
      ctx.fillStyle = '#9aa0cf';
      ctx.fillText(
        `KOs ${w.koCount} — ${loser.koCount}   ·   Damage dealt ${Math.round(
          w.damageDealt,
        )} — ${Math.round(loser.damageDealt)}`,
        VIEW_W / 2,
        560,
      );
    }

    const pulse = 0.6 + 0.4 * Math.sin(this.time * 0.12);
    ctx.font = '800 26px sans-serif';
    ctx.fillStyle = `rgba(255, 226, 122, ${pulse})`;
    ctx.fillText('ENTER — menu      R — rematch', VIEW_W / 2, 640);
    ctx.restore();
  }
}
