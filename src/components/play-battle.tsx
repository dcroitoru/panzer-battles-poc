import { MainBoardState } from "../game/types/round";
import { createSignal, For, Show } from "solid-js";
import { Unit } from "../game/unit";
import { NoUnitView, UnitView } from "./components";
import { createInitialGameState, createNextGameTick, GameState, Outcome, PlayerId } from "../game/game";
import { playAnims, playSounds } from "../anim/anim";

const getUnitView = (u: Unit) => (u.base.type == "noUnit" ? <NoUnitView /> : <UnitView unit={u} />);

const PlayerBoard = (props: { units: Unit[]; owner: PlayerId; winner: boolean }) => {
  return (
    <div>
      <h3>
        Board: {props.owner}
        <Show when={props.winner}> - Winner! - 🐐🏆🐐 </Show>
      </h3>

      <div class="flex flex-row gap-4">
        <div class="units-container">
          <For each={props.owner === "enemy" ? [...props.units].reverse() : props.units}>{getUnitView}</For>
        </div>

        <div class="flex flex-col gap-8" classList={{ "flex-col-reverse": props.owner === "enemy" }}>
          <div class="h-[120px] grid items-center font-bold">Front</div>
          <div class="h-[120px] grid items-center font-bold">Support</div>
        </div>
      </div>
    </div>
  );
};

const tickDelta = 25;
const maxTicks = 300;

export const PlayBattle = (props: { playerBord: MainBoardState; enemyBoard: MainBoardState; onNext: () => void }) => {
  const initialState: GameState = createInitialGameState(props.playerBord, props.enemyBoard);
  // const [gameState, setGameState] = createStore<GameState>(initialState);
  const [gameState, setGameState] = createSignal<GameState>(initialState);
  const [playerUnits, setPlayerUnits] = createSignal<Unit[]>(initialState.playerUnits);
  const [enemyUnits, setEnemyUnits] = createSignal<Unit[]>(initialState.enemyUnits);

  let intervalId: number;

  const processNextTick = () => {
    let { state, events } = createNextGameTick(gameState());
    if (state.playState === "ended") clearInterval(intervalId);
    if (state.tick >= maxTicks) clearInterval(intervalId);

    setPlayerUnits(state.playerUnits.map((u) => ({ ...u })));
    setEnemyUnits(state.enemyUnits.map((u) => ({ ...u })));
    setGameState(state);

    playAnims(events);
    playSounds(events);
  };

  const startBattle = () => {
    intervalId = setInterval(processNextTick, 5000 / tickDelta);
  };

  return (
    <div class="flex flex-col">
      <div>
        <div>Tick: {gameState().tick}</div>

        <button class="btn-primary" disabled={gameState().playState != "not-started"} onClick={startBattle}>
          start
        </button>

        <button class="btn-primary" disabled={gameState().playState != "ended"} onClick={props.onNext}>
          next
        </button>
      </div>

      <div>Play state: {gameState().playState}</div>
      <div>Outcome: {gameState().outcome}</div>

      <div class="flex flex-col gap-16">
        <PlayerBoard units={enemyUnits()} owner="enemy" winner={gameState().outcome === "enemy-wins"}></PlayerBoard>
        <PlayerBoard units={playerUnits()} owner="player" winner={gameState().outcome === "player-wins"}></PlayerBoard>
      </div>
    </div>
  );
};
