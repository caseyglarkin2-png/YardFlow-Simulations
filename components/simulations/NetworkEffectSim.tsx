'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Network visualization showing interconnected facilities
function NetworkMap({
  facilities,
  mode,
}: {
  facilities: number;
  mode: 'before' | 'after';
}) {
  const nodes = useMemo(() => {
    const result: Array<{ id: string; x: number; y: number; size: number }> = [];
    const cols = Math.ceil(Math.sqrt(facilities));
    const rows = Math.ceil(facilities / cols);
    
    for (let i = 0; i < facilities; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const spacing = 120;
      const offsetX = 100 + (5 - cols) * 30;
      const offsetY = 80 + (4 - rows) * 20;
      
      result.push({
        id: `node-${i}`,
        x: offsetX + col * spacing,
        y: offsetY + row * spacing,
        size: 40 + Math.random() * 20,
      });
    }
    return result;
  }, [facilities]);

  const connections = useMemo(() => {
    const result: Array<{ from: number; to: number }> = [];
    for (let i = 0; i < nodes.length; i++) {
      // Connect to next node
      if (i < nodes.length - 1) result.push({ from: i, to: i + 1 });
      // Connect to node 2 steps ahead for mesh effect
      if (i < nodes.length - 2) result.push({ from: i, to: i + 2 });
    }
    return result;
  }, [nodes]);

  return (
    <svg viewBox="0 0 700 500" className="h-full w-full">
      {/* Grid background */}
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.5" fill="rgba(255,255,255,0.1)" />
        </pattern>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(6,182,212,0.4)" />
          <stop offset="100%" stopColor="rgba(6,182,212,0)" />
        </radialGradient>
      </defs>
      
      <rect width="700" height="500" fill="url(#grid)" opacity="0.3" />

      {/* Connection lines */}
      <g opacity={mode === 'after' ? 0.6 : 0.2}>
        {connections.map((conn, idx) => {
          const from = nodes[conn.from];
          const to = nodes[conn.to];
          return (
            <motion.line
              key={`conn-${idx}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="rgba(6,182,212,0.5)"
              strokeWidth={mode === 'after' ? 2 : 1}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: idx * 0.05 }}
            />
          );
        })}
      </g>

      {/* Facility nodes */}
      {nodes.map((node, idx) => (
        <g key={node.id}>
          {mode === 'after' && (
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.size / 2 + 10}
              fill="url(#nodeGlow)"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 2 + (idx % 3) * 0.5,
                repeat: Infinity,
                delay: idx * 0.1
              }}
            />
          )}
          
          <motion.rect
            x={node.x - node.size / 2}
            y={node.y - node.size / 2}
            width={node.size}
            height={node.size}
            rx="6"
            fill="rgba(255,255,255,0.03)"
            stroke={mode === 'after' ? 'rgba(6,182,212,0.6)' : 'rgba(255,255,255,0.2)'}
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.08, type: 'spring', stiffness: 200 }}
          />
          
          {/* Mini building icon */}
          <rect
            x={node.x - 8}
            y={node.y - 8}
            width="16"
            height="16"
            rx="2"
            fill={mode === 'after' ? 'rgba(6,182,212,0.3)' : 'rgba(255,255,255,0.2)'}
          />
        </g>
      ))}

      {/* Data flow particles in "after" mode */}
      {mode === 'after' && connections.slice(0, 5).map((conn, idx) => {
        const from = nodes[conn.from];
        const to = nodes[conn.to];
        return (
          <motion.circle
            key={`particle-${idx}`}
            r="3"
            fill="rgba(6,182,212,0.9)"
            animate={{
              cx: [from.x, to.x, from.x],
              cy: [from.y, to.y, from.y],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: idx * 0.6,
              ease: 'linear'
            }}
          />
        );
      })}
    </svg>
  );
}

export default function NetworkEffectSim() {
  const [mode, setMode] = useState<'before' | 'after'>('before');
  const [facilities, setFacilities] = useState(9);

  const metrics = useMemo(() => {
    const scale = facilities / 30;
    if (mode === 'after') {
      return {
        accuracy: Math.round(55 + scale * 33) + '%',
        dwell: Math.round(180 - scale * 60) + 'm',
        turns: (1 + scale * 0.35).toFixed(2) + 'x',
        cash: '$' + (scale * 8).toFixed(1) + 'M',
      };
    }
    return {
      accuracy: Math.round(40 + scale * 15) + '%',
      dwell: Math.round(210 - scale * 15) + 'm',
      turns: (1 + scale * 0.05).toFixed(2) + 'x',
      cash: '$0M',
    };
  }, [facilities, mode]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white">Network Effect</h2>
        <p className="mt-2 text-lg text-white/60">
          Every facility added makes the entire network smarter
        </p>
      </div>

      {/* Main visual */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(6,182,212,0.08),transparent_50%)]" />
        
        <div className="relative p-8">
          <div className="h-[500px]">
            <NetworkMap facilities={facilities} mode={mode} />
          </div>
        </div>

        {/* Floating stats */}
        <div className="absolute right-6 top-6 space-y-3">
          {[
            { label: 'ETA Accuracy', value: metrics.accuracy },
            { label: 'Avg Dwell', value: metrics.dwell },
            { label: 'Turn Index', value: metrics.turns },
            { label: 'Cash Released', value: metrics.cash },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              className="rounded-xl border border-white/10 bg-gray-900/80 px-4 py-3 backdrop-blur-xl"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <div className="text-xs font-medium text-white/50">{stat.label}</div>
              <div className="text-xl font-bold text-cyan-400">{stat.value}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-white/70">Facilities in Network</span>
            <span className="text-lg font-bold text-white">{facilities}</span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            value={facilities}
            onChange={(e) => setFacilities(parseInt(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-cyan-400"
          />
          <div className="mt-2 flex justify-between text-xs text-white/40">
            <span>1 facility</span>
            <span>30 facilities</span>
          </div>
        </div>

        <div className="ml-8 flex items-center gap-3">
          <button
            onClick={() => setMode('before')}
            className={`rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
              mode === 'before'
                ? 'bg-white/10 text-white shadow-lg'
                : 'bg-transparent text-white/50 hover:text-white/70'
            }`}
          >
            Before YardFlow
          </button>
          
          <ArrowRight className="h-5 w-5 text-white/30" />
          
          <button
            onClick={() => setMode('after')}
            className={`rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
              mode === 'after'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                : 'bg-transparent text-white/50 hover:text-white/70'
            }`}
          >
            After YardFlow
          </button>
        </div>
      </div>

      {/* Insight */}
      <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">
        <h3 className="text-lg font-semibold text-white">The Compounding Advantage</h3>
        <p className="mt-2 leading-relaxed text-white/70">
          {mode === 'before' 
            ? 'Each yard operates as an island. No shared intelligence. No predictive power. Buffers everywhere.'
            : 'Standardized events across facilities create a learning network. Better predictions → fewer buffers → more turns → cash released.'}
        </p>
      </div>
    </div>
  );
}
