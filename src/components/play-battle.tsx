import { MainBoardState } from "../game/types/round";
import { GameplayState } from "../game/types/game";
import { createSignal } from "solid-js";

const EnemyBoard = () => <div>enemy board</div>;
const PlayerBoard = () => <div>player board</div>;

export const PlayBattle = (props: { playerBord: MainBoardState; enemyBoard: MainBoardState; onNext: () => void }) => {
  const [state, setState] = createSignal<GameplayState>("not-started");
  const [tick, setTick] = createSignal(0);
  const startBattle = () => {
    console.log("should start battle");
    setState("playing");
    let interval = setInterval(() => {
      setTick((v) => v + 1);
      if (tick() >= 50) {
        setState("ended");
        clearInterval(interval);
      }
    }, 25);
  };

  return (
    <div class="flex flex-col">
      <div>
        <div>Tick: {tick()}</div>

        <button class="btn-primary" disabled={state() != "not-started"} onClick={startBattle}>
          start
        </button>

        <button class="btn-primary" disabled={state() != "ended"} onClick={props.onNext}>
          next
        </button>
      </div>

      <EnemyBoard></EnemyBoard>
      <PlayerBoard></PlayerBoard>
    </div>
  );
};
