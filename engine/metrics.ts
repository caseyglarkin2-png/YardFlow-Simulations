import { SimEvent, MetricDefinition } from './types';

// Metric computation functions
export const driverMetrics: MetricDefinition[] = [
  {
    id: 'gate_time',
    label: 'Gate Time',
    unit: 'min',
    compute: (events: SimEvent[]) => {
      const queueStart = events.find(e => e.type === 'queue_start');
      const assigned = events.find(e => e.type === 'assigned_lane' || e.type === 'assigned_door');
      if (!queueStart || !assigned) return 0;
      return Math.round((assigned.t - queueStart.t) / 60);
    },
    format: (val) => `${val}m`,
  },
  {
    id: 'total_dwell',
    label: 'Total Dwell',
    unit: 'min',
    compute: (events: SimEvent[]) => {
      const arrive = events.find(e => e.type === 'arrive');
      const exit = events.find(e => e.type === 'exit_road');
      if (!arrive || !exit) return 0;
      return Math.round((exit.t - arrive.t) / 60);
    },
    format: (val) => `${val}m`,
  },
  {
    id: 'touchpoints',
    label: 'Driver Touchpoints',
    unit: 'count',
    compute: (events: SimEvent[]) => {
      const touchpointEvents = ['paperwork_start', 'call_dispatch', 'reroute_manual', 'checkout_paperwork', 'qr_scan'];
      return events.filter(e => touchpointEvents.includes(e.type)).length;
    },
    format: (val) => `${val}`,
  },
  {
    id: 'detention_risk',
    label: 'Detention Risk',
    unit: 'boolean',
    compute: (events: SimEvent[]) => {
      const arrive = events.find(e => e.type === 'arrive');
      const exit = events.find(e => e.type === 'exit_road');
      if (!arrive || !exit) return 'Low';
      const dwellMin = (exit.t - arrive.t) / 60;
      return dwellMin > 180 ? 'High' : 'Low';
    },
  },
];

export const facilityMetrics: MetricDefinition[] = [
  {
    id: 'queue_length',
    label: 'Queue Length',
    unit: 'trucks',
    compute: (events: SimEvent[], currentTime: number) => {
      const queued = events.filter(e => e.type === 'queue_start' && e.t <= currentTime);
      const dequeued = events.filter(e => e.type === 'assigned_door' && e.t <= currentTime);
      return Math.max(0, queued.length - dequeued.length);
    },
    format: (val) => `${val}`,
  },
  {
    id: 'door_utilization',
    label: 'Door Utilization',
    unit: '%',
    compute: (events: SimEvent[], currentTime: number) => {
      const doorEvents = events.filter(e => e.t <= currentTime && (e.type === 'door_occupied' || e.type === 'door_idle'));
      const occupied = doorEvents.filter(e => e.type === 'door_occupied').length;
      const total = doorEvents.length;
      return total > 0 ? Math.round((occupied / total) * 100) : 0;
    },
    format: (val) => `${val}%`,
  },
  {
    id: 'moves_per_hour',
    label: 'Moves/Hour',
    unit: 'moves/hr',
    compute: (events: SimEvent[], currentTime: number) => {
      const moves = events.filter(e => e.type === 'move_end' && e.t <= currentTime).length;
      const hours = currentTime / 3600;
      return hours > 0 ? Math.round(moves / hours) : 0;
    },
    format: (val) => `${val}`,
  },
  {
    id: 'exceptions',
    label: 'Exceptions',
    unit: 'count',
    compute: (events: SimEvent[], currentTime: number) => {
      return events.filter(e => e.type === 'exception_detected' && e.t <= currentTime).length;
    },
    format: (val) => `${val}`,
  },
  {
    id: 'avg_dwell',
    label: 'Avg Dwell',
    unit: 'min',
    compute: (events: SimEvent[], currentTime: number) => {
      const completed = events.filter(e => e.type === 'exit_road' && e.t <= currentTime);
      if (completed.length === 0) return 0;
      
      const dwells = completed.map(exit => {
        const arrive = events.find(e => e.type === 'arrive' && e.actorId === exit.actorId && e.t < exit.t);
        return arrive ? (exit.t - arrive.t) / 60 : 0;
      });
      
      return Math.round(dwells.reduce((sum, d) => sum + d, 0) / dwells.length);
    },
    format: (val) => `${val}m`,
  },
];

export const networkMetrics: MetricDefinition[] = [
  {
    id: 'eta_accuracy',
    label: 'ETA Accuracy',
    unit: '%',
    compute: (events: SimEvent[], currentTime: number, facilityCount: number = 1) => {
      // ETA accuracy improves logarithmically with network size
      const baseAccuracy = 45;
      const maxAccuracy = 92;
      const improvement = (maxAccuracy - baseAccuracy) * Math.log(facilityCount + 1) / Math.log(31);
      return Math.round(baseAccuracy + improvement);
    },
    format: (val) => `${val}%`,
  },
  {
    id: 'avg_dwell',
    label: 'Avg Dwell',
    unit: 'min',
    compute: (events: SimEvent[], currentTime: number, facilityCount: number = 1) => {
      // Dwell time decreases with network effects
      const baseDwell = 165;
      const minDwell = 85;
      const reduction = (baseDwell - minDwell) * Math.log(facilityCount + 1) / Math.log(31);
      return Math.round(baseDwell - reduction);
    },
    format: (val) => `${val}m`,
  },
  {
    id: 'turn_index',
    label: 'Turn Index',
    unit: 'x',
    compute: (events: SimEvent[], currentTime: number, facilityCount: number = 1) => {
      // Turn index improves with standardization
      const baseIndex = 0.78;
      const maxIndex = 1.25;
      const improvement = (maxIndex - baseIndex) * Math.log(facilityCount + 1) / Math.log(31);
      return (baseIndex + improvement).toFixed(2);
    },
    format: (val) => `${val}x`,
  },
  {
    id: 'cash_released',
    label: 'Cash Released',
    unit: '$M',
    compute: (events: SimEvent[], currentTime: number, facilityCount: number = 1) => {
      // Cash released grows with network efficiency
      const perFacilityBase = 0.8;
      const networkMultiplier = 1 + Math.log(facilityCount + 1) / Math.log(31) * 0.4;
      return (facilityCount * perFacilityBase * networkMultiplier).toFixed(1);
    },
    format: (val) => `$${val}M`,
  },
];

export function computeMetrics(
  metricDefs: MetricDefinition[],
  events: SimEvent[],
  currentTime: number,
  extraParams?: any
): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  
  metricDefs.forEach(def => {
    const value = def.compute(events, currentTime, extraParams);
    results[def.id] = value;
  });
  
  return results;
}
