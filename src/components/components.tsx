import { For, Show } from "solid-js";
import { PlayerId, replaySpeedList } from "../game/types/types";
import { isPlaying, play, setIsPlaying, setSpeed, speed, stop, units } from "../store/store";
import { Unit } from "../game/types/unit";
import { getPlayerUnits, getUnit, playerUnits } from "../game/game";

export const ReplaySpeed = () => (
  <div class="flex flex-row gap-4">
    Speed:
    <For each={replaySpeedList}>
      {(sp) => (
        <label>
          <input type="radio" name="replaySpeed" checked={sp === speed()} onChange={() => setSpeed(sp)}></input> {sp}
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
    <div class="unit" classList={{ dead: !props.unit.alive }}>
      <h3>
        {props.unit.type} ({props.unit.id})
      </h3>
      <p>
        cd: {props.unit.cooldown.toFixed(2)} ({props.unit.base.cooldown.toFixed(2)})
      </p>
      <p>alive: {props.unit.alive.toString()}</p>

      <div class="unit-attack">{props.unit.attack}</div>
      <div class="unit-hp" classList={{ "unit-damaged": damaged() }}>
        {hpStr()}
      </div>

      <div class="cooldown" style={{ transform: `scaleY(${cdNorm()})` }}></div>
    </div>
  );
};

export const Units = (props: { playerId: PlayerId }) => {
  const unitsArr = () => (props.playerId === 0 ? units().filter(playerUnits(props.playerId)).reverse() : units().filter(playerUnits(props.playerId)));

  return (
    <div>
      <h3>Player {props.playerId} Units</h3>

      <div class="units-container">
        <For each={unitsArr()}>{(u) => <UnitView unit={u}></UnitView>}</For>
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
