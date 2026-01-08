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
  
  const scenario = scenarios[scenarioType][mode];
  const [state, dispatch] = useReducer(simReducer, scenario, createInitialState);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(Date.now());

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
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
            {scenarioTitles[scenarioType]}
          </h2>
          <p className="text-lg text-white/70">
            {scenarioDescriptions[scenarioType]}
          </p>
        </div>

        {/* Mode Toggle */}
        <button
          onClick={() => setMode(mode === 'before' ? 'after' : 'before')}
          className="group flex-shrink-0"
        >
          <div className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 hover:bg-white/[0.07] transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Viewing
              </div>
              <ArrowLeftRight className="h-3 w-3 text-white/60 group-hover:translate-x-1 transition-transform" />
            </div>
            <div
              className={`text-xl font-bold ${
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

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Event Log */}
        <div className="lg:col-span-3">
          <EventLog events={state.processedEvents} />
        </div>

        {/* Center: Simulation Canvas */}
        <div className="lg:col-span-6">
          <YardScene
            actors={state.actors}
            mode={mode}
            scenarioType={scenarioType}
            facilityCount={scenarioType === 'network' ? facilityCount : undefined}
          />
        </div>

        {/* Right: Telemetry */}
        <div className="lg:col-span-3">
          <TelemetryPanel metrics={metrics} metricDefs={metricDefs} mode={mode} />
        </div>
      </div>
    </div>
  );
}
