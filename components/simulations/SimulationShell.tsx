'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, ArrowLeftRight } from 'lucide-react';

export type SimMode = 'before' | 'after';

export type SimMetric = {
  key: string;
  label: string;
  value: string;
  delta?: string; // e.g., "-42%"
  emphasis?: 'good' | 'bad' | 'neutral';
};

export type SimStep = {
  id: string;
  title: string;
  subtitle?: string;
  narration: string;
  // Optional callouts that appear as "system messages"
  callouts?: Array<{ title: string; body: string }>;
  metrics: {
    before: SimMetric[];
    after: SimMetric[];
  };
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function GlassPanel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_20px_60px_rgba(0,0,0,0.55)]',
        className
      )}
    >
      {children}
    </div>
  );
}

export function MetricPill({ m }: { m: SimMetric }) {
  const tone =
    m.emphasis === 'good'
      ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200'
      : m.emphasis === 'bad'
      ? 'border-rose-400/25 bg-rose-400/10 text-rose-200'
      : 'border-sky-400/25 bg-sky-400/10 text-sky-200';

  return (
    <div className={cn('rounded-xl border px-3 py-2', tone)}>
      <div className="text-[11px] uppercase tracking-wider opacity-80">{m.label}</div>
      <div className="flex items-baseline gap-2">
        <div className="text-base font-semibold">{m.value}</div>
        {m.delta ? <div className="text-xs opacity-80">{m.delta}</div> : null}
      </div>
    </div>
  );
}

export function SimulationShell({
  title,
  description,
  steps,
  stepIndex,
  setStepIndex,
  mode,
  setMode,
  isPlaying,
  setIsPlaying,
  onReset,
  leftVisual,
  rightVisual,
}: {
  title: string;
  description: string;
  steps: SimStep[];
  stepIndex: number;
  setStepIndex: (n: number) => void;
  mode: SimMode;
  setMode: (m: SimMode) => void;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  onReset: () => void;
  leftVisual: React.ReactNode; // the main visual (yard/phone/map)
  rightVisual?: React.ReactNode; // optional secondary visual
}) {
  const step = steps[stepIndex];

  const metrics = useMemo(() => {
    return mode === 'before' ? step.metrics.before : step.metrics.after;
  }, [mode, step]);

  return (
    <div className="w-full">
      <div className="mb-5 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xl font-semibold tracking-tight text-white">{title}</div>
            <div className="text-sm text-white/70">{description}</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode(mode === 'before' ? 'after' : 'before')}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wider',
                'border-white/10 bg-white/[0.04] text-white/85 hover:bg-white/[0.07]'
              )}
              aria-label="Toggle before/after"
            >
              <ArrowLeftRight className="h-4 w-4" />
              {mode === 'before' ? 'Before' : 'After'}
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wider',
                'border-white/10 bg-white/[0.04] text-white/85 hover:bg-white/[0.07]'
              )}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <button
              onClick={onReset}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wider',
                'border-white/10 bg-white/[0.04] text-white/85 hover:bg-white/[0.07]'
              )}
              aria-label="Reset"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Stepper */}
        <GlassPanel className="px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            {steps.map((s, i) => {
              const active = i === stepIndex;
              return (
                <button
                  key={s.id}
                  onClick={() => setStepIndex(i)}
                  className={cn(
                    'rounded-xl border px-3 py-2 text-xs font-semibold tracking-tight',
                    active
                      ? 'border-sky-400/30 bg-sky-400/10 text-sky-100'
                      : 'border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.06]'
                  )}
                >
                  {i + 1}. {s.title}
                </button>
              );
            })}
          </div>
        </GlassPanel>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <GlassPanel className="relative overflow-hidden lg:col-span-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.12),transparent_45%),radial-gradient(circle_at_70%_60%,rgba(99,102,241,0.10),transparent_50%)]" />
          <div className="relative p-4">{leftVisual}</div>
        </GlassPanel>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <GlassPanel className="p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
              {mode === 'before' ? 'Before YardFlow' : 'After YardFlow'}
            </div>
            <div className="mt-2 text-lg font-semibold text-white">{step.title}</div>
            {step.subtitle ? (
              <div className="mt-1 text-sm text-white/70">{step.subtitle}</div>
            ) : null}

            <AnimatePresence mode="wait">
              <motion.div
                key={`${mode}-${step.id}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="mt-3 text-sm leading-relaxed text-white/80"
              >
                {step.narration}
              </motion.div>
            </AnimatePresence>

            {step.callouts?.length ? (
              <div className="mt-4 space-y-2">
                {step.callouts.map((c, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
                  >
                    <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
                      {c.title}
                    </div>
                    <div className="mt-1 text-sm text-white/80">{c.body}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </GlassPanel>

          <GlassPanel className="p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Live KPIs
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {metrics.map((m) => (
                <MetricPill key={m.key} m={m} />
              ))}
            </div>
          </GlassPanel>

          {rightVisual ? <GlassPanel className="p-4">{rightVisual}</GlassPanel> : null}
        </div>
      </div>
    </div>
  );
}
