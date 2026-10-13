import { TIME_SIGNATURES, type TimeSig } from "../constants";

interface Props {
  value: TimeSig;
  onChange: (ts: TimeSig) => void;
}

export function TimeSignatureSelector({ value, onChange }: Props) {
  return (
    <div className="px-4 sm:px-6 py-4">
      <div className="text-[10px] tracking-[0.3em] text-[#888888] uppercase mb-3">
        Time Signature
      </div>
      <div className="flex gap-2 flex-wrap">
        {TIME_SIGNATURES.map((ts) => (
          <button
            key={ts.label}
            onClick={() => onChange(ts)}
            className={`px-3 py-1 text-sm tracking-wide border-2 font-bold transition-all active:translate-x-[3px] active:translate-y-[3px]
              ${value.label === ts.label
                ? "bg-[#CC0000] text-white border-[#CC0000] shadow-[3px_3px_0_#8B0000]"
                : "bg-white text-[#0D0D0D] border-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A] hover:bg-[#CC0000] hover:text-white hover:border-[#CC0000] hover:shadow-[3px_3px_0_#8B0000] active:shadow-none"
              }`}
          >
            {ts.label}
          </button>
        ))}
      </div>
    </div>
  );
}
