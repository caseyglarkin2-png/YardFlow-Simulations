'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Gauge } from 'lucide-react';
import { IsometricYard } from './IsometricYard';
import { AnimatedTruck } from './AnimatedTruck';

function FacilityScene({
  mode,
  intensity,
}: {
  mode: 'before' | 'after';
  intensity: number; // 0-1
}) {
  // Show queue and flow based on mode and intensity
  const queueCount = mode === 'before' 
    ? Math.round(2 + intensity * 6)  // 2-8 trucks waiting
    : Math.round(1 + intensity * 2); // 1-3 trucks waiting

  const truckPaths = [
    // Path 1: Quick flow (after) vs slow (before)
    [
      { x: 100, y: 420, rotation: -15 },
      { x: 180, y: 380, rotation: -20 },
      { x: 260, y: 340, rotation: -25 },
      { x: 320, y: 310, rotation: -30 },
    ],
    // Path 2: Secondary flow
    [
      { x: 120, y: 400, rotation: -15 },
      { x: 200, y: 360, rotation: -20 },
      { x: 280, y: 320, rotation: -30 },
    ],
    // Path 3: Tertiary (only in "after" with higher intensity)
    [
      { x: 140, y: 390, rotation: -15 },
      { x: 220, y: 350, rotation: -20 },
      { x: 300, y: 310, rotation: -30 },
    ],
  ];

  const doorUtil = mode === 'before' 
    ? Math.round(45 + intensity * 15)  // 45-60%
    : Math.round(75 + intensity * 15); // 75-90%

  return (
    <div className="relative h-[500px] w-full">
      <IsometricYard showActivity={mode === 'after'} />
      
      {/* Overlay SVG for truck animations */}
      <svg
        viewBox="0 0 800 600"
        className="absolute inset-0 h-full w-full"
        style={{ pointerEvents: 'none' }}
      >
        {/* Main flow truck - always visible */}
        <AnimatedTruck
          path={truckPaths[0]}
          duration={mode === 'before' ? 14 : 9}
          color={mode === 'before' ? 'rgba(244,63,94,0.8)' : 'rgba(56,189,248,0.9)'}
        />
        
        {/* Second truck - depends on intensity */}
        {intensity > 0.3 && (
          <AnimatedTruck
            path={truckPaths[1]}
            duration={mode === 'before' ? 16 : 10}
            delay={mode === 'before' ? 6 : 3}
            color={mode === 'before' ? 'rgba(244,63,94,0.7)' : 'rgba(56,189,248,0.8)'}
          />
        )}

        {/* Third truck - only in "after" with high intensity */}
        {mode === 'after' && intensity > 0.6 && (
          <AnimatedTruck
            path={truckPaths[2]}
            duration={8}
            delay={5}
            color="rgba(56,189,248,0.7)"
          />
        )}

        {/* Queue visualization - circles representing waiting trucks */}
        {Array.from({ length: queueCount }).map((_, i) => (
          <motion.circle
            key={i}
            cx={90 + i * 15}
            cy={440 - i * 8}
            r="8"
            fill={mode === 'before' ? 'rgba(244,63,94,0.6)' : 'rgba(56,189,248,0.5)'}
            stroke={mode === 'before' ? 'rgba(244,63,94,0.8)' : 'rgba(56,189,248,0.7)'}
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
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
      </div>
    </div>
  );
}

export default function FacilityOpsSim() {
  const [mode, setMode] = useState<'before' | 'after'>('before');
  const [intensity, setIntensity] = useState(0.6); // 0-1

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
              <FacilityScene mode={mode} intensity={intensity} />
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

          {/* Intensity slider */}
          <div className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold uppercase tracking-wider text-white/60">
                Arrival Intensity
              </div>
              <Gauge className="h-4 w-4 text-white/60" />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={intensity * 100}
              onChange={(e) => setIntensity(parseInt(e.target.value) / 100)}
              className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10"
              style={{
                background: `linear-gradient(to right, rgba(56,189,248,0.5) 0%, rgba(56,189,248,0.5) ${intensity * 100}%, rgba(255,255,255,0.1) ${intensity * 100}%, rgba(255,255,255,0.1) 100%)`,
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
