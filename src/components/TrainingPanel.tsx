interface Props {
  enabled: boolean;
  onToggle: () => void;
  barsPerStep: number;
  setBarsPerStep: (fn: (b: number) => number) => void;
  direction: 1 | -1;
  setDirection: (d: 1 | -1) => void;
}

export function TrainingPanel({
  enabled,
  onToggle,
  barsPerStep,
  setBarsPerStep,
  direction,
  setDirection,
}: Props) {
  return (
    <div>
      {/* Toggle row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-[#F5F5F5] transition-all active:translate-x-[2px] active:translate-y-[2px]"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#888888]">
          Training Mode
        </span>
        <span
          className={`text-xs tracking-widest font-bold transition-colors ${
            enabled ? "text-[#CC0000]" : "text-[#CCCCCC]"
          }`}
        >
          {enabled ? "ON" : "OFF"}
        </span>
      </button>

      {/* Expanded controls */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${enabled ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="border-t-3 border-[#1A1A1A]">
            {/* Bars per step */}
            <div className="flex items-center border-b-3 border-[#1A1A1A]">
              <div className="px-4 sm:px-6 py-3 flex-1">
                <div className="text-[10px] tracking-[0.3em] text-[#888888] uppercase">
                  Bars per step
                </div>
                <div className="text-2xl tabular-nums mt-0.5 text-[#0D0D0D] font-black">{barsPerStep}</div>
              </div>
              <div className="flex border-l-3 border-[#1A1A1A] h-full">
                <button
                  className="w-12 h-full text-xl border-r-3 border-[#1A1A1A] text-[#0D0D0D] hover:bg-[#CC0000] hover:text-white transition-all flex items-center justify-center py-3 active:translate-x-[2px] active:translate-y-[2px]"
                  onClick={() => setBarsPerStep((b) => Math.max(1, b - 1))}
                >
                  −
                </button>
                <button
                  className="w-12 h-full text-xl text-[#0D0D0D] hover:bg-[#CC0000] hover:text-white transition-all flex items-center justify-center py-3 active:translate-x-[2px] active:translate-y-[2px]"
                  onClick={() => setBarsPerStep((b) => b + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Direction */}
            <div className="flex">
              {([1, -1] as const).map((d, i) => (
                <button
                  key={d}
                  onClick={() => setDirection(d)}
                  className={`flex-1 py-3 text-xs tracking-[0.2em] uppercase font-bold transition-all active:translate-x-[2px] active:translate-y-[2px]
                    ${i === 0 ? "border-r-3 border-[#1A1A1A]" : ""}
                    ${direction === d
                      ? "bg-[#CC0000] text-white"
                      : "bg-white text-[#888888] hover:bg-[#F5F5F5] hover:text-[#0D0D0D]"
                    }`}
                >
                  {d === 1 ? "Increasing" : "Decreasing"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
