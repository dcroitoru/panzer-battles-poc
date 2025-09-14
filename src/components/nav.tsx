import { A } from "@solidjs/router";

export const Nav = () => (
  <nav class="bg-gray-200 text-gray-900 px-4">
    <ul class="flex items-center">
      <li class="py-2 px-4">
        <A href="/" class="no-underline hover:underline" activeClass="underline" inactiveClass="default" end>
          Play
        </A>
      </li>

      <li class="py-2 px-4">
        <A href="/edit" class="no-underline hover:underline" activeClass="underline" inactiveClass="default" end>
          Edit
        </A>
      </li>
    </ul>
  </nav>
);
