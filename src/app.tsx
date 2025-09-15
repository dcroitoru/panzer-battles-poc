import { type Component } from "solid-js";
import { Nav } from "./components/nav";

const App: Component<{ children: Element }> = (props) => {
  return (
    <div class="flex flex-col h-full">
      <Nav />
      <main class="bg-gray-100 text-gray-700 flex-1">{props.children}</main>
      <div id="animations-layer">
        {/* <div class="attack-anim"></div>
        <div class="dummy"></div> */}
      </div>
    </div>
  );
};

export default App;
