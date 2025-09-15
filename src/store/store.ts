import { createStore } from "solid-js/store";
import { GameState, ReplaySpeed } from "../game/types/types";
import { createSignal } from "solid-js";
import { createTick, getUnit } from "../game/game";
import { initialState } from "./initial";
import { playAnim } from "../anim/anim";

const initialStoreState = [...initialState.units.all.values()];
export const [units, setUnits] = createSignal(initialStoreState);
export const [store, setStore] = createStore(initialState);
export const [speed, setSpeed] = createSignal<ReplaySpeed>(2);
export const [isPlaying, setIsPlaying] = createSignal(false);

export const tickDelta = 0.25;

let intId: number | undefined;
let currentState: GameState;
const maxTicks = 240;
export const stop = () => {
  clearInterval(intId);
  setIsPlaying(false);
  intId = undefined;
};
export const play = () => {
  if (intId !== undefined) {
    stop();
    return;
  }
  console.log("should set interval id");
  setIsPlaying(true);
  currentState = initialState;
  intId = setInterval(() => {
    let { state, event } = createTick(currentState);
    if (state.tick > maxTicks) stop();
    if (state.gameplayState === "ended") stop();
    if (event.events.length > 0) console.log(event);
    currentState = state;

    setUnits((prev) =>
      prev.map((u) => {
        const su = getUnit(u.id, state);
        return { ...u, ...su };
      })
    );

    setStore(state);

    // play animations
    event.events.forEach(playAnim);
  }, (tickDelta * 1000) / speed());
};
