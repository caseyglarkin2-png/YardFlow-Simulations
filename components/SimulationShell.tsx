"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Share2, Download } from "lucide-react";

import type { SimMode, SimTab } from "@/engine/simTypes";
import { getScenario } from "@/data/scenarios";
import { SimProvider, useSim } from "@/engine/simEngine";
import TimelineControls from "@/components/TimelineControls";
import EventLog from "@/components/EventLog";
import TelemetryPanel from "@/components/TelemetryPanel";
import YardScene from "@/components/canvas/YardScene";
import { downloadJson } from "@/utils/download";

function parseParam(p: unknown): string | null {
  if (typeof p === "string") return p;
  if (Array.isArray(p) && typeof p[0] === "string") return p[0];
  return null;
}

function ShellInner({
  tab,
  mode,
  facilitiesN,
  setFacilitiesN,
}: {
  tab: SimTab;
  mode: SimMode;
  facilitiesN: number;
  setFacilitiesN: (n: number) => void;
}) {
  const { state, dispatch } = useSim();
  const scenario = state.scenario;

  // Keyboard shortcuts
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          dispatch({ type: 'TOGGLE_PLAY' });
          break;
        case 'arrowleft':
          e.preventDefault();
          dispatch({ type: 'SET_TIME', timeSec: Math.max(0, state.timeSec - 5) });
          break;
        case 'arrowright':
          e.preventDefault();
          dispatch({ type: 'SET_TIME', timeSec: Math.min(scenario.durationSec, state.timeSec + 5) });
          break;
        case 'r':
          e.preventDefault();
          dispatch({ type: 'RESTART' });
          break;
        case '1':
          dispatch({ type: 'SET_SPEED', speed: 0.5 });
          break;
        case '2':
          dispatch({ type: 'SET_SPEED', speed: 1 });
          break;
        case '3':
          dispatch({ type: 'SET_SPEED', speed: 1.5 });
          break;
        case '4':
          dispatch({ type: 'SET_SPEED', speed: 2 });
          break;
      }
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [dispatch, state.timeSec, scenario.durationSec]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
      <div className="md:col-span-3">
        <EventLog log={state.log} />
      </div>

      <div className="md:col-span-6 space-y-4">
        <TimelineControls
          timeSec={state.timeSec}
          durationSec={scenario.durationSec}
          isPlaying={state.isPlaying}
          speed={state.speed}
          onTogglePlay={() => dispatch({ type: "TOGGLE_PLAY" })}
          onScrub={(t) => dispatch({ type: "SET_TIME", timeSec: t })}
          onRestart={() => dispatch({ type: "RESTART" })}
          onSpeed={(s) => dispatch({ type: "SET_SPEED", speed: s })}
        />

        {tab === "network" && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Facilities</div>
                <div className="text-xs text-slate-400">
                  Drag to watch intelligence compound (or… not).
                </div>
              </div>
              <div className="text-lg font-semibold tabular-nums">{facilitiesN}</div>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              value={facilitiesN}
              onChange={(e) => setFacilitiesN(Number(e.target.value))}
              className="mt-3 w-full accent-cyan-300"
            />
          </div>
        )}

        <YardScene scenario={scenario} timeSec={state.timeSec} log={state.log} facilitiesN={facilitiesN} />
      </div>

      <div className="md:col-span-3 space-y-4">
        <TelemetryPanel scenario={scenario} tab={tab} timeSec={state.timeSec} log={state.log} facilitiesN={facilitiesN} />
      </div>
    </div>
  );
}

export default function SimulationShell({
  initialSearchParams,
}: {
  initialSearchParams: Record<string, string | string[] | undefined>;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const initialTab = (parseParam(initialSearchParams.tab) as SimTab) || "driver";
  const initialMode = (parseParam(initialSearchParams.mode) as SimMode) || "before";
  const initialSpeed = Number(parseParam(initialSearchParams.speed) || "1");

  const [tab, setTab] = useState<SimTab>(initialTab);
  const [mode, setMode] = useState<SimMode>(initialMode);
  const [facilitiesN, setFacilitiesN] = useState<number>(12);
  const [copied, setCopied] = useState(false);

  const scenario = useMemo(() => getScenario(tab, mode), [tab, mode]);

  // keep URL in sync (shareable links)
  useEffect(() => {
    const q = new URLSearchParams();
    q.set("tab", tab);
    q.set("mode", mode);
    q.set("speed", String(initialSpeed || 1));
    router.replace(`${pathname}?${q.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, mode]);

  function shareLink() {
    const url = window.location.href;
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function exportScenario() {
    downloadJson(`${scenario.id}.json`, scenario);
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs text-cyan-200/80 font-mono tracking-widest">YARDFLOW SIMULATIONS v2</div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Before vs After: YardFlow YNS</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-300">
            Deterministic sims (state machine + events + computed telemetry). No vibes-only numbers. No truck-to-black-hole. Yes exit.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportScenario}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
          >
            <Download size={16} />
            Export config
          </button>
          <button
            onClick={shareLink}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          >
            <Share2 size={16} />
            {copied ? "Copied!" : "Copy share link"}
          </button>
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-400">
        <span className="font-semibold text-slate-300">Keyboard:</span> Space/K = play/pause • ←/→ = skip 5s • R = restart • 1-4 = speed
      </div>

      {/* tabs + mode toggle */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["driver", "ops", "network"] as SimTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-xl border px-4 py-2 text-sm capitalize transition ${
                tab === t
                  ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-100"
                  : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
              }`}
            >
              {t === "ops" ? "Facility Ops" : t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur">
          <button
            onClick={() => setMode("before")}
            className={`rounded-xl px-4 py-2 text-sm transition ${
              mode === "before" ? "bg-white/10 border border-white/10" : "text-slate-300 hover:bg-white/5"
            }`}
          >
            Before
          </button>
          <button
            onClick={() => setMode("after")}
            className={`rounded-xl px-4 py-2 text-sm transition ${
              mode === "after" ? "bg-cyan-300/10 border border-cyan-300/20 text-cyan-100" : "text-slate-300 hover:bg-white/5"
            }`}
          >
            After (YNS)
          </button>
        </div>
      </div>

      <SimProvider scenario={scenario}>
        <ShellInner tab={tab} mode={mode} facilitiesN={facilitiesN} setFacilitiesN={setFacilitiesN} />
      </SimProvider>

      <div className="mt-8 text-xs text-slate-500">
        Tip: replace the scenario timings and events in <span className="font-mono text-slate-300">data/scenarios.ts</span> with your exact workflows.
      </div>
    </div>
  );
}
