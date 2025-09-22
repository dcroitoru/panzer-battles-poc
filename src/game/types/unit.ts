import { Abilities, Ability, StatusMap, StatusType } from "./ability";
import { Passives } from "./passives";
import { PlayerId } from "./types";

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

export type UnitId = number;
export type UnitBase = {
  type: UnitType;
  attack: number;
  cooldown: number;
  hp: number;
  //   rarity: Rarity;
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
export const unitTypes = ["no-unit", "regulars", "conscripts", "lightTank", "mediumTank", "mobileAntitank", "fieldMedics", "snipers", "guards"] as const;
export type UnitType = (typeof unitTypes)[number];
export const UnitBases: Record<UnitType, UnitBase> = {
  "no-unit": {
    type: "no-unit",
    attack: 0,
    hp: 0,
    cooldown: 0,
  },
  regulars: {
    type: "regulars",
    attack: 4,
    hp: 20,
    cooldown: 5, //5
  },
  conscripts: {
    type: "conscripts",
    attack: 4,
    hp: 10,
    cooldown: 5, //5
  },
  lightTank: {
    type: "lightTank",
    attack: 5,
    hp: 16, //15
    cooldown: 4, //6
    passives: [Passives.Armor(1), Passives.Blitz()],
  },
  mediumTank: {
    type: "mediumTank",
    attack: 5,
    hp: 16,
    cooldown: 4,
    passives: [Passives.Armor(2)],
  },
  mobileAntitank: {
    type: "mobileAntitank",
    attack: 4,
    hp: 15,
    cooldown: 7,
    passives: [Passives.Armor(1), Passives.ArmorPen(), Passives.Ammo(3)],
  },
  fieldMedics: {
    type: "fieldMedics",
    attack: 0,
    hp: 10,
    cooldown: 5, // 5 in spreadsheet
    abilities: [Abilities.Heal(1)],
    passives: [],
  },
  snipers: {
    type: "snipers",
    attack: 4,
    hp: 20,
    cooldown: 8,
    abilities: [Abilities.Expose(1)],
  },
  guards: {
    type: "guards",
    attack: 2,
    hp: 30,
    cooldown: 5,
    abilities: [Abilities.EntrenchSelf(2)],
  },
};

let internalId = 0;
export const resetUnitId = () => (internalId = 0);
export const createUnitId = () => internalId++;
export const createUnitVO = (type: UnitType): UnitVO => ({ id: createUnitId(), type });
export const createUnit = (id: UnitId, type: UnitType, ownerId: PlayerId, position: Position): Unit => {
  const base = UnitBases[type];
  const alive = type === "no-unit" ? false : true;
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
