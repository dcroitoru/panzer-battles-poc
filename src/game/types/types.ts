export const replaySpeedList = [1, 2, 5, 10] as const;
export type ReplaySpeed = (typeof replaySpeedList)[number];

export type Unit = {
  id: number;
  cooldown: number;
  baseCooldown: number;
};
