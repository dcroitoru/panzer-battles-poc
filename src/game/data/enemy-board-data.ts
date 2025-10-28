import { MainBoardState } from "../types/round";

const r1: MainBoardState = [
  ["noUnit", "noUnit", "regulars", "noUnit", "noUnit"],
  ["noUnit", "noUnit", "noUnit", "noUnit", "noUnit"],
];

const r2: MainBoardState = [
  ["noUnit", "noUnit", "regulars", "noUnit", "noUnit"],
  ["noUnit", "noUnit", "regulars", "noUnit", "noUnit"],
];

const r3: MainBoardState = [
  ["noUnit", "noUnit", "regulars", "noUnit", "noUnit"],
  ["noUnit", "noUnit", "lightTank", "noUnit", "noUnit"],
];

const r4: MainBoardState = [
  ["noUnit", "regulars", "regulars", "noUnit", "noUnit"],
  ["noUnit", "noUnit", "lightTank", "noUnit", "noUnit"],
];

const r5: MainBoardState = [
  ["noUnit", "regulars", "lightTank", "regulars", "noUnit"],
  ["noUnit", "noUnit", "lightTank", "noUnit", "noUnit"],
];

const r6: MainBoardState = [
  ["noUnit", "regulars", "mediumTank", "regulars", "noUnit"],
  ["noUnit", "noUnit", "heavyTank", "noUnit", "noUnit"],
];

const r7: MainBoardState = [
  ["noUnit", "regulars", "mediumTank", "regulars", "noUnit"],
  ["noUnit", "fieldMedics", "heavyTank", "fieldMedics", "noUnit"],
];

const r8: MainBoardState = [
  ["noUnit", "regulars", "mediumTank", "regulars", "noUnit"],
  ["snipers", "fieldMedics", "heavyTank", "fieldMedics", "snipers"],
];

const r9: MainBoardState = [
  ["mobileAntitank", "regulars", "mediumTank", "regulars", "mobileAntitank"],
  ["snipers", "fieldMedics", "heavyTank", "fieldMedics", "snipers"],
];

const r10: MainBoardState = [
  ["mobileAntitank", "lightTank", "mediumTank", "lightTank", "mobileAntitank"],
  ["snipers", "fieldMedics", "heavyTank", "fieldMedics", "snipers"],
];

const boards: MainBoardState[] = [r1, r2, r3, r3, r5, r6, r7, r8, r9, r10];

export const getEnemyBoardStateForRound = (round: number): MainBoardState => {
  return boards[round];
};
