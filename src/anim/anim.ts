import { GameEvent } from "../game/types/events";
import { Unit, UnitId } from "../game/types/unit";

export const bulletAnimDuration = 0.5;

export const playAnim = (e: GameEvent) => {
  switch (e.type) {
    case "unitAttack":
      playRecoilAnim(e.unitId);
      playDamageAnim(e.targetUnitId, e.damage);
      playBulletAnim(e.unitId, e.targetUnitId);
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
  //   dmgRectEl.addEventListener("transitionend", () => dmgRectEl.remove());
  setTimeout(() => {
    dmgEl.remove();
    dmgRectEl.remove();
  }, 1000);
};

export function playBulletAnim(sourceId: UnitId, targetId: UnitId) {
  const source = document.querySelector<HTMLElement>(`#unit-${sourceId}`)!;
  const target = document.querySelector<HTMLElement>(`#unit-${targetId}`)!;

  if (!source || !target) {
    console.log("could not playe bullet anim");
    return;
  }

  const bullet = document.createElement("div");
  bullet.className = "bullet";

  const shooterRect = source.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  const startX = shooterRect.left + shooterRect.width / 2; // - containerRect.left;
  const startY = shooterRect.top + shooterRect.height / 2; // - containerRect.top;
  const endX = targetRect.left + targetRect.width / 2; // - containerRect.left;
  const endY = targetRect.top + targetRect.height / 2; // - containerRect.top;

  bullet.style.transition = "none";
  bullet.style.transform = `translate(${startX}px, ${startY}px)`;

  const container = document.querySelector<HTMLElement>("#animations-layer")!;
  container.appendChild(bullet);

  void bullet.offsetWidth;

  bullet.style.transition = `transform ${bulletAnimDuration}s linear, opacity ${bulletAnimDuration}s linear`;
  bullet.style.transform = `translate(${endX}px, ${endY}px)`;
  bullet.style.opacity = "0";
  //   bullet.style.boxShadow = `-30px 0 10px rgba(0, 0, 0, 0.5)`;

  bullet.addEventListener("transitionend", () => bullet.remove());
}

// const playBulletAnim = (from: UnitId, to: UnitId) => {
//   const elfrom = document.querySelector<HTMLElement>(`#unit-${from}`);
//   const elto = document.querySelector<HTMLElement>(`#unit-${to}`);
//   if (!elfrom || !elto) return;

//   const rectfrom = elfrom.getBoundingClientRect();
//   const rectto = elto.getBoundingClientRect();
//   const layer = document.querySelector<HTMLElement>("#animations-layer")!;

//   const dx = rectto.x - rectfrom.x;
//   const dy = rectto.y - rectfrom.y;
//   const length = Math.sqrt(dx * dx + dy * dy);
//   const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
//   const bullet = document.createElement("div");
//   bullet.classList = "bullet";
//   bullet.style.top = `${rectfrom.y}px`;
//   bullet.style.left = `${rectfrom.x}px`;
//   bullet.style.width = `${length}px`;
//   bullet.style.transform = `rotate(${angle}deg)`;

//   layer.append(bullet);
//   setTimeout(() => {
//     // dmgEl.remove();
//     // dmgRectEl.remove();
//   }, 1000);
// };

// function BulletTrail({ from, to }) {
//   const dx = to.x - from.x;
//   const dy = to.y - from.y;
//   const length = Math.sqrt(dx*dx + dy*dy);
//   const angle = Math.atan2(dy, dx) * 180 / Math.PI;

//   return (
//     <div
//       style={{
//         position: "absolute",
//         left: `${from.x}px`,
//         top: `${from.y}px`,
//         width: `${length}px`,
//         height: "10px",
//         background: "yellow",
//         transformOrigin: "0 50%", // rotate around the start
//         transform: `rotate(${angle}deg)`,
//       }}
//     />
//   );
// }
