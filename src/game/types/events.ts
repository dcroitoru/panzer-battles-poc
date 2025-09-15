import { Ability, Status } from "./ability";
import { UnitId } from "./unit";

export type GameEvent =
  | { type: "gameStart" }
  | { type: "gameEnd" }
  | {
      type: "unitDie";
      unitId: UnitId;
    }
  | {
      type: "unitAttack";
      unitId: UnitId;
      targetUnitId: UnitId;
      damage: number;
      remainingHp: number;
    }
  | {
      type: "unitUseAbility";
      unitId: UnitId;
      targetUnitId: UnitId;
      ability: Ability;
    }
  | {
      type: "unitConsumeStatus";
      unitId: UnitId;
      status: Status;
    };

export type GameTickEvent = {
  tick: number;
  events: GameEvent[];
};
