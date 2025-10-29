import { useAbility } from "./ability";
import { createUnits } from "./new-game";
import { GameEvent } from "./types/events";
import { MainBoardState } from "./types/round";
import { alive, blitz, Position, Unit, UnitId } from "./unit";
import { sortByDistance } from "./util";

export const replaySpeedList = [1, 2, 5, 10] as const;
export type ReplaySpeed = (typeof replaySpeedList)[number];

export type PlayState = "not-started" | "playing" | "ended";
export type Outcome = "no-outcome" | "draw" | "player-wins" | "enemy-wins";

export type PlayerId = "player" | "enemy";
export type PlayerBoard = UnitId[];

export type GameState = {
  tick: number;
  playState: PlayState;
  outcome: Outcome;
  units: Unit[];
  playerUnits: Unit[];
  enemyUnits: Unit[];
};

export type GameTick = {
  state: GameState;
  events: GameEvent[];
};

export const tickDelta = 0.25;
export const maxTicks = 100;

export const createInitialGameState = (playerBoard: MainBoardState, enemyBoard: MainBoardState): GameState => {
  const playerUnits = createUnits(playerBoard, "player");
  const enemyUnits = createUnits(enemyBoard, "enemy");
  const units = [...playerUnits, ...enemyUnits];
  return {
    outcome: "no-outcome",
    tick: 0,
    playState: "not-started",
    units,
    playerUnits,
    enemyUnits,
  };
};

// const allUnits = (state: GameState) => [...state.playerUnits, ...state.enemyUnits];
// const aliveUnits = (state: GameState) => allUnits(state).filter((u) => u.alive);

// const blitzUnits = (state: GameState) => state.units.filter((u) => u.passives.findIndex((p) => p.type === "blitz") != -1);
const unitCanFire = (unit: Unit) => (unit.useAmmo ? unit.ammo > 0 : true);
const unitShouldActivate = (unit: Unit) => unit.cooldown <= 0 && unitCanFire(unit);

const createGameStartTick = (state: GameState): GameTick => ({
  state: { ...state, playState: "playing" },
  events: [{ type: "gameStart" }],
});

const createDrawTick = (state: GameState): GameTick => ({
  state: { ...state, playState: "ended", outcome: "draw" },
  events: [{ type: "gameEnd" }],
});

const createPlayerWinsTick = (state: GameState): GameTick => ({
  state: { ...state, playState: "ended", outcome: "player-wins" },
  events: [{ type: "gameEnd" }],
});

const createEnemyWinsTick = (state: GameState): GameTick => ({
  state: { ...state, playState: "ended", outcome: "enemy-wins" },
  events: [{ type: "gameEnd" }],
});

export const createNextGameTick = (state: GameState): GameTick => {
  if (state.playState === "not-started") return createGameStartTick(state);

  const playerUnitsAlive = state.playerUnits.filter(alive);
  const enemyUnitsAlive = state.enemyUnits.filter(alive);
  const playerUnitsAliveCount = playerUnitsAlive.length;
  const enemyUnitsAliveCount = enemyUnitsAlive.length;

  if (playerUnitsAliveCount === 0 && enemyUnitsAliveCount === 0) return createDrawTick(state);
  if (playerUnitsAliveCount === 0) return createEnemyWinsTick(state);
  if (enemyUnitsAliveCount === 0) return createPlayerWinsTick(state);

  const tick = state.tick + 1;
  const events: GameEvent[] = [];

  if (tick === 1) {
    // Activate blitz units
    state.units.filter(blitz).forEach((u) => {
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
      events.push({ type: "unitAttack", unitId: u.id, targetUnitId: target.id, damage: attackValue, remainingHp: target.hp });
    });
  }

  const allAliveUnits = [...playerUnitsAlive, ...enemyUnitsAlive];

  // console.log(allAliveUnits);

  allAliveUnits.forEach((u) => {
    // if (u.ammo != undefined && u.ammo <= 0) return;
    u.cooldown -= tickDelta;
    console.log(u.type, u.cooldown, tickDelta, u.cooldown - tickDelta);
  });

  const activatedUnits = allAliveUnits.filter((u) => u.cooldown <= 0);
  activatedUnits.forEach((u) => (u.cooldown = u.base.cooldown));

  // trigger all attacks and activated abilities
  activatedUnits.forEach((u) => {
    // console.log("should activate unit", u.type, u.cooldown);
    // const ammo = u.passives.find((a) => a.type === "ammo");

    // if (u.ammo != undefined) {
    //   if (u.ammo <= 0) return;
    //   u.ammo -= 1;
    // }

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
    events.push({ type: "unitAttack", unitId: u.id, targetUnitId: target.id, damage: attackValue, remainingHp: target.hp });

    if (u.base.abilities?.length) {
      u.base.abilities.forEach((a) => {
        const ev = useAbility(a, u, target, state);
        if (ev) events.push(ev);
      });
    }
  });

  // check for dead units
  allAliveUnits
    .filter((u) => u.hp <= 0)
    .forEach((u) => {
      u.alive = false;
      events.push({ type: "unitDie", unitId: u.id });
    });

  return { state: { ...state, tick }, events };
};

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
