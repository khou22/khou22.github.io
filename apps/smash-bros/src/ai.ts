import type { Fighter } from './fighter';
import { STAGE } from './constants';
import { emptyFrame, type InputFrame } from './input';
import { chance, randInt } from './math';

type Plan = 'approach' | 'attack' | 'retreat' | 'recover' | 'defend' | 'zone';

/**
 * A readable state-machine CPU. Re-plans every few frames (its "reaction
 * time") and translates the current plan into an InputFrame each tick.
 */
export class CpuController {
  private plan: Plan = 'approach';
  private planTimer = 0;
  private held: Partial<InputFrame> = {};
  private tapJump = false;
  private tapAttack = false;
  private tapSpecial = false;

  constructor(private level = 5) {}

  frame(me: Fighter, foe: Fighter): InputFrame {
    const f = emptyFrame();
    if (!me.alive) return f;
    this.planTimer--;
    this.tapJump = false;
    this.tapAttack = false;
    this.tapSpecial = false;

    const offstage =
      me.x < STAGE.left - 10 || me.x > STAGE.right + 10 || me.y > 60;

    // Recovery overrides everything and re-evaluates every frame.
    if (offstage && me.state !== 'respawn') {
      this.plan = 'recover';
      this.recover(me);
    } else {
      if (this.plan === 'recover') this.planTimer = 0;
      if (this.planTimer <= 0) this.replan(me, foe);
      this.act(me, foe);
    }

    // Merge held directions + taps into the frame.
    Object.assign(f, this.held);
    if (this.tapJump) f.jumpP = true;
    if (this.tapAttack) f.attackP = true;
    if (this.tapSpecial) f.specialP = true;
    if (this.held.shield) f.shieldP = true;
    return f;
  }

  private replan(me: Fighter, foe: Fighter): void {
    // Reaction time scales inversely with level.
    this.planTimer = randInt(6, Math.max(8, 26 - this.level * 2));
    const dx = foe.x - me.x;
    const dy = foe.y - me.y;
    const dist = Math.hypot(dx, dy);
    const inRange = Math.abs(dx) < 110 && Math.abs(dy) < 95;

    if (!foe.alive || foe.state === 'respawn') {
      this.plan = chance(0.6) ? 'retreat' : 'zone';
      return;
    }
    if (
      foe.state === 'attack' &&
      dist < 150 &&
      me.onGround &&
      chance(0.28 + this.level * 0.03)
    ) {
      this.plan = 'defend';
      return;
    }
    if (inRange) {
      this.plan = chance(0.82) ? 'attack' : 'retreat';
      return;
    }
    if (Math.abs(dx) > 380 && chance(0.45) && me.projectileCooldown === 0) {
      this.plan = 'zone';
      return;
    }
    this.plan = chance(0.9) ? 'approach' : 'retreat';
  }

  private act(me: Fighter, foe: Fighter): void {
    const dx = foe.x - me.x;
    const dy = foe.y - me.y;
    this.held = {};

    switch (this.plan) {
      case 'approach': {
        this.held[dx < 0 ? 'left' : 'right'] = true;
        // Jump after airborne foes, or hop occasionally to mix up.
        if ((dy < -130 && chance(0.06)) || chance(0.005)) {
          if (me.jumpsUsed < 2) this.tapJump = true;
        }
        // Fast-fall back down when above the fight.
        if (!me.onGround && me.vy > 0 && dy > 40) this.held.down = true;
        break;
      }
      case 'attack': {
        if (!me.actionable) break;
        // Face the foe.
        if ((dx < 0 && me.facing > 0) || (dx > 0 && me.facing < 0)) {
          this.held[dx < 0 ? 'left' : 'right'] = true;
        }
        if (me.onGround) {
          if (dy < -70) this.held.up = true;
          else if (chance(0.25)) this.held.down = true;
          else if (chance(0.7)) this.held[dx < 0 ? 'left' : 'right'] = true;
          if (chance(0.16) && Math.abs(dx) > 60) this.tapSpecial = true;
          else this.tapAttack = true;
        } else {
          if (dy < -50) this.held.up = true;
          else if (dy > 60 && !me.onGround && foe.y > me.y) this.held.down = true;
          else if (Math.abs(dx) > 30) this.held[dx < 0 ? 'left' : 'right'] = true;
          this.tapAttack = true;
        }
        break;
      }
      case 'retreat': {
        this.held[dx < 0 ? 'right' : 'left'] = true;
        // Don't retreat off the ledge.
        if (me.x < STAGE.left + 90) {
          delete this.held.left;
          this.held.right = true;
        }
        if (me.x > STAGE.right - 90) {
          delete this.held.right;
          this.held.left = true;
        }
        break;
      }
      case 'defend': {
        if (me.onGround) this.held.shield = true;
        break;
      }
      case 'zone': {
        if ((dx < 0 && me.facing > 0) || (dx > 0 && me.facing < 0)) {
          this.held[dx < 0 ? 'left' : 'right'] = true;
        }
        if (me.actionable && me.projectileCooldown === 0) this.tapSpecial = true;
        else this.plan = 'approach';
        break;
      }
      case 'recover':
        break;
    }
  }

  private recover(me: Fighter): void {
    this.held = {};
    const targetX = me.x < 0 ? STAGE.left + 140 : STAGE.right - 140;
    this.held[me.x < targetX ? 'right' : 'left'] = true;

    if (me.state === 'hitstun' || me.state === 'respawn') return;

    const deep = me.y > 150;
    const veryDeep = me.y > 320;
    if (me.vy > 0 && !me.helpless) {
      if (me.jumpsUsed < 2 && (deep || chance(0.04))) {
        this.tapJump = true;
      } else if (
        me.jumpsUsed >= 2 &&
        (veryDeep || (deep && chance(0.2))) &&
        me.actionable
      ) {
        // Up-special toward the stage.
        this.held.up = true;
        this.tapSpecial = true;
      }
    }
  }
}
