import { useState, useRef } from "react";

const MIN_BPM = 40;
const MAX_BPM = 220;

interface Props {
  bpm: number;
  setBpm: (fn: (b: number) => number) => void;
  playing: boolean;
  onPlay: () => void;
  onStop: () => void;
}

export function BpmControl({ bpm, setBpm, playing, onPlay, onStop }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const atMin = bpm <= MIN_BPM;
  const atMax = bpm >= MAX_BPM;

  const stepBtn = (disabled: boolean) =>
    `flex-1 h-12 border-r-3 border-[#1A1A1A] last:border-r-0 text-lg font-bold transition-all
    ${disabled
      ? "text-[#CCCCCC] cursor-not-allowed bg-white"
      : "text-[#0D0D0D] hover:bg-[#CC0000] hover:text-white active:translate-x-[2px] active:translate-y-[2px]"
    }`;

  function startEditing() {
    setDraft(String(bpm));
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  }

  function commit() {
    const val = parseInt(draft, 10);
    if (!isNaN(val)) {
      setBpm(() => Math.min(MAX_BPM, Math.max(MIN_BPM, val)));
    }
    setEditing(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") commit();
    if (e.key === "Escape") setEditing(false);
  }

  return (
    <div>
      {/* BPM Readout */}
      <div className="px-4 sm:px-6 pt-8 pb-6 text-center">
        <input
          ref={inputRef}
          type="number"
          value={editing ? draft : bpm}
          readOnly={!editing}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={onKeyDown}
          onClick={!editing ? startEditing : undefined}
          className={`w-full text-[5rem] leading-none tracking-tight tabular-nums text-center bg-transparent outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none transition-colors text-[#0D0D0D] font-black
            ${editing
              ? "border-b-4 border-[#CC0000] cursor-text"
              : "border-b-4 border-transparent hover:opacity-60 cursor-text"
            }`}
        />
        <div className="text-xs tracking-[0.3em] text-[#888888] uppercase mt-1">
          Beats per minute
        </div>
      </div>

      {/* Play / Stop */}
      <button
        className={`w-full h-16 text-xl tracking-[0.2em] uppercase font-bold transition-all border-t-3 border-[#1A1A1A] active:translate-x-[3px] active:translate-y-[3px]
          ${playing
            ? "bg-[#CC0000] text-white hover:bg-[#FF1A1A] shadow-[4px_4px_0_#8B0000]"
            : "bg-white text-[#0D0D0D] hover:bg-[#CC0000] hover:text-white shadow-[4px_4px_0_#1A1A1A] hover:shadow-[4px_4px_0_#8B0000] active:shadow-none"
          }`}
        onClick={playing ? onStop : onPlay}
      >
        {playing ? "■  Stop" : "▶  Play"}
      </button>

      {/* ± Buttons */}
      <div className="flex border-t-3 border-[#1A1A1A]">
        <button className={stepBtn(atMin)} onClick={() => setBpm((b) => Math.max(MIN_BPM, b - 10))} disabled={atMin}>−10</button>
        <button className={stepBtn(atMin)} onClick={() => setBpm((b) => Math.max(MIN_BPM, b - 1))} disabled={atMin}>−1</button>
        <button className={stepBtn(atMax)} onClick={() => setBpm((b) => Math.min(MAX_BPM, b + 1))} disabled={atMax}>+1</button>
        <button className={stepBtn(atMax)} onClick={() => setBpm((b) => Math.min(MAX_BPM, b + 10))} disabled={atMax}>+10</button>
      </div>
    </div>
  );
}
