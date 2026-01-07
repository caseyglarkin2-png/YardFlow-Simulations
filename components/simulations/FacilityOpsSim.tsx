'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, LayoutGrid, AlertTriangle, CheckCircle2, Gauge, Wrench } from 'lucide-react';
import { SimulationShell, SimMode, SimStep, GlassPanel } from './SimulationShell';

type OpsInputs = {
  arrivalRate: number; // 0..100
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function FacilityScene({
  mode,
  stepIndex,
  inputs,
}: {
  mode: SimMode;
  stepIndex: number;
  inputs: OpsInputs;
}) {
  // Light-weight "queue visualization": dots near gate that grow/shrink by mode + arrivalRate.
  const intensity = useMemo(() => {
    const base = inputs.arrivalRate / 100;
    // before amplifies pain, after dampens
    const mult = mode === 'before' ? 1.35 : 0.65;
    // later steps show downstream impact
    const stepT = stepIndex / 5;
    return Math.max(0.05, Math.min(1, base * mult * (0.7 + stepT * 0.6)));
  }, [inputs.arrivalRate, mode, stepIndex]);

  const queueCount = Math.round(lerp(2, 16, intensity));
  const doorUtil = mode === 'before'
    ? Math.round(lerp(42, 68, 1 - intensity))
    : Math.round(lerp(68, 92, 1 - intensity * 0.5));

  return (
    <div className="relative">
      <svg viewBox="0 0 720 420" className="w-full h-[420px]">
        {/* yard floor */}
        <rect x="0" y="0" width="720" height="420" fill="rgba(255,255,255,0.00)" />
        <g opacity="0.18">
          {Array.from({ length: 22 }).map((_, i) => (
            <line key={i} x1={0} y1={i * 20} x2={720} y2={i * 20} stroke="rgba(255,255,255,0.08)" />
          ))}
          {Array.from({ length: 36 }).map((_, i) => (
            <line key={i} x1={i * 20} y1={0} x2={i * 20} y2={420} stroke="rgba(255,255,255,0.06)" />
          ))}
        </g>

        {/* buildings */}
        <g>
          {[
            { x: 140, y: 120, w: 160, h: 110 },
            { x: 360, y: 90, w: 190, h: 130 },
            { x: 260, y: 250, w: 210, h: 120 },
          ].map((b, i) => (
            <g key={i}>
              <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="14" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.15)" />
              <rect x={b.x + 18} y={b.y + b.h - 26} width={b.w - 36} height={10} rx="5" fill={mode === 'after' ? 'rgba(56,189,248,0.18)' : 'rgba(255,255,255,0.06)'} />
            </g>
          ))}
        </g>

        {/* gate + lane */}
        <g>
          <path d="M40 350 L300 215" stroke="rgba(255,255,255,0.09)" strokeWidth="26" strokeLinecap="round" />
          <path d="M50 346 L306 210" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeDasharray="8 10" />
          <rect x="285" y="188" width="60" height="40" rx="10" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.14)" />
          <path d="M270 230 L350 180" stroke={mode === 'after' ? 'rgba(56,189,248,0.35)' : 'rgba(255,255,255,0.18)'} strokeWidth="3" />
        </g>

        {/* "queue" dots */}
        <g>
          {Array.from({ length: queueCount }).map((_, i) => {
            const t = i / Math.max(1, queueCount - 1);
            const x = lerp(70, 250, t);
            const y = lerp(335, 240, t);
            const isHot = mode === 'before' && i > queueCount * 0.6;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={6}
                fill={isHot ? 'rgba(244,63,94,0.55)' : mode === 'after' ? 'rgba(56,189,248,0.55)' : 'rgba(255,255,255,0.30)'}
              />
            );
          })}
        </g>

        {/* data pulse */}
        {mode === 'after' ? (
          <motion.circle
            cx="315"
            cy="205"
            r="70"
            fill="rgba(56,189,248,0.10)"
            animate={{ opacity: [0.05, 0.18, 0.05], scale: [0.98, 1.02, 0.98] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          />
        ) : null}
      </svg>

      {/* KPI chips overlay */}
      <div className="absolute left-4 top-4">
        <GlassPanel className="p-3 w-[280px]">
          <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
            Facility Snapshot
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="text-[11px] uppercase tracking-wider text-white/60">Queue</div>
              <div className="text-lg font-semibold text-white">{queueCount} trucks</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="text-[11px] uppercase tracking-wider text-white/60">Door Util</div>
              <div className="text-lg font-semibold text-white">{doorUtil}%</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-white/70">
            Arrival load: <span className="font-semibold text-white/85">{inputs.arrivalRate}</span>/100
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

export default function FacilityOpsSim() {
  const steps: SimStep[] = [
    {
      id: 'intake',
      title: 'Intake',
      narration:
        'Before: manual intake makes the yard feel "busy" but not "productive." After: rules + digital gate create clean intake.',
      metrics: {
        before: [
          { key: 'q', label: 'Queue', value: '8–16', emphasis: 'bad' },
          { key: 'gate', label: 'Gate Cycle', value: '6–10m', emphasis: 'bad' },
          { key: 'ex', label: 'Exceptions', value: 'Late', emphasis: 'bad' },
          { key: 'rad', label: 'Radio', value: 'Hot', emphasis: 'bad' },
        ],
        after: [
          { key: 'q', label: 'Queue', value: '2–6', emphasis: 'good' },
          { key: 'gate', label: 'Gate Cycle', value: '1–3m', emphasis: 'good' },
          { key: 'ex', label: 'Exceptions', value: 'Early', emphasis: 'good' },
          { key: 'rad', label: 'Radio', value: 'Calm', emphasis: 'good' },
        ],
      },
    },
    {
      id: 'visibility',
      title: 'Yard Visibility',
      narration:
        'Before: "Where is trailer 1829?" becomes a daily hobby. After: yard inventory is a system of record.',
      metrics: {
        before: [
          { key: 'hunt', label: 'Hunt Time', value: '15–45m', emphasis: 'bad' },
          { key: 'acc', label: 'Inventory Accuracy', value: '60–75%', emphasis: 'bad' },
          { key: 'touch', label: 'Touchpoints', value: 'High', emphasis: 'bad' },
          { key: 'dwell', label: 'Dwell', value: 'Up', emphasis: 'bad' },
        ],
        after: [
          { key: 'hunt', label: 'Hunt Time', value: '<5m', emphasis: 'good' },
          { key: 'acc', label: 'Inventory Accuracy', value: '90–99%', emphasis: 'good' },
          { key: 'touch', label: 'Touchpoints', value: 'Low', emphasis: 'good' },
          { key: 'dwell', label: 'Dwell', value: 'Down', emphasis: 'good' },
        ],
      },
    },
    {
      id: 'dispatch',
      title: 'Task Dispatch',
      narration:
        'Before: radios and tribal knowledge. After: tasks are dispatched, tracked, and proven.',
      metrics: {
        before: [
          { key: 'moves', label: 'Moves/Hour', value: 'Baseline', emphasis: 'neutral' },
          { key: 'miss', label: 'Missed Priorities', value: 'Common', emphasis: 'bad' },
          { key: 'rework', label: 'Rework', value: 'High', emphasis: 'bad' },
          { key: 'sla', label: 'SLA', value: 'Fragile', emphasis: 'bad' },
        ],
        after: [
          { key: 'moves', label: 'Moves/Hour', value: '+10–25%', emphasis: 'good' },
          { key: 'miss', label: 'Missed Priorities', value: 'Rare', emphasis: 'good' },
          { key: 'rework', label: 'Rework', value: 'Low', emphasis: 'good' },
          { key: 'sla', label: 'SLA', value: 'Stable', emphasis: 'good' },
        ],
      },
    },
    {
      id: 'doors',
      title: 'Doors',
      narration:
        'Before: trucks queue while doors idle. After: readiness + assignment reduce dead time.',
      metrics: {
        before: [
          { key: 'util', label: 'Door Util', value: '45–70%', emphasis: 'bad' },
          { key: 'idle', label: 'Idle Doors', value: 'Yes', emphasis: 'bad' },
          { key: 'dwell', label: 'Avg Dwell', value: '2–4h', emphasis: 'bad' },
          { key: 'cost', label: 'Detention', value: '$$', emphasis: 'bad' },
        ],
        after: [
          { key: 'util', label: 'Door Util', value: '75–92%', emphasis: 'good' },
          { key: 'idle', label: 'Idle Doors', value: 'Rare', emphasis: 'good' },
          { key: 'dwell', label: 'Avg Dwell', value: '1–2.5h', emphasis: 'good' },
          { key: 'cost', label: 'Detention', value: '$', emphasis: 'good' },
        ],
      },
    },
    {
      id: 'exceptions',
      title: 'Exceptions',
      narration:
        'Before: exceptions are discovered late. After: exceptions are detected, routed, and measured.',
      metrics: {
        before: [
          { key: 'late', label: 'Discovery', value: 'Late', emphasis: 'bad' },
          { key: 'blast', label: 'Blast Radius', value: 'Large', emphasis: 'bad' },
          { key: 'rework', label: 'Rework', value: 'High', emphasis: 'bad' },
          { key: 'stress', label: 'Stress', value: 'High', emphasis: 'bad' },
        ],
        after: [
          { key: 'late', label: 'Discovery', value: 'Early', emphasis: 'good' },
          { key: 'blast', label: 'Blast Radius', value: 'Small', emphasis: 'good' },
          { key: 'rework', label: 'Rework', value: 'Low', emphasis: 'good' },
          { key: 'stress', label: 'Stress', value: 'Lower', emphasis: 'good' },
        ],
      },
    },
    {
      id: 'outcome',
      title: 'Outcome',
      narration:
        'This is what "flow" actually means: fewer touches, fewer surprises, more throughput with the same (or less) chaos.',
      metrics: {
        before: [
          { key: 'kpi', label: 'Throughput', value: 'Capped', emphasis: 'bad' },
          { key: 'labor', label: 'Labor', value: 'Overrun', emphasis: 'bad' },
          { key: 'sla', label: 'On-Time', value: 'Variable', emphasis: 'bad' },
          { key: 'data', label: 'Data', value: 'Thin', emphasis: 'bad' },
        ],
        after: [
          { key: 'kpi', label: 'Throughput', value: 'Higher', emphasis: 'good' },
          { key: 'labor', label: 'Labor', value: 'Controlled', emphasis: 'good' },
          { key: 'sla', label: 'On-Time', value: 'Improved', emphasis: 'good' },
          { key: 'data', label: 'Data', value: 'Rich', emphasis: 'good' },
        ],
      },
    },
  ];

  const [mode, setMode] = useState<SimMode>('before');
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [arrivalRate, setArrivalRate] = useState(70);

  useEffect(() => {
    if (!isPlaying) return;
    const t = setInterval(() => setStepIndex((i) => (i + 1) % steps.length), 2400);
    return () => clearInterval(t);
  }, [isPlaying, steps.length]);

  return (
    <SimulationShell
      title="Facility Operations"
      description="A yard-level simulation that shows why digital gate + visibility + dispatch changes the entire operating system."
      steps={steps}
      stepIndex={stepIndex}
      setStepIndex={setStepIndex}
      mode={mode}
      setMode={setMode}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
      onReset={() => {
        setIsPlaying(false);
        setStepIndex(0);
        setMode('before');
        setArrivalRate(70);
      }}
      leftVisual={<FacilityScene mode={mode} stepIndex={stepIndex} inputs={{ arrivalRate }} />}
      rightVisual={
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
            Controls
          </div>

          <div className="mt-3 space-y-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="flex items-center justify-between text-white/85">
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4" />
                  <div className="text-sm font-semibold">Arrival Load</div>
                </div>
                <div className="text-xs text-white/70">{arrivalRate}/100</div>
              </div>
              <input
                className="mt-2 w-full accent-white"
                type="range"
                min={10}
                max={100}
                value={arrivalRate}
                onChange={(e) => setArrivalRate(parseInt(e.target.value, 10))}
              />
              <div className="mt-1 text-xs text-white/65">
                Crank it up to simulate peak days (aka: when spreadsheets start crying).
              </div>
            </div>

            <GlassPanel className="p-3">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Radio Reliance', Icon: Radio, bad: true },
                  { label: 'Yard Map', Icon: LayoutGrid, bad: false },
                  { label: 'Exceptions', Icon: AlertTriangle, bad: true },
                  { label: 'Auto Flow', Icon: CheckCircle2, bad: false },
                ].map(({ label, Icon, bad }) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <div className="flex items-center gap-2 text-white/85">
                      <Icon className="h-4 w-4" />
                      <div className="text-sm font-semibold">{label}</div>
                    </div>
                    <div className="mt-1 text-xs text-white/70">
                      {mode === 'before'
                        ? bad
                          ? 'Spiking'
                          : 'Limited'
                        : bad
                        ? 'Down'
                        : 'Active'}
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="flex items-center gap-2 text-white/85">
                <Wrench className="h-4 w-4" />
                <div className="text-sm font-semibold">Ops takeaway</div>
              </div>
              <div className="mt-1 text-sm text-white/75">
                YardFlow doesn't "add a tool." It replaces the duct tape.
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}
