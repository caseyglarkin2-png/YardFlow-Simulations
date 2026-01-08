import { SimState, SimEvent, Scenario, Actor } from './types';

export type SimAction =
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'TICK'; deltaTime: number }
  | { type: 'SEEK'; time: number }
  | { type: 'SET_SPEED'; speed: number }
  | { type: 'LOAD_SCENARIO'; scenario: Scenario };

export function createInitialState(scenario: Scenario): SimState {
  const actorsMap = new Map<string, Actor>();
  scenario.actors.forEach(actor => {
    actorsMap.set(actor.id, { ...actor });
  });

  return {
    currentTime: 0,
    isPlaying: false,
    speed: 1,
    events: [...scenario.events].sort((a, b) => a.t - b.t),
    processedEvents: [],
    actors: actorsMap,
    metrics: {},
  };
}

export function simReducer(state: SimState, action: SimAction): SimState {
  switch (action.type) {
    case 'PLAY':
      return { ...state, isPlaying: true };

    case 'PAUSE':
      return { ...state, isPlaying: false };

    case 'RESET':
      return {
        ...state,
        currentTime: 0,
        isPlaying: false,
        processedEvents: [],
      };

    case 'SET_SPEED':
      return { ...state, speed: action.speed };

    case 'SEEK': {
      const newTime = Math.max(0, Math.min(action.time, getScenarioDuration(state)));
      const processedEvents = state.events.filter(e => e.t <= newTime);
      return {
        ...state,
        currentTime: newTime,
        processedEvents,
      };
    }

    case 'TICK': {
      if (!state.isPlaying) return state;

      const newTime = state.currentTime + action.deltaTime * state.speed;
      const scenarioDuration = getScenarioDuration(state);

      // Loop back to start if we've reached the end
      const wrappedTime = newTime > scenarioDuration ? 0 : newTime;

      // Find events that should be processed
      const newlyProcessedEvents = state.events.filter(
        e =>
          e.t > state.currentTime &&
          e.t <= wrappedTime &&
          !state.processedEvents.some(pe => pe === e)
      );

      // If we wrapped around, reset processed events
      const processedEvents =
        newTime > scenarioDuration
          ? state.events.filter(e => e.t <= wrappedTime)
          : [...state.processedEvents, ...newlyProcessedEvents];

      // Update actor positions based on events
      const updatedActors = new Map(state.actors);
      newlyProcessedEvents.forEach(event => {
        if (event.payload?.x !== undefined && event.payload?.y !== undefined) {
          const actor = updatedActors.get(event.actorId);
          if (actor) {
            updatedActors.set(event.actorId, {
              ...actor,
              x: event.payload.x,
              y: event.payload.y,
              rotation: event.payload.rotation ?? actor.rotation,
              status: event.type,
            });
          }
        }
      });

      return {
        ...state,
        currentTime: wrappedTime,
        processedEvents,
        actors: updatedActors,
      };
    }

    case 'LOAD_SCENARIO': {
      return createInitialState(action.scenario);
    }

    default:
      return state;
  }
}

export function getScenarioDuration(state: SimState): number {
  if (state.events.length === 0) return 60;
  return Math.max(...state.events.map(e => e.t));
}

export function getActiveEvents(state: SimState): SimEvent[] {
  return state.processedEvents;
}

export function getRecentEvents(state: SimState, count: number = 5): SimEvent[] {
  return state.processedEvents.slice(-count);
}
