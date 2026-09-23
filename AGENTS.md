# Auronima — agent instructions

Relational/spatial learning interface for textbooks (see `info/plan.txt` for the
vision: "Fractal Knowledge Space", learning objects = **Guros**). The project
restarted with a docs-only worktree (see `roadmap.txt`); a working Canvas 2D
engine prototype existed but was removed in the restart and remains recoverable
in git history.

## Stack & verification (no build/test/lint tooling)

Pure vanilla stack, by design (`info/plan.txt`): vanilla JS/HTML/CSS, a local
Python server, filesystem storage. Deliberately **no** React, Next.js, databases,
or cloud. Do not introduce a build system or frameworks.

- **No runnable code in the worktree right now** — the engine prototype
  (`main.js`), demo (`index.html`), and server (`server.py`) were deleted in the
  restart; they remain recoverable in git history.
- **No tests, lint, or build exist.**
- Don't run `node`/`npm` for anything — no Node tooling is installed or expected.

## Repo structure

```
AGENTS.md                        # agent instructions (this file)
README.md                        # informal project readme
roadmap.txt                      # roadmap + engine/event flow diagram
estemsched                       # stray file — keep, do not touch
info/                            # documentation (vision, plans, specs — no executable code)
  rendering engine1.txt          # engine spec — formulas + constraints (see below)
  plan.txt                       # core vision: fractal knowledge space, Guros, universes
  idea.txt                       # philosophy / overview
  final ui.txt                   # unified fractal UI model
  hypothetical user experience.txt
```

## Rendering engine — spec and hard constraints

Single spec file (`info/rendering engine1.txt`); no engine code exists in the
worktree after the restart.

- Pipeline: Update Manager → Spatial Processor → Projection → Ordering → Render
  Preparation → (future WebGPU backend).
- Projection is **angular, no focal-division**: `theta = atan2(offset, dist)`,
  `m = k/dist`, transparency `g = dist/0.25` (dist < 0.25), painter's ordering
  far→near (`sort desc by dist`). No object rotation, ever.
- Movement model (agent would likely get these wrong):
  - camera is fixed, looking down +z; `dist = cam.z - object.z`.
  - world-speed input stays **constant** while a key is held; on-screen speed is
    its angular derivative. **NEVER** scale world speed by `1/dist` or `dist` —
    the near-fast/far-slow relation is the feature.
  - x and y use the **exact same** formula; any asymmetry is a bug.
  - `dt` must come from `requestAnimationFrame`/`performance.now()` timestamps —
    never a fixed `1/60` step (fps-dependent).

Roadmap after the engine (see `roadmap.txt`): coordinate system → object system →
event system → content processing → database.

## Developer capability constraint (important convention)

The project owner is not a professional software engineer and cannot complete
unfinished implementations, architecture gaps, refactors, or implied follow-up
work. Treat every requested implementation as requiring **production-ready,
fully integrated completion**:

- no placeholder code, no TODO-as-substitute, no partial integrations
- update all affected files/interfaces so the result is runnable without the
  owner wiring anything together afterward
- when you change a system, update every file and reference it touches

Default expectation is "implement it completely," not "provide guidance."

## Working notes

- Git commit history and README are informal (owner is new to GitHub); match the
  existing style — short, lowercase, plain commit messages.
- **NEVER commit or push** — no `git commit`, no `git push`, ever. Leave all
  changes in the working tree; the owner commits and pushes when they want.
- Design specs in `info/` describe vision but contain no executable code; they
  may contradict each other and the engine specs as designs evolve. Trust the
  latest/roadmap/code context, not any single doc.
- `info/` was formerly `info-to-agent/`; treat content, not path, as authority.
- `.gitignore` only lists `.directory`.
- Keep filenames with spaces (`info/rendering engine1.txt`) quoted in shell
  commands.