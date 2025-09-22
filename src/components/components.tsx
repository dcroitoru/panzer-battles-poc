import { For, Show } from "solid-js";
import { PlayerId, replaySpeedList } from "../game/types/types";
import {
  enableSounds,
  events,
  isPlaying,
  onSpeedChange,
  play,
  setEnableSounds,
  setShowEvents,
  showEvents,
  speed,
  stop,
  store,
  tickDelta,
  units,
} from "../store/store";
import { Passive, Unit } from "../game/types/unit";
import { playerUnits } from "../game/game";
import { printHtmlEvent } from "../game/printEvents";
import { StatusKind } from "../game/types/ability";

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

export const PlaySounds = () => (
  <div>
    <label>
      Play sounds <input type="checkbox" checked={enableSounds()} onChange={() => setEnableSounds((prev) => !prev)}></input>
    </label>
  </div>
);

export const ShowEventsLog = () => (
  <label>
    Show Events Log <input type="checkbox" checked={showEvents()} onChange={() => setShowEvents((prev) => !prev)}></input>
  </label>
);

export const NoUnitView = () => (
  <div class="unit no-unit">
    <p class="unit-name">Empty</p>
  </div>
);

export const UnitView = (props: { unit: Unit }) => {
  const cdNorm = () => 1 - props.unit.cooldown / props.unit.base.cooldown;
  const damaged = () => props.unit.hp < props.unit.base.hp;
  const hpStr = () => (props.unit.alive ? props.unit.hp : "💀");
  const buffs = () => [...props.unit.passives.filter((p) => p.kind === "buff")];
  const debuffs = (): Passive[] => [];
  const status = () => [...props.unit.status];
  const statusBuff = () => status().filter((s) => StatusKind[s[0]] === "buff");
  const statusDebuff = () => status().filter((s) => StatusKind[s[0]] === "debuff");
  const ammo = () => props.unit.ammo;

  return (
    <div class="unit" classList={{ dead: !props.unit.alive, [props.unit.type]: true }} id={`unit-${props.unit.id}`}>
      <div class="cooldown" style={{ transform: `scaleY(${cdNorm()})` }}></div>
      <p class="font-bold text-md -mt-2 whitespace-nowrap">{props.unit.type}</p>
      <p class="text-xs">
        🕒 {props.unit.cooldown.toFixed(2)} ({props.unit.base.cooldown.toFixed(2)})
      </p>
      {/* <p>alive: {props.unit.alive.toString()}</p> */}

      <div class="flex flex-col text-xs">
        <div class="buffs">
          <For each={buffs()}>
            {(b) => (
              <p class="text-green-800">
                ▲ {b.type} {b.value ? b.value : ""}
              </p>
            )}
          </For>
        </div>

        <div class="debuffs">
          <For each={debuffs()}>
            {(b) => (
              <p class="text-red-800">
                ▼ {b.type} {b.value ? b.value : ""}
              </p>
            )}
          </For>
        </div>

        <div>
          <For each={statusBuff()}>
            {(b) => (
              <p class="text-green-800">
                ▲ {b[0]} {b[1]}
              </p>
            )}
          </For>
        </div>
        <div>
          <For each={statusDebuff()}>
            {(b) => (
              <p class="text-red-800">
                ▼ {b[0]} {b[1]}
              </p>
            )}
          </For>
        </div>

        <Show when={ammo() != undefined}>
          <div>💣 {ammo()}</div>
        </Show>
      </div>

      <div class="unit-attack">{props.unit.attack}</div>
      <div class="unit-id">id: {props.unit.id}</div>
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
  const isWinner = () => store.outcome === `player-${props.playerId}-wins`;

  return (
    <div>
      <h3>
        Player {props.playerId} Units
        <Show when={isWinner()}> - Winner! - 🐐🏆🐐 </Show>
      </h3>
      {/* <Show when={props.playerId == 0}>
        <label class="block">
          <input type="checkbox" checked={reorient()} onChange={() => setReorient((prev) => !prev)}></input>
          Orient upside down
        </label>
      </Show> */}

      <div class="flex flex-row gap-4">
        <div class="units-container">
          <For each={unitsArr()}>{(u) => (u.type === "no-unit" ? <NoUnitView></NoUnitView> : <UnitView unit={u}></UnitView>)}</For>
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
