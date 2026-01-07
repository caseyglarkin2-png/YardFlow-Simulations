'use client';

import React from 'react';
import { motion } from 'framer-motion';

type TruckPosition = {
  x: number;
  y: number;
  rotation: number;
};

export function AnimatedTruck({
  path,
  duration = 8,
  delay = 0,
  color = 'rgba(56,189,248,0.9)',
}: {
  path: TruckPosition[];
  duration?: number;
  delay?: number;
  color?: string;
}) {
  return (
    <motion.g
      animate={{
        x: path.map((p) => p.x),
        y: path.map((p) => p.y),
        rotate: path.map((p) => p.rotation),
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
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
        opacity="0.3"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.circle
        cx="12"
        cy="4"
        r="3"
        fill={color}
        opacity="0.3"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
      />
    </motion.g>
  );
}
