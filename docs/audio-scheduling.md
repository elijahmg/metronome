# Audio Scheduling: Why AudioContext Instead of setInterval

## The Problem with setInterval

The naive metronome implementation looks like this:

```ts
setInterval(() => {
  new Audio("/click.wav").play();
}, 60000 / bpm);
```

This has a fundamental flaw: `setInterval` runs on the JavaScript event loop, which is single-threaded and non-deterministic. The browser can delay a callback for any number of reasons — a React re-render, a garbage collection pause, a heavy DOM update, or simply the tab being throttled in the background. Even a 5–10ms drift per beat adds up quickly and makes the metronome feel unstable.

The first version of this app used `setInterval` and the user reported audible fluctuations. That was the symptom.

## The Fix: Web Audio API Scheduling

The Web Audio API exposes `AudioContext.currentTime` — a high-resolution timestamp driven by the audio hardware clock, completely independent of the JavaScript event loop. Audio events scheduled against this clock fire with sample-level precision regardless of what the main thread is doing.

The pattern used in `useMetronome.ts`:

```
setTimeout (heartbeat, every 25ms)
    └── while loop: schedule any beats that fall within the next 100ms
            └── source.start(exactTime)  ← fires from the audio thread
```

`setTimeout` is still imprecise, but it only drives the *scheduler*, not the sound. The scheduler looks ahead 100ms (`SCHEDULE_AHEAD_S`) and pre-schedules every beat that falls in that window using `source.start(time)`. By the time the audio thread reaches that timestamp, the event is already queued and plays exactly on time.

## Constants

```ts
const LOOKAHEAD_MS = 25;       // how often the scheduler heartbeat runs
const SCHEDULE_AHEAD_S = 0.1;  // how far ahead beats are pre-scheduled
```

- **LOOKAHEAD_MS** controls CPU usage. Lower = tighter loop = more overhead.
- **SCHEDULE_AHEAD_S** is the buffer. It must be larger than the worst-case `setTimeout` delay. 100ms is conservative and works even in throttled background tabs.

The two values overlap intentionally: the scheduler runs every 25ms but looks 100ms ahead, so each beat gets scheduled 2–4 heartbeats before it plays. There is always a pre-scheduled beat waiting in the audio queue.

## BPM Changes While Playing

Because the scheduler reads `bpmRef.current` (a ref, not state) on every heartbeat, BPM changes take effect immediately on the next scheduler tick without restarting the interval. There is no gap or double-beat when the user adjusts BPM mid-playback.

## References

- Chris Wilson's original article that established this pattern: *A Tale of Two Clocks* (2013) — the standard reference for web metronome timing.
- MDN: `AudioContext.currentTime`, `AudioBufferSourceNode.start(when)`
