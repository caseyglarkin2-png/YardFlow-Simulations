'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, ScanLine, ShieldCheck, MapPin, Truck, FileCheck2 } from 'lucide-react';
import { SimulationShell, SimMode, SimStep, GlassPanel } from './SimulationShell';

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function DriverScene({
  mode,
  stepIndex,
}: {
  mode: SimMode;
  stepIndex: number;
}) {
  // Simple "truck along a path" animation targets per step.
  const targets = useMemo(() => {
    const before = [
      { x: 20, y: 210, glow: 0.15, phone: false }, // arrival
      { x: 90, y: 190, glow: 0.05, phone: false }, // queue
      { x: 120, y: 165, glow: 0.05, phone: false }, // confusion
      { x: 180, y: 150, glow: 0.05, phone: false }, // wrong turn
      { x: 220, y: 120, glow: 0.05, phone: false }, // waiting
      { x: 300, y: 95, glow: 0.05, phone: false }, // checkout
    ];

    const after = [
      { x: 20, y: 210, glow: 0.18, phone: true },
      { x: 115, y: 178, glow: 0.28, phone: true },
      { x: 170, y: 150, glow: 0.35, phone: true },
      { x: 220, y: 122, glow: 0.40, phone: true },
      { x: 265, y: 105, glow: 0.45, phone: true },
      { x: 320, y: 88, glow: 0.55, phone: true },
    ];

    return mode === 'before' ? before : after;
  }, [mode]);

  const t = targets[clamp(stepIndex, 0, targets.length - 1)];

  return (
    <div className="relative">
      {/* Isometric-ish "yard gate" sketch (SVG) */}
      <svg viewBox="0 0 520 340" className="w-full h-[420px]">
        <defs>
          <linearGradient id="road" x1="0" x2="1">
            <stop offset="0" stopColor="rgba(255,255,255,0.06)" />
            <stop offset="1" stopColor="rgba(255,255,255,0.02)" />
          </linearGradient>
          <radialGradient id="pulse" cx="50%" cy="50%" r="55%">
            <stop offset="0" stopColor="rgba(56,189,248,0.35)" />
            <stop offset="1" stopColor="rgba(56,189,248,0)" />
          </radialGradient>
        </defs>

        {/* background grid */}
        <g opacity="0.18">
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={i} x1={0} y1={i * 20} x2={520} y2={i * 20} stroke="rgba(255,255,255,0.08)" />
          ))}
          {Array.from({ length: 26 }).map((_, i) => (
            <line key={i} x1={i * 20} y1={0} x2={i * 20} y2={340} stroke="rgba(255,255,255,0.06)" />
          ))}
        </g>

        {/* road */}
        <path
          d="M40 260 L380 80"
          stroke="url(#road)"
          strokeWidth="26"
          strokeLinecap="round"
        />
        <path d="M55 252 L392 72" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeDasharray="8 10" />

        {/* gate */}
        <g>
          <rect x="285" y="72" width="70" height="42" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.14)" />
          <rect x="302" y="84" width="36" height="18" rx="4" fill="rgba(56,189,248,0.10)" stroke="rgba(56,189,248,0.25)" />
          <path d="M270 116 L360 66" stroke="rgba(255,255,255,0.18)" strokeWidth="3" />
        </g>

        {/* pulse glow at gate for "after" */}
        <circle
          cx="320"
          cy="92"
          r={66}
          fill="url(#pulse)"
          opacity={mode === 'after' ? t.glow : 0.06}
        />
      </svg>

      {/* Truck token */}
      <motion.div
        className="absolute"
        animate={{ x: t.x, y: t.y }}
        transition={{ type: 'spring', stiffness: 140, damping: 18 }}
        style={{ left: 60, top: 40 }}
      >
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
          <Truck className="h-5 w-5 text-white/85" />
          <div className="text-xs font-semibold text-white/85">Driver</div>
        </div>
      </motion.div>

      {/* Phone overlay in "after" */}
      {t.phone ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="absolute right-4 top-4"
        >
          <GlassPanel className="w-[280px] p-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
                YardFlow Mobile
              </div>
              <Smartphone className="h-4 w-4 text-white/60" />
            </div>
            <div className="mt-3 space-y-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center gap-2 text-white/85">
                  <ScanLine className="h-4 w-4" />
                  <div className="text-sm font-semibold">QR / Geofence Check-in</div>
                </div>
                <div className="mt-1 text-xs text-white/70">
                  Verified appointment + equipment. Instructions unlocked.
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center gap-2 text-white/85">
                  <MapPin className="h-4 w-4" />
                  <div className="text-sm font-semibold">Route</div>
                </div>
                <div className="mt-1 text-xs text-white/70">
                  Door 42 → Lane B → Spot 17 (live updates)
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center gap-2 text-white/85">
                  <FileCheck2 className="h-4 w-4" />
                  <div className="text-sm font-semibold">Digital Checkout</div>
                </div>
                <div className="mt-1 text-xs text-white/70">
                  Proof captured. Outgate is automatic.
                </div>
              </div>
            </div>
          </GlassPanel>
        </motion.div>
      ) : null}
    </div>
  );
}

export default function DriverCheckInOutSim() {
  const steps: SimStep[] = [
    {
      id: 'arrival',
      title: 'Arrival',
      subtitle: 'The first 90 seconds decide the next 90 minutes.',
      narration:
        'Driver rolls up with partial info and full optimism. The yard has… "a process."',
      callouts: [{ title: 'Signal', body: 'Do we know who this is and why they are here?' }],
      metrics: {
        before: [
          { key: 'gate', label: 'Gate Time', value: '18–35m', emphasis: 'bad' },
          { key: 'dwell', label: 'Total Dwell', value: '2.6h', emphasis: 'bad' },
          { key: 'touch', label: 'Touchpoints', value: '6–10', emphasis: 'bad' },
          { key: 'risk', label: 'Detention Risk', value: 'High', emphasis: 'bad' },
        ],
        after: [
          { key: 'gate', label: 'Gate Time', value: '2–5m', delta: '-80%+', emphasis: 'good' },
          { key: 'dwell', label: 'Total Dwell', value: '1.5h', delta: '-40%+', emphasis: 'good' },
          { key: 'touch', label: 'Touchpoints', value: '1–2', delta: '-70%+', emphasis: 'good' },
          { key: 'risk', label: 'Detention Risk', value: 'Low', emphasis: 'good' },
        ],
      },
    },
    {
      id: 'checkin',
      title: 'Gate Check-in',
      narration:
        'Before: paper, questions, re-questions. After: QR/geofence + rules-based verification.',
      callouts: [{ title: 'Rule', body: 'If appointment matches + equipment validated → auto-admit.' }],
      metrics: {
        before: [
          { key: 'gate', label: 'Gate Time', value: '25m', emphasis: 'bad' },
          { key: 'queue', label: 'Queue Length', value: '8 trucks', emphasis: 'bad' },
          { key: 'calls', label: 'Calls', value: '2', emphasis: 'bad' },
          { key: 'errors', label: 'Rework', value: 'Common', emphasis: 'bad' },
        ],
        after: [
          { key: 'gate', label: 'Gate Time', value: '3m', emphasis: 'good' },
          { key: 'queue', label: 'Queue Length', value: '2 trucks', emphasis: 'good' },
          { key: 'calls', label: 'Calls', value: '0', emphasis: 'good' },
          { key: 'errors', label: 'Rework', value: 'Rare', emphasis: 'good' },
        ],
      },
    },
    {
      id: 'routing',
      title: 'Routing',
      narration:
        'Before: "go over there and ask." After: door/lane/spot assigned and updated live.',
      metrics: {
        before: [
          { key: 'turns', label: 'Wrong Turns', value: '1–2', emphasis: 'bad' },
          { key: 'touch', label: 'Touchpoints', value: '3', emphasis: 'bad' },
          { key: 'time', label: 'Time Lost', value: '15–30m', emphasis: 'bad' },
          { key: 'conf', label: 'Confidence', value: 'Low', emphasis: 'bad' },
        ],
        after: [
          { key: 'turns', label: 'Wrong Turns', value: '0', emphasis: 'good' },
          { key: 'touch', label: 'Touchpoints', value: '1', emphasis: 'good' },
          { key: 'time', label: 'Time Lost', value: '<5m', emphasis: 'good' },
          { key: 'conf', label: 'Confidence', value: 'High', emphasis: 'good' },
        ],
      },
    },
    {
      id: 'door',
      title: 'Door / Staging',
      narration:
        'Before: door availability is a rumor. After: readiness, dwell, and exceptions are visible.',
      metrics: {
        before: [
          { key: 'idle', label: 'Door Idle', value: 'High', emphasis: 'bad' },
          { key: 'wait', label: 'Wait', value: '45m', emphasis: 'bad' },
          { key: 'ex', label: 'Exceptions', value: 'Late', emphasis: 'bad' },
          { key: 'stress', label: 'Stress', value: 'Spicy', emphasis: 'bad' },
        ],
        after: [
          { key: 'idle', label: 'Door Idle', value: 'Low', emphasis: 'good' },
          { key: 'wait', label: 'Wait', value: '10m', emphasis: 'good' },
          { key: 'ex', label: 'Exceptions', value: 'Early', emphasis: 'good' },
          { key: 'stress', label: 'Stress', value: 'Chill-ish', emphasis: 'good' },
        ],
      },
    },
    {
      id: 'status',
      title: 'Live Status',
      narration:
        'Before: no updates. After: driver gets state changes like a boarding pass.',
      metrics: {
        before: [
          { key: 'eta', label: 'ETA Certainty', value: 'Low', emphasis: 'bad' },
          { key: 'texts', label: 'Texts', value: '3–5', emphasis: 'bad' },
          { key: 'risk', label: 'Detention Risk', value: 'High', emphasis: 'bad' },
          { key: 'idle', label: 'Idle Time', value: '60m', emphasis: 'bad' },
        ],
        after: [
          { key: 'eta', label: 'ETA Certainty', value: 'High', emphasis: 'good' },
          { key: 'texts', label: 'Texts', value: '0–1', emphasis: 'good' },
          { key: 'risk', label: 'Detention Risk', value: 'Low', emphasis: 'good' },
          { key: 'idle', label: 'Idle Time', value: '15m', emphasis: 'good' },
        ],
      },
    },
    {
      id: 'checkout',
      title: 'Checkout',
      narration:
        'Before: one more line, one more mismatch, one more delay. After: proof captured → outgate.',
      callouts: [{ title: 'Outcome', body: 'Fewer minutes parked = more turns per week.' }],
      metrics: {
        before: [
          { key: 'exit', label: 'Exit Time', value: '12m', emphasis: 'bad' },
          { key: 'mismatch', label: 'BOL Issues', value: 'Sometimes', emphasis: 'bad' },
          { key: 'turn', label: 'Turn Predictability', value: 'Low', emphasis: 'bad' },
          { key: 'cost', label: 'Detention Cost', value: '$$', emphasis: 'bad' },
        ],
        after: [
          { key: 'exit', label: 'Exit Time', value: '2m', emphasis: 'good' },
          { key: 'mismatch', label: 'BOL Issues', value: 'Rare', emphasis: 'good' },
          { key: 'turn', label: 'Turn Predictability', value: 'High', emphasis: 'good' },
          { key: 'cost', label: 'Detention Cost', value: '$', emphasis: 'good' },
        ],
      },
    },
  ];

  const [mode, setMode] = useState<SimMode>('before');
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const t = setInterval(() => {
      setStepIndex((i) => (i + 1) % steps.length);
    }, 2400);
    return () => clearInterval(t);
  }, [isPlaying, steps.length]);

  return (
    <SimulationShell
      title="Driver Check-in / Check-out"
      description="A before/after simulation that makes the driver experience (and detention risk) painfully obvious."
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
      }}
      leftVisual={<DriverScene mode={mode} stepIndex={stepIndex} />}
      rightVisual={
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
            Modules shown
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              { label: 'Digital Gate', Icon: ShieldCheck },
              { label: 'QR / Geofence', Icon: ScanLine },
              { label: 'Live Routing', Icon: MapPin },
              { label: 'Proof + Outgate', Icon: FileCheck2 },
            ].map(({ label, Icon }) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
              >
                <div className="flex items-center gap-2 text-white/85">
                  <Icon className="h-4 w-4" />
                  <div className="text-sm font-semibold">{label}</div>
                </div>
              </div>
            ))}
          </div>

          <motion.div
            className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/80"
            animate={{ opacity: mode === 'after' ? 1 : 0.65 }}
          >
            <span className="font-semibold text-white/90">Driver takeaway:</span> YardFlow turns check-in/out
            into a predictable flow. (Predictable = fewer detention invoices. CFOs mysteriously love that.)
          </motion.div>
        </div>
      }
    />
  );
}
