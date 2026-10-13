# Agent Instructions

## Scope

These instructions apply to the whole repository.

## Commands

- Install dependencies: `bun install`
- Start dev server: `bun dev` (runs `bun --hot src/index.ts`)
- Start production server: `bun start` (runs `NODE_ENV=production bun src/index.ts`)
- Build: `bun run build.ts`
- Build help: `bun run build.ts --help`

## Architecture

- Server entrypoint is `src/index.ts`.
- Frontend entrypoint is `src/frontend.tsx`, mounted from `src/index.html`.
- Shared app state lives in `src/App.tsx`.
- Audio scheduling/transport logic lives in `src/hooks/useMetronome.ts`.
- Timing and time-signature constants live in `src/constants.ts`.
- UI controls are split across `src/components/BpmControl.tsx`, `src/components/TimeSignatureSelector.tsx`, and `src/components/TrainingPanel.tsx`.

## Project Conventions

- Use Bun-first tooling and APIs. Do not introduce Node/Express/Vite alternatives unless explicitly requested.
- Preserve explicit audio routes (`/click.wav`, `/click-accent.wav`) in `src/index.ts` before the catch-all route.
- Keep scheduler behavior in `src/hooks/useMetronome.ts`; avoid replacing it with interval-based audio playback.
- Keep scheduler tunables centralized in `src/constants.ts`.
- Keep `App` as state owner and pass props to presentational components.
- Respect the TypeScript path alias `@/*` defined in `tsconfig.json`.

## Agent Guardrails

- Do not claim lint, typecheck, or test scripts exist unless you add them. Current `package.json` only defines `dev`, `start`, and `build` scripts.
- If asked to change timing behavior, review `docs/audio-scheduling.md` first and preserve its core invariants.
- Prefer linking to existing docs instead of duplicating long explanations.

## References

- Project guidance: [CLAUDE.md](./CLAUDE.md)
- Scheduler rationale: [docs/audio-scheduling.md](./docs/audio-scheduling.md)
- Run basics: [README.md](./README.md)