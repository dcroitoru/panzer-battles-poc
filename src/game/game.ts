import { Ability } from "./types/ability";
import { GameEvent, GameTickEvent } from "./types/events";
import { GameState, PlayerId } from "./types/game";
import { createUnit, createUnitId, Position, resetUnitId, Unit, UnitId, UnitType } from "./types/unit";
import { pickRandom, sortByDistance } from "./util";

export const tickDelta = 0.25;

const allUnits = (state: GameState) => [...state.playerUnits, ...state.enemyUnits];
const aliveUnits = (state: GameState) => allUnits(state).filter((u) => u.alive);
const blitzUnits = (state: GameState) => allUnits(state).filter((u) => u.passives.findIndex((p) => p.type === "blitz") != -1);

export const createTick = (state: GameState): { state: GameState; event: GameTickEvent } => {
  if (state.gameplayState === "not-started")
    return {
      state: { ...state, gameplayState: "playing" },
      event: { tick: state.tick, events: [{ type: "gameStart" }] },
    };
  const alive = aliveUnits(state);

  // console.log("tick", state.tick, "alive", alive.length);

  if (alive.length === 0)
    return {
      state: { ...state, gameplayState: "ended", outcome: "draw" },
      event: { tick: state.tick, events: [{ type: "gameEnd" }] },
    };

  const p1alive = alive.filter((u) => u.ownerId === "player");
  const p2alive = alive.filter((u) => u.ownerId === "enemy");
  if (p1alive.length === 0)
    return {
      state: { ...state, gameplayState: "ended", outcome: "player-1-wins" },
      event: { tick: state.tick, events: [{ type: "gameEnd" }] },
    };

  if (p2alive.length === 0)
    return {
      state: { ...state, gameplayState: "ended", outcome: "player-0-wins" },
      event: { tick: state.tick, events: [{ type: "gameEnd" }] },
    };

  const tick = state.tick + 1;
  const event: GameTickEvent = { tick, events: [] };
  const activatedUnits: Unit[] = [];

  if (tick === 1) {
    // Activate blitz units
    blitzUnits(state).forEach((u) => {
      // This is repeated code!
      const target = acquireTarget(state, u);
      let attackValue = u.attack;

      target.passives.forEach((p) => {
        console.log("passive: ", p);

        if (p.type === "armor") {
          let armorPen = u.passives.find((up) => up.type === "armor-pen");
          attackValue -= armorPen ? 0 : p.value!;
          console.log(attackValue);
        }
      });

      attackValue = Math.max(attackValue, 0);

      target.hp -= attackValue;
      event.events.push({ type: "unitAttack", unitId: u.id, targetUnitId: target.id, damage: attackValue, remainingHp: target.hp });
    });
  }

  alive.forEach((u) => {
    // const ammo = u.passives.find((a) => a.type === "ammo");
    if (u.ammo != undefined && u.ammo <= 0) return;

    u.cooldown -= tickDelta;
    if (u.cooldown <= 0) {
      u.cooldown = u.base.cooldown;
      activatedUnits.push(u);
    }
  });

  // trigger all attacks and activated abilities
  activatedUnits.forEach((u) => {
    // console.log("should activate unit", u.type, u.cooldown);
    // const ammo = u.passives.find((a) => a.type === "ammo");
    if (u.ammo != undefined) {
      if (u.ammo <= 0) return;
      u.ammo -= 1;
    }

    const target = acquireTarget(state, u);
    // should apply status effects here
    // attack
    let attackValue = u.attack;

    target.passives.forEach((p) => {
      if (p.type === "armor") {
        let armorPen = u.passives.find((up) => up.type === "armor-pen");
        attackValue -= armorPen ? 0 : p.value!;
        console.log(attackValue);
      }
    });

    if (target.status.has("entrenched")) {
      const entrenchValue = target.status.get("entrenched")!;
      const remainingDamage = attackValue > entrenchValue ? attackValue - entrenchValue : 0;
      const newValue = entrenchValue > attackValue ? entrenchValue - attackValue : 0;
      if (newValue > 0) target.status.set("entrenched", newValue);
      else target.status.delete("entrenched");

      if (remainingDamage > 0) attackValue = remainingDamage;
    }

    attackValue = Math.max(attackValue, 0);

    target.hp -= attackValue;
    event.events.push({ type: "unitAttack", unitId: u.id, targetUnitId: target.id, damage: attackValue, remainingHp: target.hp });

    if (u.base.abilities?.length) {
      u.base.abilities.forEach((a) => {
        const ev = useAbility(a, u, target, state);
        if (ev) event.events.push(ev);
      });
    }
  });

  // check for dead units
  alive
    .filter((u) => u.hp <= 0)
    .forEach((u) => {
      u.alive = false;
      event.events.push({ type: "unitDie", unitId: u.id });
    });

  return { state: { ...state, tick }, event };
};

export const getTargetPlayerId = (unit: Unit): PlayerId => unit.ownerId;
export const playerUnits = (id: PlayerId) => (u: Unit) => u.ownerId === id;
// export const getPlayerUnits = (playerId: PlayerId, state: GameState): Unit[] => state.units[playerId].map((id) => state.units.all.get(id)!);
export const getAdverseUnits = (state: GameState, player: PlayerId): Unit[] => (player === "player" ? state.enemyUnits : state.playerUnits);
export const getAllyUnits = (state: GameState, player: PlayerId): Unit[] => (player === "player" ? state.playerUnits : state.enemyUnits);

const acquireTarget = (state: GameState, unit: Unit): Unit => {
  return pickClosestAdverseUnit(state, unit);
};

const pickClosestAdverseUnit = (state: GameState, unit: Unit): Unit => {
  const units = getAdverseUnits(state, unit.ownerId);
  return units.filter((u) => u.alive).sort(sortByDistance(unit))[0];
};

const posEquals = (a: Position) => (b: Position) => a.x === b.x && a.y === b.y;
// export const getUnit = (id: UnitId, state: GameState) => state.units.all.get(id)!;
export const getAdjacent = (unit: Unit, state: GameState): Unit[] => {
  const pos = unit.position;
  const N = { x: pos.x, y: pos.y - 1 };
  const E = { x: pos.x + 1, y: pos.y };
  const S = { x: pos.x, y: pos.y + 1 };
  const W = { x: pos.x - 1, y: pos.y };
  const coords = [N, E, S, W];
  return getAllyUnits(state, unit.ownerId)
    .filter((u) => u.alive)
    .filter((u) => coords.filter(posEquals(u.position)).length);
};

// export const createInitialState = (u1: UnitType[][], u2: UnitType[][]): GameState => {
//   resetUnitId();
//   const p1 = u1.map((row, y) => row.map((t, x) => createUnit(createUnitId(), t, 0, { x, y })));
//   const p2 = u2.map((row, y) => row.map((t, x) => createUnit(createUnitId(), t, 1, { x, y })));
//   // const p2 = u2.map((t, i) => createUnit(createUnitId(), t, 1, { x: i, y: 0 }));
//   const all = new Map([...p1.flat(), ...p2.flat()].map((u) => [u.id, u]));
//   return {
//     gameplayState: "not-started",
//     tick: 0,
//     outcome: "no-outcome",
//     units: {
//       all,
//       0: p1.flat().map((u) => u.id),
//       1: p2.flat().map((u) => u.id),
//     },
//   };
// };

const useAbility = (ability: Ability, source: Unit, target: Unit, state: GameState): GameEvent | undefined => {
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
