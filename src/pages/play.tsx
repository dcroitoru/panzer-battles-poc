import { For } from "solid-js";
import { PlayStopBtn, ReplaySpeed, Units } from "../components/components";
import { isPlaying, store } from "../store/store";

export default function Play() {
  return (
    <section class="container mx-auto flex flex-col">
      <h1>Play</h1>
      <PlayStopBtn></PlayStopBtn>
      <p>Game state: {isPlaying() ? "Playing" : "Stopped"}</p>
      <ReplaySpeed></ReplaySpeed>

      <div>{store.tick}</div>
      <div>{store.gameplayState}</div>
      <div>{JSON.stringify(store.outcome)}</div>

      {/* <For each={[...store.units.all.values()]}>
        {(u) => (
          <div class="unit">
            {u.id}: {u.cooldown}
          </div>
        )}
      </For> */}

      <Units playerId={0}></Units>
      <hr class="my-4"></hr>
      <Units playerId={1}></Units>
    </section>
  );
}
