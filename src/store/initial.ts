import { createInitialState } from "../game/game";
import { UnitType } from "../game/types/unit";

// export const p1 = [
//   ["mobileAntitank", "mobileAntitank", "conscripts", "lightTank", "conscripts"],
//   ["regulars", "regulars", "conscripts", "lightTank", "conscripts"],
//   ["no-unit", "regulars", "conscripts", "lightTank", "no-unit"],
// ] as UnitType[][];
// export const p2 = [
//   ["lightTank", "mediumTank", "mobileAntitank", "mediumTank", "lightTank"],
//   ["conscripts", "lightTank", "lightTank", "lightTank", "mediumTank"],
//   ["no-unit", "snipers", "lightTank", "fieldMedics", "no-unit"],
// ] as UnitType[][];

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

export const p1 = [
  ["no-unit", "no-unit", "mediumTank", "no-unit", "no-unit"],
  ["no-unit", "no-unit", "no-unit", "no-unit", "no-unit"],
  ["no-unit", "no-unit", "no-unit", "no-unit", "no-unit"],
] as UnitType[][];
export const p2 = [
  ["no-unit", "no-unit", "guards", "no-unit", "no-unit"],
  ["no-unit", "no-unit", "no-unit", "no-unit", "no-unit"],
  ["no-unit", "no-unit", "no-unit", "no-unit", "no-unit"],
] as UnitType[][];

export const initialState = createInitialState(p1, p2);

console.log(initialState);
