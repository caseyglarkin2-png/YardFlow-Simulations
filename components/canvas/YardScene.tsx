'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Actor, SimMode } from '@/engine/types';

interface YardSceneProps {
  actors: Map<string, Actor>;
  mode: SimMode;
  scenarioType: 'driver' | 'facility' | 'network';
  facilityCount?: number;
}

export default function YardScene({ actors, mode, scenarioType, facilityCount = 1 }: YardSceneProps) {
  const actorsList = useMemo(() => Array.from(actors.values()), [actors]);

  if (scenarioType === 'network') {
    return <NetworkScene mode={mode} facilityCount={facilityCount} />;
  }

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-br from-[#0b1220] to-[#0a0f1a] rounded-xl overflow-hidden">
      {/* Subtle grid background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <svg viewBox="0 0 800 600" className="w-full h-full">
        <defs>
          {/* Gradient for roads */}
          <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
          </linearGradient>
        </defs>

        {/* Inbound Road */}
        <path
          d="M 0 420 L 140 420"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="30"
          fill="none"
        />
        
        {/* Gate Area */}
        <rect
          x="140"
          y="390"
          width="60"
          height="60"
          fill="none"
          stroke={mode === 'after' ? 'rgba(56,189,248,0.3)' : 'rgba(255,255,255,0.15)'}
          strokeWidth="2"
          rx="4"
        />
        
        {/* QR Scanner (After mode only) */}
        {mode === 'after' && (
          <g>
            <rect x="160" y="405" width="20" height="30" fill="rgba(56,189,248,0.2)" stroke="rgba(56,189,248,0.5)" strokeWidth="1" />
            <motion.circle
              cx="170"
              cy="420"
              r="3"
              fill="#22d3ee"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </g>
        )}

        {/* Yard Lanes */}
        <path
          d="M 200 400 Q 300 350, 400 320"
          stroke="url(#roadGradient)"
          strokeWidth="25"
          fill="none"
        />

        {/* Dock Buildings */}
        <g>
          {/* Building outline */}
          <path
            d="M 340 240 L 480 240 L 480 380 L 340 380 Z"
            fill="rgba(15,23,42,0.8)"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="2"
          />
          
          {/* Dock Doors */}
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(0, ${i * 40})`}>
              <rect
                x="340"
                y={260 + i * 40}
                width="40"
                height="30"
                fill="rgba(30,41,59,0.9)"
                stroke={mode === 'after' ? 'rgba(56,189,248,0.3)' : 'rgba(255,255,255,0.1)'}
                strokeWidth="2"
                rx="2"
              />
              
              {/* Door status indicator */}
              {scenarioType === 'facility' && (
                <motion.circle
                  cx="360"
                  cy={275 + i * 40}
                  r="3"
                  fill={mode === 'after' ? '#22d3ee' : '#94a3b8'}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                />
              )}
            </g>
          ))}
        </g>

        {/* Exit Road */}
        <path
          d="M 480 300 Q 600 240, 800 180"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="28"
          fill="none"
        />
        
        {/* Exit Gate */}
        <rect
          x="500"
          y="275"
          width="50"
          height="50"
          fill="none"
          stroke={mode === 'after' ? 'rgba(56,189,248,0.25)' : 'rgba(255,255,255,0.12)'}
          strokeWidth="2"
          rx="4"
        />

        {/* Route Highlight (After mode) */}
        {mode === 'after' && (
          <motion.path
            d="M 140 420 L 200 400 Q 300 350, 350 320 L 380 300"
            stroke="rgba(56,189,248,0.4)"
            strokeWidth="3"
            fill="none"
            strokeDasharray="8 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.6, 0.4] }}
            transition={{ duration: 2, delay: 0.5 }}
          />
        )}

        {/* Render Actors */}
        {actorsList.map((actor) => {
          if (actor.type === 'truck') {
            return <Truck key={actor.id} actor={actor} mode={mode} />;
          } else if (actor.type === 'spotter') {
            return <Spotter key={actor.id} actor={actor} mode={mode} />;
          } else if (actor.type === 'door') {
            return null; // Doors are already rendered as part of building
          }
          return null;
        })}

        {/* Queue visualization for facility scenario */}
        {scenarioType === 'facility' && (
          <g>
            {actorsList
              .filter(a => a.type === 'truck' && a.status === 'queue_start')
              .slice(0, 5)
              .map((actor, i) => (
                <motion.circle
                  key={`queue-${actor.id}`}
                  cx={110 + i * 15}
                  cy={440 - i * 8}
                  r="6"
                  fill={mode === 'before' ? 'rgba(251,191,36,0.6)' : 'rgba(56,189,248,0.5)'}
                  stroke={mode === 'before' ? 'rgba(251,191,36,0.8)' : 'rgba(56,189,248,0.7)'}
                  strokeWidth="2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                />
              ))}
          </g>
        )}
      </svg>
    </div>
  );
}

function Truck({ actor, mode }: { actor: Actor; mode: SimMode }) {
  const color = mode === 'before' ? '#fbbf24' : '#22d3ee';
  
  return (
    <motion.g
      initial={{ x: actor.x, y: actor.y }}
      animate={{ x: actor.x, y: actor.y, rotate: actor.rotation || 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {/* Truck body */}
      <rect
        x={-15}
        y={-8}
        width="30"
        height="16"
        fill={`${color}33`}
        stroke={color}
        strokeWidth="2"
        rx="2"
      />
      {/* Truck cab */}
      <rect
        x={-15}
        y={-6}
        width="8"
        height="12"
        fill={color}
        opacity="0.8"
      />
      
      {/* Status indicator */}
      {actor.status === 'qr_scan' && (
        <motion.circle
          cx="0"
          cy="-15"
          r="4"
          fill="#22d3ee"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.3 }}
        />
      )}
      {actor.status === 'wrong_turn' && (
        <motion.circle
          cx="0"
          cy="-15"
          r="4"
          fill="#ef4444"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.g>
  );
}

function Spotter({ actor, mode }: { actor: Actor; mode: SimMode }) {
  return (
    <motion.g
      initial={{ x: actor.x, y: actor.y }}
      animate={{ x: actor.x, y: actor.y }}
      transition={{ duration: 1, ease: 'linear' }}
    >
      {/* Spotter vehicle - small tug */}
      <circle
        cx="0"
        cy="0"
        r="6"
        fill={mode === 'after' ? 'rgba(56,189,248,0.4)' : 'rgba(148,163,184,0.4)'}
        stroke={mode === 'after' ? '#22d3ee' : '#94a3b8'}
        strokeWidth="2"
      />
    </motion.g>
  );
}

function NetworkScene({ mode, facilityCount }: { mode: SimMode; facilityCount: number }) {
  const gridSize = 6;
  const cellSize = 80;
  const offsetX = 100;
  const offsetY = 80;

  // Generate facility positions in a grid
  const facilities = useMemo(() => {
    const positions = [];
    for (let i = 0; i < Math.min(facilityCount, 30); i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      positions.push({
        x: offsetX + col * cellSize,
        y: offsetY + row * cellSize,
        id: i,
      });
    }
    return positions;
  }, [facilityCount]);

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-br from-[#0b1220] to-[#0a0f1a] rounded-xl overflow-hidden">
      <svg viewBox="0 0 800 600" className="w-full h-full">
        {/* Connection lines (after mode only) */}
        {mode === 'after' && facilities.length > 1 && (
          <g opacity="0.3">
            {facilities.slice(0, -1).map((fac, i) => {
              const next = facilities[i + 1];
              if (!next) return null;
              
              return (
                <motion.line
                  key={`line-${i}`}
                  x1={fac.x}
                  y1={fac.y}
                  x2={next.x}
                  y2={next.y}
                  stroke="#22d3ee"
                  strokeWidth="1"
                  strokeDasharray="4 2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: i * 0.05 }}
                />
              );
            })}
          </g>
        )}

        {/* Facility nodes */}
        {facilities.map((fac, i) => (
          <motion.g
            key={`facility-${fac.id}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            {/* Node circle */}
            <circle
              cx={fac.x}
              cy={fac.y}
              r="12"
              fill={mode === 'after' ? 'rgba(56,189,248,0.2)' : 'rgba(148,163,184,0.15)'}
              stroke={mode === 'after' ? '#22d3ee' : '#64748b'}
              strokeWidth="2"
            />
            
            {/* Pulsing indicator (after mode) */}
            {mode === 'after' && (
              <motion.circle
                cx={fac.x}
                cy={fac.y}
                r="4"
                fill="#22d3ee"
                initial={{ opacity: 0.8 }}
                animate={{ opacity: [0.8, 0.3, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              />
            )}
            
            {/* Mini building icon */}
            <rect
              x={fac.x - 6}
              y={fac.y - 6}
              width="12"
              height="12"
              fill="none"
              stroke={mode === 'after' ? 'rgba(56,189,248,0.6)' : 'rgba(148,163,184,0.4)'}
              strokeWidth="1"
            />
          </motion.g>
        ))}

        {/* Protocol pulses (after mode) */}
        {mode === 'after' && facilityCount > 1 && (
          <g>
            {[0, 1, 2].map((pulseId) => (
              <motion.circle
                key={`pulse-${pulseId}`}
                cx={facilities[0]?.x || 0}
                cy={facilities[0]?.y || 0}
                r="8"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="2"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ 
                  scale: [0, 3, 6],
                  opacity: [1, 0.5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: pulseId * 1,
                }}
              />
            ))}
          </g>
        )}
      </svg>

      {/* Network Effect Label */}
      <div className="absolute top-4 left-4">
        <div className="rounded-lg border border-white/10 bg-black/40 backdrop-blur-xl px-3 py-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
            {mode === 'after' ? 'Standardized Network' : 'Isolated Facilities'}
          </div>
          <div className={`text-lg font-bold ${mode === 'after' ? 'text-cyan-400' : 'text-white/50'}`}>
            {facilityCount} {facilityCount === 1 ? 'Facility' : 'Facilities'}
          </div>
        </div>
      </div>
    </div>
  );
}
