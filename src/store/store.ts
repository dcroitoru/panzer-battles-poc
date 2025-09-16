import { createStore } from "solid-js/store";
import { GameState, ReplaySpeed } from "../game/types/types";
import { createSignal } from "solid-js";
import { createInitialState, createTick, getUnit } from "../game/game";
import { initialState, p1, p2 } from "./initial";
import { playAnim } from "../anim/anim";

const initialStoreState = [...initialState.units.all.values()];
export const [units, setUnits] = createSignal(initialStoreState);
export const [store, setStore] = createStore(initialState);
export const [speed, setSpeed] = createSignal<ReplaySpeed>(2);
export const [isPlaying, setIsPlaying] = createSignal(false);

export const tickDelta = 0.25;

let intId: number;
let currentState: GameState;
const maxTicks = 240;
export const stop = () => {
  clearInterval(intId);
  setIsPlaying(false);
  currentState = createInitialState(p1, p2);
  updateStoreState(currentState);
};
export const play = () => {
  setIsPlaying(true);
  currentState = createInitialState(p1, p2);
  updateStoreState(currentState);
  intId = setInterval(processNextTick, (tickDelta * 1000) / speed());
};

const updateStoreState = (state: GameState) => {
  setUnits((prev) => prev.map((u) => ({ ...u, ...getUnit(u.id, state) })));
  setStore(state);
};

const processNextTick = () => {
  let { state, event } = createTick(currentState);
  if (state.tick > maxTicks) stop();
  if (state.gameplayState === "ended") stop();
  if (event.events.length > 0) console.log(event);
  currentState = state;
  updateStoreState(state);
  event.events.forEach(playAnim);
};

export const onSpeedChange = (sp: ReplaySpeed) => {
  setSpeed(sp);
  if (isPlaying() === false) return;
  clearInterval(intId);
  intId = setInterval(processNextTick, (tickDelta * 1000) / speed());
};
