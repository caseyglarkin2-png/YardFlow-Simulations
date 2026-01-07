'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { SimulationShell, SimMode, SimStep, GlassPanel } from './SimulationShell';
import { Network, TrendingUp, DollarSign, Timer, BadgeCheck } from 'lucide-react';

function makeNodes(n: number) {
  // deterministic-ish layout in a ring + inner cluster
  const nodes: Array<{ id: string; x: number; y: number }> = [];
  const center = { x: 360, y: 210 };
  const ring = Math.min(n, 14);
  const inner = Math.max(0, n - ring);

  for (let i = 0; i < ring; i++) {
    const a = (Math.PI * 2 * i) / ring;
    nodes.push({
      id: `R${i}`,
      x: center.x + Math.cos(a) * 160,
      y: center.y + Math.sin(a) * 110,
    });
  }

  for (let i = 0; i < inner; i++) {
    const a = (Math.PI * 2 * i) / Math.max(1, inner);
    nodes.push({
      id: `I${i}`,
      x: center.x + Math.cos(a) * 70,
      y: center.y + Math.sin(a) * 45,
    });
  }

  return nodes.slice(0, n);
}

function NetworkScene({
  facilities,
  mode,
}: {
  facilities: number;
  mode: SimMode;
}) {
  const nodes = useMemo(() => makeNodes(facilities), [facilities]);

  // edges: connect each node to center-ish + a neighbor for "mesh"
  const edges = useMemo(() => {
    const e: Array<{ a: number; b: number }> = [];
    if (nodes.length < 2) return e;
    for (let i = 0; i < nodes.length; i++) {
      e.push({ a: i, b: (i + 1) % nodes.length });
      e.push({ a: i, b: Math.floor((i * 7) % nodes.length) });
    }
    return e.slice(0, Math.min(90, e.length));
  }, [nodes]);

  const pulseOpacity = mode === 'after' ? 0.25 : 0.08;

  return (
    <div className="relative">
      <svg viewBox="0 0 720 420" className="w-full h-[420px]">
        <g opacity="0.15">
          {Array.from({ length: 22 }).map((_, i) => (
            <line key={i} x1={0} y1={i * 20} x2={720} y2={i * 20} stroke="rgba(255,255,255,0.08)" />
          ))}
          {Array.from({ length: 36 }).map((_, i) => (
            <line key={i} x1={i * 20} y1={0} x2={i * 20} y2={420} stroke="rgba(255,255,255,0.06)" />
          ))}
        </g>

        {/* edges */}
        <g>
          {edges.map((ed, idx) => {
            const A = nodes[ed.a];
            const B = nodes[ed.b];
            return (
              <line
                key={idx}
                x1={A.x}
                y1={A.y}
                x2={B.x}
                y2={B.y}
                stroke={mode === 'after' ? 'rgba(56,189,248,0.20)' : 'rgba(255,255,255,0.10)'}
                strokeWidth="1"
              />
            );
          })}
        </g>

        {/* nodes */}
        <g>
          {nodes.map((n, idx) => (
            <g key={n.id}>
              <circle
                cx={n.x}
                cy={n.y}
                r={10}
                fill={mode === 'after' ? 'rgba(56,189,248,0.45)' : 'rgba(255,255,255,0.25)'}
                stroke={mode === 'after' ? 'rgba(56,189,248,0.45)' : 'rgba(255,255,255,0.15)'}
              />
              {/* subtle pulse */}
              {mode === 'after' ? (
                <motion.circle
                  cx={n.x}
                  cy={n.y}
                  r={18}
                  fill="rgba(56,189,248,0.10)"
                  animate={{ opacity: [0.03, pulseOpacity, 0.03], scale: [0.98, 1.04, 0.98] }}
                  transition={{ duration: 2.4 + (idx % 5) * 0.2, repeat: Infinity }}
                />
              ) : null}
            </g>
          ))}
        </g>
      </svg>

      <div className="absolute left-4 top-4">
        <GlassPanel className="p-3 w-[320px]">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Network Live
            </div>
            <div className="text-sm font-semibold text-white">{facilities} facilities</div>
          </div>
          <div className="mt-2 text-xs text-white/70">
            Each node adds standardized events → better predictions → less buffer → more turns.
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

export default function NetworkEffectSim() {
  const steps: SimStep[] = [
    {
      id: 'silos',
      title: 'Silos',
      narration:
        'Before: each yard is a standalone planet with its own rules. Network-level performance is basically folklore.',
      metrics: {
        before: [
          { key: 'eta', label: 'ETA Accuracy', value: 'Low', emphasis: 'bad' },
          { key: 'dwell', label: 'Network Dwell', value: 'High', emphasis: 'bad' },
          { key: 'turn', label: 'Turns', value: 'Flat', emphasis: 'bad' },
          { key: 'cash', label: 'Cash Released', value: '$0', emphasis: 'bad' },
        ],
        after: [
          { key: 'eta', label: 'ETA Accuracy', value: 'Improving', emphasis: 'good' },
          { key: 'dwell', label: 'Network Dwell', value: 'Down', emphasis: 'good' },
          { key: 'turn', label: 'Turns', value: 'Up', emphasis: 'good' },
          { key: 'cash', label: 'Cash Released', value: 'Ramping', emphasis: 'good' },
        ],
      },
    },
    {
      id: 'standard',
      title: 'Standardized Events',
      narration:
        'After: check-in/out, equipment, seals, door events become standardized signals — comparable across the whole network.',
      metrics: {
        before: [
          { key: 'data', label: 'Event Data', value: 'Sparse', emphasis: 'bad' },
          { key: 'ops', label: 'Ops Variance', value: 'High', emphasis: 'bad' },
          { key: 'buf', label: 'Buffers', value: 'Large', emphasis: 'bad' },
          { key: 'risk', label: 'Risk', value: 'Opaque', emphasis: 'bad' },
        ],
        after: [
          { key: 'data', label: 'Event Data', value: 'Rich', emphasis: 'good' },
          { key: 'ops', label: 'Ops Variance', value: 'Lower', emphasis: 'good' },
          { key: 'buf', label: 'Buffers', value: 'Smaller', emphasis: 'good' },
          { key: 'risk', label: 'Risk', value: 'Visible', emphasis: 'good' },
        ],
      },
    },
    {
      id: 'compounding',
      title: 'Compounding',
      narration:
        'More facilities live → more comparable events → stronger predictions → less detention and better utilization.',
      metrics: {
        before: [
          { key: 'roi', label: 'ROI', value: 'Local only', emphasis: 'bad' },
          { key: 'sla', label: 'Service', value: 'Variable', emphasis: 'bad' },
          { key: 'inv', label: 'Inventory', value: 'High', emphasis: 'bad' },
          { key: 'wc', label: 'Working Cap', value: 'Tied up', emphasis: 'bad' },
        ],
        after: [
          { key: 'roi', label: 'ROI', value: 'Network', emphasis: 'good' },
          { key: 'sla', label: 'Service', value: 'More stable', emphasis: 'good' },
          { key: 'inv', label: 'Inventory', value: 'Reduced', emphasis: 'good' },
          { key: 'wc', label: 'Working Cap', value: 'Freed', emphasis: 'good' },
        ],
      },
    },
    {
      id: 'boardroom',
      title: 'Boardroom View',
      narration:
        'This is the pitch: a network-level operating system. Not "a yard tool." A compounding advantage.',
      callouts: [{ title: 'CEO line', body: 'Every facility added makes every other facility smarter.' }],
      metrics: {
        before: [
          { key: 'story', label: 'Story', value: 'Cost center', emphasis: 'bad' },
          { key: 'predict', label: 'Predictability', value: 'Low', emphasis: 'bad' },
          { key: 'det', label: 'Detention', value: 'Up', emphasis: 'bad' },
          { key: 'brand', label: 'Carrier CX', value: 'Mixed', emphasis: 'bad' },
        ],
        after: [
          { key: 'story', label: 'Story', value: 'Advantage', emphasis: 'good' },
          { key: 'predict', label: 'Predictability', value: 'High', emphasis: 'good' },
          { key: 'det', label: 'Detention', value: 'Down', emphasis: 'good' },
          { key: 'brand', label: 'Carrier CX', value: 'Strong', emphasis: 'good' },
        ],
      },
    },
  ];

  const [mode, setMode] = useState<SimMode>('before');
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [facilities, setFacilities] = useState(12);

  // derived "executive KPIs" based on facility count + mode
  const execKPIs = useMemo(() => {
    const n = facilities;
    const t = Math.min(1, n / 30);
    const eta = mode === 'after' ? Math.round(lerp(55, 88, t)) : Math.round(lerp(40, 55, t));
    const dwell = mode === 'after' ? Math.round(lerp(180, 120, t)) : Math.round(lerp(210, 195, t));
    const cash = mode === 'after' ? Math.round(lerp(0.5, 6.0, t) * 10) / 10 : 0;
    const turns = mode === 'after' ? Math.round(lerp(1.0, 1.35, t) * 100) / 100 : Math.round(lerp(1.0, 1.05, t) * 100) / 100;
    return { eta, dwell, cash, turns };
  }, [facilities, mode]);

  useEffect(() => {
    if (!isPlaying) return;
    const t = setInterval(() => setStepIndex((i) => (i + 1) % steps.length), 2600);
    return () => clearInterval(t);
  }, [isPlaying, steps.length]);

  return (
    <SimulationShell
      title="Network Effect (C-suite View)"
      description="A compounding simulation: standardized events across facilities create measurable network advantage."
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
        setFacilities(12);
      }}
      leftVisual={<NetworkScene facilities={facilities} mode={mode} />}
      rightVisual={
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-white/60">Controls</div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between text-white/85">
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4" />
                <div className="text-sm font-semibold">Facilities Live</div>
              </div>
              <div className="text-xs text-white/70">{facilities}/30</div>
            </div>
            <input
              className="mt-2 w-full accent-white"
              type="range"
              min={1}
              max={30}
              value={facilities}
              onChange={(e) => setFacilities(parseInt(e.target.value, 10))}
            />
            <div className="mt-1 text-xs text-white/65">
              Slide right to make the CFO start smiling against their will.
            </div>
          </div>

          <GlassPanel className="p-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Executive KPIs (illustrative)
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center gap-2 text-white/85">
                  <TrendingUp className="h-4 w-4" />
                  <div className="text-sm font-semibold">ETA Accuracy</div>
                </div>
                <div className="mt-1 text-lg font-semibold text-white">{execKPIs.eta}%</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center gap-2 text-white/85">
                  <Timer className="h-4 w-4" />
                  <div className="text-sm font-semibold">Avg Dwell</div>
                </div>
                <div className="mt-1 text-lg font-semibold text-white">{execKPIs.dwell}m</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center gap-2 text-white/85">
                  <DollarSign className="h-4 w-4" />
                  <div className="text-sm font-semibold">Cash Released</div>
                </div>
                <div className="mt-1 text-lg font-semibold text-white">${execKPIs.cash}M</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center gap-2 text-white/85">
                  <BadgeCheck className="h-4 w-4" />
                  <div className="text-sm font-semibold">Turns Index</div>
                </div>
                <div className="mt-1 text-lg font-semibold text-white">{execKPIs.turns}×</div>
              </div>
            </div>
          </GlassPanel>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="text-sm font-semibold text-white/90">Boardroom takeaway</div>
            <div className="mt-1 text-sm text-white/75">
              YardFlow is an operating system for standardized yard events. That standardization is what creates the
              network effect—and why this becomes a strategic advantage, not a line-item tool.
            </div>
          </div>
        </div>
      }
    />
  );
}

// local helper
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
