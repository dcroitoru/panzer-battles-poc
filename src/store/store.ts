import { createStore } from "solid-js/store";
import { GameState, PlayerId, ReplaySpeed } from "../game/types/types";
import { createSignal } from "solid-js";
import { createInitialState, createTick, getUnit } from "../game/game";
import { initialState, p1, p2 } from "./initial";
import { playAnim, playSounds } from "../anim/anim";
import { Unit, UnitBase, UnitBases, UnitType } from "../game/types/unit";
import { GameTickEvent } from "../game/types/events";

const initialStoreState = [...initialState.units.all.values()];
export const [units, setUnits] = createSignal(initialStoreState);
export const [events, setEvents] = createSignal<GameTickEvent[]>([]);
export const [draggedUnit, setDraggedUnit] = createSignal<UnitBase>(UnitBases.noUnit);
export const isDragging = () => draggedUnit() !== UnitBases.noUnit;

export const [store, setStore] = createStore(initialState);
export const [speed, setSpeed] = createSignal<ReplaySpeed>(2);
export const [isPlaying, setIsPlaying] = createSignal(false);
export const [enableSounds, setEnableSounds] = createSignal(true);
export const [showEvents, setShowEvents] = createSignal(true);

export const tickDelta = 0.25;

let intId: number;
let currentState: GameState;
export const maxTicks = 300;
export const stop = () => {
  clearInterval(intId);
  setIsPlaying(false);
  currentState = createInitialState(p1, p2);
  updateStoreState(currentState);
  // setEvents([]);
};
export const play = () => {
  setIsPlaying(true);
  currentState = createInitialState(p1, p2);
  updateStoreState(currentState);
  setEvents([]);
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
  setEvents((prev) => [...prev, event]);
  event.events.forEach(playAnim);
  if (enableSounds()) playSounds(event);
  scrollEventsContainer();
  // if(event.events.findIndex(ge => ge.type === "unitAttack"))
};

export const onSpeedChange = (sp: ReplaySpeed) => {
  setSpeed(sp);
  if (isPlaying() === false) return;
  clearInterval(intId);
  intId = setInterval(processNextTick, (tickDelta * 1000) / speed());
};

export const onInitialStateChange = (unit: Unit, newType: UnitType) => {
  console.log("inside initial state change", unit, newType);

  let arr = unit.ownerId === 0 ? p1 : p2;
  const { x, y } = unit.position;
  arr[y][x] = newType;
  updateStoreState(createInitialState(p1, p2));
};

export const clearAllPlayerUnits = (playerId: PlayerId) => {
  let arr = playerId === 0 ? p1 : p2;
  arr.forEach((row, y) => row.forEach((c, x) => (arr[y][x] = "noUnit")));
  updateStoreState(createInitialState(p1, p2));
};

const scrollEventsContainer = () => {
  const el = document.querySelector(".replay-events");
  if (!el) {
    console.log("could not find .replay-events");
    return;
  }

  el.scrollTop = el.scrollHeight;
};

document.onmouseup = (e) => {
  setTimeout(() => {
    console.log("should check if dropped on valid target");
    const target = e.target;
    console.log("target", target);

    const valid = false;
    console.log("valid?", valid);

    setDraggedUnit(UnitBases.noUnit);
  }, 10);
};
