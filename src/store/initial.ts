import { createInitialState } from "../game/game";
import { UnitType } from "../game/types/unit";

export const p1 = [
  ["lightTank", "lightTank", "conscripts"],
  ["regulars", "regulars", "conscripts"],
] as UnitType[][];
export const p2 = [
  ["conscripts", "lightTank", "lightTank"],
  ["conscripts", "lightTank", "lightTank"],
] as UnitType[][];

export const initialState = createInitialState(p1, p2);

console.log(initialState);
