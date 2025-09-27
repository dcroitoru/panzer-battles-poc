import { lazy } from "solid-js";
import type { RouteDefinition } from "@solidjs/router";

import { Edit } from "./pages/edit";
import { Play } from "./pages/play";

export const routes: RouteDefinition[] = [
  {
    path: "/",
    component: Play,
  },
  {
    path: "/edit",
    component: Edit,
  },
  {
    path: "**",
    component: lazy(() => import("./errors/404")),
  },
];
