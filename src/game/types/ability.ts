// export type Status = { type: "exposed"; value: number; mod: "defense" } | { type: "exalted"; value: number; mod: "attack" };

import { Passive, PassiveKind, PassiveType } from "./unit";

// export type Ability = Heal | AddStatus;
// export type AbilityTarget = "self" | "adjacent" | "random-ally" | "random-enemy" | "target-enemy";
// export type Heal = {
//   type: "heal";
//   value: number;
//   target: AbilityTarget;
// };
// export type AddStatus = {
//   type: "addStatus";
//   status: Status;
//   target: AbilityTarget;
// };
export type AbilityType = "heal" | "addStatus";
export type StatusType = "exposed" | "exalted" | "entrenched";
export type AbilityTarget = "self" | "adjacent";
export type Ability = {
  type: AbilityType;
  value: number;
  status?: StatusType;
  target?: AbilityTarget;
};
export type Status = {
  type: StatusType;
  value?: number;
};
export type StatusMap = Map<StatusType, number>;
export const StatusKind: Record<StatusType, PassiveKind> = {
  entrenched: "buff",
  exalted: "buff",
  exposed: "debuff",
};

export const Abilities = {
  Heal: (value: number): Ability => ({ value, type: "heal" }),
  Expose: (value: number): Ability => ({ value, type: "addStatus", status: "exposed" }),
  Exalt: (value: number): Ability => ({ value, type: "addStatus", status: "exalted" }),
  EntrenchSelf: (value: number): Ability => ({ value, type: "addStatus", status: "entrenched", target: "self" }),
  // Heal: (value: number): Heal => ({ type: "heal", value, target: "random-ally" }),
  // Expose: (value: number): AddStatus => ({ type: "addStatus", target: "random-enemy", status: { type: "exposed", value, mod: "defense" } }),
  // Exalt: (value: number) => ({ type: "addStatus", target: "random-ally", status: { type: "exalted", value, mod: "attack" } }),
};

// export type Ability2 = {

// }
// export const Abilities2 = {
//   Heal: (value: number): Ability2 => ({type: "heal"})
// }
