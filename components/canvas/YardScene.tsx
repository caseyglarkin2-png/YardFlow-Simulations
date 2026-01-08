"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ActorMotion, Scenario, SimActor, Point } from "@/engine/simTypes";
import { isDoorOccupied, networkMetrics } from "@/engine/metrics";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
function interpPoint(from: Point, to: Point, t: number, ease?: "linear" | "easeInOut") {
  const tt = ease === "easeInOut" ? easeInOut(t) : t;
  return { x: lerp(from.x, to.x, tt), y: lerp(from.y, to.y, tt) };
}

function positionFor(actorId: string, motions: ActorMotion[] | undefined, timeSec: number) {
  const m = motions?.find((mm) => mm.actorId === actorId);
  if (!m || m.segments.length === 0) return { x: 80, y: 360 };

  const seg =
    m.segments.find((s) => timeSec >= s.t0 && timeSec <= s.t1) ??
    (timeSec < m.segments[0].t0 ? m.segments[0] : m.segments[m.segments.length - 1]);

  if (seg.t1 - seg.t0 <= 1e-6) return seg.to;
  const t = Math.max(0, Math.min(1, (timeSec - seg.t0) / (seg.t1 - seg.t0)));
  return interpPoint(seg.from, seg.to, t, seg.ease);
}

function TruckGlyph({ x, y, mode }: { x: number; y: number; mode: "before" | "after" }) {
  const stroke = mode === "after" ? "rgba(0,255,194,0.55)" : "rgba(255,255,255,0.35)";
  const fill = mode === "after" ? "rgba(0,255,194,0.12)" : "rgba(255,255,255,0.06)";
  return (
    <g transform={`translate(${x},${y})`}>
      {/* trailer */}
      <rect x={-34} y={-12} width={44} height={24} rx={6} fill={fill} stroke={stroke} strokeWidth={2} />
      {/* cab */}
      <rect x={12} y={-10} width={22} height={20} rx={6} fill={fill} stroke={stroke} strokeWidth={2} />
      <circle cx={-18} cy={14} r={4} fill={stroke} opacity={0.6} />
      <circle cx={20} cy={14} r={4} fill={stroke} opacity={0.6} />
    </g>
  );
}

function SpotterGlyph({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-10} y={-8} width={20} height={16} rx={5} fill="rgba(64,160,255,0.10)" stroke="rgba(64,160,255,0.55)" strokeWidth={2} />
      <circle cx={-6} cy={10} r={3} fill="rgba(64,160,255,0.6)" />
      <circle cx={6} cy={10} r={3} fill="rgba(64,160,255,0.6)" />
    </g>
  );
}

function DoorBox({
  id,
  label,
  at,
  occupied,
  after,
}: {
  id: string;
  label: string;
  at: Point;
  occupied: boolean;
  after: boolean;
}) {
  const stroke = after ? "rgba(0,255,194,0.45)" : "rgba(255,255,255,0.25)";
  const occ = occupied ? (after ? "rgba(0,255,194,0.18)" : "rgba(255,170,0,0.16)") : "rgba(255,255,255,0.04)";
  return (
    <g transform={`translate(${at.x},${at.y})`}>
      <rect x={-60} y={-26} width={120} height={52} rx={14} fill={occ} stroke={stroke} strokeWidth={2} />
      <text x={0} y={-3} textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.85)" fontFamily="ui-monospace, SFMono-Regular">
        {label}
      </text>
      <text x={0} y={14} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.5)" fontFamily="ui-monospace, SFMono-Regular">
        {occupied ? "OCCUPIED" : "IDLE"}
      </text>
      <text x={-48} y={-10} fontSize="10" fill="rgba(255,255,255,0.4)" fontFamily="ui-monospace, SFMono-Regular">
        {id}
      </text>
    </g>
  );
}

function NetworkScene({
  mode,
  facilitiesN,
  timeSec,
}: {
  mode: "before" | "after";
  facilitiesN: number;
  timeSec: number;
}) {
  const reduce = useReducedMotion();
  const m = networkMetrics(mode, facilitiesN);

  const cols = 6;
  const rows = 5;
  const total = cols * rows;
  const active = Math.min(total, m.N);

  const pulse = reduce ? 0 : (Math.sin(timeSec * 2.2) + 1) / 2; // 0..1

  const nodeStroke = mode === "after" ? "rgba(0,255,194,0.5)" : "rgba(255,255,255,0.25)";
  const nodeFillOn = mode === "after" ? `rgba(0,255,194,${0.10 + 0.12 * pulse})` : `rgba(255,255,255,${0.04 + 0.06 * pulse})`;
  const nodeFillOff = "rgba(255,255,255,0.03)";

  return (
    <svg viewBox="0 0 1000 600" className="h-full w-full">
      <defs>
        <radialGradient id="glow" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor={mode === "after" ? "rgba(0,255,194,0.20)" : "rgba(255,255,255,0.10)"} />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="1000" height="600" fill="rgba(0,0,0,0)" />
      <circle cx="500" cy="280" r="300" fill="url(#glow)" />

      {/* links */}
      {mode === "after" &&
        Array.from({ length: active }).map((_, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          const x = 190 + c * 130;
          const y = 140 + r * 90;
          if (i === 0) return null;
          const p = Math.max(0, i - 1);
          const pr = Math.floor(p / cols);
          const pc = p % cols;
          const x2 = 190 + pc * 130;
          const y2 = 140 + pr * 90;

          return (
            <line
              key={`l-${i}`}
              x1={x2}
              y1={y2}
              x2={x}
              y2={y}
              stroke={`rgba(0,255,194,${0.08 + 0.18 * pulse})`}
              strokeWidth={2}
            />
          );
        })}

      {/* nodes */}
      {Array.from({ length: total }).map((_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const x = 190 + c * 130;
        const y = 140 + r * 90;
        const on = i < active;

        return (
          <g key={i} transform={`translate(${x},${y})`}>
            <circle r={18} fill={on ? nodeFillOn : nodeFillOff} stroke={nodeStroke} strokeWidth={2} />
            <circle r={6} fill={on ? nodeStroke : "rgba(255,255,255,0.12)"} opacity={0.8} />
          </g>
        );
      })}

      <text x="40" y="560" fontSize="12" fill="rgba(255,255,255,0.55)" fontFamily="ui-monospace, SFMono-Regular">
        {mode === "after" ? "Shared protocol pulses across nodes → predictability compounds." : "Isolated yards → no compounding intelligence."}
      </text>
    </svg>
  );
}

export default function YardScene({
  scenario,
  timeSec,
  log,
  facilitiesN,
}: {
  scenario: Scenario;
  timeSec: number;
  log: any[];
  facilitiesN: number;
}) {
  const reduce = useReducedMotion();

  if (scenario.tab === "network") {
    return <NetworkScene mode={scenario.mode} facilitiesN={facilitiesN} timeSec={timeSec} />;
  }

  const after = scenario.mode === "after";
  const route = scenario.routeHint ?? [];

  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/20 md:h-[520px]">
      <div className="absolute inset-0 bg-grid opacity-60" />
      <svg viewBox="0 0 1000 600" className="relative h-full w-full">
        {/* yard base */}
        <rect x="40" y="120" width="920" height="420" rx="26" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" strokeWidth={2} />

        {/* road */}
        <path
          d="M60 360 L940 360"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth={10}
          strokeLinecap="round"
        />
        <path d="M60 360 L940 360" stroke="rgba(255,255,255,0.20)" strokeWidth={2} strokeDasharray="10 12" />

        {/* gate */}
        <rect x="205" y="330" width="50" height="60" rx="12" fill="rgba(0,0,0,0)" stroke={after ? "rgba(0,255,194,0.35)" : "rgba(255,255,255,0.22)"} strokeWidth={2} />
        <text x="230" y="325" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.55)" fontFamily="ui-monospace, SFMono-Regular">
          GATE
        </text>

        {/* route hint (after mode) */}
        {after && route.length >= 2 && !reduce && (
          <motion.path
            d={route
              .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
              .join(" ")}
            fill="none"
            stroke="rgba(0,255,194,0.30)"
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        )}

        {/* dock zone */}
        <rect x="690" y="140" width="250" height="380" rx="22" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" strokeWidth={2} />
        <text x="815" y="132" textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.55)" fontFamily="ui-monospace, SFMono-Regular">
          DOCKS
        </text>

        {/* doors */}
        {(scenario.doors ?? []).map((d) => (
          <DoorBox
            key={d.id}
            id={d.id}
            label={d.label}
            at={d.at}
            occupied={isDoorOccupied(log, d.id, timeSec)}
            after={after}
          />
        ))}

        {/* actors */}
        {scenario.actors.map((a: SimActor) => {
          const pos = positionFor(a.id, scenario.motions, timeSec);
          if (a.kind === "spotter") return <SpotterGlyph key={a.id} x={pos.x} y={pos.y} />;
          return <TruckGlyph key={a.id} x={pos.x} y={pos.y} mode={scenario.mode} />;
        })}

        {/* labels */}
        <text x="60" y="150" fontSize="12" fill="rgba(255,255,255,0.5)" fontFamily="ui-monospace, SFMono-Regular">
          {scenario.title}
        </text>
        <text x="60" y="170" fontSize="11" fill="rgba(255,255,255,0.35)" fontFamily="ui-sans-serif, system-ui">
          {scenario.description}
        </text>
      </svg>
    </div>
  );
}
