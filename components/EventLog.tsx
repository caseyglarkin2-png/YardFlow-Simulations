'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertCircle, CheckCircle2, Clock, FileText, Navigation, Phone, QrCode, TrendingUp } from 'lucide-react';
import { SimEvent } from '@/engine/types';

interface EventLogProps {
  events: SimEvent[];
  maxEvents?: number;
}

const eventIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  arrive: Navigation,
  queue_start: Clock,
  paperwork_start: FileText,
  paperwork_end: CheckCircle2,
  call_dispatch: Phone,
  qr_scan: QrCode,
  verified: CheckCircle2,
  assigned_lane: Navigation,
  assigned_door: Navigation,
  wrong_turn: AlertCircle,
  reroute_manual: AlertCircle,
  docked: CheckCircle2,
  loading_start: Activity,
  loading_end: CheckCircle2,
  checkout_paperwork: FileText,
  digital_checkout: QrCode,
  checkout_complete: CheckCircle2,
  exit_gate: TrendingUp,
  exit_road: CheckCircle2,
  exception_detected: AlertCircle,
  exception_resolved: CheckCircle2,
  door_occupied: Activity,
  door_idle: Clock,
  move_start: Activity,
  move_end: CheckCircle2,
};

const eventLabels: Record<string, string> = {
  arrive: 'Arrived at facility',
  queue_start: 'Joined queue',
  paperwork_start: 'Started paperwork',
  paperwork_end: 'Completed paperwork',
  call_dispatch: 'Called dispatch',
  qr_scan: 'QR code scanned',
  verified: 'Credentials verified',
  assigned_lane: 'Lane assigned',
  assigned_door: 'Door assigned',
  wrong_turn: 'Wrong turn',
  reroute_manual: 'Manual reroute',
  docked: 'Docked at door',
  loading_start: 'Loading started',
  loading_end: 'Loading completed',
  checkout_paperwork: 'Checkout paperwork',
  digital_checkout: 'Digital checkout',
  checkout_complete: 'Checkout complete',
  exit_gate: 'Exited gate',
  exit_road: 'Left facility',
  exception_detected: 'Exception detected',
  exception_resolved: 'Exception resolved',
  door_occupied: 'Door occupied',
  door_idle: 'Door available',
  move_start: 'Move started',
  move_end: 'Move completed',
};

export default function EventLog({ events, maxEvents = 8 }: EventLogProps) {
  const displayEvents = events.slice(-maxEvents).reverse();

  const getEventColor = (type: string): string => {
    if (type.includes('exception') || type.includes('wrong')) return 'text-amber-400';
    if (type.includes('complete') || type.includes('verified') || type.includes('exit')) return 'text-cyan-400';
    if (type.includes('checkout') || type.includes('qr')) return 'text-cyan-400';
    return 'text-white/60';
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4">
      <div className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-4">
        Live Event Log
      </div>
      
      <div className="space-y-2 min-h-[300px]">
        <AnimatePresence mode="popLayout">
          {displayEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-white/40 italic py-8 text-center"
            >
              No events yet...
            </motion.div>
          ) : (
            displayEvents.map((event, index) => {
              const Icon = eventIcons[event.type] || Activity;
              const label = eventLabels[event.type] || event.type;
              const color = getEventColor(event.type);
              
              return (
                <motion.div
                  key={`${event.t}-${event.type}-${event.actorId}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-3 p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${color}`} />
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${color}`}>
                      {label}
                    </div>
                    {event.payload?.message && (
                      <div className="text-xs text-white/40 mt-0.5">
                        {event.payload.message}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-white/30 font-mono flex-shrink-0">
                    {Math.floor(event.t / 60)}:{(Math.floor(event.t) % 60).toString().padStart(2, '0')}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
