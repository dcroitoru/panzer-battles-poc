import { MainBoardState, ShopTier } from "./types/round";
import { createUnit, createUnitId, Rarity, Unit, UnitBase, UnitType, unitTypes } from "./unit";
import { PlayerId } from "./game";
import { UnitBases, UnitBasesByRarity } from "./data/unit-bases";

export const getShopTierForRound = (round: number): ShopTier => {
  if (round >= 7) return 4;
  if (round >= 5) return 3;
  if (round >= 3) return 2;
  return 1;
};

export const shopWeights = {
  1: [1, 0, 0, 0],
  2: [1, 1, 0, 0],
  3: [1, 1, 1, 0],
  4: [1, 1, 1, 1],
};

// TODO: this should be weight/total weight function, too tired to think...
const rollRarity = (tier: number): Rarity => {
  const rnd = Math.random();
  if (tier == 4) {
    return rnd < 0.25 ? 1 : rnd < 0.5 ? 2 : rnd < 0.75 ? 3 : 4;
  }
  if (tier == 3) {
    return rnd < 0.333 ? 1 : rnd < 0.666 ? 2 : 3;
  }
  if (tier == 2) {
    return rnd < 0.5 ? 1 : 2;
  }
  return 1;
};
const rollUnitType = (rarity: Rarity, exclude: UnitType[]): UnitType => {
  const bases = UnitBasesByRarity[rarity].filter((b) => !exclude.includes(b.type));
  const index = Math.round(Math.random() * (bases.length - 1));
  const base = bases[index];
  return base.type;
};
const rollShopOption = (tier: number, exclude: UnitType[]): UnitType => rollUnitType(rollRarity(tier), exclude);

// TODO: This should be random
// Add more unit bases with varying rarities and implement proper shop
// Add ability to reroll shop (once?)
export const rollShopForRound = (round: number): UnitType[] => {
  const tier = getShopTierForRound(round);
  // if (tier == 4) return ["lightTank", "mediumTank", "heavyTank"];
  // if (tier == 3) return ["snipers", "fieldMedics", "heavyTank"];
  // if (tier == 2) return ["guards", "lightTank", "mobileAntitank"];
  const option1 = rollShopOption(tier, []);
  const option2 = rollShopOption(tier, [option1]);
  const option3 = rollShopOption(tier, [option1, option2]);

  return [option1, option2, option3];
};

export const createUnits = (board: MainBoardState, owner: PlayerId): Unit[] => [
  ...board[0].map((t, x) => createUnit(createUnitId(), t, owner, { x, y: 0 })),
  ...board[1].map((t, x) => createUnit(createUnitId(), t, owner, { x, y: 1 })),
];
