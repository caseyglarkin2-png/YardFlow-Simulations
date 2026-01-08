'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function IsometricYard({
  showActivity = false,
}: {
  showActivity?: boolean;
}) {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-full">
      <defs>
        {/* Gradients for depth */}
        <linearGradient id="buildingFace" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(60,70,85,1)" />
          <stop offset="100%" stopColor="rgba(45,52,65,1)" />
        </linearGradient>
        <linearGradient id="buildingSide" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(45,52,65,1)" />
          <stop offset="100%" stopColor="rgba(35,42,55,1)" />
        </linearGradient>
        <linearGradient id="buildingTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(70,80,95,1)" />
          <stop offset="100%" stopColor="rgba(55,65,80,1)" />
        </linearGradient>
        <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(40,45,55,1)" />
          <stop offset="100%" stopColor="rgba(30,35,45,1)" />
        </linearGradient>
        <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(25,30,40,1)" />
          <stop offset="100%" stopColor="rgba(20,25,35,1)" />
        </linearGradient>
        
        {/* Glow effect */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Ground plane */}
      <path
        d="M 50 450 L 400 250 L 750 450 L 400 550 Z"
        fill="url(#groundGrad)"
        opacity="0.6"
      />

      {/* Grid lines on ground */}
      <g opacity="0.15" stroke="rgba(255,255,255,0.3)" strokeWidth="1">
        <line x1="150" y1="400" x2="400" y2="300" />
        <line x1="250" y1="450" x2="400" y2="375" />
        <line x1="350" y1="500" x2="400" y2="450" />
        <line x1="200" y1="350" x2="600" y2="350" />
        <line x1="150" y1="400" x2="650" y2="400" />
      </g>

      {/* Main warehouse building - right side */}
      <g>
        {/* Building base */}
        <path
          d="M 480 280 L 680 380 L 680 480 L 480 380 Z"
          fill="url(#buildingSide)"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="2"
        />
        <path
          d="M 280 180 L 480 280 L 480 380 L 280 280 Z"
          fill="url(#buildingFace)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="2"
        />
        <path
          d="M 280 180 L 480 280 L 680 380 L 480 280 L 680 180 L 480 80 Z"
          fill="url(#buildingTop)"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="2"
        />

        {/* Dock doors on front face */}
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect
              x={300 + i * 40}
              y={240 + i * 20}
              width="30"
              height="35"
              fill="rgba(20,25,35,0.8)"
              stroke={showActivity ? 'rgba(56,189,248,0.6)' : 'rgba(255,255,255,0.2)'}
              strokeWidth="1.5"
              rx="2"
            />
            {showActivity && i === 1 && (
              <motion.rect
                x={300 + i * 40}
                y={240 + i * 20}
                width="30"
                height="35"
                fill="rgba(56,189,248,0.15)"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </g>
        ))}

        {/* Windows on side */}
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={`win-${i}`}
            x={500 + i * 35}
            y={320 + i * 18}
            width="20"
            height="15"
            fill="rgba(56,189,248,0.15)"
            stroke="rgba(56,189,248,0.3)"
            strokeWidth="1"
            rx="1"
            opacity="0.6"
          />
        ))}
      </g>

      {/* Guard shack / gate building - left side */}
      <g>
        <path
          d="M 120 380 L 200 340 L 200 400 L 120 440 Z"
          fill="url(#buildingSide)"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1.5"
        />
        <path
          d="M 40 340 L 120 380 L 120 440 L 40 400 Z"
          fill="url(#buildingFace)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
        />
        <path
          d="M 40 340 L 120 300 L 200 340 L 120 380 Z"
          fill="url(#buildingTop)"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.5"
        />
        
        {/* Gate window with glow */}
        <rect
          x="60"
          y="360"
          width="35"
          height="25"
          fill="rgba(56,189,248,0.25)"
          stroke="rgba(56,189,248,0.5)"
          strokeWidth="1.5"
          rx="2"
          filter={showActivity ? "url(#glow)" : undefined}
        />
      </g>

      {/* Road/path: inbound lane → ingate → yard route → outgate → outbound lane */}
      {/* Inbound lane (before fence) */}
      <path
        d="M 20 480 L 80 450 L 140 420"
        fill="none"
        stroke="url(#roadGrad)"
        strokeWidth="50"
        opacity="0.5"
      />
      <path
        d="M 25 478 L 85 448 L 143 418"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="2"
        strokeDasharray="12 8"
        opacity="0.4"
      />
      
      {/* Internal yard road */}
      <path
        d="M 140 420 L 180 395 L 220 370 L 280 340 L 340 315 L 400 290 L 460 270"
        fill="none"
        stroke="url(#roadGrad)"
        strokeWidth="50"
        opacity="0.6"
      />
      <path
        d="M 145 418 L 185 393 L 225 368 L 285 338 L 345 313 L 405 288 L 463 268"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="2"
        strokeDasharray="12 8"
        opacity="0.4"
      />
      
      {/* Outbound exit lane (past fence) */}
      <path
        d="M 460 270 L 520 250 L 580 235 L 640 225 L 700 220 L 760 220"
        fill="none"
        stroke="url(#roadGrad)"
        strokeWidth="50"
        opacity="0.5"
      />
      <path
        d="M 463 268 L 523 248 L 583 233 L 643 223 L 703 218 L 763 218"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="2"
        strokeDasharray="12 8"
        opacity="0.4"
      />
      
      {/* Fence/boundary markers */}
      <line
        x1="120"
        y1="430"
        x2="135"
        y2="422"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="3"
        opacity="0.6"
      />
      <line
        x1="470"
        y1="280"
        x2="485"
        y2="272"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="3"
        opacity="0.6"
      />
      
      {/* INGATE structure */}
      <g id="ingate">
        {/* QR kiosk/pedestal */}
        <rect
          x="125"
          y="410"
          width="12"
          height="20"
          fill="rgba(50,60,75,1)"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.5"
          rx="2"
        />
        {/* QR scanner screen */}
        <rect
          x="127"
          y="412"
          width="8"
          height="10"
          fill={showActivity ? 'rgba(56,189,248,0.6)' : 'rgba(30,35,45,1)'}
          stroke={showActivity ? 'rgba(56,189,248,0.8)' : 'rgba(255,255,255,0.2)'}
          strokeWidth="1"
          rx="1"
          filter={showActivity ? "url(#glow)" : undefined}
        />
        
        {/* Gate barrier arm */}
        <motion.line
          x1="140"
          y1="418"
          x2="160"
          y2="410"
          stroke="rgba(244,63,94,0.8)"
          strokeWidth="3"
          strokeLinecap="round"
          animate={showActivity ? { rotate: [-5, 85, -5], x: [0, 5, 0] } : {}}
          transition={showActivity ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : {}}
          style={{ transformOrigin: '140px 418px' }}
        />
      </g>
      
      {/* OUTGATE structure */}
      <g id="outgate">
        {/* Outgate kiosk */}
        <rect
          x="463"
          y="260"
          width="12"
          height="18"
          fill="rgba(50,60,75,1)"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.5"
          rx="2"
        />
        {/* Outgate screen */}
        <rect
          x="465"
          y="262"
          width="8"
          height="9"
          fill={showActivity ? 'rgba(56,189,248,0.6)' : 'rgba(30,35,45,1)'}
          stroke={showActivity ? 'rgba(56,189,248,0.8)' : 'rgba(255,255,255,0.2)'}
          strokeWidth="1"
          rx="1"
          filter={showActivity ? "url(#glow)" : undefined}
        />
        
        {/* Outgate barrier arm */}
        <motion.line
          x1="475"
          y1="268"
          x2="492"
          y2="261"
          stroke="rgba(56,189,248,0.8)"
          strokeWidth="3"
          strokeLinecap="round"
          animate={showActivity ? { rotate: [-5, 85, -5], x: [0, 4, 0] } : {}}
          transition={showActivity ? { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 } : {}}
          style={{ transformOrigin: '475px 268px' }}
        />
      </g>

      {/* Parking/staging area markers */}
      {[0, 1, 2].map((i) => (
        <rect
          key={`spot-${i}`}
          x={200 + i * 60}
          y={420 - i * 30}
          width="45"
          height="25"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          rx="2"
        />
      ))}

      {/* Lighting poles */}
      {[
        { x: 150, y: 360 },
        { x: 350, y: 300 },
        { x: 550, y: 360 },
      ].map((pos, i) => (
        <g key={`light-${i}`}>
          <line
            x1={pos.x}
            y1={pos.y}
            x2={pos.x}
            y2={pos.y - 40}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
          />
          <circle
            cx={pos.x}
            cy={pos.y - 42}
            r="4"
            fill={showActivity ? 'rgba(56,189,248,0.8)' : 'rgba(255,255,255,0.4)'}
            filter={showActivity ? "url(#glow)" : undefined}
          />
          {showActivity && (
            <motion.circle
              cx={pos.x}
              cy={pos.y - 42}
              r="8"
              fill="rgba(56,189,248,0.2)"
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            />
          )}
        </g>
      ))}
    </svg>
  );
}
