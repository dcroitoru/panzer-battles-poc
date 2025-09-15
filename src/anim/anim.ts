import { GameEvent } from "../game/types/events";
import { UnitId } from "../game/types/unit";
export const playAnim = (e: GameEvent) => {
  switch (e.type) {
    case "unitAttack":
      playRecoilAnim(e.unitId);
      playDamageAnim(e.targetUnitId, e.damage);
      break;
    default:
      break;
  }
};
export const playRecoilAnim = (unitId: UnitId) => {
  const el = document.querySelector<HTMLElement>(`#unit-${unitId}`);
  if (!el) return;
  el.classList.remove("recoil"); // reset if still applied
  void el.offsetWidth; // force reflow to restart animation
  el.classList.add("recoil");
};

export const playDamageAnim = (unitId: UnitId, damage: number) => {
  const el = document.querySelector<HTMLElement>(`#unit-${unitId}`);
  if (!el) return;
  el.classList.remove("shake"); // reset if still applied
  void el.offsetWidth; // force reflow to restart animation
  el.classList.add("shake");

  const rect = el.getBoundingClientRect();

  const layer = document.querySelector<HTMLElement>("#animations-layer")!;

  const dmgEl = document.createElement("div");
  dmgEl.classList = "damage-number";
  dmgEl.innerText = `-${damage}hp`;
  dmgEl.style.top = `${rect.top}px`;
  dmgEl.style.left = `${rect.left + rect.width - 40}px`;
  layer.append(dmgEl);

  const dmgRectEl = document.createElement("div");
  dmgRectEl.classList = "damage-rect";
  dmgRectEl.style.top = `${rect.top}px`;
  dmgRectEl.style.left = `${rect.left}px`;
  dmgRectEl.style.width = `${rect.width}px`;
  dmgRectEl.style.height = `${rect.height}px`;
  layer.append(dmgRectEl);
  setTimeout(() => {
    // dmgEl.remove();
    // dmgRectEl.remove();
  }, 1000);
};
