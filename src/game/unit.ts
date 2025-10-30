import { UnitBases } from "./data/unit-bases";
import { Passive } from "./passives";
import { PlayerId } from "./game";
import { Ability, StatusMap, StatusType } from "./ability";

export type Position = { x: number; y: number };

export type Rarity = 0 | 1 | 2 | 3 | 4;

export type UnitId = number;

export const unitTypes = [
  // 0
  "noUnit",
  "conscripts",

  // 1
  "regulars",
  "lightTank",
  "mediumTank",
  "mobileAntitank",
  "fieldMedics",
  "snipers",
  "guards",
  "assaultCommand",

  // 2
  "heavyTank",
  "supportAntitank",
  "FLAKGun",
  "highPrecisionArtilery",
  "napalmAntitank",
  "wespe",

  // 3
  "tempoGun",
  "artilleryCommand",
  "customTank",
  "henkel",

  // 4
  "eliteEngineers",
  "kingTiger",
  "firingElite",
  "highCommand",
] as const;

export type UnitType = (typeof unitTypes)[number];

export type UnitBase = {
  type: UnitType;
  rarity: Rarity;
  attack: number;
  cooldown: number;
  hp: number;
  cost: number;
  //   tags: Tag[];
  passives?: Passive[];
  abilities?: Ability[];
  ammo?: number;
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
  position: { x: number; y: number };
  passives: Passive[];
  status: StatusMap;
  ammo: number;
  useAmmo: boolean;
};

let internalId = 0;
export const resetUnitId = () => (internalId = 0);
export const createUnitId = () => internalId++;
export const createUnitVO = (type: UnitType): UnitVO => ({ id: createUnitId(), type });
export const createUnit = (id: UnitId, type: UnitType, ownerId: PlayerId, position: Position): Unit => {
  const base = UnitBases[type];
  const alive = type === "noUnit" ? false : true;
  const ammo = base.ammo ?? 0;
  const useAmmo = base.ammo !== undefined;
  return {
    id,
    type,
    ownerId,
    base,
    alive,
    attack: base.attack,
    hp: base.hp,
    cooldown: base.cooldown,
    position,
    passives: base.passives || [],
    status: new Map<StatusType, number>(),
    ammo,
    useAmmo,
  };
};

export const alive = (unit: Unit) => unit.alive;
export const blitz = (unit: Unit) => unit.passives.find((p) => p.type === "blitz");
