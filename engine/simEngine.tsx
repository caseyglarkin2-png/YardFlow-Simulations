"use client";

import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import type { Scenario, SimEvent } from "./simTypes";

type State = {
  scenario: Scenario;
  timeSec: number;
  isPlaying: boolean;
  speed: number;
  fired: Record<string, true>;
  log: SimEvent[];
};

type Action =
  | { type: "SET_SCENARIO"; scenario: Scenario }
  | { type: "SET_TIME"; timeSec: number }
  | { type: "TOGGLE_PLAY" }
  | { type: "SET_PLAYING"; value: boolean }
  | { type: "SET_SPEED"; speed: number }
  | { type: "RESTART" }
  | { type: "TICK"; deltaSec: number };

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function recompute(scenario: Scenario, timeSec: number) {
  const fired: Record<string, true> = {};
  const log: SimEvent[] = [];
  for (const ev of scenario.events) {
    if (ev.t <= timeSec) {
      fired[ev.id] = true;
      log.push(ev);
    }
  }
  log.sort((a, b) => a.t - b.t);
  return { fired, log };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_SCENARIO": {
      const timeSec = 0;
      const { fired, log } = recompute(action.scenario, timeSec);
      return { ...state, scenario: action.scenario, timeSec, fired, log, isPlaying: false };
    }
    case "SET_TIME": {
      const t = clamp(action.timeSec, 0, state.scenario.durationSec);
      const { fired, log } = recompute(state.scenario, t);
      return { ...state, timeSec: t, fired, log };
    }
    case "TOGGLE_PLAY":
      return { ...state, isPlaying: !state.isPlaying };
    case "SET_PLAYING":
      return { ...state, isPlaying: action.value };
    case "SET_SPEED":
      return { ...state, speed: action.speed };
    case "RESTART": {
      const timeSec = 0;
      const { fired, log } = recompute(state.scenario, timeSec);
      return { ...state, timeSec, fired, log, isPlaying: false };
    }
    case "TICK": {
      if (!state.isPlaying) return state;
      const next = state.timeSec + action.deltaSec * state.speed;
      const timeSec = clamp(next, 0, state.scenario.durationSec);
      const { fired, log } = recompute(state.scenario, timeSec);
      const done = timeSec >= state.scenario.durationSec - 1e-6;
      return { ...state, timeSec, fired, log, isPlaying: done ? false : state.isPlaying };
    }
    default:
      return state;
  }
}

const SimCtx = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function SimProvider({
  scenario,
  children,
}: {
  scenario: Scenario;
  children: React.ReactNode;
}) {
  const initial = useMemo<State>(() => {
    const { fired, log } = recompute(scenario, 0);
    return {
      scenario,
      timeSec: 0,
      isPlaying: false,
      speed: 1,
      fired,
      log,
    };
  }, [scenario]);

  const [state, dispatch] = useReducer(reducer, initial);

  // Keep reducer scenario in sync if prop changes
  useEffect(() => {
    dispatch({ type: "SET_SCENARIO", scenario });
  }, [scenario]);

  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);

  useEffect(() => {
    function loop(now: number) {
      if (lastRef.current == null) lastRef.current = now;
      const deltaMs = now - lastRef.current;
      lastRef.current = now;

      dispatch({ type: "TICK", deltaSec: deltaMs / 1000 });

      rafRef.current = requestAnimationFrame(loop);
    }

    if (state.isPlaying) {
      rafRef.current = requestAnimationFrame(loop);
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        lastRef.current = null;
      };
    }
  }, [state.isPlaying, state.speed]);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <SimCtx.Provider value={value}>{children}</SimCtx.Provider>;
}

export function useSim() {
  const ctx = useContext(SimCtx);
  if (!ctx) throw new Error("useSim must be used within SimProvider");
  return ctx;
}
