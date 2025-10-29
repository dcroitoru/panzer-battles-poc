import { MainBoardState } from "../game/types/round";
import { createSignal, For } from "solid-js";
import { Unit } from "../game/unit";
import { NoUnitView, UnitView } from "./components";
import { createInitialGameState, createNextGameTick, GameState, PlayerId } from "../game/game";
import { playAnims, playSounds } from "../anim/anim";

const getUnitView = (u: Unit) => (u.base.type == "noUnit" ? <NoUnitView /> : <UnitView unit={u} />);

const PlayerBoard = (props: { units: Unit[]; owner: PlayerId }) => {
  return (
    <div>
      <h3>Owner: {props.owner}</h3>

      <div class="units-container">
        <For each={props.owner === "enemy" ? [...props.units].reverse() : props.units}>{getUnitView}</For>
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

      <PlayerBoard units={enemyUnits()} owner="enemy"></PlayerBoard>
      <PlayerBoard units={playerUnits()} owner="player"></PlayerBoard>
    </div>
  );
};
