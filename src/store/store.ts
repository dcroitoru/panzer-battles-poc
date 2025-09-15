import { createStore } from "solid-js/store";
import { GameState, ReplaySpeed } from "../game/types/types";
import { createEffect, createSignal } from "solid-js";
import { createUnit, createUnitId, Unit, UnitType } from "../game/types/unit";
import { createTick } from "../game/game";

const initialState0: UnitType[] = ["lightTank"];
const initialState1: UnitType[] = ["lightTank"];
const initialState: Unit[] = [
  ...initialState0.map((t, x) => createUnit(createUnitId(), t, 0, { x, y: 0 })),
  ...initialState1.map((t, x) => createUnit(createUnitId(), t, 1, { x, y: 0 })),
];

export const [units, setUnits] = createStore(initialState);
export const [speed, setSpeed] = createSignal<ReplaySpeed>(2);
export const [isPlaying, setIsPlaying] = createSignal(false);

export const tickDelta = 0.25;

let intId: number | undefined;
let currentState: GameState;
const maxTicks = 120;
export const stop = () => {
  //   clearInterval(intId);
  //   setIsPlaying(false);
  //   intId = undefined;
};
export const play = () => {
  //   if (intId !== undefined) {
  //     stop();
  //     return;
  //   }
  //   console.log("should set interval id");
  //   setIsPlaying(true);
  //   currentState = initialGameState;
  //   intId = setInterval(() => {
  //     let { state, event } = createTick(currentState);
  //     if (state.tick > maxTicks) stop();
  //     if (state.gameplayState === "ended") stop();
  //     console.log(state);
  //     if (event.events.length > 0) console.log(event);
  //     currentState = state;
  //     // units.forEach((u, i) => {
  //     //   const cd = u.cooldown - tickDelta;
  //     //   setUnits(i, "cooldown", cd > 0 ? cd : u.base.cooldown);
  //     // });
  //   }, 0); //(tickDelta * 1000) / speed());
};

// createEffect(() => {
//   if (speed()) stop();
//   console.log("should start playing");

//   play();
// });

const initialGameState: GameState = {
  tick: 0,
  outcome: "no-outcome",
  gameplayState: "not-started",
  units: {
    all: new Map(initialState.map((u) => [u.id, u])),
    0: [0],
    1: [1],
  },
};
