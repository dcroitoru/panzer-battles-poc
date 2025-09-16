import { Passive } from "./unit";

export const Armor = (value: number): Passive => ({ type: "armor", value, kind: "buff", mod: "defense" });

export const Multistrike = (value: number): Passive => ({ type: "multistrike", value, kind: "buff", mod: "attack" });

export const Exposed = (value: number): Passive => ({ type: "exposed", value, kind: "debuff", consumable: true, mod: "defense" });

export const Blitz = (): Passive => ({ type: "blitz", kind: "buff" });
