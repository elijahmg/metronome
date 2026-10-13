import { useState } from "react";
import { TIME_SIGNATURES, type TimeSig } from "./constants";
import { useMetronome } from "./hooks/useMetronome";
import { BpmControl } from "./components/BpmControl";
import { TimeSignatureSelector } from "./components/TimeSignatureSelector";
import { TrainingPanel } from "./components/TrainingPanel";
import "./index.css";

export function App() {
  const [bpm, setBpm] = useState(120);
  const [timeSig, setTimeSig] = useState<TimeSig>(TIME_SIGNATURES[2]);
  const [driftEnabled, setDriftEnabled] = useState(false);
  const [barsPerStep, setBarsPerStep] = useState(4);
  const [driftDirection, setDriftDirection] = useState<1 | -1>(1);

  const { playing, start, stop } = useMetronome({
    bpm,
    setBpm,
    timeSig,
    driftEnabled,
    barsPerStep,
    driftDirection,
  });

  return (
    <div className="min-h-screen bg-white flex items-start justify-center p-2 sm:p-6 pt-8 sm:pt-16">
      <div className="w-full max-w-sm border-3 border-[#1A1A1A] bg-white shadow-[8px_8px_0_#1A1A1A]">
        {/* Red accent bar */}
        <div className="h-2 bg-[#CC0000]" />

        {/* Header */}
        <div className="border-b-3 border-[#1A1A1A] px-4 sm:px-6 py-4">
          <h1 className="text-4xl tracking-[0.25em] uppercase text-center text-[#0D0D0D]">
            Metronome
          </h1>
        </div>

        {/* Time Signature */}
        <div className="border-b-3 border-[#1A1A1A]">
          <TimeSignatureSelector value={timeSig} onChange={setTimeSig} />
        </div>

        {/* BPM + Controls */}
        <div className="border-b-3 border-[#1A1A1A]">
          <BpmControl
            bpm={bpm}
            setBpm={setBpm}
            playing={playing}
            onPlay={start}
            onStop={stop}
          />
        </div>

        {/* Training */}
        <TrainingPanel
          enabled={driftEnabled}
          onToggle={() => setDriftEnabled((d) => !d)}
          barsPerStep={barsPerStep}
          setBarsPerStep={setBarsPerStep}
          direction={driftDirection}
          setDirection={setDriftDirection}
        />
      </div>
    </div>
  );
}

export default App;
