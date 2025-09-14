import { PlayStopBtn, ReplaySpeed, Units } from "../components/components";
import { isPlaying } from "../store/store";

export default function Play() {
  return (
    <section class="bg-gray-100 text-gray-700 p-8">
      <h1>Play</h1>
      <PlayStopBtn></PlayStopBtn>
      <p>Game state: {isPlaying() ? "Playing" : "Stopped"}</p>
      <ReplaySpeed></ReplaySpeed>

      <Units></Units>
    </section>
  );
}
