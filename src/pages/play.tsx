import { For } from "solid-js";
import { PlayStopBtn, ReplaySpeed, Units } from "../components/components";
import { isPlaying, maxTicks, store } from "../store/store";

export default function Play() {
  return (
    <section class="container mx-auto flex flex-col">
      <h1>Play</h1>
      <PlayStopBtn></PlayStopBtn>
      <p>Game state: {isPlaying() ? "Playing" : "Stopped"}</p>
      <ReplaySpeed></ReplaySpeed>

      <div>
        Tick: {store.tick} (max {maxTicks})
      </div>
      <div>{store.gameplayState}</div>
      <div>{JSON.stringify(store.outcome)}</div>

      <Units playerId={0}></Units>
      <hr class="h-4 my-4 bg-gray-600"></hr>
      <Units playerId={1}></Units>
    </section>
  );
}
