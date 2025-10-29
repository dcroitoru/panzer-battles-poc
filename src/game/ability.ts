import { GameState, getAdjacent } from "./game";
import { PassiveKind } from "./passives";
import { GameEvent } from "./types/events";
import { Unit } from "./unit";

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
};

export const useAbility = (ability: Ability, source: Unit, target: Unit, state: GameState): GameEvent | undefined => {
  switch (ability.type) {
    case "addStatus":
      if (ability.target == "self") target = source;
      const status = ability.status!;
      const newValue = ability.value + (target.status.get(status) || 0);
      target.status.set(status, newValue);

      // console.log(target.status);
      return {
        type: "unitUseAbility",
        ability,
        unitId: source.id,
        targetUnitId: target.id,
      };
    case "heal":
      // console.log(source.id, "should heal adjacent units");
      const targets = getAdjacent(source, state);
      const healValue = ability.value;
      targets.forEach((t) => (t.hp = Math.min(t.hp + healValue, t.base.hp)));
      return {
        type: "unitUseAbility",
        ability,
        unitId: source.id,
        source: source.id,
        targetUnitId: source.id,
        targets: targets.map((u) => u.id),
      };

    default:
      return;

    // if(target.status.has(ability.status!)) {}
  }
};
