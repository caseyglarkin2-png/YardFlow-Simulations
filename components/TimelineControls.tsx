'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimelineControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSeek: (time: number) => void;
  onSpeedChange: (speed: number) => void;
}

export default function TimelineControls({
  isPlaying,
  currentTime,
  duration,
  speed,
  onPlay,
  onPause,
  onReset,
  onSeek,
  onSpeedChange,
}: TimelineControlsProps) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const speeds = [0.5, 1, 1.5, 2];

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        {/* Play/Pause */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          className="rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 p-2 transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 text-cyan-400" />
          ) : (
            <Play className="h-5 w-5 text-cyan-400" />
          )}
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          className="rounded-lg bg-white/5 hover:bg-white/10 p-2 transition-colors"
          aria-label="Reset"
        >
          <RotateCcw className="h-5 w-5 text-white/60" />
        </button>

        {/* Time Display */}
        <div className="text-sm text-white/60 font-mono">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        <div className="flex-1" />

        {/* Speed Controls */}
        <div className="flex gap-1">
          {speeds.map(s => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                speed === s
                  ? 'bg-cyan-500/30 text-cyan-400'
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Scrub Bar */}
      <div className="relative">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
            style={{ width: `${progress}%` }}
            initial={false}
          />
        </div>
        <input
          type="range"
          min="0"
          max={duration}
          step="0.1"
          value={currentTime}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Timeline scrubber"
        />
      </div>
    </div>
  );
}
