import { Abilities } from "../types/ability";
import { Passives } from "../types/passives";
import { UnitBase, UnitType } from "../types/unit";

const UnitBasesData: UnitBase[] = [
  {
    type: "noUnit",
    attack: 0,
    hp: 0,
    cooldown: 0,
    rarity: 1,
  },
  {
    type: "regulars",
    attack: 4,
    hp: 20,
    cooldown: 5, //5
    rarity: 1,
  },
  {
    type: "conscripts",
    attack: 4,
    hp: 10,
    cooldown: 5, //5
    rarity: 0,
  },
  {
    type: "lightTank",
    attack: 5,
    hp: 16, //15
    cooldown: 4, //6
    passives: [Passives.Armor(1), Passives.Blitz()],
    rarity: 0,
  },
  {
    type: "mediumTank",
    attack: 5,
    hp: 16,
    cooldown: 4,
    passives: [Passives.Armor(2)],
    rarity: 1,
  },
  {
    type: "heavyTank",
    attack: 6,
    hp: 16,
    cooldown: 5,
    passives: [Passives.Armor(3)],
    rarity: 2,
  },
  {
    type: "mobileAntitank",
    attack: 4,
    hp: 15,
    cooldown: 7,
    passives: [Passives.Armor(1), Passives.ArmorPen(), Passives.Ammo(3)],
    rarity: 1,
  },
  {
    type: "fieldMedics",
    attack: 0,
    hp: 10,
    cooldown: 5, // 5 in spreadsheet
    abilities: [Abilities.Heal(1)],
    rarity: 1,
  },
  {
    type: "snipers",
    attack: 4,
    hp: 20,
    cooldown: 8,
    abilities: [Abilities.Expose(1)],
    rarity: 1,
  },
  {
    type: "guards",
    attack: 2,
    hp: 30,
    cooldown: 5,
    abilities: [Abilities.EntrenchSelf(2)],
    rarity: 1,
  },
] as const;

export const UnitBases: Record<UnitType, UnitBase> = UnitBasesData.reduce((acc, cur) => {
  acc[cur.type] = cur;
  return acc;
}, {} as Record<UnitType, UnitBase>);
