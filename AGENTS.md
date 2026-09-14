# Auronima — agent instructions

Relational/spatial learning interface for textbooks (see `info/plan.txt` for the
vision: "Fractal Knowledge Space", learning objects = **Guros**). Current active
work is step 1 of the roadmap in `roadmap.txt`: the **rendering engine** — a
working Canvas 2D prototype already exists.

## Stack & verification (no build/test/lint tooling)

Pure vanilla stack, by design (`info/plan.txt`): vanilla JS/HTML/CSS, a local
Python server, filesystem storage. Deliberately **no** React, Next.js, databases,
or cloud. Do not introduce a build system or frameworks.

- **Run/verify the engine**: `python3 server.py` then open
  `http://localhost:8000` (serves repo root, port 8000). The Canvas build also
  runs straight from `file://`; the server only becomes necessary later for
  WebGPU (secure context) and `fetch()` of JSON.
- **No tests, lint, or build exist.** Verify by opening `index.html` in a browser
  and checking the demo (W/S z, A/D x, Q/E y, scroll zoom, R reset; HUD shows
  computed projection values).
- Don't run `node`/`npm` for anything — no Node tooling is installed or expected.

## Repo structure

```
main.js                          # Canvas 2D rendering engine prototype (active work)
index.html                       # single-page canvas demo, loads main.js
server.py                        # optional local static server (python3 server.py)
archives/rendering engine1.txt   # engine v1 spec — superseded (see below)
"rendering engine2.txt"          # engine v2 spec — AUTHORITATIVE (see gotchas)
info/                            # design docs (vision, plans — no executable code)
  plan.txt                       # core vision: fractal knowledge space, Guros, universes
  idea.txt                       # philosophy / overview
  final ui.txt                   # unified fractal UI model
  hypothetical user experience.txt
roadmap.txt                      # roadmap + engine/event flow diagram
book/<book-id>/                  # textbook data (former layout; NOT in current worktree)
```

## Rendering engine — specs and hard constraints

Two spec files; they disagree. **`rendering engine2.txt` is authoritative** for
movement/speed; `archives/rendering engine1.txt` v1 formulas still hold for
projection/size/transparency/ordering.

- `rendering engine2.txt` literally contains leftover unresolved git
  merge-conflict markers. Only the top section
  (`# Rendering Engine v2 — rethink (authoritative)`) is real; the bottom hunk
  under `=======`/`>>>>>>>` is stale. Do not "resolve" or delete either file's
  conflicted region unless asked.
- Pipeline (per `main.js` and archive spec): Update Manager → Spatial Processor →
  Projection → Ordering → Render Preparation → (future WebGPU backend).
- Projection is **angular, no focal-division**: `theta = atan2(offset, dist)`,
  `m = k/dist`, transparency `g = dist/0.25` (dist < 0.25), painter's ordering
  far→near (`sort desc by dist`). No object rotation, ever.
- Movement model gotchas from engine v2 (agent would likely get these wrong):
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
- Design specs in `info/` describe vision but contain no executable code; they
  may contradict each other and the engine specs as designs evolve. Trust the
  latest/roadmap/code context, not any single doc.
- `info/` was formerly `info-to-agent/`; treat content, not path, as authority.
- `.gitignore` only lists `.directory`.
- Keep filenames with spaces (`rendering engine2.txt`) quoted in shell commands.