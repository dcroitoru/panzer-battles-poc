import { createInitialState } from "../game/game";
import { UnitType } from "../game/types/unit";

export const p1 = [
  ["regulars", "lightTank", "conscripts"],
  ["regulars", "lightTank", "conscripts"],
] as UnitType[][];
export const p2 = [
  ["conscripts", "regulars", "lightTank"],
  ["conscripts", "regulars", "lightTank"],
] as UnitType[][];

export const initialState = createInitialState(p1, p2);

console.log(initialState);
