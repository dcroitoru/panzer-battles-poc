import { createStore } from "solid-js/store";
import { ReplaySpeed, Unit } from "../game/types/types";
import { createEffect, createSignal } from "solid-js";

const initialState: Unit[] = [
  { id: 1, baseCooldown: 4, cooldown: 4 },
  { id: 2, baseCooldown: 5, cooldown: 5 },
  { id: 3, baseCooldown: 8, cooldown: 8 },
];

export const [units, setUnits] = createStore(initialState);
export const [speed, setSpeed] = createSignal<ReplaySpeed>(2);
export const [isPlaying, setIsPlaying] = createSignal(false);

export const delta = 0.25;

let intId: number | undefined;
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

  intId = setInterval(() => {
    units.forEach((u, i) => {
      const cd = u.cooldown - delta;
      setUnits(i, "cooldown", cd > 0 ? cd : u.baseCooldown);
    });
  }, (delta * 1000) / speed());
};

createEffect(() => {
  if (speed()) stop();
  console.log("should start playing");

  play();
});
