import { For, Show } from "solid-js";
import { replaySpeedList, Unit } from "../game/types/types";
import { isPlaying, play, setIsPlaying, setSpeed, speed, stop, units } from "../store/store";

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
  const cdNorm = () => 1 - props.unit.cooldown / props.unit.baseCooldown;
  return (
    <div class="unit">
      <h3>Unit {props.unit.id}</h3>
      <p>
        cd: {props.unit.cooldown.toFixed(2)} ({props.unit.baseCooldown.toFixed(2)})
      </p>
      {/* <p>cd norm {cdNorm()}</p> */}

      <div class="cooldown" style={{ transform: `scaleY(${cdNorm()})` }}></div>
    </div>
  );
};

export const Units = () => (
  <div>
    <h3>Units</h3>

    <div class="flex flex-row">
      <For each={units}>{(u) => <UnitView unit={u}></UnitView>}</For>
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
