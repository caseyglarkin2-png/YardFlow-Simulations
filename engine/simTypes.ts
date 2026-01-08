export type SimTab = "driver" | "ops" | "network";
export type SimMode = "before" | "after";

export type Severity = "info" | "good" | "warn" | "bad";

export type Point = { x: number; y: number };

export type ActorKind = "truck" | "spotter" | "staff";

export type SimActor = {
  id: string;
  kind: ActorKind;
  label: string;
};

export type Door = {
  id: string;
  label: string;
  at: Point;
};

export type SimEvent = {
  id: string;
  t: number; // seconds
  type:
    | "arrive"
    | "queue_start"
    | "paperwork_start"
    | "paperwork_end"
    | "qr_scan"
    | "verified"
    | "assigned_lane"
    | "assigned_door"
    | "wrong_turn"
    | "reroute_manual"
    | "docked"
    | "loading_start"
    | "loading_end"
    | "checkout_start"
    | "checkout_end"
    | "exit_gate"
    | "exit_road"
    | "yard_move"
    | "exception"
    | "pulse"
    | "note";
  label: string;
  actorId?: string;
  doorId?: string;
  touchpoint?: boolean;
  severity?: Severity;
};

export type PathSegment = {
  t0: number;
  t1: number;
  from: Point;
  to: Point;
  ease?: "linear" | "easeInOut";
};

export type ActorMotion = {
  actorId: string;
  segments: PathSegment[];
};

export type Scenario = {
  id: string;
  tab: SimTab;
  mode: SimMode;
  title: string;
  description: string;
  durationSec: number;

  actors: SimActor[];
  doors?: Door[];

  motions?: ActorMotion[];
  routeHint?: Point[]; // for AFTER mode highlight

  events: SimEvent[];

  assumptions?: {
    label: string;
    value: string;
  }[];
};
