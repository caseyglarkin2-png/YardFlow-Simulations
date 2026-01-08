'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Gauge, Activity, TrendingUp } from 'lucide-react';
import { IsometricYard } from './IsometricYard';
import { YardJourneyTruck } from './TruckPathAnim';

function FacilityScene({
  mode,
  throughput,
}: {
  mode: 'before' | 'after';
  throughput: number; // 0-100 (arrival rate)
}) {
  // Calculate metrics based on mode and throughput
  const scale = throughput / 100;
  
  const queueCount = mode === 'before' 
    ? Math.round(3 + scale * 9)  // 3-12 trucks in before
    : Math.round(1 + scale * 3); // 1-4 trucks in after

  const doorUtil = mode === 'before' 
    ? Math.round(45 + scale * 20)  // 45-65%
    : Math.round(75 + scale * 20); // 75-95%

  const avgDwell = mode === 'before'
    ? Math.round(180 - scale * 30)  // 180-150min
    : Math.round(110 - scale * 30); // 110-80min

  const trucksPerHour = mode === 'before'
    ? Math.round(8 + scale * 4)  // 8-12/hr
    : Math.round(14 + scale * 8); // 14-22/hr

  // Number of simultaneous trucks in yard based on throughput
  const truckCount = mode === 'after' 
    ? Math.min(5, Math.max(2, Math.round(scale * 5)))
    : Math.min(3, Math.max(1, Math.round(scale * 3)));

  return (
    <div className="relative h-[500px] w-full">
      <IsometricYard showActivity={mode === 'after'} />
      
      {/* Overlay SVG for truck animations */}
      <svg
        viewBox="0 0 800 600"
        className="absolute inset-0 h-full w-full"
        style={{ pointerEvents: 'none' }}
      >
        {/* Multiple trucks showing throughput */}
        {Array.from({ length: truckCount }).map((_, i) => (
          <YardJourneyTruck
            key={i}
            mode={mode}
            delay={i * (mode === 'after' ? 3 : 5)}
          />
        ))}

        {/* Queue visualization - circles at gate representing waiting trucks */}
        {Array.from({ length: queueCount }).map((_, i) => (
          <motion.circle
            key={`queue-${i}`}
            cx={50 + i * 12}
            cy={470 - i * 6}
            r="7"
            fill={mode === 'before' ? 'rgba(244,63,94,0.5)' : 'rgba(56,189,248,0.4)'}
            stroke={mode === 'before' ? 'rgba(244,63,94,0.7)' : 'rgba(56,189,248,0.6)'}
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.08 }}
          />
        ))}
      </svg>

      {/* Live stats overlay */}
      <div className="absolute bottom-6 left-6 flex gap-3">
        <motion.div
          className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl px-4 py-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-1">
            Queue
          </div>
          <div className={`text-2xl font-bold ${mode === 'before' ? 'text-rose-400' : 'text-cyan-400'}`}>
            {queueCount} trucks
          </div>
        </motion.div>

        <motion.div
          className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl px-4 py-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-1">
            Door Utilization
          </div>
          <div className={`text-2xl font-bold ${mode === 'before' ? 'text-rose-400' : 'text-cyan-400'}`}>
            {doorUtil}%
          </div>
        </motion.div>
        <motion.div
          className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl px-4 py-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-1">
            Avg Dwell
          </div>
          <div className={`text-2xl font-bold ${mode === 'before' ? 'text-rose-400' : 'text-cyan-400'}`}>
            {avgDwell}m
          </div>
        </motion.div>

        <motion.div
          className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl px-4 py-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-1">
            Trucks/hr
          </div>
          <div className={`text-2xl font-bold ${mode === 'before' ? 'text-rose-400' : 'text-cyan-400'}`}>
            {trucksPerHour}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function FacilityOpsSim() {
  const [mode, setMode] = useState<'before' | 'after'>('before');
  const [throughput, setThroughput] = useState(60); // 0-100

  return (
    <div className="relative">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-3">
          Facility Operations: Yard-Wide Flow
        </h2>
        <p className="text-lg text-white/70 max-w-2xl">
          Watch how YardFlow transforms yard chaos into orchestrated flow with higher utilization and less detention.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main visualization */}
        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(56,189,248,0.08),transparent_60%)]" />
            <div className="relative">
              <FacilityScene mode={mode} throughput={throughput} />
            </div>
          </div>
        </div>

        {/* Controls panel */}
        <div className="lg:col-span-4 space-y-4">
          {/* Toggle */}
          <button
            onClick={() => setMode(mode === 'before' ? 'after' : 'before')}
            className="w-full group"
          >
            <div className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 hover:bg-white/[0.07] transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold uppercase tracking-wider text-white/60">
                  Viewing
                </div>
                <ArrowRight className="h-4 w-4 text-white/60 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className={`text-xl font-bold ${mode === 'before' ? 'text-rose-400' : 'text-cyan-400'}`}>
                {mode === 'before' ? 'Before YardFlow' : 'After YardFlow'}
              </div>
              <div className="text-sm text-white/70 mt-1">
                Click to toggle
              </div>
            </div>
          </button>

          {/* Throughput slider */}
          <div className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold uppercase tracking-wider text-white/60">
                Arrival Rate
              </div>
              <Gauge className="h-4 w-4 text-white/60" />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={throughput}
              onChange={(e) => setThroughput(parseInt(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10"
              style={{
                background: `linear-gradient(to right, rgba(56,189,248,0.5) 0%, rgba(56,189,248,0.5) ${throughput}%, rgba(255,255,255,0.1) ${throughput}%, rgba(255,255,255,0.1) 100%)`,
              }}
            />
            <div className="flex justify-between mt-2 text-xs text-white/60">
              <span>Low</span>
              <span>Peak</span>
            </div>
          </div>

          {/* Key metrics */}
          <div className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4">
            <div className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-4">
              Operations Impact
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <div className="text-sm text-white/70">Avg Dwell</div>
                  <div className={`text-lg font-bold ${mode === 'before' ? 'text-rose-400' : 'text-cyan-400'}`}>
                    {mode === 'before' ? '2-4h' : '1-2.5h'}
                  </div>
                </div>
                {mode === 'after' && (
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                      initial={{ width: '0%' }}
                      animate={{ width: '45%' }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <div className="text-sm text-white/70">Moves/Hour</div>
                  <div className={`text-lg font-bold ${mode === 'before' ? 'text-white/60' : 'text-cyan-400'}`}>
                    {mode === 'before' ? 'Baseline' : '+15-25%'}
                  </div>
                </div>
                {mode === 'after' && (
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                      initial={{ width: '0%' }}
                      animate={{ width: '62%' }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <div className="text-sm text-white/70">Exceptions</div>
                  <div className={`text-lg font-bold ${mode === 'before' ? 'text-rose-400' : 'text-cyan-400'}`}>
                    {mode === 'before' ? 'Late' : 'Early'}
                  </div>
                </div>
                {mode === 'after' && (
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                      initial={{ width: '0%' }}
                      animate={{ width: '75%' }}
                      transition={{ duration: 1, delay: 0.4 }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Explanation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4"
            >
              <div className="text-sm text-white/80 leading-relaxed">
                {mode === 'before' ? (
                  <>
                    <strong className="text-white">Without YardFlow:</strong> Manual intake creates bottlenecks.
                    No unified inventory means lost trailers. Radio dispatch is reactive. Doors idle while trucks queue.
                    Exceptions discovered late = costly rework.
                  </>
                ) : (
                  <>
                    <strong className="text-white">With YardFlow:</strong> Digital gate validates and routes automatically.
                    Real-time yard map eliminates "where is it?" chaos. Task dispatch optimizes switcher moves.
                    Door assignment reduces idle time. Early exception detection = smaller blast radius.
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
