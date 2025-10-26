import { GameState } from "./types/game";
import { Position, Unit } from "./types/unit";

export const pickRandom = <T>(arr: T[]): T | undefined => {
  if (arr.length === 0) return undefined;
  const i = Math.floor(Math.random() * arr.length);
  return arr[i];
};

const det = (a: Position, b: Position) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
export const sortByDistance = (p: Unit) => (a: Unit, b: Unit) => {
  const da = det(a.position, { x: 4 - p.position.x, y: -1 });
  const db = det(b.position, { x: 4 - p.position.x, y: -1 });
  return da - db;
};
