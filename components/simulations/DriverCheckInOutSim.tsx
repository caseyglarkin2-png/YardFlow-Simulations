'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { IsometricYard } from './IsometricYard';
import { AnimatedTruck } from './AnimatedTruck';

function DriverScene({
  mode,
}: {
  mode: 'before' | 'after';
}) {
  // Define truck paths for before/after scenarios
  const beforePath = [
    { x: 80, y: 430, rotation: -15 },   // Approaching gate
    { x: 120, y: 410, rotation: -15 },  // Stopped at gate (long wait)
    { x: 130, y: 405, rotation: -15 },  // Slowly moving
    { x: 180, y: 380, rotation: -20 },  // Confused routing
    { x: 220, y: 360, rotation: -25 },  // Wrong turn
    { x: 260, y: 340, rotation: -30 },  // Waiting at door
    { x: 290, y: 320, rotation: -30 },  // Finally at door
    { x: 320, y: 300, rotation: -30 },  // Loading (stuck)
  ];

  const afterPath = [
    { x: 80, y: 430, rotation: -15 },   // Approaching gate
    { x: 160, y: 390, rotation: -15 },  // Quick through gate
    { x: 240, y: 350, rotation: -25 },  // Direct routing
    { x: 300, y: 315, rotation: -30 },  // At door quickly
    { x: 320, y: 305, rotation: -30 },  // Loading
    { x: 340, y: 295, rotation: -30 },  // Done
    { x: 380, y: 275, rotation: -35 },  // Exiting
    { x: 420, y: 255, rotation: -35 },  // Smooth exit
  ];

  return (
    <div className="relative h-[500px] w-full">
      <IsometricYard showActivity={mode === 'after'} />
      
      {/* Overlay SVG for truck animation */}
      <svg
        viewBox="0 0 800 600"
        className="absolute inset-0 h-full w-full"
        style={{ pointerEvents: 'none' }}
      >
        <AnimatedTruck
          path={mode === 'before' ? beforePath : afterPath}
          duration={mode === 'before' ? 16 : 10}
          color={mode === 'before' ? 'rgba(244,63,94,0.8)' : 'rgba(56,189,248,0.9)'}
        />
        
        {/* Additional trucks in "after" mode to show higher throughput */}
        {mode === 'after' && (
          <>
            <AnimatedTruck
              path={afterPath}
              duration={10}
              delay={3}
              color="rgba(56,189,248,0.7)"
            />
            <AnimatedTruck
              path={afterPath}
              duration={10}
              delay={6}
              color="rgba(56,189,248,0.6)"
            />
          </>
        )}
      </svg>

      {/* Status indicator */}
      <div className="absolute bottom-6 left-6">
        <motion.div
          className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl px-4 py-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-1">
            Avg Turn Time
          </div>
          <div className="flex items-baseline gap-2">
            <div className={`text-2xl font-bold ${mode === 'before' ? 'text-rose-400' : 'text-cyan-400'}`}>
              {mode === 'before' ? '2.6h' : '1.5h'}
            </div>
            {mode === 'after' && (
              <div className="text-sm text-emerald-400">-42%</div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function DriverCheckInOutSim() {
  const [mode, setMode] = useState<'before' | 'after'>('before');

  return (
    <div className="relative">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-3">
          Driver Experience: Gate to Gate
        </h2>
        <p className="text-lg text-white/70 max-w-2xl">
          Watch how YardFlow transforms driver check-in from paperwork chaos to seamless flow.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main visualization */}
        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.08),transparent_60%)]" />
            <div className="relative">
              <DriverScene mode={mode} />
            </div>
          </div>
        </div>

        {/* Info panel */}
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

          {/* Key metrics */}
          <div className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4">
            <div className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-4">
              Key Impact
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <div className="text-sm text-white/70">Gate Time</div>
                  <div className={`text-lg font-bold ${mode === 'before' ? 'text-rose-400' : 'text-cyan-400'}`}>
                    {mode === 'before' ? '18-35m' : '2-5m'}
                  </div>
                </div>
                {mode === 'after' && (
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                      initial={{ width: '0%' }}
                      animate={{ width: '85%' }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <div className="text-sm text-white/70">Total Dwell</div>
                  <div className={`text-lg font-bold ${mode === 'before' ? 'text-rose-400' : 'text-cyan-400'}`}>
                    {mode === 'before' ? '2.6h' : '1.5h'}
                  </div>
                </div>
                {mode === 'after' && (
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                      initial={{ width: '0%' }}
                      animate={{ width: '42%' }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <div className="text-sm text-white/70">Driver Touchpoints</div>
                  <div className={`text-lg font-bold ${mode === 'before' ? 'text-rose-400' : 'text-cyan-400'}`}>
                    {mode === 'before' ? '6-10' : '1-2'}
                  </div>
                </div>
                {mode === 'after' && (
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                      initial={{ width: '0%' }}
                      animate={{ width: '80%' }}
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
                    <strong className="text-white">Without YardFlow:</strong> Drivers arrive blind, wait in queues,
                    make calls, get lost in the yard, and face detention risk. Every minute parked is a minute not earning.
                  </>
                ) : (
                  <>
                    <strong className="text-white">With YardFlow:</strong> Pre-check validates everything before arrival.
                    QR/geofence check-in is instant. Auto-routing eliminates confusion. Live updates reduce anxiety.
                    Digital proof makes exit seamless.
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
