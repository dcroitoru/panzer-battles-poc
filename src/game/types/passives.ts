import { Passive } from "./unit";

export const Passives = {
  Armor: (value: number): Passive => ({ type: "armor", value, kind: "buff", mod: "defense" }),
  ArmorPen: (): Passive => ({ type: "armor-pen", kind: "buff", mod: "attack" }),
  Multistrike: (value: number): Passive => ({ type: "multistrike", value, kind: "buff", mod: "attack" }),
  Ammo: (value: number): Passive => ({ type: "ammo", value, kind: "other", mod: "attack" }),
  Exposed: (value: number): Passive => ({ type: "exposed", value, kind: "debuff", consumable: true, mod: "defense" }),
  Blitz: (): Passive => ({ type: "blitz", kind: "buff" }),
};
