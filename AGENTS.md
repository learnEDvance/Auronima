# Auronima — agent instructions

Design-phase project: a relational/spatial learning interface for textbooks.
There is **no source code, build system, tests, or lint/typecheck tooling** in
this repo. Do not assume any exist. What exists on disk is textbook data and
design specs only.

## Repo structure

```
book/<book-id>/
  <book-id>.json   # book metadata (see schema)
  jpg/             # page scans: {page_number}.jpg (zero-indexed!)
info/              # design documents (plans, not code)
  plan.txt                     # vision: fractal knowledge space
  idea.txt                     # core philosophy
  event system.txt             # event execution engine design
  final ui.txt                 # unified fractal UI model
  hypothetical user experience.txt
  executor.txt                 # empty placeholder — do not rely on it
roadmap.txt        # roadmap + architecture flow
"rendering engine.txt"         # rendering engine spec + pipeline (note: filename
                               #   contains a space; quote it in shell)
```

`info/` was formerly `info-to-agent/` in early git history; treat content, not
path, as source of truth.

## Book metadata schema

Every `book/*/<id>.json` follows this shape:

```json
{
  "id": "<book-id>",
  "title": "NCERT <book-id>" or human-readable,
  "pages": <int>,
  "start_page": 0,
  "image_format": "jpg",
  "selections": []
}
```

- `selections` is the extension point for highlights/annotations; currently
  empty in all books. Preserve the pattern when adding data.
- Image filenames are **zero-indexed** page numbers (`0.jpg`, `1.jpg`, …);
  `start_page` is always `0`.
- Book ID prefix encodes subject: `iesc` = Science, `jesc` = Social Science,
  `kech` = Chemistry. Currently: iesc105, iesc108, iesc109, jesc101, kech101.

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

- Design specs in `info/` describe the vision but contain no executable code;
  they may contradict each other as the design evolves. Trust the latest/roadmap
  context, not any single doc.
- `.gitignore` only lists `.directory`.
- Keep filenames with spaces (`rendering engine.txt`) quoted in shell commands.
