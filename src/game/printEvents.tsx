import { getUnit } from "./game";
import { GameEvent } from "./types/events";
import { GameState, PlayerId } from "./types/game";
import { Unit } from "./types/unit";

const col = (id: PlayerId) => (str: string) => `<b class="color-${id}"}>${str}</b>`;
const htmlUnitName = (u: Unit) => col(u.ownerId)(`${u.type} (${u.id})`);
const red = (str: any) => `<b class="text-red-600">${str}</b>`;
const orange = (str: any) => `<b class="text-orange-600">${str}</b>`;
const green = (str: any) => `<b class="text-green-600">${str}</b>`;

export const printHtmlEvent = (e: GameEvent, state: GameState): string => {
  let s, t: Unit;
  switch (e.type) {
    case "gameStart":
      return "Game started!";
    case "gameEnd":
      return "Game ended!";
    case "unitAttack":
      s = getUnit(e.unitId, state);
      t = getUnit(e.targetUnitId, state);
      return `${htmlUnitName(s)} attacked ${htmlUnitName(t)} for ${red(e.damage)} => ${htmlUnitName(t)} has ${red(e.remainingHp)} hp left!`;
    case "unitDie":
      return `💀 ${htmlUnitName(getUnit(e.unitId, state))} died!`;
    case "unitUseAbility":
      switch (e.ability.type) {
        case "addStatus":
          s = getUnit(e.unitId, state);
          t = getUnit(e.targetUnitId, state);
          return `${htmlUnitName(s)} used ${orange(e.ability.type)}: ${orange(e.ability.status)} ${orange(e.ability.value)} on ${htmlUnitName(t)}`;
        case "heal":
          s = getUnit(e.source!, state);
          let ts = e.targets!.map((tt) => getUnit(tt, state));
          return `${htmlUnitName(s)} used ${green(e.ability.type)} ${green(e.ability.value)} on ${ts.map((tt) => htmlUnitName(tt)).join(", ")}`;
      }
  }
  return "unknown event";
};
