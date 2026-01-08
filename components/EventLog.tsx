"use client";

import type { SimEvent } from "@/engine/simTypes";
import { fmtClock } from "@/utils/format";

function badgeClass(sev?: string) {
  switch (sev) {
    case "good":
      return "bg-emerald-400/15 text-emerald-200 border-emerald-400/20";
    case "warn":
      return "bg-amber-400/15 text-amber-200 border-amber-400/20";
    case "bad":
      return "bg-rose-400/15 text-rose-200 border-rose-400/20";
    default:
      return "bg-white/10 text-slate-200 border-white/10";
  }
}

export default function EventLog({ log }: { log: SimEvent[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide">Live Event Log</h3>
        <span className="text-xs text-slate-400">{log.length} events</span>
      </div>

      <div className="max-h-[50vh] space-y-2 overflow-auto pr-1 md:max-h-[70vh]">
        {log.length === 0 ? (
          <div className="text-sm text-slate-400">Press play. The yard awaits.</div>
        ) : (
          log
            .slice()
            .reverse()
            .map((e) => (
              <div
                key={e.id}
                className="flex items-start gap-2 rounded-xl border border-white/10 bg-black/20 p-2"
              >
                <div className="w-12 shrink-0 text-xs text-slate-400 tabular-nums">
                  {fmtClock(e.t)}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-slate-100">{e.label}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {e.actorId && (
                      <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-300">
                        {e.actorId}
                      </span>
                    )}
                    {e.doorId && (
                      <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-300">
                        {e.doorId}
                      </span>
                    )}
                    {e.touchpoint && (
                      <span className="rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-2 py-0.5 text-[11px] text-cyan-200">
                        touchpoint
                      </span>
                    )}
                    <span className={`rounded-lg border px-2 py-0.5 text-[11px] ${badgeClass(e.severity)}`}>
                      {e.type}
                    </span>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
