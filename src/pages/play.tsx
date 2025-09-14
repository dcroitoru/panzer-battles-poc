import { PlayStopBtn, ReplaySpeed, Units } from "../components/components";
import { isPlaying } from "../store/store";

export default function Play() {
  return (
    <section class="container mx-auto flex flex-col">
      <h1>Play</h1>
      <PlayStopBtn></PlayStopBtn>
      <p>Game state: {isPlaying() ? "Playing" : "Stopped"}</p>
      <ReplaySpeed></ReplaySpeed>

      <Units></Units>

      <Units></Units>
    </section>
  );
}
