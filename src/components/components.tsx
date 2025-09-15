import { For, Show } from "solid-js";
import { PlayerId, replaySpeedList } from "../game/types/types";
import { isPlaying, play, setIsPlaying, setSpeed, speed, stop } from "../store/store";
import { Unit } from "../game/types/unit";

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
  return (
    <div class="unit">
      <h3>
        {props.unit.type} ({props.unit.id})
      </h3>
      <p>
        cd: {props.unit.cooldown.toFixed(2)} ({props.unit.base.cooldown.toFixed(2)})
      </p>
      {/* <p>cd norm {cdNorm()}</p> */}

      <div class="cooldown" style={{ transform: `scaleY(${cdNorm()})` }}></div>
    </div>
  );
};

export const Units = (props: { playerId: PlayerId; units: Unit[] }) => (
  <div>
    <h3>Player {props.playerId} Units</h3>

    <div class="flex flex-row">
      <For each={props.units}>{(u) => <UnitView unit={u}></UnitView>}</For>
    </div>
  </div>
);

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
