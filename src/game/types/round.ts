import { Unit, UnitBase } from "./unit";

export const EventTypes = ["shop", "battle"] as const;
export type EventType = (typeof EventTypes)[number];

export type RoundState = {
  round: number;
  event: number;
};

export type PlayerBoardState = {
  main: Unit[][];
  side: Unit[];
};
