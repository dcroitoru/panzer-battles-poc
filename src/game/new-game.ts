import { createSignal } from "solid-js";
import { MainBoardState, MainBoardUnits, PlayerBoardState, PlayerType, ShopTier } from "./types/round";
import { createUnit, createUnitId, Unit, UnitBase, UnitType } from "./types/unit";
import { UnitBases } from "./data/unit-bases";
import { PlayerId } from "./types/game";

export const getShopTierForRound = (round: number): ShopTier => {
  if (round >= 7) return 4;
  if (round >= 5) return 3;
  if (round >= 3) return 2;
  return 1;
};

export const rollShopForRound = (round: number): UnitType[] => {
  const tier = getShopTierForRound(round);
  if (tier == 4) return ["lightTank", "mediumTank", "heavyTank"];
  if (tier == 3) return ["snipers", "fieldMedics", "heavyTank"];
  if (tier == 2) return ["guards", "lightTank", "mobileAntitank"];
  return ["regulars", "fieldMedics", "lightTank"];
};

export const createUnits = (board: MainBoardState, owner: PlayerId): Unit[] => [
  ...board[0].map((t, x) => createUnit(createUnitId(), t, owner, { x, y: 0 })),
  ...board[1].map((t, x) => createUnit(createUnitId(), t, owner, { x, y: 1 })),
];
