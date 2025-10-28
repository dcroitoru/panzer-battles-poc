import { createStore } from "solid-js/store";
import { MainBoardState } from "../game/types/round";
import { createSignal, For, Show } from "solid-js";
import { GameState, PlayerId } from "../game/types/game";
import { createUnits } from "../game/new-game";
import { Unit } from "../game/types/unit";
import { NoUnitView, UnitView } from "./components";

const getUnitView = (u: Unit) => (u.base.type == "noUnit" ? <NoUnitView /> : <UnitView unit={u} />);

const PlayerBoard = (props: { units: Unit[]; owner: PlayerId }) => (
  <div>
    <h3>Owner: {props.owner}</h3>

    <div class="units-container">
      <For each={props.units}>{getUnitView}</For>
    </div>
  </div>
);

const createInitialGameState = (playerBoard: MainBoardState, enemyBoard: MainBoardState): GameState => ({
  outcome: "no-outcome",
  tick: 0,
  playState: "not-started",
  playerUnits: createUnits(playerBoard, "player"),
  enemyUnits: createUnits(enemyBoard, "enemy"),
});

const tickDelta = 25;
const maxTicks = 50;

export const PlayBattle = (props: { playerBord: MainBoardState; enemyBoard: MainBoardState; onNext: () => void }) => {
  const initialState: GameState = createInitialGameState(props.playerBord, props.enemyBoard);
  const [gameState, setGameState] = createStore<GameState>(initialState);

  const startBattle = () => {
    console.log("should start battle");

    let interval = setInterval(() => {
      setGameState("tick", (value) => value + 1);
      if (gameState.tick >= maxTicks) {
        setGameState("playState", "ended");
        clearInterval(interval);
      }
    }, tickDelta);
  };

  return (
    <div class="flex flex-col">
      <div>
        <div>Tick: {gameState.tick}</div>

        <button class="btn-primary" disabled={gameState.playState != "not-started"} onClick={startBattle}>
          start
        </button>

        <button class="btn-primary" disabled={gameState.playState != "ended"} onClick={props.onNext}>
          next
        </button>
      </div>

      <div>Player state: {gameState.playState}</div>

      <Show when={gameState.playState === "ended"}>
        <div>Outcome: {gameState.outcome}</div>
      </Show>

      <PlayerBoard units={gameState.enemyUnits} owner="enemy"></PlayerBoard>
      <PlayerBoard units={gameState.playerUnits} owner="player"></PlayerBoard>
    </div>
  );
};
