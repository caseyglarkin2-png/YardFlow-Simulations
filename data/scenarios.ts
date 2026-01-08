import { Scenario } from '../engine/types';

// Driver Experience Scenarios
export const driverBeforeScenario: Scenario = {
  id: 'driver-before',
  title: 'Before YardFlow',
  description: 'Manual check-in with paperwork, delays, and confusion',
  mode: 'before',
  durationSec: 380,
  actors: [
    { id: 'truck-1', type: 'truck', x: -50, y: 400, rotation: 0 },
  ],
  events: [
    { t: 0, type: 'arrive', actorId: 'truck-1', payload: { x: 50, y: 400, rotation: 0 } },
    { t: 5, type: 'queue_start', actorId: 'truck-1', payload: { x: 100, y: 420, rotation: -15 } },
    { t: 20, type: 'paperwork_start', actorId: 'truck-1', payload: { x: 140, y: 410 } },
    { t: 45, type: 'paperwork_end', actorId: 'truck-1', payload: { x: 140, y: 410 } },
    { t: 50, type: 'call_dispatch', actorId: 'truck-1', payload: { x: 140, y: 410 } },
    { t: 70, type: 'wrong_turn', actorId: 'truck-1', payload: { x: 200, y: 380, rotation: -30 } },
    { t: 90, type: 'reroute_manual', actorId: 'truck-1', payload: { x: 240, y: 360 } },
    { t: 120, type: 'assigned_door', actorId: 'truck-1', payload: { x: 280, y: 340, rotation: -35 } },
    { t: 180, type: 'docked', actorId: 'truck-1', payload: { x: 350, y: 300, rotation: -40 } },
    { t: 180, type: 'loading_start', actorId: 'truck-1', payload: { x: 350, y: 300 } },
    { t: 300, type: 'loading_end', actorId: 'truck-1', payload: { x: 350, y: 300 } },
    { t: 310, type: 'checkout_paperwork', actorId: 'truck-1', payload: { x: 350, y: 300 } },
    { t: 340, type: 'checkout_complete', actorId: 'truck-1', payload: { x: 420, y: 260, rotation: -35 } },
    { t: 360, type: 'exit_gate', actorId: 'truck-1', payload: { x: 520, y: 210, rotation: -30 } },
    { t: 380, type: 'exit_road', actorId: 'truck-1', payload: { x: 650, y: 150, rotation: -25 } },
  ],
};

export const driverAfterScenario: Scenario = {
  id: 'driver-after',
  title: 'After YardFlow',
  description: 'QR scan, instant routing, smooth flow',
  mode: 'after',
  durationSec: 165,
  actors: [
    { id: 'truck-1', type: 'truck', x: -50, y: 400, rotation: 0 },
  ],
  events: [
    { t: 0, type: 'arrive', actorId: 'truck-1', payload: { x: 50, y: 400, rotation: 0 } },
    { t: 3, type: 'qr_scan', actorId: 'truck-1', payload: { x: 120, y: 420, rotation: -15 } },
    { t: 6, type: 'verified', actorId: 'truck-1', payload: { x: 140, y: 410 } },
    { t: 8, type: 'assigned_lane', actorId: 'truck-1', payload: { x: 160, y: 400, rotation: -20 } },
    { t: 12, type: 'assigned_door', actorId: 'truck-1', payload: { x: 220, y: 370, rotation: -30 } },
    { t: 40, type: 'docked', actorId: 'truck-1', payload: { x: 350, y: 300, rotation: -40 } },
    { t: 40, type: 'loading_start', actorId: 'truck-1', payload: { x: 350, y: 300 } },
    { t: 130, type: 'loading_end', actorId: 'truck-1', payload: { x: 350, y: 300 } },
    { t: 135, type: 'digital_checkout', actorId: 'truck-1', payload: { x: 350, y: 300 } },
    { t: 150, type: 'exit_gate', actorId: 'truck-1', payload: { x: 520, y: 210, rotation: -30 } },
    { t: 165, type: 'exit_road', actorId: 'truck-1', payload: { x: 650, y: 150, rotation: -25 } },
  ],
};

// Facility Operations Scenarios
export const facilityBeforeScenario: Scenario = {
  id: 'facility-before',
  title: 'Before YardFlow',
  description: 'Manual operations with low utilization and exceptions',
  mode: 'before',
  durationSec: 600,
  actors: [
    { id: 'truck-1', type: 'truck', x: -50, y: 400, rotation: 0 },
    { id: 'truck-2', type: 'truck', x: -50, y: 420, rotation: 0 },
    { id: 'truck-3', type: 'truck', x: -50, y: 440, rotation: 0 },
    { id: 'door-1', type: 'door', x: 350, y: 280, status: 'idle' },
    { id: 'door-2', type: 'door', x: 350, y: 320, status: 'idle' },
    { id: 'door-3', type: 'door', x: 350, y: 360, status: 'idle' },
    { id: 'spotter-1', type: 'spotter', x: 200, y: 300 },
  ],
  events: [
    // Truck 1
    { t: 0, type: 'arrive', actorId: 'truck-1', payload: { x: 50, y: 400 } },
    { t: 5, type: 'queue_start', actorId: 'truck-1', payload: { x: 100, y: 420 } },
    { t: 45, type: 'assigned_door', actorId: 'truck-1', payload: { x: 280, y: 340 } },
    { t: 90, type: 'docked', actorId: 'truck-1', payload: { x: 350, y: 300 } },
    { t: 90, type: 'door_occupied', actorId: 'door-1', payload: {} },
    { t: 250, type: 'exception_detected', actorId: 'truck-1', payload: { message: 'Wrong BOL' } },
    { t: 320, type: 'exit_road', actorId: 'truck-1', payload: { x: 650, y: 150 } },
    { t: 320, type: 'door_idle', actorId: 'door-1', payload: {} },
    
    // Truck 2
    { t: 20, type: 'arrive', actorId: 'truck-2', payload: { x: 50, y: 420 } },
    { t: 25, type: 'queue_start', actorId: 'truck-2', payload: { x: 100, y: 440 } },
    { t: 120, type: 'assigned_door', actorId: 'truck-2', payload: { x: 280, y: 360 } },
    { t: 180, type: 'docked', actorId: 'truck-2', payload: { x: 350, y: 320 } },
    { t: 180, type: 'door_occupied', actorId: 'door-2', payload: {} },
    { t: 360, type: 'exit_road', actorId: 'truck-2', payload: { x: 650, y: 150 } },
    { t: 360, type: 'door_idle', actorId: 'door-2', payload: {} },
    
    // Truck 3
    { t: 60, type: 'arrive', actorId: 'truck-3', payload: { x: 50, y: 440 } },
    { t: 65, type: 'queue_start', actorId: 'truck-3', payload: { x: 100, y: 460 } },
    { t: 200, type: 'assigned_door', actorId: 'truck-3', payload: { x: 280, y: 380 } },
    { t: 260, type: 'docked', actorId: 'truck-3', payload: { x: 350, y: 360 } },
    { t: 260, type: 'door_occupied', actorId: 'door-3', payload: {} },
    { t: 450, type: 'exit_road', actorId: 'truck-3', payload: { x: 650, y: 150 } },
    { t: 450, type: 'door_idle', actorId: 'door-3', payload: {} },
    
    // Spotter moves
    { t: 100, type: 'move_start', actorId: 'spotter-1', payload: { x: 200, y: 300 } },
    { t: 150, type: 'move_end', actorId: 'spotter-1', payload: { x: 280, y: 340 } },
    { t: 300, type: 'move_start', actorId: 'spotter-1', payload: { x: 280, y: 340 } },
    { t: 340, type: 'move_end', actorId: 'spotter-1', payload: { x: 200, y: 300 } },
  ],
};

export const facilityAfterScenario: Scenario = {
  id: 'facility-after',
  title: 'After YardFlow',
  description: 'Optimized operations with high door utilization',
  mode: 'after',
  durationSec: 400,
  actors: [
    { id: 'truck-1', type: 'truck', x: -50, y: 400, rotation: 0 },
    { id: 'truck-2', type: 'truck', x: -50, y: 420, rotation: 0 },
    { id: 'truck-3', type: 'truck', x: -50, y: 440, rotation: 0 },
    { id: 'truck-4', type: 'truck', x: -50, y: 460, rotation: 0 },
    { id: 'door-1', type: 'door', x: 350, y: 280, status: 'idle' },
    { id: 'door-2', type: 'door', x: 350, y: 320, status: 'idle' },
    { id: 'door-3', type: 'door', x: 350, y: 360, status: 'idle' },
    { id: 'spotter-1', type: 'spotter', x: 200, y: 300 },
  ],
  events: [
    // Truck 1 - fast flow
    { t: 0, type: 'arrive', actorId: 'truck-1', payload: { x: 50, y: 400 } },
    { t: 3, type: 'qr_scan', actorId: 'truck-1', payload: { x: 120, y: 420 } },
    { t: 8, type: 'assigned_door', actorId: 'truck-1', payload: { x: 220, y: 370 } },
    { t: 30, type: 'docked', actorId: 'truck-1', payload: { x: 350, y: 300 } },
    { t: 30, type: 'door_occupied', actorId: 'door-1', payload: {} },
    { t: 20, type: 'exception_detected', actorId: 'truck-1', payload: { message: 'Wrong BOL' } },
    { t: 25, type: 'exception_resolved', actorId: 'truck-1', payload: {} },
    { t: 140, type: 'exit_road', actorId: 'truck-1', payload: { x: 650, y: 150 } },
    { t: 140, type: 'door_idle', actorId: 'door-1', payload: {} },
    
    // Truck 2
    { t: 10, type: 'arrive', actorId: 'truck-2', payload: { x: 50, y: 420 } },
    { t: 13, type: 'qr_scan', actorId: 'truck-2', payload: { x: 120, y: 440 } },
    { t: 18, type: 'assigned_door', actorId: 'truck-2', payload: { x: 220, y: 390 } },
    { t: 50, type: 'docked', actorId: 'truck-2', payload: { x: 350, y: 320 } },
    { t: 50, type: 'door_occupied', actorId: 'door-2', payload: {} },
    { t: 170, type: 'exit_road', actorId: 'truck-2', payload: { x: 650, y: 150 } },
    { t: 170, type: 'door_idle', actorId: 'door-2', payload: {} },
    
    // Truck 3
    { t: 30, type: 'arrive', actorId: 'truck-3', payload: { x: 50, y: 440 } },
    { t: 33, type: 'qr_scan', actorId: 'truck-3', payload: { x: 120, y: 460 } },
    { t: 38, type: 'assigned_door', actorId: 'truck-3', payload: { x: 220, y: 410 } },
    { t: 70, type: 'docked', actorId: 'truck-3', payload: { x: 350, y: 360 } },
    { t: 70, type: 'door_occupied', actorId: 'door-3', payload: {} },
    { t: 200, type: 'exit_road', actorId: 'truck-3', payload: { x: 650, y: 150 } },
    { t: 200, type: 'door_idle', actorId: 'door-3', payload: {} },
    
    // Truck 4 - reuses door 1
    { t: 90, type: 'arrive', actorId: 'truck-4', payload: { x: 50, y: 460 } },
    { t: 93, type: 'qr_scan', actorId: 'truck-4', payload: { x: 120, y: 480 } },
    { t: 145, type: 'assigned_door', actorId: 'truck-4', payload: { x: 220, y: 370 } },
    { t: 175, type: 'docked', actorId: 'truck-4', payload: { x: 350, y: 300 } },
    { t: 175, type: 'door_occupied', actorId: 'door-1', payload: {} },
    { t: 300, type: 'exit_road', actorId: 'truck-4', payload: { x: 650, y: 150 } },
    { t: 300, type: 'door_idle', actorId: 'door-1', payload: {} },
    
    // More spotter moves
    { t: 40, type: 'move_start', actorId: 'spotter-1', payload: { x: 200, y: 300 } },
    { t: 60, type: 'move_end', actorId: 'spotter-1', payload: { x: 280, y: 340 } },
    { t: 120, type: 'move_start', actorId: 'spotter-1', payload: { x: 280, y: 340 } },
    { t: 140, type: 'move_end', actorId: 'spotter-1', payload: { x: 200, y: 300 } },
    { t: 190, type: 'move_start', actorId: 'spotter-1', payload: { x: 200, y: 300 } },
    { t: 210, type: 'move_end', actorId: 'spotter-1', payload: { x: 280, y: 360 } },
  ],
};

// Network Effect Scenarios (simplified - metrics are computed from facility count)
export const networkBeforeScenario: Scenario = {
  id: 'network-before',
  title: 'Before YardFlow',
  description: 'Isolated facilities with no shared intelligence',
  mode: 'before',
  durationSec: 60,
  actors: [],
  events: [],
};

export const networkAfterScenario: Scenario = {
  id: 'network-after',
  title: 'After YardFlow',
  description: 'Connected facilities with compounding intelligence',
  mode: 'after',
  durationSec: 60,
  actors: [],
  events: [],
};

export type ScenarioType = 'driver' | 'facility' | 'network';

export const scenarios: Record<ScenarioType, { before: Scenario; after: Scenario }> = {
  driver: {
    before: driverBeforeScenario,
    after: driverAfterScenario,
  },
  facility: {
    before: facilityBeforeScenario,
    after: facilityAfterScenario,
  },
  network: {
    before: networkBeforeScenario,
    after: networkAfterScenario,
  },
};
