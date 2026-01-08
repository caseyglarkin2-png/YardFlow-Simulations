'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { MetricDefinition } from '@/engine/types';

interface TelemetryPanelProps {
  metrics: Record<string, number | string>;
  metricDefs: MetricDefinition[];
  mode: 'before' | 'after';
}

export default function TelemetryPanel({ metrics, metricDefs, mode }: TelemetryPanelProps) {
  const getMetricTrend = (metricId: string): 'up' | 'down' | 'neutral' => {
    // Define which metrics are "good" when they go up vs down
    const lowerIsBetter = ['gate_time', 'total_dwell', 'touchpoints', 'queue_length', 'exceptions', 'avg_dwell'];
    const higherIsBetter = ['door_utilization', 'moves_per_hour', 'eta_accuracy', 'turn_index', 'cash_released'];
    
    if (mode === 'after') {
      if (lowerIsBetter.includes(metricId)) return 'down';
      if (higherIsBetter.includes(metricId)) return 'up';
    }
    return 'neutral';
  };

  const getMetricStatus = (metricId: string, value: number | string): 'good' | 'warning' | 'bad' => {
    if (mode === 'before') {
      if (metricId === 'detention_risk' && value === 'High') return 'bad';
      if (metricId === 'touchpoints' && typeof value === 'number' && value > 3) return 'warning';
      if (metricId === 'queue_length' && typeof value === 'number' && value > 5) return 'warning';
      return 'warning';
    } else {
      if (metricId === 'detention_risk' && value === 'Low') return 'good';
      if (metricId === 'door_utilization' && typeof value === 'number' && value > 75) return 'good';
      if (metricId === 'eta_accuracy' && typeof value === 'number' && value > 80) return 'good';
      return 'good';
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-4">
        Live Telemetry
      </div>
      
      {metricDefs.map((def) => {
        const value = metrics[def.id];
        const trend = getMetricTrend(def.id);
        const status = getMetricStatus(def.id, value);
        
        const statusColors = {
          good: 'text-cyan-400',
          warning: 'text-amber-400',
          bad: 'text-rose-400',
        };
        
        return (
          <motion.div
            key={def.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
                {def.label}
              </div>
              {trend !== 'neutral' && (
                <div className={`${trend === 'down' ? 'text-cyan-400' : 'text-cyan-400'}`}>
                  {trend === 'down' ? (
                    <TrendingDown className="h-3 w-3" />
                  ) : (
                    <TrendingUp className="h-3 w-3" />
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-baseline gap-2">
              <div className={`text-2xl font-bold ${statusColors[status]}`}>
                {def.format ? def.format(value) : value}
              </div>
              
              {def.id === 'detention_risk' && (
                <div className="flex items-center gap-1">
                  {value === 'High' ? (
                    <AlertTriangle className="h-4 w-4 text-rose-400" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  )}
                </div>
              )}
            </div>
            
            {def.id === 'detention_risk' && (
              <div className="text-xs text-white/40 mt-1">
                {value === 'High' ? 'May incur fees' : 'No risk'}
              </div>
            )}
          </motion.div>
        );
      })}
      
      {/* Key Impact Callout */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`rounded-xl border p-4 ${
          mode === 'after'
            ? 'border-cyan-500/30 bg-cyan-500/10'
            : 'border-amber-500/30 bg-amber-500/10'
        }`}
      >
        <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: mode === 'after' ? '#22d3ee' : '#fbbf24' }}>
          Key Impact
        </div>
        <div className="text-sm text-white/80 leading-relaxed">
          {mode === 'before' ? (
            <>
              Manual processes create <strong>friction</strong> at every step.
              Delays compound. Detention risk grows.
            </>
          ) : (
            <>
              Digital workflow eliminates <strong>touchpoints</strong>.
              Real-time orchestration reduces dwell by <strong>40-60%</strong>.
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
