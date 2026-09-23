# Auronima — agent instructions

A spatial/reactive learning interface, built as an **absolute primitive
prototype** that grows feature by feature. Two files rule this project:

- `prototype.txt` — the spec: what the viewer must do (rects, lines,
  expand/collapse, exploration map, ...).
- `estemsched` — the schedule: the exact order to build it in, one item at a
  time.

Work strictly top-down from `prototype.txt` and `estemsched`. Bigger vision
docs live in `info/` and are **off-limits until the owner says otherwise** —
they distract from the prototype job.

## Stack & verification (no build/test/lint tooling)

- Vanilla JS (ES modules) + Three.js + HTML + CSS. Vanilla stack by design.
- Three.js is **vendored locally** (`libs/three/three.module.js`) and wired in
  with an `importmap` — no CDN at runtime, no build step.
- `server.py` — local Python static server. ES modules (and later `fetch()` of
  JSON) need HTTP, so run it before opening the page.
- Deliberately **no** build system, no frameworks, no databases, no cloud, no
  `node`/`npm`. Run nothing from Node.

## Roles

- The **owner designs the algorithms** and decides behavior.
- The **agent codes everything**: production-ready, fully integrated, runnable
  without the owner wiring anything together. No placeholders, no
  TODO-as-substitute, no partial integrations.

## Hard rules

- **Never** `git commit` or `git push`. Leave changes in the working tree.
- **Never** run `node`/`npm`.
- Implement each schedule item completely before moving on.

## Current invariants (implemented — don't regress)

- Camera is **fixed-orientation**: it never rotates, it only translates.
- `dt` comes from `requestAnimationFrame`/`performance.now()` timestamps —
  never a fixed `1/60` step.
- X and Y movement use the **exact same** rule; any asymmetry is a bug.
- World speed is **constant** while a key is held — never scaled by distance.

## Working notes

- README and commit messages are informal (owner is new to GitHub); match the
  short, lowercase, plain style.
- Filenames with spaces (`info/rendering engine1.txt`) need quotes in shell
  commands.
- `.gitignore` only lists `.directory`.