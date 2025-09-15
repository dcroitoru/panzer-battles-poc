export type Status = { type: "exposed"; value: number; mod: "defense" } | { type: "exalted"; value: number; mod: "attack" };

export type Ability = Heal | AddStatus;
export type AbilityTarget = "self" | "adjacent" | "random-ally" | "random-enemy" | "target-enemy";
export type Heal = {
  type: "heal";
  value: number;
  target: AbilityTarget;
};
export type AddStatus = {
  type: "addStatus";
  status: Status;
  target: AbilityTarget;
};

export const Abilities = {
  Heal: (value: number): Heal => ({ type: "heal", value, target: "random-ally" }),
  Expose: (value: number): AddStatus => ({ type: "addStatus", target: "random-enemy", status: { type: "exposed", value, mod: "defense" } }),
  Exalt: (value: number) => ({ type: "addStatus", target: "random-ally", status: { type: "exalted", value, mod: "attack" } }),
};
