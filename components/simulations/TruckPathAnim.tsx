'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { YARD_PATHS } from './YardPaths';

type TruckPathAnimProps = {
  pathString: string;
  duration: number;
  delay?: number;
  color?: string;
  loop?: boolean;
  onComplete?: () => void;
};

export function TruckPathAnim({
  pathString,
  duration,
  delay = 0,
  color = 'rgba(56,189,248,0.9)',
  loop = true,
  onComplete,
}: TruckPathAnimProps) {
  const [pathLength, setPathLength] = useState(0);
  const [pathEl, setPathEl] = useState<SVGPathElement | null>(null);

  // Create hidden path for calculations
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathString);
      setPathEl(path);
      setPathLength(path.getTotalLength());
    }
  }, [pathString]);

  if (!pathEl || pathLength === 0) return null;

  return (
    <motion.g
      animate={{
        offsetDistance: ['0%', '100%'],
      }}
      transition={{
        duration,
        delay,
        repeat: loop ? Infinity : 0,
        ease: 'linear',
        onComplete,
      }}
      style={{
        offsetPath: `path('${pathString}')`,
        offsetRotate: 'auto 0deg',
      }}
    >
      {/* Truck cab */}
      <rect
        x="-12"
        y="-8"
        width="24"
        height="16"
        rx="2"
        fill={color}
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
      />
      {/* Truck windshield */}
      <rect
        x="6"
        y="-6"
        width="5"
        height="12"
        fill="rgba(20,25,35,0.8)"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="0.5"
      />
      {/* Trailer */}
      <rect
        x="-35"
        y="-7"
        width="20"
        height="14"
        rx="1"
        fill="rgba(40,45,55,0.9)"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
      />
      {/* Wheels */}
      <circle cx="-28" cy="8" r="2.5" fill="rgba(20,25,35,1)" />
      <circle cx="-20" cy="8" r="2.5" fill="rgba(20,25,35,1)" />
      <circle cx="5" cy="8" r="2.5" fill="rgba(20,25,35,1)" />
      <circle cx="-3" cy="8" r="2.5" fill="rgba(20,25,35,1)" />
      
      {/* Headlights glow */}
      <motion.circle
        cx="12"
        cy="-4"
        r="3"
        fill={color}
        opacity="0.6"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.circle
        cx="12"
        cy="4"
        r="3"
        fill={color}
        opacity="0.6"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
      />
    </motion.g>
  );
}

// Complete journey truck that follows the full path through the yard
export function YardJourneyTruck({
  mode,
  delay = 0,
}: {
  mode: 'before' | 'after';
  delay?: number;
}) {
  const color = mode === 'before' ? 'rgba(244,63,94,0.8)' : 'rgba(56,189,248,0.9)';
  const duration = mode === 'before' ? 18 : 12; // Slower in before mode

  return (
    <TruckPathAnim
      pathString={YARD_PATHS.fullJourney}
      duration={duration}
      delay={delay}
      color={color}
      loop={true}
    />
  );
}
