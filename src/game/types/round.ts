import { Unit, UnitBase, UnitType } from "./unit";

export const EventTypes = ["shop", "battle"] as const;
export type EventType = (typeof EventTypes)[number];

export type RoundState = {
  round: number;
  event: "shop" | "battle";
};

export type MainBoardState = UnitType[][];
export type SideBoardState = UnitType[];
export type PlayerBoardState = {
  main: MainBoardState;
  side: SideBoardState;
};

export type ShopTier = 1 | 2 | 3 | 4;

export type BoardItem = {
  type: UnitType;
  parent: string;
  y: number;
  x: number;
};
