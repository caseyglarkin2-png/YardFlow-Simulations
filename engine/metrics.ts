import type { Scenario, SimEvent } from "./simTypes";

function firstByType(log: SimEvent[], type: SimEvent["type"], actorId?: string) {
  return log.find((e) => e.type === type && (actorId ? e.actorId === actorId : true));
}

export function countTouchpoints(log: SimEvent[], actorId?: string) {
  return log.filter((e) => (actorId ? e.actorId === actorId : true)).filter((e) => e.touchpoint).length;
}

export function driverMetrics(scenario: Scenario, timeSec: number, log: SimEvent[]) {
  const actorId = scenario.actors.find((a) => a.kind === "truck")?.id;

  const arrive = firstByType(log, "arrive", actorId);
  const assigned = firstByType(log, "assigned_door", actorId) ?? firstByType(log, "assigned_lane", actorId);
  const exitRoad = firstByType(log, "exit_road", actorId);

  const arriveT = arrive?.t ?? null;
  const assignedT = assigned?.t ?? null;
  const exitT = exitRoad?.t ?? null;

  const gateTimeSec =
    arriveT != null
      ? (assignedT != null ? assignedT - arriveT : Math.max(0, timeSec - arriveT))
      : null;

  const dwellSec =
    arriveT != null
      ? (exitT != null ? exitT - arriveT : Math.max(0, timeSec - arriveT))
      : null;

  const touchpoints = actorId ? countTouchpoints(log, actorId) : countTouchpoints(log);

  // Simple detention heuristic: if dwell exceeds 4 hours (in-progress or finished)
  const detentionRisk = dwellSec != null && dwellSec >= 4 * 3600;

  return {
    gateTimeSec,
    dwellSec,
    touchpoints,
    detentionRisk,
    completed: !!exitT,
  };
}

export function opsMetrics(scenario: Scenario, timeSec: number, log: SimEvent[]) {
  const truckIds = scenario.actors.filter((a) => a.kind === "truck").map((a) => a.id);

  const queueing = truckIds.filter((id) => {
    const q = firstByType(log, "queue_start", id);
    const assigned = firstByType(log, "assigned_door", id);
    return !!q && !assigned;
  }).length;

  const doors = scenario.doors ?? [];
  const occupiedDoors = doors.filter((d) => {
    return isDoorOccupied(log, d.id, timeSec);
  }).length;

  const doorUtilPct = doors.length > 0 ? Math.round((occupiedDoors / doors.length) * 100) : 0;

  const moves = log.filter((e) => e.type === "yard_move").length;
  const movesPerHour = timeSec > 0 ? Math.round((moves / timeSec) * 3600) : 0;

  const exceptions = log.filter((e) => e.type === "exception").length;

  const dwells = truckIds
    .map((id) => {
      const arrive = firstByType(log, "arrive", id);
      if (!arrive) return null;
      const exit = firstByType(log, "exit_road", id);
      const endT = exit?.t ?? timeSec;
      return Math.max(0, endT - arrive.t);
    })
    .filter((n): n is number => typeof n === "number");

  const avgDwellSec = dwells.length ? Math.round(dwells.reduce((a, b) => a + b, 0) / dwells.length) : 0;

  return {
    queueing,
    doorUtilPct,
    movesPerHour,
    exceptions,
    avgDwellSec,
  };
}

export function isDoorOccupied(log: SimEvent[], doorId: string, timeSec: number) {
  const starts = log.filter((e) => e.type === "loading_start" && e.doorId === doorId);
  const ends = log.filter((e) => e.type === "loading_end" && e.doorId === doorId);

  const lastStart = starts[starts.length - 1];
  const lastEnd = ends[ends.length - 1];

  if (!lastStart) return false;
  if (!lastEnd) return lastStart.t <= timeSec;
  return lastStart.t > lastEnd.t && lastStart.t <= timeSec;
}

export function networkMetrics(mode: "before" | "after", facilitiesN: number) {
  const N = Math.max(1, Math.min(30, facilitiesN));
  // smooth saturation curve
  const sat = (k: number) => 1 - Math.exp(-k * (N - 1));

  const etaAccuracy =
    mode === "before"
      ? 0.45 + 0.12 * sat(0.06)
      : 0.55 + (0.92 - 0.55) * sat(0.10);

  const avgDwellMins =
    mode === "before"
      ? 170 - 18 * sat(0.06)
      : 165 - 55 * sat(0.09);

  const turnIndex =
    mode === "before"
      ? 1.00 + 0.06 * sat(0.05)
      : 1.05 + 0.40 * sat(0.08);

  const baselineDwell = 170; // mins (illustrative)
  const dwellReductionMins = Math.max(0, baselineDwell - avgDwellMins);
  // $ released (millions): dwell reduction → fewer buffers/detention/expedites (simple model)
  const cashReleasedM =
    mode === "before"
      ? 0.02 * N * (dwellReductionMins / 60)
      : 0.08 * N * (dwellReductionMins / 60);

  return {
    N,
    etaAccuracy,
    avgDwellMins,
    turnIndex,
    cashReleasedM,
  };
}
