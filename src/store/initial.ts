// import { createInitialState } from "../game/game";
import { UnitType } from "../game/types/unit";

// export const p1 = [
//   ["mobileAntitank", "mobileAntitank", "conscripts", "lightTank", "conscripts"],
//   ["regulars", "regulars", "conscripts", "lightTank", "conscripts"],
//   ["noUnit", "regulars", "conscripts", "lightTank", "noUnit"],
// ] as UnitType[][];
// export const p2 = [
//   ["lightTank", "mediumTank", "mobileAntitank", "mediumTank", "lightTank"],
//   ["conscripts", "lightTank", "lightTank", "lightTank", "mediumTank"],
//   ["noUnit", "snipers", "lightTank", "fieldMedics", "noUnit"],
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

// const loadInitialStateFromLocal = (): { p1: string[][]; p2: string[][] } | null => {
//   const data = localStorage.getItem("player-data");
//   if (data === null) return null;
//   return JSON.parse(localStorage.getItem("player-data")!);
// };

// const rawState = loadInitialStateFromLocal();
// console.log(rawState);

// export const p1 =
//   (rawState?.p1 as UnitType[][]) ||
//   ([
//     ["noUnit", "noUnit", "mediumTank", "noUnit", "noUnit"],
//     ["noUnit", "noUnit", "noUnit", "noUnit", "noUnit"],
//     ["noUnit", "noUnit", "noUnit", "noUnit", "noUnit"],
//   ] as UnitType[][]);
// export const p2 =
//   (rawState?.p2 as UnitType[][]) ||
//   ([
//     ["noUnit", "noUnit", "guards", "noUnit", "noUnit"],
//     ["noUnit", "noUnit", "noUnit", "noUnit", "noUnit"],
//     ["noUnit", "noUnit", "noUnit", "noUnit", "noUnit"],
//   ] as UnitType[][]);

// export const initialState = createInitialState(p1, p2);

// export const saveInitialStateToLocal = (s1: UnitType[][], s2: UnitType[][]) => {
//   localStorage.setItem("player-data", JSON.stringify({ p1: s1, p2: s2 }));
// };
