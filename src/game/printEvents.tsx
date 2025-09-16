import { getUnit } from "./game";
import { GameEvent } from "./types/events";
import { GameState, PlayerId } from "./types/types";
import { Unit } from "./types/unit";

const col = (id: PlayerId) => (str: string) => `<b class="color-${id}"}>${str}</b>`;
const htmlUnitName = (u: Unit) => col(u.ownerId)(`${u.type} (${u.id})`);
const red = (str: any) => `<b class="text-red-600">${str}</b>`;

export const printHtmlEvent = (e: GameEvent, state: GameState): string => {
  switch (e.type) {
    case "gameStart":
      return "Game started!";
    case "gameEnd":
      return "Game ended!";
    case "unitAttack":
      const s = getUnit(e.unitId, state);
      const t = getUnit(e.targetUnitId, state);
      return `${htmlUnitName(s)} attacked ${htmlUnitName(t)} for ${red(e.damage)} => ${htmlUnitName(t)} has ${red(e.remainingHp)} hp left!`;
    case "unitDie":
      return `💀 ${htmlUnitName(getUnit(e.unitId, state))} died!`;
  }
  return "unknown event";
};
