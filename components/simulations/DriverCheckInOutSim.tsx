'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Smartphone, MapPin, CheckCircle2 } from 'lucide-react';
import { IsometricYard } from './IsometricYard';
import { YardJourneyTruck } from './TruckPathAnim';
import { YARD_PATHS } from './YardPaths';

// QR Scan effect overlay
function QRScanEffect({ show, position }: { show: boolean; position: { x: number; y: number } }) {
  if (!show) return null;
  
  return (
    <g>
      {/* QR code visual */}
      <motion.rect
        x={position.x - 15}
        y={position.y - 15}
        width="30"
        height="30"
        fill="rgba(56,189,248,0.2)"
        stroke="rgba(56,189,248,0.8)"
        strokeWidth="2"
        rx="3"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      />
      {/* QR pattern */}
      {[...Array(3)].map((_, i) => (
        <motion.line
          key={i}
          x1={position.x - 10}
          y1={position.y - 8 + i * 8}
          x2={position.x + 10}
          y2={position.y - 8 + i * 8}
          stroke="rgba(56,189,248,0.6)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: i * 0.1 }}
        />
      ))}
      {/* Scan line */}
      <motion.line
        x1={position.x - 15}
        y1={position.y}
        x2={position.x + 15}
        y2={position.y}
        stroke="rgba(56,189,248,1)"
        strokeWidth="3"
        initial={{ y: position.y - 15 }}
        animate={{ y: position.y + 15 }}
        transition={{ duration: 0.8, repeat: 2 }}
      />
      {/* Success checkmark */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <circle
          cx={position.x}
          cy={position.y}
          r="18"
          fill="rgba(34,197,94,0.2)"
          stroke="rgba(34,197,94,1)"
          strokeWidth="2"
        />
        <motion.path
          d={`M ${position.x - 8} ${position.y} L ${position.x - 3} ${position.y + 6} L ${position.x + 8} ${position.y - 6}`}
          stroke="rgba(34,197,94,1)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.6, duration: 0.3 }}
        />
      </motion.g>
    </g>
  );
}

function DriverScene({
  mode,
  step,
}: {
  mode: 'before' | 'after';
  step: number; // 0-6: arrival, ingate, routing, dock, loading, outgate, exit
}) {
  const [showQRScan, setShowQRScan] = useState(false);
  const [showRouting, setShowRouting] = useState(false);
  const [showOutgateProof, setShowOutgateProof] = useState(false);

  // Trigger QR scan at ingate step in after mode
  useEffect(() => {
    if (mode === 'after' && step === 1) {
      setShowQRScan(true);
      const timer = setTimeout(() => {
        setShowQRScan(false);
        setShowRouting(true);
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      setShowQRScan(false);
    }
  }, [mode, step]);

  // Show routing in after mode
  useEffect(() => {
    if (mode === 'after' && step === 2) {
      setShowRouting(true);
    } else if (step > 3) {
      setShowRouting(false);
    }
  }, [mode, step]);

  // Show outgate proof in after mode
  useEffect(() => {
    if (mode === 'after' && step === 5) {
      setShowOutgateProof(true);
      const timer = setTimeout(() => setShowOutgateProof(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [mode, step]);

  return (
    <div className="relative h-[500px] w-full">
      <IsometricYard showActivity={mode === 'after'} />
      
      {/* Overlay SVG for truck animation and effects */}
      <svg
        viewBox="0 0 800 600"
        className="absolute inset-0 h-full w-full"
        style={{ pointerEvents: 'none' }}
      >
        {/* Main truck journey */}
        <YardJourneyTruck mode={mode} delay={0} />
        
        {/* Additional throughput trucks in after mode */}
        {mode === 'after' && (
          <>
            <YardJourneyTruck mode={mode} delay={4} />
            <YardJourneyTruck mode={mode} delay={8} />
          </>
        )}
        
        {/* QR scan visualization at ingate */}
        <AnimatePresence>
          {showQRScan && <QRScanEffect show={showQRScan} position={{ x: 131, y: 417 }} />}
        </AnimatePresence>
        
        {/* Routing instruction callout */}
        <AnimatePresence>
          {showRouting && (
            <motion.g
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <rect
                x="200"
                y="340"
                width="140"
                height="50"
                rx="8"
                fill="rgba(20,25,35,0.95)"
                stroke="rgba(56,189,248,0.6)"
                strokeWidth="2"
              />
              <text
                x="270"
                y="360"
                textAnchor="middle"
                fill="rgba(56,189,248,1)"
                fontSize="11"
                fontWeight="600"
              >
                ROUTE ASSIGNED
              </text>
              <text
                x="270"
                y="377"
                textAnchor="middle"
                fill="rgba(255,255,255,0.9)"
                fontSize="14"
                fontWeight="700"
              >
                Door 42 • Lane B
              </text>
            </motion.g>
          )}
        </AnimatePresence>
        
        {/* Outgate proof captured */}
        <AnimatePresence>
          {showOutgateProof && (
            <motion.g
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <rect
                x="420"
                y="230"
                width="120"
                height="45"
                rx="8"
                fill="rgba(34,197,94,0.15)"
                stroke="rgba(34,197,94,0.8)"
                strokeWidth="2"
              />
              <text
                x="480"
                y="250"
                textAnchor="middle"
                fill="rgba(34,197,94,1)"
                fontSize="11"
                fontWeight="600"
              >
                PROOF CAPTURED
              </text>
              <text
                x="480"
                y="265"
                textAnchor="middle"
                fill="rgba(255,255,255,0.9)"
                fontSize="10"
              >
                Auto-released
              </text>
            </motion.g>
          )}
        </AnimatePresence>
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
      
      {/* Mobile app indicator in after mode */}
      {mode === 'after' && (
        <div className="absolute top-6 right-6">
          <motion.div
            className="rounded-xl border border-cyan-400/30 bg-black/40 backdrop-blur-xl px-4 py-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-cyan-400" />
              <div className="text-xs font-semibold text-white">YardFlow Mobile</div>
            </div>
            <div className="mt-1 text-xs text-white/60">QR Check-in Active</div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default function DriverCheckInOutSim() {
  const [mode, setMode] = useState<'before' | 'after'>('before');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    { id: 0, label: 'Arrival', description: 'Approaching yard' },
    { id: 1, label: 'Ingate', description: mode === 'before' ? 'Manual check-in' : 'QR scan check-in' },
    { id: 2, label: 'Routing', description: mode === 'before' ? 'Finding way' : 'Auto-routed' },
    { id: 3, label: 'At Dock', description: 'Door assignment' },
    { id: 4, label: 'Loading', description: 'Cargo operations' },
    { id: 5, label: 'Outgate', description: mode === 'before' ? 'Manual checkout' : 'Auto proof capture' },
    { id: 6, label: 'Exit', description: 'Departing yard' },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

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
              <DriverScene mode={mode} step={currentStep} />
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
