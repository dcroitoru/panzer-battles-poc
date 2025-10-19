import { A } from "@solidjs/router";

export const Nav = () => (
  <nav class="bg-gray-200 text-gray-900">
    <ul class="container mx-auto flex items-center gap-4">
      <li class="py-2">
        <A href="/" class="no-underline hover:underline" activeClass="underline" inactiveClass="default" end>
          Play
        </A>
      </li>

      <li class="py-2">
        <A href="/edit" class="no-underline hover:underline" activeClass="underline" inactiveClass="default" end>
          Edit
        </A>
      </li>

      <li class="py-2">
        <A href="/new-game" class="no-underline hover:underline" activeClass="underline" inactiveClass="default" end>
          Start a New Game
        </A>
      </li>
    </ul>
  </nav>
);
