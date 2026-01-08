"use client";

import { Play, Pause, RotateCcw } from "lucide-react";
import { fmtClock } from "@/utils/format";

export default function TimelineControls({
  timeSec,
  durationSec,
  isPlaying,
  speed,
  onTogglePlay,
  onScrub,
  onRestart,
  onSpeed,
}: {
  timeSec: number;
  durationSec: number;
  isPlaying: boolean;
  speed: number;
  onTogglePlay: () => void;
  onScrub: (t: number) => void;
  onRestart: () => void;
  onSpeed: (s: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          >
            <RotateCcw size={16} />
            Restart
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-300">Speed</span>
          <select
            value={speed}
            onChange={(e) => onSpeed(Number(e.target.value))}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="w-14 text-xs text-slate-300 tabular-nums">{fmtClock(timeSec)}</span>
        <input
          type="range"
          min={0}
          max={durationSec}
          step={0.1}
          value={timeSec}
          onChange={(e) => onScrub(Number(e.target.value))}
          className="w-full accent-cyan-300"
        />
        <span className="w-14 text-xs text-slate-300 text-right tabular-nums">{fmtClock(durationSec)}</span>
      </div>
    </div>
  );
}
