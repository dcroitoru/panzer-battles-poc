import { Ability } from "./types/ability";
import { GameEvent, GameTickEvent } from "./types/events";
import { GameState, PlayerId } from "./types/types";
import { createUnit, createUnitId, Position, resetUnitId, Unit, UnitId, UnitType } from "./types/unit";
import { pickRandom, sortByDistance } from "./util";

export const tickDelta = 0.25;

const aliveUnits = (state: GameState) => [...state.units.all.values().filter((u) => u.alive)];

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

  const p1alive = alive.filter((u) => u.ownerId === 0);
  const p2alive = alive.filter((u) => u.ownerId === 1);
  if (p1alive.length === 0)
    return {
      state: { ...state, gameplayState: "ended", outcome: { winner: 1 } },
      event: { tick: state.tick, events: [{ type: "gameEnd" }] },
    };

  if (p2alive.length === 0)
    return {
      state: { ...state, gameplayState: "ended", outcome: { winner: 0 } },
      event: { tick: state.tick, events: [{ type: "gameEnd" }] },
    };

  const tick = state.tick + 1;
  const event: GameTickEvent = { tick, events: [] };
  const activatedUnits: Unit[] = [];
  alive.forEach((u) => {
    u.cooldown -= tickDelta;
    if (u.cooldown <= 0) {
      u.cooldown = u.base.cooldown;
      activatedUnits.push(u);
    }
  });

  // trigger all attacks and activated abilities
  activatedUnits.forEach((u) => {
    // console.log("should activate unit", u.type, u.cooldown);

    const target = acquireTarget(u, state);
    // should apply status effects here
    // attack
    let attackValue = u.attack;

    target.passives.forEach((p) => {
      if (p.type === "armor") {
        let armorPen = u.passives.find((up) => up.type === "armor-pen");
        let pvalue = Math.max(p.value! - (armorPen?.value || 0), 0);
        attackValue -= pvalue;
      }
    });

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

export const getTargetPlayerId = (unit: Unit): PlayerId => (unit.ownerId === 0 ? 1 : 0);
export const playerUnits = (id: PlayerId) => (u: Unit) => u.ownerId === id;
export const getPlayerUnits = (playerId: PlayerId, state: GameState): Unit[] => state.units[playerId].map((id) => state.units.all.get(id)!);
export const getEnemyUnits = (unit: Unit, state: GameState): Unit[] => getPlayerUnits(getTargetPlayerId(unit), state);
export const getAllyUnits = (unit: Unit, state: GameState): Unit[] => getPlayerUnits(unit.ownerId, state);

const acquireTarget = (unit: Unit, state: GameState): Unit => {
  return pickClosestEnemy(unit, state);
};

const pickClosestEnemy = (unit: Unit, state: GameState): Unit => {
  const enemyUnits = getEnemyUnits(unit, state);
  return enemyUnits.filter((u) => u.alive).sort(sortByDistance(unit))[0];
};

const posEquals = (a: Position) => (b: Position) => a.x === b.x && a.y === b.y;
export const getUnit = (id: UnitId, state: GameState) => state.units.all.get(id)!;
export const getAdjacent = (unit: Unit, state: GameState): Unit[] => {
  const pos = unit.position;
  const N = { x: pos.x, y: pos.y - 1 };
  const E = { x: pos.x + 1, y: pos.y };
  const S = { x: pos.x, y: pos.y + 1 };
  const W = { x: pos.x - 1, y: pos.y };
  const coords = [N, E, S, W];
  return getAllyUnits(unit, state)
    .filter((u) => u.alive)
    .filter((u) => coords.filter(posEquals(u.position)).length);
};

export const createInitialState = (u1: UnitType[][], u2: UnitType[][]): GameState => {
  resetUnitId();
  const p1 = u1.map((row, y) => row.map((t, x) => createUnit(createUnitId(), t, 0, { x, y })));
  const p2 = u2.map((row, y) => row.map((t, x) => createUnit(createUnitId(), t, 1, { x, y })));
  // const p2 = u2.map((t, i) => createUnit(createUnitId(), t, 1, { x: i, y: 0 }));
  const all = new Map([...p1.flat(), ...p2.flat()].map((u) => [u.id, u]));
  return {
    gameplayState: "not-started",
    tick: 0,
    outcome: "no-outcome",
    units: {
      all,
      0: p1.flat().map((u) => u.id),
      1: p2.flat().map((u) => u.id),
    },
  };
};

const useAbility = (ability: Ability, source: Unit, target: Unit, state: GameState): GameEvent | undefined => {
  switch (ability.type) {
    case "addStatus":
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
