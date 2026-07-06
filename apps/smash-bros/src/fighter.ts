import type { CharDef, Move, MoveKey } from './characters';
import {
  BLAST,
  HITSTUN_PER_KB,
  KB_WEIGHT_PIVOT,
  LAUNCH_SPEED_PER_KB,
  RESPAWN_HOVER_FRAMES,
  RESPAWN_INVINCIBLE_FRAMES,
  RESPAWN_X,
  RESPAWN_Y,
  SHIELD_BREAK_STUN,
  SHIELD_DECAY,
  SHIELD_MAX,
  SHIELD_REGEN,
  STAGE,
} from './constants';
import type { InputFrame } from './input';
import { approach, clamp, deg, TAU } from './math';

export type FighterState =
  | 'idle'
  | 'run'
  | 'air'
  | 'attack'
  | 'hitstun'
  | 'shield'
  | 'roll'
  | 'stunned' // shield break
  | 'respawn'
  | 'dead';

export interface HitEvent {
  attacker: Fighter;
  victim: Fighter;
  x: number;
  y: number;
  kb: number;
  angleRad: number;
  shielded: boolean;
}

export interface KoEvent {
  fighter: Fighter;
  x: number;
  y: number;
  angleRad: number;
}

/** Classic-style knockback formula, simplified. */
export function computeKnockback(
  percentAfter: number,
  damage: number,
  weight: number,
  bkb: number,
  kbg: number,
): number {
  const p = percentAfter;
  const scaled =
    ((p / 10 + (p * damage) / 20) * (200 / (weight + KB_WEIGHT_PIVOT)) * 1.4 +
      18) *
      (kbg / 100) +
    bkb;
  return scaled;
}

export class Fighter {
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  facing: 1 | -1 = 1;
  percent = 0;
  stocks: number;
  state: FighterState = 'air';
  stateTimer = 0;
  onGround = false;
  jumpsUsed = 0;
  helpless = false;
  fastFalling = false;
  hitstun = 0;
  hitlag = 0;
  invincible = 0;
  shieldHP = SHIELD_MAX;
  currentMove: Move | null = null;
  currentMoveKey: MoveKey | null = null;
  moveFrame = 0;
  hitVictims = new Set<Fighter>();
  projectileCooldown = 0;
  spinAngle = 0;
  runPhase = 0;
  landSquash = 0;
  respawnTimer = 0;
  // Match stats
  koCount = 0;
  damageDealt = 0;
  falls = 0;

  constructor(
    public def: CharDef,
    public playerIndex: number,
    public isCpu: boolean,
    stocks: number,
    spawnX: number,
    facing: 1 | -1,
  ) {
    this.stocks = stocks;
    this.x = spawnX;
    this.y = STAGE.surfaceY;
    this.facing = facing;
    this.onGround = true;
    this.state = 'idle';
  }

  get alive(): boolean {
    return this.state !== 'dead';
  }

  get actionable(): boolean {
    return this.state === 'idle' || this.state === 'run' || this.state === 'air';
  }

  private startMove(key: MoveKey): void {
    const move = this.def.moves[key];
    if (move.projectile && this.projectileCooldown > 0) return;
    this.currentMove = move;
    this.currentMoveKey = key;
    this.moveFrame = 0;
    this.state = 'attack';
    this.hitVictims.clear();
  }

  /** Pick a ground attack from held direction. */
  private groundAttack(f: InputFrame): void {
    if (f.up) this.startMove('utilt');
    else if (f.down) this.startMove('dtilt');
    else if (f.left || f.right) {
      this.facing = f.left ? -1 : 1;
      this.startMove('ftilt');
    } else this.startMove('jab');
  }

  private airAttack(f: InputFrame): void {
    if (f.up) this.startMove('uair');
    else if (f.down) this.startMove('dair');
    else if (f.left || f.right) {
      // Back-air acts like fair for simplicity; turn toward input.
      this.facing = f.left ? -1 : 1;
      this.startMove('fair');
    } else this.startMove('nair');
  }

  private specialAttack(f: InputFrame): void {
    if (f.up) {
      this.startMove('uspec');
    } else if (f.down) this.startMove('dspec');
    else if (f.left || f.right) {
      this.facing = f.left ? -1 : 1;
      this.startMove('sspec');
    } else this.startMove('nspec');
  }

  private doJump(): void {
    this.vy = this.jumpsUsed === 0 ? this.def.jumpVel : this.def.djVel;
    this.jumpsUsed++;
    this.onGround = false;
    this.fastFalling = false;
    this.state = 'air';
  }

  /**
   * Advance one 60hz tick.
   * Returns the world-space active hitbox for this frame, if any.
   */
  update(
    f: InputFrame,
    events: {
      onJump: (fi: Fighter) => void;
      onLand: (fi: Fighter) => void;
      onProjectile: (fi: Fighter, move: Move) => void;
      onFootstep: (fi: Fighter) => void;
    },
  ): void {
    if (!this.alive) return;
    if (this.projectileCooldown > 0) this.projectileCooldown--;
    if (this.invincible > 0) this.invincible--;
    if (this.landSquash > 0) this.landSquash -= 0.08;

    // Hitlag freeze: nothing moves, timers hold.
    if (this.hitlag > 0) {
      this.hitlag--;
      return;
    }

    switch (this.state) {
      case 'respawn': {
        this.respawnTimer--;
        this.x = RESPAWN_X;
        this.y = RESPAWN_Y + Math.sin(this.respawnTimer * 0.08) * 6;
        this.vx = 0;
        this.vy = 0;
        const wantsOut =
          f.leftP || f.rightP || f.jumpP || f.attackP || f.specialP || f.downP;
        if (this.respawnTimer <= 0 || wantsOut) {
          this.state = 'air';
          this.jumpsUsed = 0;
          this.helpless = false;
        }
        return;
      }
      case 'hitstun': {
        this.hitstun--;
        this.spinAngle += 0.32;
        if (this.hitstun <= 0) {
          this.state = this.onGround ? 'idle' : 'air';
          this.spinAngle = 0;
        }
        break;
      }
      case 'stunned': {
        this.stateTimer--;
        if (this.stateTimer <= 0) this.state = 'idle';
        break;
      }
      case 'roll': {
        this.stateTimer--;
        if (this.stateTimer <= 0) {
          this.vx = 0;
          this.state = 'idle';
        }
        break;
      }
      case 'shield': {
        this.shieldHP -= SHIELD_DECAY;
        if (this.shieldHP <= 0) {
          this.shieldHP = SHIELD_MAX * 0.55;
          this.state = 'stunned';
          this.stateTimer = SHIELD_BREAK_STUN;
          break;
        }
        if (!f.shield) {
          this.state = 'idle';
          break;
        }
        if (f.jumpP) {
          this.doJump();
          events.onJump(this);
          break;
        }
        // Roll dodge
        if (f.leftP || f.rightP) {
          const dir: 1 | -1 = f.leftP ? -1 : 1;
          this.state = 'roll';
          this.stateTimer = 22;
          this.invincible = Math.max(this.invincible, 14);
          this.vx = dir * this.def.runSpeed * 1.35;
          this.facing = (dir * -1) as 1 | -1;
        }
        break;
      }
      case 'attack': {
        const m = this.currentMove!;
        this.moveFrame++;
        if (this.moveFrame === m.startup + 1) {
          // First active frame: apply self-impulse / fire projectile.
          if (m.impulseX) this.vx = m.impulseX * this.facing;
          if (m.impulseY !== undefined) {
            this.vy = m.impulseY;
            this.onGround = false;
          }
          if (m.projectile) {
            events.onProjectile(this, m);
            this.projectileCooldown = m.projectile.cooldown;
          }
        }
        const total = m.startup + m.active + m.recovery;
        if (this.moveFrame >= total) {
          this.currentMove = null;
          this.currentMoveKey = null;
          if (m.helplessAfter && !this.onGround) this.helpless = true;
          this.state = this.onGround ? 'idle' : 'air';
        }
        // Aerial attacks keep drift.
        if (!this.onGround) {
          const target = (f.left ? -1 : f.right ? 1 : 0) * this.def.airSpeed;
          this.vx = approach(this.vx, target, this.def.airAccel);
        } else {
          this.vx = approach(this.vx, 0, this.def.traction * 0.6);
        }
        break;
      }
      case 'idle':
      case 'run': {
        // Ground control
        const dir = f.left ? -1 : f.right ? 1 : 0;
        if (dir !== 0) {
          this.facing = dir as 1 | -1;
          this.vx = approach(this.vx, dir * this.def.runSpeed, 0.8);
          this.state = 'run';
          this.runPhase += 0.28 * Math.abs(this.vx / this.def.runSpeed);
          if (Math.abs(this.vx) > this.def.runSpeed * 0.7 && Math.random() < 0.08) {
            events.onFootstep(this);
          }
        } else {
          this.vx = approach(this.vx, 0, this.def.traction);
          if (Math.abs(this.vx) < 0.1) this.state = 'idle';
        }
        if (f.jumpP) {
          this.doJump();
          events.onJump(this);
          break;
        }
        if (f.shieldP || (f.shield && this.actionable)) {
          this.vx = 0;
          this.state = 'shield';
          break;
        }
        if (f.attackP) {
          this.groundAttack(f);
          break;
        }
        if (f.specialP) {
          this.specialAttack(f);
          break;
        }
        break;
      }
      case 'air': {
        const target = (f.left ? -1 : f.right ? 1 : 0) * this.def.airSpeed;
        this.vx = approach(this.vx, target, this.def.airAccel);
        if (!this.helpless) {
          if (f.jumpP && this.jumpsUsed < 2) {
            this.doJump();
            events.onJump(this);
            break;
          }
          if (f.attackP) {
            this.airAttack(f);
            break;
          }
          if (f.specialP) {
            this.specialAttack(f);
            break;
          }
        }
        if (f.downP && this.vy > 0) this.fastFalling = true;
        break;
      }
      case 'dead':
        return;
    }

    this.physics(events);
  }

  private physics(events: { onLand: (fi: Fighter) => void }): void {
    if (this.state === 'respawn') return;

    // Gravity
    if (!this.onGround) {
      const cap = this.fastFalling ? this.def.fastFall : this.def.fallSpeed;
      // Hitstun uses slightly lower gravity so launches feel arcing.
      const g = this.state === 'hitstun' ? this.def.gravity * 0.82 : this.def.gravity;
      this.vy = Math.min(this.vy + g, cap);
      // Launches bleed horizontal speed so knockback traces an arc, not a beam.
      if (this.state === 'hitstun') this.vx = approach(this.vx, 0, 0.09);
    }

    const prevY = this.y;
    this.x += this.vx;
    this.y += this.vy;

    // Land on the platform (one-way from above).
    const onStageX = this.x >= STAGE.left - 2 && this.x <= STAGE.right + 2;
    if (
      this.vy >= 0 &&
      prevY <= STAGE.surfaceY + 1 &&
      this.y >= STAGE.surfaceY &&
      onStageX
    ) {
      this.y = STAGE.surfaceY;
      this.vy = 0;
      if (!this.onGround) {
        this.onGround = true;
        this.jumpsUsed = 0;
        this.helpless = false;
        this.fastFalling = false;
        this.landSquash = 0.5;
        events.onLand(this);
        if (this.state === 'air') this.state = 'idle';
        if (this.state === 'attack') {
          // Landing cancels aerials with a touch of lag.
          this.currentMove = null;
          this.currentMoveKey = null;
          this.state = 'idle';
          this.vx *= 0.4;
        }
        if (this.state === 'hitstun' && this.hitstun < 12) {
          this.state = 'idle';
          this.hitstun = 0;
          this.spinAngle = 0;
        }
      }
    } else if (this.onGround) {
      // Walked off the edge.
      if (!onStageX || this.y < STAGE.surfaceY - 1) {
        this.onGround = false;
        if (this.state === 'idle' || this.state === 'run') this.state = 'air';
        this.jumpsUsed = Math.max(this.jumpsUsed, 1);
      } else {
        this.y = STAGE.surfaceY;
      }
    }
  }

  /** World-space active hitbox, if we're in the active window of a move. */
  activeHitbox(): { x: number; y: number; r: number; move: Move } | null {
    if (this.state !== 'attack' || !this.currentMove || this.hitlag > 0)
      return null;
    const m = this.currentMove;
    if (m.hr <= 0) return null;
    if (this.moveFrame <= m.startup || this.moveFrame > m.startup + m.active)
      return null;
    return {
      x: this.x + m.hx * this.facing,
      y: this.y + m.hy,
      r: m.hr,
      move: m,
    };
  }

  /** Apply a hit to this fighter. Returns the resulting KB + whether shielded. */
  takeHit(
    damage: number,
    angleDeg: number,
    bkb: number,
    kbg: number,
    attackerFacing: 1 | -1,
  ): { kb: number; angleRad: number; shielded: boolean } {
    if (this.state === 'shield') {
      this.shieldHP -= damage * 1.15;
      this.vx += attackerFacing * 3;
      if (this.shieldHP <= 0) {
        this.shieldHP = SHIELD_MAX * 0.55;
        this.state = 'stunned';
        this.stateTimer = SHIELD_BREAK_STUN;
      }
      return { kb: 0, angleRad: 0, shielded: true };
    }

    this.percent = Math.min(999, this.percent + damage);
    const kb = computeKnockback(this.percent, damage, this.def.weight, bkb, kbg);
    const a = deg(angleDeg);
    const speed = kb * LAUNCH_SPEED_PER_KB;
    this.vx = Math.cos(a) * speed * attackerFacing;
    this.vy = -Math.sin(a) * speed;
    this.hitstun = Math.floor(kb * HITSTUN_PER_KB);
    this.hitlag = Math.floor(damage / 3) + 3;
    this.state = 'hitstun';
    this.onGround = false;
    this.fastFalling = false;
    this.currentMove = null;
    this.currentMoveKey = null;
    this.helpless = false;
    const angleRad = Math.atan2(this.vy, this.vx);
    return { kb, angleRad, shielded: false };
  }

  /** Check blast zones. Returns a KO event if the fighter died this frame. */
  checkBlastZones(): KoEvent | null {
    if (!this.alive || this.state === 'respawn') return null;
    const out =
      this.x < BLAST.left ||
      this.x > BLAST.right ||
      this.y > BLAST.bottom ||
      (this.y < BLAST.top && this.state === 'hitstun');
    if (!out) return null;

    const angleRad = Math.atan2(this.vy, this.vx);
    this.stocks--;
    this.falls++;
    const ev: KoEvent = { fighter: this, x: this.x, y: this.y, angleRad };
    if (this.stocks <= 0) {
      this.state = 'dead';
    } else {
      this.percent = 0;
      this.vx = 0;
      this.vy = 0;
      this.hitstun = 0;
      this.hitlag = 0;
      this.helpless = false;
      this.currentMove = null;
      this.currentMoveKey = null;
      this.onGround = false;
      this.state = 'respawn';
      this.respawnTimer = RESPAWN_HOVER_FRAMES;
      this.invincible = RESPAWN_INVINCIBLE_FRAMES;
      this.shieldHP = SHIELD_MAX;
    }
    return ev;
  }

  regenShield(): void {
    if (this.state !== 'shield' && this.shieldHP < SHIELD_MAX) {
      this.shieldHP = Math.min(SHIELD_MAX, this.shieldHP + SHIELD_REGEN);
    }
  }

  // ------------------------------------------------------------------
  // Rendering — stylized vector puppet, posed from the current state.
  // ------------------------------------------------------------------
  draw(ctx: CanvasRenderingContext2D, time: number): void {
    if (!this.alive) return;
    const d = this.def;
    ctx.save();
    ctx.translate(this.x, this.y);

    // Invincibility blink
    if (this.invincible > 0 && Math.floor(time / 4) % 2 === 0) {
      ctx.globalAlpha = 0.45;
    }

    // Hitlag shiver
    if (this.hitlag > 0) {
      ctx.translate((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5);
    }

    const squash = this.landSquash > 0 ? this.landSquash : 0;
    ctx.scale(this.facing * (1 + squash * 0.35), 1 - squash * 0.3);

    if (this.state === 'hitstun') {
      ctx.rotate(this.spinAngle * this.facing);
      ctx.translate(0, -d.height * 0.45);
      this.drawBody(ctx, time, 'tumble');
      ctx.restore();
      return;
    }

    this.drawBody(ctx, time, this.poseName());

    ctx.restore();

    // Shield bubble drawn unflipped in world space.
    if (this.state === 'shield') {
      const ratio = this.shieldHP / SHIELD_MAX;
      ctx.save();
      ctx.globalAlpha = 0.4;
      const r = (d.height * 0.7 + 14) * (0.45 + 0.55 * ratio);
      const g = ctx.createRadialGradient(
        this.x,
        this.y - d.height * 0.45,
        r * 0.2,
        this.x,
        this.y - d.height * 0.45,
        r,
      );
      g.addColorStop(0, 'rgba(120,200,255,0.15)');
      g.addColorStop(1, ratio > 0.35 ? 'rgba(80,160,255,0.8)' : 'rgba(255,90,90,0.85)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(this.x, this.y - d.height * 0.45, r, 0, TAU);
      ctx.fill();
      ctx.restore();
    }

    if (this.state === 'stunned' && Math.floor(time / 6) % 2 === 0) {
      ctx.save();
      ctx.fillStyle = '#ffe066';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✦', this.x, this.y - this.def.height - 18);
      ctx.restore();
    }
  }

  private poseName(): string {
    if (this.state === 'attack' && this.currentMove) {
      const m = this.moveFrame;
      const mv = this.currentMove;
      if (m <= mv.startup) return 'windup';
      if (m <= mv.startup + mv.active) return 'strike';
      return 'recover';
    }
    if (this.state === 'run') return 'run';
    if (this.state === 'roll') return 'roll';
    if (this.state === 'shield' || this.state === 'stunned') return 'guard';
    if (this.state === 'respawn') return 'idle';
    if (!this.onGround) return this.helpless ? 'flail' : 'air';
    return 'idle';
  }

  /** Draw in local space: origin at feet, +x = facing direction. */
  private drawBody(ctx: CanvasRenderingContext2D, time: number, pose: string): void {
    const d = this.def;
    const h = d.height;
    const bodyW = d.size * 1.15;
    const bob = pose === 'idle' ? Math.sin(time * 0.06 + this.playerIndex) * 2 : 0;
    const runLift = pose === 'run' ? Math.abs(Math.sin(this.runPhase)) * 4 : 0;
    const hipY = -h * 0.42 + bob - runLift;
    const headR = d.size * 0.62;
    const headY = -h + headR * 0.9 + bob - runLift;

    // Move-strike offsets: extend a limb toward the hitbox.
    let strikeX = 0;
    let strikeY = 0;
    if ((pose === 'strike' || pose === 'windup') && this.currentMove) {
      const mvx = this.currentMove.hx;
      const mvy = this.currentMove.hy + h * 0.45;
      const len = Math.max(1, Math.hypot(mvx, mvy));
      const reach = pose === 'strike' ? 1 : -0.35;
      strikeX = (mvx / len) * d.size * 1.5 * reach;
      strikeY = (mvy / len) * d.size * 1.5 * reach;
    }

    // Shadow of motion for speedster
    if (d.style === 'speedster' && Math.abs(this.vx) > d.runSpeed * 0.6) {
      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.ellipse(-14, hipY, bodyW * 0.7, h * 0.3, 0, 0, TAU);
      ctx.fill();
      ctx.restore();
    }

    // ---- legs ----
    if (d.style !== 'wisp') {
      const legSwing = pose === 'run' ? Math.sin(this.runPhase) * 14 : 0;
      const legSpread = pose === 'guard' ? 8 : 5;
      ctx.strokeStyle = d.color2;
      ctx.lineWidth = d.size * 0.32;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-legSpread, hipY + h * 0.1);
      ctx.lineTo(-legSpread - legSwing, 0);
      ctx.moveTo(legSpread, hipY + h * 0.1);
      ctx.lineTo(legSpread + legSwing, 0);
      ctx.stroke();
    } else {
      // Ghost tail
      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.moveTo(-bodyW * 0.55, hipY + h * 0.05);
      for (let i = 0; i <= 4; i++) {
        const tx = -bodyW * 0.55 + (bodyW * 1.1 * i) / 4;
        const ty = i % 2 === 0 ? 0 : -8 + Math.sin(time * 0.15 + i) * 4;
        ctx.lineTo(tx, ty);
      }
      ctx.lineTo(bodyW * 0.55, hipY + h * 0.05);
      ctx.closePath();
      ctx.fill();
    }

    // ---- torso ----
    const grd = ctx.createLinearGradient(0, headY, 0, 0);
    grd.addColorStop(0, d.color);
    grd.addColorStop(1, d.color2);
    ctx.fillStyle = grd;
    const guardSquat = pose === 'guard' ? 6 : 0;
    if (d.style === 'golem') {
      // Chunky angular torso
      ctx.beginPath();
      ctx.moveTo(-bodyW * 0.85, hipY + h * 0.16 + guardSquat);
      ctx.lineTo(-bodyW * 0.95, headY + headR * 0.4 + guardSquat);
      ctx.lineTo(0, headY - headR * 0.1 + guardSquat);
      ctx.lineTo(bodyW * 0.95, headY + headR * 0.4 + guardSquat);
      ctx.lineTo(bodyW * 0.85, hipY + h * 0.16 + guardSquat);
      ctx.closePath();
      ctx.fill();
      // Glowing core
      ctx.fillStyle = d.eyeColor;
      ctx.globalAlpha = 0.75 + 0.25 * Math.sin(time * 0.1);
      ctx.beginPath();
      ctx.arc(0, hipY - h * 0.1, d.size * 0.22, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = 1;
    } else {
      ctx.beginPath();
      ctx.ellipse(
        0,
        (hipY + headY) / 2 + guardSquat,
        bodyW * 0.62,
        (hipY - headY) * 0.62 + 4,
        pose === 'run' ? -0.12 : 0,
        0,
        TAU,
      );
      ctx.fill();
    }

    // ---- arms ----
    ctx.strokeStyle = d.color;
    ctx.lineWidth = d.size * (d.style === 'golem' ? 0.42 : 0.28);
    ctx.lineCap = 'round';
    const shoulderY = headY + headR * 0.9 + guardSquat;
    const shoulderX = bodyW * 0.42;
    const armSwing = pose === 'run' ? Math.sin(this.runPhase + Math.PI) * 12 : 0;
    if (pose === 'strike' || pose === 'windup') {
      // Striking arm reaches toward the hitbox; other arm counterbalances.
      ctx.beginPath();
      ctx.moveTo(shoulderX, shoulderY);
      ctx.lineTo(strikeX * 1.4 + bodyW * 0.3, shoulderY + strikeY * 1.4 + 6);
      ctx.moveTo(-shoulderX, shoulderY);
      ctx.lineTo(-bodyW * 0.6 - strikeX * 0.4, shoulderY + 14);
      ctx.stroke();
      // Fist
      ctx.fillStyle = d.color2;
      ctx.beginPath();
      ctx.arc(
        strikeX * 1.4 + bodyW * 0.3,
        shoulderY + strikeY * 1.4 + 6,
        ctx.lineWidth * 0.85,
        0,
        TAU,
      );
      ctx.fill();
    } else if (pose === 'flail' || pose === 'air') {
      const wave = Math.sin(time * 0.3) * (pose === 'flail' ? 14 : 5);
      ctx.beginPath();
      ctx.moveTo(shoulderX, shoulderY);
      ctx.lineTo(bodyW * 0.95, shoulderY - 10 + wave);
      ctx.moveTo(-shoulderX, shoulderY);
      ctx.lineTo(-bodyW * 0.95, shoulderY - 10 - wave);
      ctx.stroke();
    } else if (pose === 'tumble') {
      ctx.beginPath();
      ctx.moveTo(shoulderX, shoulderY);
      ctx.lineTo(bodyW * 1.05, shoulderY - 16);
      ctx.moveTo(-shoulderX, shoulderY);
      ctx.lineTo(-bodyW * 1.05, shoulderY - 12);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(shoulderX, shoulderY);
      ctx.lineTo(bodyW * 0.68 + armSwing, hipY + 4);
      ctx.moveTo(-shoulderX, shoulderY);
      ctx.lineTo(-bodyW * 0.68 - armSwing, hipY + 4);
      ctx.stroke();
    }

    // ---- head ----
    ctx.fillStyle = d.color;
    ctx.beginPath();
    if (d.style === 'golem') {
      ctx.rect(-headR * 0.9, headY - headR * 0.7 + guardSquat, headR * 1.8, headR * 1.5);
    } else {
      ctx.arc(0, headY + guardSquat, headR, 0, TAU);
    }
    ctx.fill();

    // Style flair
    if (d.style === 'speedster') {
      // Ears + tail
      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.moveTo(-headR * 0.5, headY - headR * 0.6);
      ctx.lineTo(-headR * 0.2, headY - headR * 1.5);
      ctx.lineTo(headR * 0.1, headY - headR * 0.7);
      ctx.closePath();
      ctx.moveTo(headR * 0.5, headY - headR * 0.6);
      ctx.lineTo(headR * 0.8, headY - headR * 1.4);
      ctx.lineTo(headR * 1, headY - headR * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = d.color2;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-bodyW * 0.5, hipY);
      ctx.quadraticCurveTo(
        -bodyW * 1.3,
        hipY - 6 + Math.sin(time * 0.2) * 5,
        -bodyW * 1.6,
        hipY - 18,
      );
      ctx.stroke();
    } else if (d.style === 'brawler') {
      // Headband
      ctx.fillStyle = d.color2;
      ctx.fillRect(-headR, headY - headR * 0.35 + guardSquat, headR * 2, headR * 0.34);
      ctx.beginPath();
      ctx.moveTo(-headR * 0.9, headY - headR * 0.2);
      ctx.lineTo(-headR * 1.7, headY + Math.sin(time * 0.15) * 4);
      ctx.lineTo(-headR * 1.5, headY + headR * 0.4);
      ctx.closePath();
      ctx.fill();
    } else if (d.style === 'wisp') {
      // Hood glow
      ctx.strokeStyle = d.color2;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, headY + guardSquat, headR + 4, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    }

    // ---- eyes ----
    ctx.fillStyle = d.eyeColor;
    const eyeY = headY + guardSquat - headR * 0.1;
    if (d.style === 'golem') {
      ctx.fillRect(headR * 0.1, eyeY - 3, headR * 0.55, 6);
      ctx.fillRect(-headR * 0.62, eyeY - 3, headR * 0.4, 6);
    } else {
      ctx.beginPath();
      ctx.arc(headR * 0.38, eyeY, headR * 0.16, 0, TAU);
      ctx.arc(-headR * 0.12, eyeY, headR * 0.13, 0, TAU);
      ctx.fill();
    }
  }
}
