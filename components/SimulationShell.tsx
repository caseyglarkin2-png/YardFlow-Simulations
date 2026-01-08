'use client';

import React, { useReducer, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight } from 'lucide-react';
import { simReducer, createInitialState, getScenarioDuration } from '@/engine/simEngine';
import { computeMetrics, driverMetrics, facilityMetrics, networkMetrics } from '@/engine/metrics';
import { scenarios, ScenarioType } from '@/data/scenarios';
import { SimMode, MetricDefinition } from '@/engine/types';
import TimelineControls from './TimelineControls';
import EventLog from './EventLog';
import TelemetryPanel from './TelemetryPanel';
import YardScene from './canvas/YardScene';

interface SimulationShellProps {
  scenarioType: ScenarioType;
}

export default function SimulationShell({ scenarioType }: SimulationShellProps) {
  const [mode, setMode] = useState<SimMode>('before');
  const [facilityCount, setFacilityCount] = useState(1); // For network scenario
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  const scenario = scenarios[scenarioType][mode];
  const [state, dispatch] = useReducer(simReducer, scenario, createInitialState);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(Date.now());

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement) return;
      
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          if (state.isPlaying) {
            dispatch({ type: 'PAUSE' });
          } else {
            dispatch({ type: 'PLAY' });
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          dispatch({ type: 'SEEK', time: Math.max(0, state.currentTime - 5) });
          break;
        case 'ArrowRight':
          e.preventDefault();
          dispatch({ type: 'SEEK', time: Math.min(getScenarioDuration(state), state.currentTime + 5) });
          break;
        case 'r':
          e.preventDefault();
          dispatch({ type: 'RESET' });
          break;
        case '1':
          dispatch({ type: 'SET_SPEED', speed: 0.5 });
          break;
        case '2':
          dispatch({ type: 'SET_SPEED', speed: 1 });
          break;
        case '3':
          dispatch({ type: 'SET_SPEED', speed: 1.5 });
          break;
        case '4':
          dispatch({ type: 'SET_SPEED', speed: 2 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [state.isPlaying, state.currentTime]);

  // Load scenario when mode changes
  useEffect(() => {
    const newScenario = scenarios[scenarioType][mode];
    dispatch({ type: 'LOAD_SCENARIO', scenario: newScenario });
  }, [scenarioType, mode]);

  // Animation loop
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const deltaTime = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      dispatch({ type: 'TICK', deltaTime });
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    if (state.isPlaying) {
      animationFrameRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.isPlaying]);

  // Compute metrics
  const metricDefs: MetricDefinition[] =
    scenarioType === 'driver'
      ? driverMetrics
      : scenarioType === 'facility'
      ? facilityMetrics
      : networkMetrics;

  const metrics = computeMetrics(
    metricDefs,
    state.processedEvents,
    state.currentTime,
    scenarioType === 'network' ? facilityCount : undefined
  );

  const duration = getScenarioDuration(state);

  const scenarioTitles = {
    driver: 'Driver Experience',
    facility: 'Facility Operations',
    network: 'Network Effect',
  };

  const scenarioDescriptions = {
    driver: 'Complete journey from arrival to exit',
    facility: 'Queue dynamics, door utilization, and throughput',
    network: 'Intelligence compounds as facilities join the network',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6 mb-6">
        <div className="flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            {scenarioTitles[scenarioType]}
          </h2>
          <p className="text-base sm:text-lg text-white/70">
            {scenarioDescriptions[scenarioType]}
          </p>
        </div>

        {/* Mode Toggle */}
        <button
          onClick={() => setMode(mode === 'before' ? 'after' : 'before')}
          className="group flex-shrink-0 w-full sm:w-auto"
        >
          <div className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-3 sm:p-4 hover:bg-white/[0.07] transition-colors">
            <div className="flex items-center justify-between sm:justify-start gap-2 mb-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Viewing
              </div>
              <ArrowLeftRight className="h-3 w-3 text-white/60 group-hover:translate-x-1 transition-transform" />
            </div>
            <div
              className={`text-lg sm:text-xl font-bold ${
                mode === 'before' ? 'text-amber-400' : 'text-cyan-400'
              }`}
            >
              {mode === 'before' ? 'Before YardFlow' : 'After YardFlow'}
            </div>
          </div>
        </button>
      </div>

      {/* Network Facility Slider */}
      {scenarioType === 'network' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold uppercase tracking-wider text-white/60">
              Facilities in Network
            </div>
            <div className="text-2xl font-bold text-cyan-400">{facilityCount}</div>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            value={facilityCount}
            onChange={(e) => setFacilityCount(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400"
          />
          <div className="flex justify-between mt-2 text-xs text-white/40">
            <span>Single Site</span>
            <span>Multi-Site Network</span>
          </div>
        </div>
      )}

      {/* Timeline Controls */}
      <TimelineControls
        isPlaying={state.isPlaying}
        currentTime={state.currentTime}
        duration={duration}
        speed={state.speed}
        onPlay={() => dispatch({ type: 'PLAY' })}
        onPause={() => dispatch({ type: 'PAUSE' })}
        onReset={() => dispatch({ type: 'RESET' })}
        onSeek={(time) => dispatch({ type: 'SEEK', time })}
        onSpeedChange={(speed) => dispatch({ type: 'SET_SPEED', speed })}
      />

      {/* Three Column Layout - Mobile stacks vertically */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Center: Simulation Canvas - Shows first on mobile */}
        <div className="lg:col-span-6 order-1 lg:order-2">
          <YardScene
            actors={state.actors}
            mode={mode}
            scenarioType={scenarioType}
            facilityCount={scenarioType === 'network' ? facilityCount : undefined}
            reducedMotion={prefersReducedMotion}
          />
        </div>

        {/* Left: Event Log */}
        <div className="lg:col-span-3 order-2 lg:order-1">
          <EventLog events={state.processedEvents} />
        </div>

        {/* Right: Telemetry */}
        <div className="lg:col-span-3 order-3">
          <TelemetryPanel metrics={metrics} metricDefs={metricDefs} mode={mode} />
        </div>
      </div>
      
      {/* Keyboard shortcuts hint */}
      <div className="mt-4 text-center text-xs text-white/40">
        <span className="hidden sm:inline">Keyboard: Space/K = Play/Pause • ← → = Seek • R = Reset • 1-4 = Speed</span>
      </div>
    </div>
  );
}
