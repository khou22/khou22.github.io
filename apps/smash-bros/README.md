# Super Mash: Melee — a fan-made platform fighter

An original, from-scratch tribute to GameCube-era platform fighters, built as
an isolated mini-app inside this repo. It re-creates the _feel_ of the classic
formula — percent-based damage, knockback that scales with percent, stocks,
double jumps, fast-falls, shields, spikes, and recovery specials — with an
original engine, original characters, and original art. No Nintendo code or
assets are used, and this project is not affiliated with or endorsed by
Nintendo.

## What's included

- **Main menu** — 1P vs CPU, 2P local versus, and a controls screen
- **Character select** — 4 original fighters with distinct archetypes:
  - **NOVA** — balanced all-rounder
  - **BLITZ** — blazing-fast featherweight (fast-faller)
  - **GRONDO** — super heavyweight powerhouse
  - **WISP** — floaty featherweight with drifty aerials
- **One stage** — _Final Destination_: a single flat platform over a void with
  blast zones on all sides
- **Melee-style systems** — classic knockback formula, hitstun + hitlag
  (freeze frames), meteor spikes, shields with shield-break, roll dodges,
  projectiles, CPU AI with recovery logic, dynamic zooming camera, 4-stock
  battles
- **Zero-asset presentation** — all graphics are procedural canvas vector art;
  all sound effects are synthesized live with WebAudio

## Requirements

- Node.js 18+ (20+ recommended) — `brew install node` if you don't have it
- Any modern browser (Chrome/Arc/Safari/Firefox). On an M4 MacBook Pro the
  simulation runs at a fixed 60 Hz and renders at your display's refresh rate
  (120 Hz on ProMotion).

## Run it

```bash
cd apps/smash-bros
npm install     # or: pnpm install
npm run dev     # or: pnpm dev
```

Then open the printed URL (default `http://localhost:5173`).

### Production build

```bash
npm run build    # typechecks + bundles to dist/
npm run preview  # serves the production build
```

## Controls

| Action                | Player 1 | Player 2 |
| --------------------- | -------- | -------- |
| Move                  | A / D    | ← / →    |
| Jump (press twice)    | W        | ↑        |
| Crouch / fast-fall    | S        | ↓        |
| Attack (+ direction)  | F        | ,        |
| Special (+ direction) | G        | .        |
| Shield / roll         | H        | /        |

- **ENTER** — confirm / pause · **ESC** — back / quit match · **M** — mute
- **Attack + direction** changes the move (up-tilt, down-tilt, forward air,
  down-air spike, …)
- **Special + up** is your recovery move — use it to get back to the stage
- Gamepads are supported (standard mapping): stick/d-pad to move, **A**
  attack, **B** special, **Y** jump, triggers shield, **Start** pause. Pad 1
  drives P1, pad 2 drives P2.

## How to win

Knock your opponent off the stage. Damage them to raise their percent — the
higher it climbs, the further they fly. Each fighter has 4 stocks; take them
all to win. Watch for the down-air **meteor spike** when an enemy is
recovering below the ledge.

## Architecture (for the curious)

```
src/
├── main.ts            # canvas bootstrap, fixed-60hz loop, scene routing
├── constants.ts       # stage geometry, blast zones, combat tuning
├── characters.ts      # roster data: stats + full frame-data movesets
├── fighter.ts         # fighter state machine, physics, knockback, renderer
├── input.ts           # keyboard + gamepad, edge-triggered per tick
├── ai.ts              # CPU: plan-based state machine w/ recovery logic
├── projectiles.ts     # neutral-special projectiles
├── stage.ts           # Final Destination platform + parallax starfield
├── camera.ts          # dynamic framing camera with screen shake
├── particles.ts       # hit sparks, KO blasts, dust
├── audio.ts           # WebAudio-synthesized SFX (no audio files)
└── scenes/
    ├── menu.ts        # title + mode select + controls
    ├── select.ts      # character select for 1P/2P
    └── battle.ts      # match orchestration, HUD, results
```

The simulation runs on a fixed 60 Hz timestep (decoupled from render), all
combat is expressed in classic frame-data terms (startup / active / recovery
frames), and knockback uses the classic formula:
`kb = ((p/10 + p·d/20) · 200/(w+100) · 1.4 + 18) · kbg/100 + bkb`.
