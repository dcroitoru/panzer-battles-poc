import { createSignal, For, Show } from "solid-js";
import { PlayerId, replaySpeedList } from "../game/types/types";
import { events, isPlaying, onSpeedChange, play, speed, stop, store, tickDelta, units } from "../store/store";
import { Unit } from "../game/types/unit";
import { playerUnits } from "../game/game";
import { printHtmlEvent } from "../game/printEvents";

export const ReplaySpeed = () => (
  <div class="flex flex-row gap-4">
    Speed:
    <For each={replaySpeedList}>
      {(sp) => (
        <label>
          <input type="radio" name="replaySpeed" checked={sp === speed()} onChange={() => onSpeedChange(sp)}></input> {sp}
        </label>
      )}
    </For>
  </div>
);

export const UnitView = (props: { unit: Unit }) => {
  const cdNorm = () => 1 - props.unit.cooldown / props.unit.base.cooldown;
  const damaged = () => props.unit.hp < props.unit.base.hp;
  const hpStr = () => (props.unit.alive ? props.unit.hp : "💀");

  return (
    <div class="unit" classList={{ dead: !props.unit.alive, [props.unit.type]: true }} id={`unit-${props.unit.id}`}>
      <div class="cooldown" style={{ transform: `scaleY(${cdNorm()})` }}></div>
      <p class="font-bold text-md">
        {props.unit.type} <span class="text-xs font-normal">({props.unit.id})</span>
      </p>
      <p class="text-xs">
        🕒 {props.unit.cooldown.toFixed(2)} ({props.unit.base.cooldown.toFixed(2)})
      </p>
      {/* <p>alive: {props.unit.alive.toString()}</p> */}

      <div class="unit-attack">{props.unit.attack}</div>
      <div class="unit-hp" classList={{ "unit-damaged": damaged() }}>
        {hpStr()}
      </div>
    </div>
  );
};

export const Units = (props: { playerId: PlayerId }) => {
  const unitsArr = () => (props.playerId === 0 ? units().filter(playerUnits(props.playerId)).reverse() : units().filter(playerUnits(props.playerId)));
  // const unitsArr = () => units().filter(playerUnits(props.playerId));
  // const [reorient, setReorient] = createSignal(false);
  const reorient = () => props.playerId === 0;

  return (
    <div>
      <h3>Player {props.playerId} Units</h3>
      {/* <Show when={props.playerId == 0}>
        <label class="block">
          <input type="checkbox" checked={reorient()} onChange={() => setReorient((prev) => !prev)}></input>
          Orient upside down
        </label>
      </Show> */}

      <div class="flex flex-row gap-4">
        <div class="units-container">
          <For each={unitsArr()}>{(u) => <UnitView unit={u}></UnitView>}</For>
        </div>

        <div class="flex flex-col gap-8" classList={{ "flex-col-reverse": reorient() }}>
          <div class="h-[120px] grid items-center font-bold">Front</div>
          <div class="h-[120px] grid items-center font-bold">Support</div>
          <div class="h-[120px] grid items-center font-bold">Back</div>
        </div>
      </div>
    </div>
  );
};

export const PlayStopBtn = () => (
  <div>
    <Show when={isPlaying()}>
      <button class="btn-primary" onClick={() => stop()}>
        Stop
      </button>
    </Show>

    <Show when={!isPlaying()}>
      <button class="btn-primary" onClick={() => play()}>
        Play
      </button>
    </Show>
  </div>
);

export const ReplayEvents = () => {
  return (
    <div>
      <h1>Events</h1>
      <For each={events().filter((e) => e.events.length > 0)}>
        {(e) => (
          <div class="mt-4">
            <p class="text-gray-500 text-sm">
              Tick: {e.tick} ({e.tick * tickDelta}s)
            </p>
            <For each={e.events}>{(ev) => <p innerHTML={printHtmlEvent(ev, store)}></p>}</For>
          </div>
        )}
      </For>
    </div>
  );
};
