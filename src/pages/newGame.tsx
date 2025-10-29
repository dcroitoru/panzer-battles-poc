import { createSignal, For, onCleanup, Show } from "solid-js";
import { BoardItem, MainBoardState, PlayerBoardState, RoundState, SideBoardState } from "../game/types/round";
import { UnitBase, UnitType } from "../game/unit";
import { UnitBases } from "../game/data/unit-bases";
import { getShopTierForRound, rollShopForRound } from "../game/new-game";
import { Pos } from "./edit";
import { runWithOwner, getOwner } from "solid-js";
import { createStore } from "solid-js/store";
import { PlayBattle } from "../components/play-battle";
import { getEnemyBoardStateForRound } from "../game/data/enemy-board-data";

type MetaState = "not-started" | "started" | "ended";

const startingFame = 5;
const maxRounds = 10;
const [metaState, setMetaState] = createSignal<MetaState>("not-started");
const [fame, setFame] = createSignal(startingFame);
const [state, setState] = createSignal<RoundState>({ round: 0, event: "shop" });
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

const NoItem: BoardItem = { type: "noUnit", parent: "", x: 0, y: 0 };
const [dragged, setDragged] = createSignal<BoardItem>(NoItem);
const [pos, setPos] = createSignal<Pos>({ x: 0, y: 0 });

const isDragging = () => dragged() !== NoItem;
const [shopUsed, setShopUsed] = createSignal(false);
const isDraggedItem = (item: BoardItem) => {
  if (item.type == "noUnit") return false;

  const { parent, type, x, y } = dragged();
  if (item.parent == parent && item.type == type && item.x == x && item.y == y) return true;
  return false;
};
const onDrop = (item: BoardItem) => {
  console.log("droped on", item);
  if (item.parent == "side") {
    if (dragged().parent == "main") setPlayerBoardState("main", dragged().y, dragged().x, item.type);
    if (dragged().parent == "side") setPlayerBoardState("side", dragged().x, item.type);
    setPlayerBoardState("side", item.x, dragged().type);
  }
  if (item.parent == "main") {
    if (dragged().parent == "main") setPlayerBoardState("main", dragged().y, dragged().x, item.type);
    if (dragged().parent == "side") setPlayerBoardState("side", dragged().x, item.type);
    setPlayerBoardState("main", item.y, item.x, dragged().type);
  }
  if (dragged().parent == "shop" && item.parent != "shop") setShopUsed(true);
  setDragged(NoItem);
};

const startNewGame = () => {
  setState({ round: 0, event: "shop" });
  setMetaState("started");
};

const nextState = () => {
  if (state().round === maxRounds - 1 && state().event === "battle") {
    setMetaState("ended");
    return;
  }

  setState((prev) => {
    setShopUsed(false);
    const round = prev.event === "shop" ? prev.round : prev.round + 1;
    const event = prev.event === "shop" ? "battle" : "shop";
    return { ...prev, round, event };
  });
};

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

const BoardItemView = (props: { item: BoardItem; selected: boolean }) => (
  <div
    class="unit shop-unit cursor-pointer "
    classList={{ [props.item.type]: true, selected: props.selected, "opacity-50": isDraggedItem(props.item) }}
    onPointerDown={() => setDragged(props.item)}
    onPointerUp={() => onDrop(props.item)}
  >
    <p class="font-bold text-md -mt-2 whitespace-nowrap select-none">{props.item.type}</p>
  </div>
);

const PlayerBoardStateScreen = (props: { boardState: PlayerBoardState }) => (
  <div>
    <div>
      <h3>Main</h3>
      <div class="flex flex-col gap-4">
        <div class="flex flex-row gap-4">
          <For each={props.boardState.main[0]}>
            {(u, x) => <BoardItemView item={{ parent: "main", type: u, y: 0, x: x() }} selected={false}></BoardItemView>}
          </For>
        </div>
        <div class="flex flex-row gap-4">
          <For each={props.boardState.main[1]}>
            {(u, x) => <BoardItemView item={{ parent: "main", type: u, y: 1, x: x() }} selected={false}></BoardItemView>}
          </For>
        </div>
      </div>
    </div>

    <div>
      <h3>Side</h3>
      <div class="flex flex-row gap-4">
        <For each={props.boardState.side}>{(u, x) => <BoardItemView item={{ parent: "side", type: u, y: 0, x: x() }} selected={false}></BoardItemView>}</For>
      </div>
    </div>
  </div>
);

const ShopScreen = (props: { round: number }) => {
  const choices = rollShopForRound(props.round);
  const [choice, setChoice] = createSignal<UnitType>("noUnit");
  const nextDisabled = () => shopUsed() == false;
  const shopTier = () => getShopTierForRound(props.round);

  return (
    <div class="bg-green-200 p-2">
      <h3>Shop (Tier {shopTier()})</h3>

      <Show when={shopUsed() == false}>
        <p>Choose one</p>

        <div class="flex flex-row gap-4" classList={{ disabled: true }}>
          <For each={choices}>
            {(c, x) => (
              <div onclick={() => setChoice(c)}>
                <BoardItemView selected={c === choice()} item={{ parent: "shop", type: c, y: 0, x: x() }}></BoardItemView>
              </div>
            )}
          </For>
        </div>
      </Show>

      <div class="mt-4">
        <NextStateButton disabled={nextDisabled()} />
      </div>
    </div>
  );
};

// const BattleScreen = () => {
//   const [battleEnded, setBattleEnded] = createSignal(false);
//   const nextDisabled = () => battleEnded() === false;

//   return (
//     <div class="bg-blue-200">
//       <h3>Battle</h3>
//       <div>Should show both sides here</div>

//       <div class="inline-flex flex-col gap-4">
//         <button class="btn-primary" onclick={() => setBattleEnded(true)}>
//           Simulate end battle
//         </button>

//         <Show when={battleEnded()}>Somebody won!</Show>

//         <NextStateButton disabled={nextDisabled()}></NextStateButton>
//       </div>
//     </div>
//   );
// };

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

const unitClass = (i: BoardItem) => ({ [i.type]: true });

export const NewGame = () => {
  let containerRef;
  let followerRef;

  // const [pos, setPos] = createSignal({ x: 0, y: 0 });

  const updatePos = (e: PointerEvent) => {
    if (!containerRef) return;
    // Cursor position relative to container
    const x = e.clientX; // - rect.left - 32;
    const y = e.clientY; // - rect.top - 32;
    setPos({ x, y });
  };

  // Attach event listener to container
  const attach = () => containerRef!.addEventListener("mousemove", updatePos);
  const detach = () => containerRef!.removeEventListener("mousemove", updatePos);

  onCleanup(detach);

  return (
    <section class="container mx-auto select-none" ref={containerRef}>
      <h3>Play new game</h3>

      <div>
        State: <b>{metaState()}</b>
      </div>

      <Show when={metaState() === "not-started"}>
        <StartNewGameButton />
      </Show>

      <Show when={metaState() === "started"}>
        <div class="flex flex-row gap-2 bg-amber-200">
          <For each={rounds}>
            {(round) => (
              <div class="p-2">
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

        <div class="flex flex-row gap-4 bg-amber-100 p-2">
          <div classList={{ selected: state().event === "shop" }}>Shop</div>
          <div classList={{ selected: state().event === "battle" }}>Battle</div>
        </div>

        <Show when={state().event === "shop"}>
          <ShopScreen round={state().round}></ShopScreen>
          <PlayerBoardStateScreen boardState={playerBoardState}></PlayerBoardStateScreen>
        </Show>

        <Show when={state().event === "battle"}>
          <PlayBattle playerBord={playerBoardState.main} enemyBoard={getEnemyBoardStateForRound(state().round)} onNext={() => nextState()}></PlayBattle>
          {/* <BattleScreen></BattleScreen> */}
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
      setDragged(NoItem);
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
