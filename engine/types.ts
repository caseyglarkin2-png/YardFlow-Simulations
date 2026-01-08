// Simulation Engine Type Definitions

export type SimMode = 'before' | 'after';

export type EventType =
  | 'arrive'
  | 'queue_start'
  | 'paperwork_start'
  | 'paperwork_end'
  | 'call_dispatch'
  | 'qr_scan'
  | 'verified'
  | 'assigned_lane'
  | 'assigned_door'
  | 'wrong_turn'
  | 'reroute_manual'
  | 'docked'
  | 'loading_start'
  | 'loading_end'
  | 'checkout_paperwork'
  | 'digital_checkout'
  | 'checkout_complete'
  | 'exit_gate'
  | 'exit_road'
  | 'exception_detected'
  | 'exception_resolved'
  | 'door_occupied'
  | 'door_idle'
  | 'move_start'
  | 'move_end';

export interface SimEvent {
  t: number; // time in seconds
  type: EventType;
  actorId: string;
  payload?: Record<string, any>;
}

export interface Actor {
  id: string;
  type: 'truck' | 'staff' | 'door' | 'spotter';
  x: number;
  y: number;
  rotation?: number;
  status?: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  mode: SimMode;
  durationSec: number;
  events: SimEvent[];
  actors: Actor[];
}

export interface SimState {
  currentTime: number;
  isPlaying: boolean;
  speed: number;
  events: SimEvent[];
  processedEvents: SimEvent[];
  actors: Map<string, Actor>;
  metrics: Record<string, number | string>;
}

export interface MetricDefinition {
  id: string;
  label: string;
  unit: string;
  compute: (events: SimEvent[], currentTime: number, extraParams?: any) => number | string;
  format?: (value: number | string) => string;
}
