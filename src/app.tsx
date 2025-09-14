import { type Component } from "solid-js";
import { useLocation } from "@solidjs/router";
import { Nav } from "./components/nav";

const App: Component<{ children: Element }> = (props) => {
  const location = useLocation();

  return (
    <div class="flex flex-col h-full">
      <Nav />
      <main class="bg-gray-100 text-gray-700 flex-1">{props.children}</main>
    </div>
  );
};

export default App;
