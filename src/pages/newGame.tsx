import { createComputed, createEffect, createSignal, For, Show } from "solid-js";
import { RoundState } from "../game/types/round";
import { UnitBase, UnitType } from "../game/types/unit";
import { UnitView } from "../components/components";
import { UnitBases } from "../game/data/unit-bases";

type MetaState = "not-started" | "started" | "ended";

const startingFame = 5;
const maxRounds = 10;
const [metaState, setMetaState] = createSignal<MetaState>("not-started");
const [fame, setFame] = createSignal(startingFame);
const [state, setState] = createSignal<RoundState>({ round: 0, event: 0 });

const rounds: number[] = Array.from(Array(maxRounds).keys());

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

const createShopChoices = (): UnitType[] => ["conscripts", "regulars", "lightTank"];

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
  <button class="btn-primary" onClick={() => nextState()} disabled={props.disabled}>
    next
  </button>
);

const UnitBaseView = (props: { unitBase: UnitBase; selected: boolean }) => (
  <div class="unit shop-unit cursor-pointer" classList={{ [props.unitBase.type]: true, selected: props.selected }}>
    <p class="font-bold text-md -mt-2 whitespace-nowrap">{props.unitBase.type}</p>
  </div>
);

const ShopScreen = () => {
  const choices = createShopChoices();
  const [choice, setChoice] = createSignal<UnitType>("noUnit");
  const nextDisabled = () => choice() === "noUnit";
  return (
    <div class="bg-green-200 p-2">
      <h3>Shop</h3>
      <p>Choose one</p>
      <div class="flex flex-row gap-4">
        <For each={choices}>
          {(c) => (
            <div onclick={() => setChoice(c)}>
              <UnitBaseView unitBase={UnitBases[c]} selected={c === choice()}></UnitBaseView>
            </div>
          )}
        </For>
      </div>

      <NextStateButton disabled={nextDisabled()} />
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

export const NewGame = () => {
  return (
    <section class="container mx-auto">
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
          <ShopScreen></ShopScreen>
        </Show>

        <Show when={state().event === 1}>
          <BattleScreen></BattleScreen>
        </Show>
      </Show>

      <Show when={metaState() === "ended"}>
        <p>Game ended!</p>
        <EndGameButton />
      </Show>
    </section>
  );
};
