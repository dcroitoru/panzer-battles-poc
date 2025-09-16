import { getUnit } from "./game";
import { GameEvent } from "./types/events";
import { GameState, PlayerId } from "./types/types";
import { Unit } from "./types/unit";

const unitName = (unit: Unit): string => `P${unit.ownerId}:${unit.type} (${unit.id})`;

export const printEvent = (e: GameEvent, state: GameState): string => {
  switch (e.type) {
    case "gameStart":
      return "Game started!";
    case "gameEnd":
      return "Game ended!";
    case "unitAttack":
      const s = getUnit(e.unitId, state);
      const t = getUnit(e.targetUnitId, state);
      return `${unitName(s)} attacked ${unitName(t)} for ${e.damage} => ${unitName(t)} has ${e.remainingHp} hp left!`;
    case "unitDie":
      return `Unit ${e.unitId} died`;
  }
  return "unknown event";
};

// const col = (id: PlayerId) => (str: string) => `<b class="color-${id}"></b>`;
// const htmlUnitName = (u: Unit) => col(u.ownerId)(`${u.type} (${u.id})`);

// export const printHtmlEvent = (e: GameEvent, state: GameState): string => {
//   switch (e.type) {
//     case "gameStart":
//       return "Game started!";
//     case "gameEnd":
//       return "Game ended!";
//     case "unitAttack":
//       const s = getUnit(e.unitId, state);
//       const t = getUnit(e.targetUnitId, state);
//       return `${htmlUnitName(s)} attacked ${htmlUnitName(t)} for ${e.damage} => ${htmlUnitName(t)} has ${e.remainingHp} hp left!`;
//     case "unitDie":
//       return `Unit ${e.unitId} died`;
//   }
//   return "unknown event";
// };
