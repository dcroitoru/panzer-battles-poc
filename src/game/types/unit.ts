import { Ability, StatusMap, StatusType } from "./ability";
import { PlayerId } from "./game";
import { UnitBases } from "../data/unit-bases";
import { PlayerType } from "./round";

export type Position = { x: number; y: number };

export type PassiveKind = "buff" | "debuff" | "other";
export type PassiveType = "armor" | "armor-pen" | "multistrike" | "blitz" | "exposed" | "exalted" | "ammo";
export type Passive = {
  type: PassiveType;
  kind: PassiveKind;
  value?: number;
  consumable?: boolean;
  mod?: "attack" | "defense";
};

export type Rarity = 0 | 1 | 2 | 3 | 4;

export type UnitId = number;

export const unitTypes = [
  "noUnit",
  "regulars",
  "conscripts",
  "lightTank",
  "mediumTank",
  "heavyTank",
  "mobileAntitank",
  "fieldMedics",
  "snipers",
  "guards",
] as const;

export type UnitType = (typeof unitTypes)[number];

export type UnitBase = {
  type: UnitType;
  attack: number;
  cooldown: number;
  hp: number;
  rarity: Rarity;
  //   tags: Tag[];
  passives?: Passive[];
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
  // status: Set<Status>;
  position: { x: number; y: number };
  passives: Passive[];
  status: StatusMap;
  ammo?: number;
};

let internalId = 0;
export const resetUnitId = () => (internalId = 0);
export const createUnitId = () => internalId++;
export const createUnitVO = (type: UnitType): UnitVO => ({ id: createUnitId(), type });
export const createUnit = (id: UnitId, type: UnitType, ownerId: PlayerId, position: Position): Unit => {
  const base = UnitBases[type];
  const alive = type === "noUnit" ? false : true;
  const passives = base.passives || [];
  const ammo = passives.find((p) => p.type === "ammo")?.value;
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
  };
};
