import { type Component } from "solid-js";
import { useLocation } from "@solidjs/router";
import { Nav } from "./components/nav";

const App: Component<{ children: Element }> = (props) => {
  const location = useLocation();

  return (
    <>
      <Nav />
      <main>{props.children}</main>
    </>
  );
};

export default App;
