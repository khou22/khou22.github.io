// Keyboard + gamepad input. Each fighter samples an InputFrame once per tick.

export interface InputFrame {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  attack: boolean;
  special: boolean;
  shield: boolean;
  jumpP: boolean; // P suffix = pressed this tick (edge)
  attackP: boolean;
  specialP: boolean;
  shieldP: boolean;
  leftP: boolean;
  rightP: boolean;
  upP: boolean;
  downP: boolean;
}

export function emptyFrame(): InputFrame {
  return {
    left: false,
    right: false,
    up: false,
    down: false,
    attack: false,
    special: false,
    shield: false,
    jumpP: false,
    attackP: false,
    specialP: false,
    shieldP: false,
    leftP: false,
    rightP: false,
    upP: false,
    downP: false,
  };
}

interface KeyMap {
  left: string[];
  right: string[];
  up: string[];
  down: string[];
  attack: string[];
  special: string[];
  shield: string[];
}

export const PLAYER_KEYS: KeyMap[] = [
  {
    left: ['KeyA'],
    right: ['KeyD'],
    up: ['KeyW'],
    down: ['KeyS'],
    attack: ['KeyF'],
    special: ['KeyG'],
    shield: ['KeyH'],
  },
  {
    left: ['ArrowLeft'],
    right: ['ArrowRight'],
    up: ['ArrowUp'],
    down: ['ArrowDown'],
    attack: ['Comma'],
    special: ['Period'],
    shield: ['Slash'],
  },
];

export class Input {
  private held = new Set<string>();
  private pressed = new Set<string>();
  private padPrev: boolean[][] = [[], []];
  private padCur: boolean[][] = [[], []];
  private padAxes: number[][] = [
    [0, 0],
    [0, 0],
  ];
  onAnyKey: (() => void) | null = null;

  constructor() {
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      this.held.add(e.code);
      this.pressed.add(e.code);
      this.onAnyKey?.();
      // Stop arrows/space from scrolling the page.
      if (
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(
          e.code,
        )
      ) {
        e.preventDefault();
      }
    });
    window.addEventListener('keyup', (e) => this.held.delete(e.code));
    window.addEventListener('blur', () => this.held.clear());
  }

  /** Poll gamepads once per tick. Pad 0 -> player 0, pad 1 -> player 1. */
  pollGamepads(): void {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    let slot = 0;
    for (const pad of pads) {
      if (!pad || slot >= 2) continue;
      this.padPrev[slot] = this.padCur[slot];
      this.padCur[slot] = pad.buttons.map((b) => b.pressed);
      this.padAxes[slot] = [pad.axes[0] ?? 0, pad.axes[1] ?? 0];
      slot++;
    }
    for (; slot < 2; slot++) {
      this.padPrev[slot] = this.padCur[slot];
      this.padCur[slot] = [];
      this.padAxes[slot] = [0, 0];
    }
  }

  down(code: string): boolean {
    return this.held.has(code);
  }

  wasPressed(code: string): boolean {
    return this.pressed.has(code);
  }

  anyPressed(codes: string[]): boolean {
    return codes.some((c) => this.pressed.has(c));
  }

  /** Call after every fixed update tick so edges last exactly one tick. */
  clearPressed(): void {
    this.pressed.clear();
  }

  private padBtn(slot: number, indices: number[]): boolean {
    return indices.some((i) => this.padCur[slot][i]);
  }

  private padBtnP(slot: number, indices: number[]): boolean {
    return indices.some((i) => this.padCur[slot][i] && !this.padPrev[slot][i]);
  }

  /** Standard-mapping gamepad: 0/2=attack, 1=special, 3=jump, 4/5/6/7=shield, 12-15=dpad. */
  sample(player: number): InputFrame {
    const m = PLAYER_KEYS[player];
    const f = emptyFrame();
    const anyDown = (codes: string[]) => codes.some((c) => this.held.has(c));
    const anyP = (codes: string[]) => codes.some((c) => this.pressed.has(c));

    f.left = anyDown(m.left);
    f.right = anyDown(m.right);
    f.up = anyDown(m.up);
    f.down = anyDown(m.down);
    f.attack = anyDown(m.attack);
    f.special = anyDown(m.special);
    f.shield = anyDown(m.shield);
    f.leftP = anyP(m.left);
    f.rightP = anyP(m.right);
    f.upP = anyP(m.up);
    f.downP = anyP(m.down);
    f.jumpP = anyP(m.up);
    f.attackP = anyP(m.attack);
    f.specialP = anyP(m.special);
    f.shieldP = anyP(m.shield);

    // Merge gamepad state.
    const ax = this.padAxes[player][0];
    const ay = this.padAxes[player][1];
    const DEAD = 0.35;
    if (ax < -DEAD || this.padBtn(player, [14])) f.left = true;
    if (ax > DEAD || this.padBtn(player, [15])) f.right = true;
    if (ay < -DEAD || this.padBtn(player, [12])) f.up = true;
    if (ay > DEAD || this.padBtn(player, [13])) f.down = true;
    if (this.padBtn(player, [0, 2])) f.attack = true;
    if (this.padBtn(player, [1])) f.special = true;
    if (this.padBtn(player, [4, 5, 6, 7])) f.shield = true;
    if (this.padBtnP(player, [3, 12])) f.jumpP = true;
    if (this.padBtnP(player, [0, 2])) f.attackP = true;
    if (this.padBtnP(player, [1])) f.specialP = true;
    if (this.padBtnP(player, [4, 5, 6, 7])) f.shieldP = true;
    if (this.padBtnP(player, [14])) f.leftP = true;
    if (this.padBtnP(player, [15])) f.rightP = true;
    if (this.padBtnP(player, [12])) f.upP = true;
    if (this.padBtnP(player, [13])) f.downP = true;

    return f;
  }

  startPressed(): boolean {
    return (
      this.pressed.has('Enter') ||
      this.padBtnP(0, [9]) ||
      this.padBtnP(1, [9])
    );
  }

  backPressed(): boolean {
    return this.pressed.has('Escape') || this.padBtnP(0, [8]);
  }
}
