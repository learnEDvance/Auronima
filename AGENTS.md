# Auronima — agent instructions

Design-phase project: a spatial learning environment for NCERT textbooks.
Currently only textbook page scans (JPEGs + JSON metadata) exist. No runtime
code, no build system, no tests, no git repo.

## Repo structure

```
book/<book-id>/
  <book-id>.json   # metadata
  jpg/             # page images: {page_number}.jpg
info-to-agent/     # design documents (supplementary context for agents)
  plan.txt         #   vision: fractal knowledge space
  idea.txt         #   core philosophy
  event system.txt #   event execution engine design
  final ui.txt     #   unified fractal UI model
  executor.txt     #   empty (placeholder)
opencode.json      # OpenCode config (auronima agent, ponytail plugin)
AGENTS.md          # this file
```

## Book metadata schema

Every `book/*/<id>.json` follows this shape:

```json
{
  "id": "<book-id>",
  "title": "NCERT <book-id>" or a human-readable title,
  "pages": <int>,
  "start_page": 0,
  "image_format": "jpg",
  "selections": []
}
```

- `selections` is the extension point for page highlights/annotations.
  Currently empty in all books. Preserve the pattern when adding data.
- Image filenames are zero-indexed page numbers (`0.jpg`, `1.jpg`, …).
- `start_page` is always `0` — images start at zero, not one.

## Book IDs and subjects

| ID      | Subject                  |
|---------|--------------------------|
| iesc105 | Science (Class 10?)      |
| iesc108 | Science (Class 10?)      |
| iesc109 | Science (Class 10?)      |
| jesc101 | Social Science (Class 9) |
| kech101 | Chemistry                |

Prefix encodes subject: `iesc` = Science, `jesc` = Social Science,
`kech` = Chemistry.

## Design documents

`info-to-agent/*.txt` are design specs for the planned application. They
describe the vision but contain no executable code. The project is still in
design phase — only book metadata and JPEG pages exist on disk.

## Agent workflow (from opencode.json)

- **Primary agent**: `auronima`
- **Developer Capability Constraint**: the project owner cannot fill in
  placeholders, connect systems, refactor, or fix partial implementations.
  All implementations must be production-ready and fully integrated.
- **Ponytail plugin**: loaded from `/home/rabamari/tools/ponytail/.opencode/plugins/ponytail.mjs`
- **No git repo** exists yet. Init one (`git init`) before making commits.
- **No build, test, lint, or typecheck commands** exist. Do not assume them.
