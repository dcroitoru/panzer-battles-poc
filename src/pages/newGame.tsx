import { createSignal, For, onCleanup, Show } from "solid-js";
import { DraggedUnit, MainBoardState, PlayerBoardState, RoundState, SideBoardState } from "../game/types/round";
import { UnitBase, UnitType } from "../game/types/unit";
import { UnitBases } from "../game/data/unit-bases";
import { getShopTierForRound, rollShopForRound } from "../game/new-game";
import { Pos } from "./edit";
import { runWithOwner, getOwner } from "solid-js";
import { createStore } from "solid-js/store";

type MetaState = "not-started" | "started" | "ended";

const startingFame = 5;
const maxRounds = 10;
const [metaState, setMetaState] = createSignal<MetaState>("not-started");
const [fame, setFame] = createSignal(startingFame);
const [state, setState] = createSignal<RoundState>({ round: 0, event: 0 });
const initialMainBoardState: MainBoardState = [
  ["noUnit", "noUnit", "noUnit", "noUnit", "noUnit"],
  ["noUnit", "noUnit", "noUnit", "noUnit", "noUnit"],
];
const intiialSideBoardState: SideBoardState = ["noUnit", "noUnit", "noUnit", "noUnit", "noUnit"];
const [playerBoardState, setPlayerBoardState] = createStore<PlayerBoardState>({
  main: initialMainBoardState,
  side: intiialSideBoardState,
});

const rounds: number[] = Array.from(Array(maxRounds).keys());

const [dragged, setDragged] = createSignal<DraggedUnit>(null);
const [pos, setPos] = createSignal<Pos>({ x: 0, y: 0 });

const isDragging = () => dragged() !== null;

const startDrag = (d: DraggedUnit) => {
  console.log("started dragging", d);
  setDragged(d);
};

const stopDrag = (dd: DraggedUnit) => {
  console.log("droped on", dd);
  // if (dd?.parent == "side") {
  //   updateSide(dd?.type!, dd?.x!);
  // }

  // if (dd?.parent == "main") {
  //   updateMain(dd?.type, dd?.y, dd?.x);
  // }
  // addUnitToPlayerSideBoard(dragged()?.type!);
  // updateSide(dragged()?.type!, dd?.x!);
  setPlayerBoardState("side", dd?.x!, dragged()?.type!);
  setDragged(null);
};

// document.onmouseup = (e) => {
//   setTimeout(() => {
//     setDragged(null);
//   }, 10);
// };

const startNewGame = () => {
  setState({ round: 0, event: 0 });
  setMetaState("started");
};

const nextState = () => {
  if (state().round === maxRounds - 1 && state().event === 1) {
    setMetaState("ended");
    return;
  }

  setState((prev) => {
    const round = prev.event === 0 ? prev.round : prev.round + 1;
    const event = prev.event === 0 ? 1 : 0;
    return { ...prev, round, event };
  });
};

const addUnitToPlayerSideBoard = (type: UnitType) => {
  // setPlayerBoardState("")
  // const newState = { ...playerBoardState() };
  const x = playerBoardState.side.findIndex((el) => el == "noUnit");
  // newState.side = [...newState.side];
  // newState.side[pos] = unitType;
  // setPlayerBoardState(newState);
  setPlayerBoardState("side", x, type);
};

// const canAddUnitToPlayerSideBoard = () => playerBoardState().side.findIndex((el) => el == "noUnit") != -1;

const StartNewGameButton = () => (
  <button class="btn-primary" onclick={() => startNewGame()}>
    start new game
  </button>
);

const EndGameButton = () => (
  <button class="btn-primary" onclick={() => setMetaState("not-started")}>
    end game
  </button>
);

const NextStateButton = (props: { disabled: boolean }) => (
  <button class="btn-primary block" onClick={() => nextState()} disabled={props.disabled}>
    next
  </button>
);

const UnitBaseView = (props: { unitBase: UnitBase; selected: boolean; parent: string; x: number; y: number }) => (
  <div
    data-parent={props.parent}
    data-x={props.x}
    data-y={props.y}
    data-type={props.unitBase.type}
    class="unit shop-unit cursor-pointer"
    classList={{ [props.unitBase.type]: true, selected: props.selected }}
    onPointerDown={() => startDrag({ type: props.unitBase.type, parent: props.parent, x: props.x, y: props.y })}
    onPointerUp={() => stopDrag({ type: props.unitBase.type, parent: props.parent, x: props.x, y: props.y })}
  >
    <p class="font-bold text-md -mt-2 whitespace-nowrap select-none">{props.unitBase.type}</p>
  </div>
);

const PlayerBoardStateScreen = (props: { boardState: PlayerBoardState }) => (
  <div>
    <div>
      <h3>Main</h3>
      <div class="flex flex-col gap-4">
        <div class="flex flex-row gap-4">
          <For each={props.boardState.main[0]}>
            {(u, x) => <UnitBaseView unitBase={UnitBases[u]} selected={false} parent="main" y={0} x={x()}></UnitBaseView>}
          </For>
        </div>
        <div class="flex flex-row gap-4">
          <For each={props.boardState.main[1]}>
            {(u, x) => <UnitBaseView unitBase={UnitBases[u]} selected={false} parent="main" y={1} x={x()}></UnitBaseView>}
          </For>
        </div>
      </div>
    </div>

    <div>
      <h3>Side</h3>
      <div class="flex flex-row gap-4">
        <For each={props.boardState.side}>{(u, x) => <UnitBaseView unitBase={UnitBases[u]} selected={false} parent="side" y={0} x={x()}></UnitBaseView>}</For>
      </div>
    </div>
  </div>
);

const ShopScreen = (props: { round: number }) => {
  const choices = rollShopForRound(props.round);
  const [choice, setChoice] = createSignal<UnitType>("noUnit");
  const [confirmed, setConfirmed] = createSignal(false);
  const confirmDisabled = () => choice() === "noUnit";
  const nextDisabled = () => confirmDisabled() || confirmed() == false;
  const shopTier = () => getShopTierForRound(props.round);
  const onConfirm = () => {
    addUnitToPlayerSideBoard(choice());
    setConfirmed(true);
  };
  // const boardIsFull = () => !canAddUnitToPlayerSideBoard();
  const boardIsFull = () => false;
  return (
    <div class="bg-green-200 p-2">
      <h3>Shop (Tier {shopTier()})</h3>

      <Show when={confirmed() == false}>
        <p>Choose one</p>

        <div class="flex flex-row gap-4" classList={{ disabled: true }}>
          <For each={choices}>
            {(c, x) => (
              <div onclick={() => setChoice(c)}>
                <UnitBaseView unitBase={UnitBases[c]} selected={c === choice()} parent="shop" y={0} x={x()}></UnitBaseView>
              </div>
            )}
          </For>
        </div>

        <button class="btn-primary mt-4" disabled={confirmDisabled()} onClick={onConfirm}>
          Confirm
        </button>

        <Show when={boardIsFull()}>
          <p class="bold text-red-800 mt-4">Player side board full! (Move to main or sell smth.)</p>
        </Show>
      </Show>

      <div class="mt-4">
        <NextStateButton disabled={nextDisabled()} />
      </div>
    </div>
  );
};

const BattleScreen = () => {
  const [battleEnded, setBattleEnded] = createSignal(false);
  const nextDisabled = () => battleEnded() === false;

  return (
    <div class="bg-blue-200">
      <h3>Battle</h3>
      <div>Should show both sides here</div>

      <div class="inline-flex flex-col gap-4">
        <button class="btn-primary" onclick={() => setBattleEnded(true)}>
          Simulate end battle
        </button>

        <Show when={battleEnded()}>Somebody won!</Show>

        <NextStateButton disabled={nextDisabled()}></NextStateButton>
      </div>
    </div>
  );
};

export const CreateDraggedUnit = () => {
  return (
    <Show when={isDragging()}>
      <div
        class="dragged-unit unit-image text-sm text-gray-500 overflow-clip top-0 left-0"
        classList={unitClass(dragged())}
        style={{ transform: `translate(${pos().x - 32}px, ${pos().y - 32}px)` }}
      >
        {dragged()?.type}
      </div>
    </Show>
  );
};

const unitClass = (d: DraggedUnit) => {
  if (d == null) return {};
  return { [d.type]: true };
};

export const NewGame = () => {
  let containerRef;
  let followerRef;

  // const [pos, setPos] = createSignal({ x: 0, y: 0 });

  const updatePos = (e: PointerEvent) => {
    if (!containerRef) return;

    // Get container's box (accounts for padding & borders, not margins)
    const rect = (containerRef as HTMLElement).getBoundingClientRect();

    // Cursor position relative to container
    const x = e.clientX - rect.left - 32;
    const y = e.clientY - rect.top - 32;

    setPos({ x, y });
  };

  // Attach event listener to container
  const attach = () => containerRef!.addEventListener("mousemove", updatePos);
  const detach = () => containerRef!.removeEventListener("mousemove", updatePos);

  onCleanup(detach);

  return (
    <section class="container mx-auto select-none" ref={containerRef}>
      <div>
        Side:
        <For each={playerBoardState.side}>{(u) => <p>{u}</p>}</For>
      </div>

      <h3>Play new game</h3>

      <div>meta state: {metaState()}</div>

      <Show when={metaState() === "not-started"}>
        <StartNewGameButton />
      </Show>

      <Show when={metaState() === "started"}>
        <div class="flex flex-row gap-2 bg-amber-200">
          <For each={rounds}>
            {(round) => (
              <div>
                <Show when={round === state().round}>
                  <div class="font-bold underline">round {(round + 1).toString()}</div>
                </Show>
                <Show when={round !== state().round}>
                  <div class="">round {(round + 1).toString()}</div>
                </Show>
              </div>
            )}
          </For>
        </div>

        <div class="flex flex-row gap-4 bg-amber-100">
          <div classList={{ selected: state().event === 0 }}>Shop</div>
          <div classList={{ selected: state().event === 1 }}>Battle</div>
        </div>

        <Show when={state().event === 0}>
          <ShopScreen round={state().round}></ShopScreen>
          <PlayerBoardStateScreen boardState={playerBoardState}></PlayerBoardStateScreen>
        </Show>

        <Show when={state().event === 1}>
          <BattleScreen></BattleScreen>
        </Show>
      </Show>

      <Show when={metaState() === "ended"}>
        <p>Game ended!</p>
        <EndGameButton />
      </Show>

      <CreateDraggedUnit></CreateDraggedUnit>

      {attach()}
    </section>
  );
};

if (!(document as any).flag) {
  document.addEventListener("pointerup", (e) => {
    setTimeout(() => {
      setDragged(null);
    }, 10);
  });
}

(document as any).flag = true;

// if (!(document as any).flag) {
//   document.addEventListener("pointerdown", (e) => {
//     var el = e.target as HTMLElement;
//     if (el.dataset.type) {
//       console.log("should start dragging el", el);
//       const { type, parent, y, x } = el.dataset;
//       console.log("should set dragged", type, parent, y, x);

//       setPos({ x: e.clientX, y: e.clientY });
//       setDragged({ type, parent, x: +x!, y: +y! } as DraggedUnit);
//     }
//   });

//   document.addEventListener("pointerup", (e) => {
//     var el = e.target as HTMLElement;
//     if (el.dataset.type) {
//       console.log("should drop at", el);
//       const { type, parent, y, x } = el.dataset;
//       console.log("dropped on", type, parent, y, x);

//       if (parent == "side") {
//         updateSide(type as UnitType, +x!);
//       }

//       if (parent == "main") {
//         updateMain(type as UnitType, +y!, +x!);
//       }
//     }

//     setDragged(null);
//   });

//   document.addEventListener("pointermove", (e) => {
//     if (!isDragging()) return;
//     setPos({ x: e.clientX, y: e.clientY });
//     // var el = e.target as HTMLElement;
//     // if (el.dataset.type) {
//     //   console.log("should start dragging el", el);
//     // }
//   });
// }

// (document as any).flag = true;
