import { createInitialState } from "../game/game";
import { UnitType } from "../game/types/unit";

export const p1 = [
  ["lightTank", "lightTank", "conscripts", "lightTank", "conscripts"],
  ["regulars", "regulars", "conscripts", "lightTank", "conscripts"],
  ["regulars", "regulars", "conscripts", "lightTank", "conscripts"],
] as UnitType[][];
export const p2 = [
  ["lightTank", "mediumTank", "mobileAntitank", "mediumTank", "lightTank"],
  ["conscripts", "lightTank", "lightTank", "lightTank", "lightTank"],
  ["conscripts", "lightTank", "lightTank", "lightTank", "lightTank"],
] as UnitType[][];

// export const p1 = [
//   ["conscripts", "conscripts", "conscripts", "conscripts", "conscripts"],
//   ["conscripts", "conscripts", "conscripts", "conscripts", "conscripts"],
//   ["lightTank", "lightTank", "lightTank", "lightTank", "lightTank"],
// ] as UnitType[][];
// export const p2 = [
//   ["conscripts", "conscripts", "conscripts", "conscripts", "conscripts"],
//   ["conscripts", "conscripts", "conscripts", "conscripts", "conscripts"],
//   ["lightTank", "lightTank", "lightTank", "lightTank", "lightTank"],
// ] as UnitType[][];

export const initialState = createInitialState(p1, p2);

console.log(initialState);
