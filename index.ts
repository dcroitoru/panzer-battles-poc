import { createInitialState, createTick, tickDelta } from "./src/game/game";
import { printEvent } from "./src/game/print";
import { GameTickEvent } from "./src/game/types/events";
import { GameState } from "./src/game/types/game";
import { Unit, UnitType } from "./src/game/unit";

const maxTicks = 180;
const simulate = (initialState: GameState): GameTickEvent[] => {
  let state = initialState;
  let events: GameTickEvent[] = [];
  while (state.gameplayState !== "ended" && state.tick <= maxTicks) {
    const tick = createTick(state);
    // console.log("tick", tick.state.tick);

    state = tick.state;
    if (tick.event.events.length) {
      events.push(tick.event);
      tick.event.events.forEach((e) => console.log(`[t-${tick.event.tick}:${tick.event.tick * tickDelta}s]`, printEvent(e, state)));
    }
  }
  console.log(state.outcome);

  return events;
};

const p1 = [
  ["regulars", "lightTank", "conscripts"],
  ["regulars", "lightTank", "conscripts"],
] as UnitType[][];
const p2 = [
  ["conscripts", "regulars", "lightTank"],
  ["conscripts", "regulars", "lightTank"],
] as UnitType[][];

const initial = createInitialState(p1, p2);

simulate(initial);
