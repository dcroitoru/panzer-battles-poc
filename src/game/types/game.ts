import { MainBoardUnits } from "./round";
import { Unit, UnitId } from "./unit";

export const replaySpeedList = [1, 2, 5, 10] as const;
export type ReplaySpeed = (typeof replaySpeedList)[number];

export type GameplayState = "not-started" | "playing" | "ended";
export type Outcome = "no-outcome" | "draw" | "player-0-wins" | "player-1-wins";

export type PlayerId = "player" | "enemy";
export type PlayerBoard = UnitId[];

export type GameState = {
  playerUnits: Unit[];
  enemyUnits: Unit[];
  tick: number;
  gameplayState: GameplayState;
  outcome: Outcome;
};
