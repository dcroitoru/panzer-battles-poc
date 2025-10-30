import { Abilities } from "../ability";
import { Passives } from "../passives";
import { UnitBase, UnitType } from "../unit";

const UnitBasesData: UnitBase[] = [
  // 0
  {
    type: "noUnit",
    rarity: 0,
    attack: 0,
    hp: 0,
    cooldown: 0,
    cost: 0,
  },
  {
    type: "conscripts",
    rarity: 0,
    attack: 4,
    hp: 10,
    cooldown: 5,
    cost: 1,
  },

  // 1
  {
    type: "regulars",
    rarity: 1,
    attack: 4,
    hp: 20,
    cooldown: 5,
    cost: 2,
  },
  {
    type: "lightTank",
    rarity: 1,
    attack: 5,
    hp: 16,
    cooldown: 4,
    cost: 4,
    passives: [Passives.Armor(1), Passives.Blitz()],
  },
  {
    type: "mediumTank",
    rarity: 1,
    attack: 5,
    hp: 16,
    cooldown: 4,
    cost: 4,
    passives: [Passives.Armor(2)],
  },
  {
    type: "mobileAntitank",
    rarity: 1,
    attack: 4,
    hp: 15,
    cooldown: 7,
    cost: 3,
    passives: [Passives.Armor(1), Passives.ArmorPen(), Passives.Ammo(3)],
  },

  {
    type: "fieldMedics",
    rarity: 1,
    attack: 0,
    hp: 10,
    cooldown: 5,
    cost: 1,
    abilities: [Abilities.Heal(1)],
  },
  {
    type: "snipers",
    rarity: 1,
    attack: 4,
    hp: 20,
    cooldown: 8,
    cost: 2,
    abilities: [Abilities.Expose(1)],
  },
  {
    type: "guards",
    rarity: 1,
    attack: 2,
    hp: 30,
    cooldown: 5,
    cost: 2,
    abilities: [Abilities.EntrenchSelf(2)],
  },
  {
    type: "assaultCommand",
    rarity: 1,
    attack: 2,
    hp: 20,
    cooldown: 5,
    cost: 2,
    abilities: [],
  },

  // 2
  {
    type: "heavyTank",
    rarity: 2,
    attack: 6,
    hp: 16,
    cooldown: 5,
    cost: 5,
    passives: [Passives.Armor(3)],
  },
  {
    type: "supportAntitank",
    rarity: 2,
    attack: 6,
    hp: 12,
    cooldown: 6,
    cost: 3,
    ammo: 5,
    // tags: Equipment Support
    // passives: Frontline units have +1 ATK Ammo 5
  },
  {
    type: "FLAKGun",
    rarity: 2,
    attack: 6,
    hp: 12,
    cooldown: 6,
    cost: 3,
    // tags: Equipment	Support	AntiAerian
    // passives: Pen	Ammo 5	Air Defense 1
  },
  {
    type: "highPrecisionArtilery",
    rarity: 2,
    attack: 10,
    hp: 10,
    cooldown: 8,
    cost: 3,
    // tags: Equipment	Artilery	Ranged
    // passives: Ammo 4	Snipe
  },
  {
    type: "napalmAntitank",
    rarity: 2,
    attack: 3,
    hp: 12,
    cooldown: 7,
    cost: 3,
    // tags: Vehicle	Tank	Equipment
    // actives: Last Stand: Activate
    // passive: Armor 1	Pen	Ammo 5	Cleave
  },
  {
    type: "wespe",
    rarity: 2,
    attack: 8,
    hp: 10,
    cooldown: 8,
    cost: 3,
  },

  // 3
  {
    type: "tempoGun",
    rarity: 3,
    attack: 7,
    hp: 12,
    cooldown: 30,
    cost: 3,
  },
  {
    type: "artilleryCommand",
    rarity: 3,
    attack: 0,
    hp: 20,
    cooldown: 5,
    cost: 2,
  },
  {
    type: "customTank",
    rarity: 3,
    attack: 3,
    hp: 16,
    cooldown: 4,
    cost: 4,
  },
  {
    type: "henkel",
    rarity: 3,
    attack: 10,
    hp: 10,
    cooldown: 8,
    cost: 5,
  },

  // Rarity 4
  {
    type: "eliteEngineers",
    rarity: 4,
    attack: 4,
    hp: 20,
    cooldown: 5,
    cost: 4,
    abilities: [Abilities.EntrenchSelf(2)],
  },
] as const;

export const UnitBases: Record<UnitType, UnitBase> = UnitBasesData.reduce((acc, cur) => {
  acc[cur.type] = cur;
  return acc;
}, {} as Record<UnitType, UnitBase>);

export const UnitBasesByRarity = {
  0: Object.values(UnitBases).filter((b) => b.rarity == 0),
  1: Object.values(UnitBases).filter((b) => b.rarity == 1),
  2: Object.values(UnitBases).filter((b) => b.rarity == 2),
  3: Object.values(UnitBases).filter((b) => b.rarity == 3),
  4: Object.values(UnitBases).filter((b) => b.rarity == 4),
};
