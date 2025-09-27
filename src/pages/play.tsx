import { For, Show } from "solid-js";
import { PlaySounds, PlayStopBtn, ReplayEvents, ReplaySpeed, ShowEventsLog, Units } from "../components/components";
import { isPlaying, maxTicks, showEvents, store } from "../store/store";

export function Play() {
  return (
    <section class="container mx-auto flex flex-col">
      <h1>Play</h1>
      <PlayStopBtn></PlayStopBtn>
      <p>Game state: {isPlaying() ? "Playing" : "Stopped"}</p>
      <div class="flex flex-row gap-4">
        <ReplaySpeed></ReplaySpeed>
        <PlaySounds></PlaySounds>
        <ShowEventsLog></ShowEventsLog>
      </div>

      <div>
        Tick: {store.tick} (max {maxTicks})
      </div>
      <div>{store.gameplayState}</div>
      <div>{JSON.stringify(store.outcome)}</div>

      <div class="flex flex-row gap-8 board-container">
        <div>
          <Units playerId={0}></Units>
          <hr class="h-2 my-4 bg-gray-600"></hr>
          <Units playerId={1}></Units>
        </div>

        <div class="replay-events">
          <Show when={showEvents()}>
            <ReplayEvents></ReplayEvents>
          </Show>
        </div>
      </div>
    </section>
  );
}
