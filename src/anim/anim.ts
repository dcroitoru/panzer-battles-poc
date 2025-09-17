import { GameEvent, GameTickEvent } from "../game/types/events";
import { Unit, UnitId } from "../game/types/unit";

export const bulletAnimDuration = 0.5;

export const playAnim = (e: GameEvent) => {
  switch (e.type) {
    case "unitAttack":
      playRecoilAnim(e.unitId);
      playDamageAnim(e.targetUnitId, e.damage);
      playBulletAnim(e.unitId, e.targetUnitId);
      break;
    case "unitUseAbility":
      switch (e.ability.type) {
        case "heal":
          e.targets?.forEach((id) => playHealAnim(id, e.ability.value));
          break;
      }
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

export const playHealAnim = (unitId: UnitId, value: number) => {
  const el = document.querySelector<HTMLElement>(`#unit-${unitId}`);
  if (!el) return;

  // el.classList.remove("shake"); // reset if still applied
  // void el.offsetWidth; // force reflow to restart animation
  // el.classList.add("shake");

  const rect = el.getBoundingClientRect();

  const layer = document.querySelector<HTMLElement>("#animations-layer")!;

  const textEl = document.createElement("div");
  textEl.classList = "heal-text";
  textEl.innerText = `+${value}hp`;
  textEl.style.top = `${rect.top}px`;
  textEl.style.left = `${rect.left + rect.width - 60}px`;
  layer.append(textEl);

  const rectEl = document.createElement("div");
  rectEl.classList = "heal-rect";
  rectEl.style.top = `${rect.top}px`;
  rectEl.style.left = `${rect.left}px`;
  rectEl.style.width = `${rect.width}px`;
  rectEl.style.height = `${rect.height}px`;
  layer.append(rectEl);
  //   dmgRectEl.addEventListener("transitionend", () => dmgRectEl.remove());
  setTimeout(() => {
    textEl.remove();
    rectEl.remove();
  }, 1000);
};

export const playSounds = (event: GameTickEvent) => {
  // Shot sound
  if (event.events.findIndex((ge) => ge.type === "unitAttack") !== -1) {
    playShotSound();
  }
};

export const playShotSound = () => {
  const rnd = 1 + Math.round(Math.random());
  // const src = rnd > 0.5 ? 1 : 2;
  const audio = new Audio(`src/assets/audio/shot-${rnd}.mp3`);
  audio.volume = 0.15;
  audio.play();
};
