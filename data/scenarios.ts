import type { Scenario, Point, SimEvent } from "@/engine/simTypes";

const pt = (x: number, y: number): Point => ({ x, y });

/**
 * Scene coordinate system: SVG viewBox 0 0 1000 600
 * Waypoints: left road -> gate -> yard -> doors -> exit road
 */
const W = {
  roadIn: pt(80, 360),
  gate: pt(230, 360),
  queueA: pt(170, 315),
  queueB: pt(150, 360),
  queueC: pt(170, 405),
  lane: pt(380, 360),
  yardLoopTop: pt(520, 270),
  yardLoopMid: pt(520, 360),
  yardLoopBot: pt(520, 450),
  door1: pt(820, 190),
  door2: pt(820, 290),
  door3: pt(820, 390),
  door4: pt(820, 490),
  exitGate: pt(230, 360),
  roadOut: pt(940, 360),
};

function ev(
  id: string,
  t: number,
  type: SimEvent["type"],
  label: string,
  opts: Partial<SimEvent> = {}
): SimEvent {
  return { id, t, type, label, ...opts };
}

const driverActors = [
  { id: "truck_main", kind: "truck" as const, label: "Driver" },
  { id: "truck_q1", kind: "truck" as const, label: "Queue" },
  { id: "truck_q2", kind: "truck" as const, label: "Queue" },
];

const doors = [
  { id: "D1", label: "Door 1", at: W.door1 },
  { id: "D2", label: "Door 2", at: W.door2 },
  { id: "D3", label: "Door 3", at: W.door3 },
  { id: "D4", label: "Door 4", at: W.door4 },
];

export const scenarios: Record<string, Scenario> = {
  driver_before: {
    id: "driver_before",
    tab: "driver",
    mode: "before",
    title: "Driver Journey (Before)",
    description:
      "Manual verification, queue friction, wrong turns, delayed assignment, paperwork checkout — and finally an exit.",
    durationSec: 380,
    actors: driverActors,
    doors,
    motions: [
      {
        actorId: "truck_main",
        segments: [
          { t0: 0, t1: 5, from: W.roadIn, to: W.gate, ease: "easeInOut" },
          { t0: 5, t1: 20, from: W.gate, to: W.queueB, ease: "easeInOut" },
          { t0: 20, t1: 45, from: W.queueB, to: W.queueB },
          { t0: 45, t1: 70, from: W.queueB, to: W.lane, ease: "easeInOut" },
          { t0: 70, t1: 90, from: W.lane, to: W.yardLoopTop, ease: "easeInOut" }, // wrong turn
          { t0: 90, t1: 105, from: W.yardLoopTop, to: W.lane, ease: "easeInOut" }, // recover
          { t0: 105, t1: 120, from: W.lane, to: W.door2, ease: "easeInOut" },
          { t0: 120, t1: 180, from: W.door2, to: W.door2 },
          { t0: 180, t1: 300, from: W.door2, to: W.door2 },
          { t0: 300, t1: 340, from: W.door2, to: W.exitGate, ease: "easeInOut" },
          { t0: 340, t1: 380, from: W.exitGate, to: W.roadOut, ease: "easeInOut" },
        ],
      },
      // Static queue trucks
      { actorId: "truck_q1", segments: [{ t0: 0, t1: 380, from: W.queueA, to: W.queueA }] },
      { actorId: "truck_q2", segments: [{ t0: 0, t1: 380, from: W.queueC, to: W.queueC }] },
    ],
    events: [
      ev("d0", 0, "arrive", "Arrive at yard"),
      ev("d1", 5, "queue_start", "Queue begins", { severity: "warn" }),
      ev("d2", 20, "paperwork_start", "Paperwork / ID checks", { touchpoint: true, severity: "warn" }),
      ev("d3", 45, "paperwork_end", "Manual verification complete", { severity: "info" }),
      ev("d4", 50, "note", "Call dispatch for instructions", { touchpoint: true, severity: "warn" }),
      ev("d5", 70, "wrong_turn", "Wrong turn (yard confusion)", { touchpoint: true, severity: "bad" }),
      ev("d6", 90, "reroute_manual", "Manual reroute", { touchpoint: true, severity: "warn" }),
      ev("d7", 105, "assigned_door", "Door assigned: D2", { doorId: "D2", severity: "info" }),
      ev("d8", 120, "docked", "Docked at D2", { doorId: "D2", severity: "info" }),
      ev("d9", 180, "loading_start", "Loading begins", { doorId: "D2", severity: "info" }),
      ev("d10", 300, "loading_end", "Loading complete", { doorId: "D2", severity: "good" }),
      ev("d11", 310, "checkout_start", "Checkout paperwork", { touchpoint: true, severity: "warn" }),
      ev("d12", 340, "checkout_end", "Checkout complete", { severity: "info" }),
      ev("d13", 360, "exit_gate", "Exit gate", { severity: "good" }),
      ev("d14", 380, "exit_road", "Exit road — trip resumes", { severity: "good" }),
    ],
    assumptions: [
      { label: "Mechanism shown", value: "Manual verification + calls + misroutes increase touchpoints and dwell." },
      { label: "Detention risk", value: "Flagged at 4+ hours dwell (illustrative)." },
    ],
  },

  driver_after: {
    id: "driver_after",
    tab: "driver",
    mode: "after",
    title: "Driver Journey (After YNS)",
    description:
      "Touchless check-in via QR, instant lane/door instruction, guided route, digital checkout, explicit exit.",
    durationSec: 170,
    actors: driverActors,
    doors,
    routeHint: [W.gate, W.lane, W.door2, W.exitGate, W.roadOut],
    motions: [
      {
        actorId: "truck_main",
        segments: [
          { t0: 0, t1: 3, from: W.roadIn, to: W.gate, ease: "easeInOut" },
          { t0: 3, t1: 12, from: W.gate, to: W.lane, ease: "easeInOut" },
          { t0: 12, t1: 40, from: W.lane, to: W.door2, ease: "easeInOut" },
          { t0: 40, t1: 130, from: W.door2, to: W.door2 },
          { t0: 130, t1: 150, from: W.door2, to: W.exitGate, ease: "easeInOut" },
          { t0: 150, t1: 165, from: W.exitGate, to: W.roadOut, ease: "easeInOut" },
        ],
      },
      { actorId: "truck_q1", segments: [{ t0: 0, t1: 170, from: W.queueA, to: W.queueA }] },
      { actorId: "truck_q2", segments: [{ t0: 0, t1: 170, from: W.queueC, to: W.queueC }] },
    ],
    events: [
      ev("a0", 0, "arrive", "Arrive (pre-arrival visible)"),
      ev("a1", 3, "qr_scan", "QR scan at gate", { touchpoint: true, severity: "info" }),
      ev("a2", 6, "verified", "Credential verified", { severity: "good" }),
      ev("a3", 8, "assigned_lane", "Assigned lane", { severity: "info" }),
      ev("a4", 12, "assigned_door", "Door assigned: D2", { doorId: "D2", severity: "info" }),
      ev("a5", 40, "docked", "Docked at D2", { doorId: "D2", severity: "info" }),
      ev("a6", 40, "loading_start", "Loading begins", { doorId: "D2", severity: "info" }),
      ev("a7", 130, "loading_end", "Loading complete", { doorId: "D2", severity: "good" }),
      ev("a8", 135, "checkout_end", "Digital checkout complete", { severity: "good" }),
      ev("a9", 150, "exit_gate", "Exit gate", { severity: "good" }),
      ev("a10", 165, "exit_road", "Exit road — trip resumes", { severity: "good" }),
    ],
    assumptions: [
      { label: "Mechanism shown", value: "QR → verification → instruction → route → dock → digital checkout." },
      { label: "Touchpoints", value: "Only the QR interaction is a driver touchpoint (illustrative)." },
    ],
  },

  ops_before: {
    id: "ops_before",
    tab: "ops",
    mode: "before",
    title: "Facility Ops (Before)",
    description: "Reactive radio dispatch, doors idle while queue grows, exceptions discovered late.",
    durationSec: 360,
    actors: [
      { id: "t1", kind: "truck", label: "Truck 1" },
      { id: "t2", kind: "truck", label: "Truck 2" },
      { id: "t3", kind: "truck", label: "Truck 3" },
      { id: "spot", kind: "spotter", label: "Spotter" },
    ],
    doors,
    motions: [
      {
        actorId: "t1",
        segments: [
          { t0: 0, t1: 10, from: W.roadIn, to: W.queueB, ease: "easeInOut" },
          { t0: 10, t1: 90, from: W.queueB, to: W.queueB },
          { t0: 90, t1: 120, from: W.queueB, to: W.door1, ease: "easeInOut" },
          { t0: 120, t1: 220, from: W.door1, to: W.door1 },
          { t0: 220, t1: 260, from: W.door1, to: W.exitGate, ease: "easeInOut" },
          { t0: 260, t1: 300, from: W.exitGate, to: W.roadOut, ease: "easeInOut" },
        ],
      },
      {
        actorId: "t2",
        segments: [
          { t0: 20, t1: 40, from: W.roadIn, to: W.queueA, ease: "easeInOut" },
          { t0: 40, t1: 160, from: W.queueA, to: W.queueA },
          { t0: 160, t1: 190, from: W.queueA, to: W.door2, ease: "easeInOut" },
          { t0: 190, t1: 320, from: W.door2, to: W.door2 },
          { t0: 320, t1: 360, from: W.door2, to: W.roadOut, ease: "easeInOut" },
        ],
      },
      {
        actorId: "t3",
        segments: [
          { t0: 60, t1: 80, from: W.roadIn, to: W.queueC, ease: "easeInOut" },
          { t0: 80, t1: 240, from: W.queueC, to: W.queueC },
          { t0: 240, t1: 270, from: W.queueC, to: W.door3, ease: "easeInOut" },
          { t0: 270, t1: 350, from: W.door3, to: W.door3 },
          { t0: 350, t1: 360, from: W.door3, to: W.roadOut, ease: "easeInOut" },
        ],
      },
      {
        actorId: "spot",
        segments: [
          { t0: 0, t1: 60, from: W.yardLoopMid, to: W.yardLoopTop, ease: "easeInOut" },
          { t0: 60, t1: 140, from: W.yardLoopTop, to: W.yardLoopBot, ease: "easeInOut" },
          { t0: 140, t1: 220, from: W.yardLoopBot, to: W.yardLoopMid, ease: "easeInOut" },
          { t0: 220, t1: 360, from: W.yardLoopMid, to: W.yardLoopMid },
        ],
      },
    ],
    events: [
      ev("o0", 0, "arrive", "Truck 1 arrives", { actorId: "t1" }),
      ev("o1", 10, "queue_start", "Truck 1 queued", { actorId: "t1", severity: "warn" }),
      ev("o2", 20, "arrive", "Truck 2 arrives", { actorId: "t2" }),
      ev("o3", 40, "queue_start", "Truck 2 queued", { actorId: "t2", severity: "warn" }),
      ev("o4", 60, "arrive", "Truck 3 arrives", { actorId: "t3" }),
      ev("o5", 80, "queue_start", "Truck 3 queued", { actorId: "t3", severity: "warn" }),

      ev("o6", 70, "yard_move", "Spotter move (reactive)", { actorId: "spot", severity: "info" }),
      ev("o7", 125, "yard_move", "Spotter move (reactive)", { actorId: "spot", severity: "info" }),
      ev("o8", 210, "yard_move", "Spotter move (reactive)", { actorId: "spot", severity: "info" }),

      ev("o9", 90, "assigned_door", "Truck 1 assigned: D1", { actorId: "t1", doorId: "D1" }),
      ev("o10", 120, "loading_start", "D1 occupied", { actorId: "t1", doorId: "D1" }),
      ev("o11", 220, "loading_end", "D1 freed", { actorId: "t1", doorId: "D1", severity: "good" }),
      ev("o12", 300, "exit_road", "Truck 1 exits", { actorId: "t1", severity: "good" }),

      ev("o13", 160, "assigned_door", "Truck 2 assigned: D2", { actorId: "t2", doorId: "D2" }),
      ev("o14", 190, "loading_start", "D2 occupied", { actorId: "t2", doorId: "D2" }),
      ev("o15", 260, "exception", "Exception discovered late (rework)", { actorId: "t2", severity: "bad", touchpoint: true }),
      ev("o16", 320, "loading_end", "D2 freed", { actorId: "t2", doorId: "D2", severity: "good" }),
      ev("o17", 360, "exit_road", "Truck 2 exits", { actorId: "t2", severity: "good" }),

      ev("o18", 240, "assigned_door", "Truck 3 assigned: D3", { actorId: "t3", doorId: "D3" }),
      ev("o19", 270, "loading_start", "D3 occupied", { actorId: "t3", doorId: "D3" }),
      ev("o20", 350, "loading_end", "D3 freed", { actorId: "t3", doorId: "D3", severity: "good" }),
      ev("o21", 360, "exit_road", "Truck 3 exits", { actorId: "t3", severity: "good" }),
    ],
    assumptions: [
      { label: "Mechanism shown", value: "Door assignment happens late; exceptions surface late; queue persists." },
      { label: "Door utilization", value: "Occupied if loading_start has occurred and loading_end has not (per door)." },
    ],
  },

  ops_after: {
    id: "ops_after",
    tab: "ops",
    mode: "after",
    title: "Facility Ops (After YNS)",
    description: "Arrival visibility + dynamic assignment increases door utilization, reduces queue, moves become planned.",
    durationSec: 300,
    actors: [
      { id: "t1", kind: "truck", label: "Truck 1" },
      { id: "t2", kind: "truck", label: "Truck 2" },
      { id: "t3", kind: "truck", label: "Truck 3" },
      { id: "spot", kind: "spotter", label: "Spotter" },
    ],
    doors,
    routeHint: [W.gate, W.lane, W.door1],
    motions: [
      {
        actorId: "t1",
        segments: [
          { t0: 0, t1: 8, from: W.roadIn, to: W.gate, ease: "easeInOut" },
          { t0: 8, t1: 20, from: W.gate, to: W.door1, ease: "easeInOut" },
          { t0: 20, t1: 120, from: W.door1, to: W.door1 },
          { t0: 120, t1: 150, from: W.door1, to: W.roadOut, ease: "easeInOut" },
        ],
      },
      {
        actorId: "t2",
        segments: [
          { t0: 25, t1: 35, from: W.roadIn, to: W.gate, ease: "easeInOut" },
          { t0: 35, t1: 50, from: W.gate, to: W.door2, ease: "easeInOut" },
          { t0: 50, t1: 170, from: W.door2, to: W.door2 },
          { t0: 170, t1: 205, from: W.door2, to: W.roadOut, ease: "easeInOut" },
        ],
      },
      {
        actorId: "t3",
        segments: [
          { t0: 60, t1: 70, from: W.roadIn, to: W.gate, ease: "easeInOut" },
          { t0: 70, t1: 90, from: W.gate, to: W.door3, ease: "easeInOut" },
          { t0: 90, t1: 220, from: W.door3, to: W.door3 },
          { t0: 220, t1: 260, from: W.door3, to: W.roadOut, ease: "easeInOut" },
        ],
      },
      {
        actorId: "spot",
        segments: [
          { t0: 0, t1: 40, from: W.yardLoopTop, to: W.yardLoopMid, ease: "easeInOut" },
          { t0: 40, t1: 120, from: W.yardLoopMid, to: W.yardLoopBot, ease: "easeInOut" },
          { t0: 120, t1: 300, from: W.yardLoopBot, to: W.yardLoopMid, ease: "easeInOut" },
        ],
      },
    ],
    events: [
      ev("oa0", 0, "arrive", "Truck 1 arrives (visible)", { actorId: "t1" }),
      ev("oa1", 8, "qr_scan", "Truck 1 QR check-in", { actorId: "t1", touchpoint: true, severity: "info" }),
      ev("oa2", 12, "assigned_door", "Truck 1 assigned: D1", { actorId: "t1", doorId: "D1" }),
      ev("oa3", 20, "loading_start", "D1 occupied", { actorId: "t1", doorId: "D1" }),
      ev("oa4", 120, "loading_end", "D1 freed", { actorId: "t1", doorId: "D1", severity: "good" }),
      ev("oa5", 150, "exit_road", "Truck 1 exits", { actorId: "t1", severity: "good" }),

      ev("oa6", 25, "arrive", "Truck 2 arrives (visible)", { actorId: "t2" }),
      ev("oa7", 35, "qr_scan", "Truck 2 QR check-in", { actorId: "t2", touchpoint: true, severity: "info" }),
      ev("oa8", 40, "exception", "Exception detected early (reroute)", { actorId: "t2", severity: "warn" }),
      ev("oa9", 45, "assigned_door", "Truck 2 assigned: D2", { actorId: "t2", doorId: "D2" }),
      ev("oa10", 50, "loading_start", "D2 occupied", { actorId: "t2", doorId: "D2" }),
      ev("oa11", 170, "loading_end", "D2 freed", { actorId: "t2", doorId: "D2", severity: "good" }),
      ev("oa12", 205, "exit_road", "Truck 2 exits", { actorId: "t2", severity: "good" }),

      ev("oa13", 60, "arrive", "Truck 3 arrives (visible)", { actorId: "t3" }),
      ev("oa14", 70, "qr_scan", "Truck 3 QR check-in", { actorId: "t3", touchpoint: true, severity: "info" }),
      ev("oa15", 75, "assigned_door", "Truck 3 assigned: D3", { actorId: "t3", doorId: "D3" }),
      ev("oa16", 90, "loading_start", "D3 occupied", { actorId: "t3", doorId: "D3" }),
      ev("oa17", 220, "loading_end", "D3 freed", { actorId: "t3", doorId: "D3", severity: "good" }),
      ev("oa18", 260, "exit_road", "Truck 3 exits", { actorId: "t3", severity: "good" }),

      ev("oa19", 40, "yard_move", "Planned move", { actorId: "spot", severity: "info" }),
      ev("oa20", 120, "yard_move", "Planned move", { actorId: "spot", severity: "info" }),
      ev("oa21", 200, "yard_move", "Planned move", { actorId: "spot", severity: "info" }),
    ],
    assumptions: [
      { label: "Mechanism shown", value: "Earlier visibility + assignment reduces queue, raises utilization." },
      { label: "Exceptions", value: "Surfaced early to avoid long rework cycles." },
    ],
  },

  network_before: {
    id: "network_before",
    tab: "network",
    mode: "before",
    title: "Network Effect (Before)",
    description: "Facilities operate as isolated islands. Scale doesn't compound intelligence.",
    durationSec: 30,
    actors: [],
    events: Array.from({ length: 31 }).map((_, i) =>
      ev(`nb_pulse_${i}`, i, "pulse", "Isolated pulse (no shared protocol)", { severity: "info" })
    ),
    assumptions: [
      { label: "Model", value: "Improvements saturate slowly without shared protocols." },
      { label: "Interpretation", value: "Illustrative only — swap assumptions as you learn." },
    ],
  },

  network_after: {
    id: "network_after",
    tab: "network",
    mode: "after",
    title: "Network Effect (After YNS)",
    description: "Facilities become nodes. Protocol + visibility compounds across the network.",
    durationSec: 30,
    actors: [],
    events: Array.from({ length: 31 }).map((_, i) =>
      ev(`na_pulse_${i}`, i, "pulse", "Protocol pulse (shared intelligence)", { severity: "good" })
    ),
    assumptions: [
      { label: "Model", value: "ETA accuracy and turn index saturate as nodes join the network." },
      { label: "Cash released", value: "Derived from dwell reduction × sites (simple model; make yours real)." },
    ],
  },
};

export function getScenario(tab: "driver" | "ops" | "network", mode: "before" | "after") {
  const key = `${tab}_${mode}` as const;
  return scenarios[key];
}
