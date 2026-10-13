---
description: "Use when changing frontend metronome UI, Web Audio scheduling, click sample loading, or timing behavior. Enforces scheduler safety, route safety, and state ownership boundaries."
name: "Frontend Audio Safety"
applyTo:
  - "src/App.tsx"
  - "src/constants.ts"
  - "src/hooks/useMetronome.ts"
  - "src/components/**/*.tsx"
  - "src/frontend.tsx"
  - "src/index.ts"
---
# Frontend Audio Safety

- Keep transport and scheduling internals in src/hooks/useMetronome.ts.
- Keep scheduler tunables in src/constants.ts and import them from there.
- Do not replace scheduled Web Audio playback with interval-based playback.
- Preserve useRef-based live reads used by the scheduler to avoid stale closure timing bugs.
- Keep App as the shared state owner and pass props to presentational components.
- Preserve explicit audio routes for /click.wav and /click-accent.wav in src/index.ts before the catch-all route.
- If timing behavior changes, align with docs/audio-scheduling.md and keep its invariants.
- Keep BPM bounds consistent with hook logic and any related UI controls.
- Use Bun-first patterns already used in this repository; do not introduce Vite or Express without an explicit request.
- Prefer linking to existing docs rather than duplicating long rationale in code comments or instructions.

References:
- docs/audio-scheduling.md
- CLAUDE.md
- AGENTS.md
