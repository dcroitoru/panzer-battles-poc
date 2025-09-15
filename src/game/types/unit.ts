import { Abilities, Ability, Status } from "./ability";
import { PlayerId } from "./types";

export type Position = { x: number; y: number };
export const unitTypes = ["regulars", "conscripts", "lightTank", "fieldMedics", "snipers"] as const;
export type UnitType = (typeof unitTypes)[number];

export type UnitId = number;
export type UnitBase = {
  type: UnitType;
  attack: number;
  cooldown: number;
  hp: number;
  //   rarity: Rarity;
  //   tags: Tag[];
  //   passives: Passive[];
  abilities?: Ability[];
};

export type UnitVO = {
  id: UnitId;
  type: UnitType;
};

export type Unit = UnitVO & {
  base: UnitBase;
  ownerId: PlayerId;
  attack: number;
  hp: number;
  cooldown: number;
  alive: boolean;
  status: Set<Status>;
  position: { x: number; y: number };
};

export const UnitBases: Record<UnitType, UnitBase> = {
  regulars: {
    type: "regulars",
    attack: 3,
    hp: 12,
    cooldown: 4, //5
  },
  conscripts: {
    type: "conscripts",
    attack: 2,
    hp: 5,
    cooldown: 5, //5
  },
  lightTank: {
    type: "lightTank",
    attack: 3,
    hp: 18, //15
    cooldown: 9, //6
  },
  fieldMedics: {
    type: "fieldMedics",
    attack: 0,
    hp: 10,
    cooldown: 5, // 5 in spreadsheet
    abilities: [Abilities.Heal(1)],
  },
  snipers: {
    type: "snipers",
    attack: 2,
    hp: 10,
    cooldown: 8,
    abilities: [Abilities.Expose(1)],
  },
};

let internalId = 0;
export const createUnitId = () => internalId++;
export const createUnitVO = (type: UnitType): UnitVO => ({ id: createUnitId(), type });
export const createUnit = (id: UnitId, type: UnitType, ownerId: PlayerId, position: Position): Unit => {
  const base = UnitBases[type];
  return {
    id,
    type,
    ownerId,
    base,
    alive: true,
    attack: base.attack,
    hp: base.hp,
    cooldown: base.cooldown,
    status: new Set<Status>(),
    position,
  };
};
