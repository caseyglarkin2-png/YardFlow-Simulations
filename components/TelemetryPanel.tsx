"use client";

import type { Scenario, SimTab } from "@/engine/simTypes";
import { driverMetrics, networkMetrics, opsMetrics } from "@/engine/metrics";
import { fmtHMS, fmtMoneyM } from "@/utils/format";

function Card({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="mt-1 text-lg font-semibold tracking-tight">{value}</div>
      {hint ? <div className="mt-1 text-xs text-slate-400">{hint}</div> : null}
    </div>
  );
}

export default function TelemetryPanel({
  scenario,
  tab,
  timeSec,
  log,
  facilitiesN,
}: {
  scenario: Scenario;
  tab: SimTab;
  timeSec: number;
  log: any[];
  facilitiesN: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide">Telemetry</h3>
        <span className="text-xs text-slate-400">{scenario.mode.toUpperCase()}</span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {tab === "driver" && (() => {
          const m = driverMetrics(scenario, timeSec, log);
          return (
            <>
              <Card label="Gate Time" value={fmtHMS(m.gateTimeSec)} hint={m.completed ? "arrive → assigned" : "in progress"} />
              <Card label="Total Dwell" value={fmtHMS(m.dwellSec)} hint={m.completed ? "arrive → exit road" : "so far"} />
              <Card label="Driver Touchpoints" value={`${m.touchpoints}`} hint="count of human interactions" />
              <Card
                label="Detention Risk"
                value={m.detentionRisk ? "HIGH" : "LOW"}
                hint="illustrative threshold at 4+ hours"
              />
            </>
          );
        })()}

        {tab === "ops" && (() => {
          const m = opsMetrics(scenario, timeSec, log);
          return (
            <>
              <Card label="Queueing Trucks" value={`${m.queueing}`} hint="queued and not assigned" />
              <Card label="Door Utilization" value={`${m.doorUtilPct}%`} hint="occupied doors / total doors" />
              <Card label="Moves / Hour" value={`${m.movesPerHour}`} hint="spotter moves rate" />
              <Card label="Exceptions" value={`${m.exceptions}`} hint="issues surfaced" />
              <Card label="Avg Dwell" value={fmtHMS(m.avgDwellSec)} hint="avg across trucks (to now)" />
            </>
          );
        })()}

        {tab === "network" && (() => {
          const m = networkMetrics(scenario.mode, facilitiesN);
          return (
            <>
              <Card label="Facilities in Network" value={`${m.N}`} hint="slider-driven" />
              <Card label="ETA Accuracy" value={`${Math.round(m.etaAccuracy * 100)}%`} hint="saturation curve" />
              <Card label="Avg Dwell" value={`${Math.round(m.avgDwellMins)} min`} hint="modeled" />
              <Card label="Turn Index" value={`${m.turnIndex.toFixed(2)}x`} hint="modeled productivity" />
              <Card label="Cash Released" value={fmtMoneyM(m.cashReleasedM)} hint="dwell reduction × sites" />
            </>
          );
        })()}
      </div>

      {scenario.assumptions?.length ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3">
          <div className="text-xs font-semibold text-slate-200">Assumptions</div>
          <ul className="mt-2 space-y-1 text-xs text-slate-400">
            {scenario.assumptions.map((a) => (
              <li key={a.label}>
                <span className="text-slate-300">{a.label}:</span> {a.value}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
