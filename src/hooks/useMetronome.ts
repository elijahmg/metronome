import { useState, useRef, useCallback } from "react";
import { LOOKAHEAD_MS, SCHEDULE_AHEAD_S, type TimeSig } from "../constants";

const MIN_BPM = 40;
const MAX_BPM = 220;

interface Options {
  bpm: number;
  setBpm: (bpm: number) => void;
  timeSig: TimeSig;
  driftEnabled: boolean;
  barsPerStep: number;
  driftDirection: 1 | -1;
}

export function useMetronome({
  bpm,
  setBpm,
  timeSig,
  driftEnabled,
  barsPerStep,
  driftDirection,
}: Options) {
  const [playing, setPlaying] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const nextNoteTimeRef = useRef(0);
  const beatInBarRef = useRef(0);
  const beatCountRef = useRef(0);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs so the scheduler always reads the latest values without restarts
  const bpmRef = useRef(bpm);
  bpmRef.current = bpm;

  const timeSigRef = useRef(timeSig);
  timeSigRef.current = timeSig;

  const driftEnabledRef = useRef(driftEnabled);
  driftEnabledRef.current = driftEnabled;

  const barsPerStepRef = useRef(barsPerStep);
  barsPerStepRef.current = barsPerStep;

  const driftDirectionRef = useRef(driftDirection);
  driftDirectionRef.current = driftDirection;

  const scheduleNote = useCallback((time: number, accent: boolean) => {
    const ctx = audioCtxRef.current!;
    const freq = accent ? 1040 : 620;
    const duration = 0.04;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }, []);

  const scheduler = useCallback(() => {
    const ctx = audioCtxRef.current!;

    while (nextNoteTimeRef.current < ctx.currentTime + SCHEDULE_AHEAD_S) {
      scheduleNote(nextNoteTimeRef.current, beatInBarRef.current === 0);
      beatInBarRef.current =
        (beatInBarRef.current + 1) % timeSigRef.current.beats;
      nextNoteTimeRef.current += 60 / bpmRef.current;

      if (driftEnabledRef.current) {
        beatCountRef.current += 1;
        if (
          beatCountRef.current >=
          barsPerStepRef.current * timeSigRef.current.beats
        ) {
          beatCountRef.current = 0;
          const next = Math.min(
            MAX_BPM,
            Math.max(MIN_BPM, bpmRef.current + 10 * driftDirectionRef.current),
          );
          bpmRef.current = next;
          setBpm(next);
        }
      }
    }

    timerRef.current = setTimeout(scheduler, LOOKAHEAD_MS);
  }, [scheduleNote, setBpm]);

  const start = useCallback(() => {
    const ctx = audioCtxRef.current ?? new AudioContext();
    audioCtxRef.current = ctx;
    if (ctx.state === "suspended") ctx.resume();

    beatCountRef.current = 0;
    beatInBarRef.current = 0;
    nextNoteTimeRef.current = ctx.currentTime;
    setPlaying(true);
    scheduler();
  }, [scheduler]);

  const stop = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPlaying(false);
  }, []);

  return { playing, start, stop };
}
