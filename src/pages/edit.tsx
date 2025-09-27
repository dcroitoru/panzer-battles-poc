import { createSignal, For, onCleanup, Show, Suspense } from "solid-js";
import { PlayerId } from "../game/types/types";
import { clearAllPlayerUnits, draggedUnit, onInitialStateChange, setDraggedUnit, isDragging, store, units } from "../store/store";
import { playerUnits } from "../game/game";
import { Unit, UnitBase, UnitBases, UnitType, unitTypes } from "../game/types/unit";

const EditUnitView = (props: { unit: Unit; onChange: (unit: Unit, newType: UnitType) => void; onMouseUp: (unit: Unit) => void }) => {
  const [hovered, setHovered] = createSignal(false);
  return (
    <div
      class="unit"
      classList={{ [props.unit.type]: true, "unit-hovered": hovered() }}
      onMouseUp={() => props.onMouseUp(props.unit)}
      onMouseOver={() => isDragging() && setHovered(true)}
      onMouseOut={() => setHovered(false)}
    >
      <select class="w-full hover:bg-orange-100" name="unitType" id="" onChange={(e) => props.onChange(props.unit, e.target.value as UnitType)}>
        <For each={unitTypes}>
          {(ut) => (
            <option value={ut} selected={ut === props.unit.type}>
              {ut}
            </option>
          )}
        </For>
      </select>

      <Show when={props.unit.type !== UnitBases.noUnit.type}>
        <button class="btn-delete" onClick={() => props.onChange(props.unit, UnitBases.noUnit.type)}>
          ❌
        </button>
      </Show>
    </div>
  );
};

const EditUnits = (props: { playerId: PlayerId }) => {
  // const unitsArr = () => units().filter(playerUnits(props.playerId));
  const unitsArr = () => (props.playerId === 0 ? units().filter(playerUnits(props.playerId)).reverse() : units().filter(playerUnits(props.playerId)));
  // const unitsArr = () => units().filter(playerUnits(props.playerId));
  // const [reorient, setReorient] = createSignal(false);
  const reorient = () => props.playerId === 0;
  const onChange = (unit: Unit, newType: UnitType) => {
    // console.log("player", props.playerId, "should update unit", unit.position, "with type", newType);
    onInitialStateChange(unit, newType);
  };

  const onMouseUp = (unit: Unit) => {
    if (draggedUnit().type === "noUnit") return;
    onInitialStateChange(unit, draggedUnit().type);
  };

  return (
    <div>
      <div class="flex gap-8 items-center">
        <h3>Player {props.playerId} Units</h3>

        <button class="btn-primary h-6" onClick={() => clearAllPlayerUnits(props.playerId)}>
          Clear
        </button>
      </div>

      <div class="flex flex-row gap-4">
        <div class="units-container">
          <For each={unitsArr()}>{(u) => <EditUnitView unit={u} onChange={onChange} onMouseUp={onMouseUp}></EditUnitView>}</For>
        </div>

        <div class="flex flex-col gap-8" classList={{ "flex-col-reverse": reorient() }}>
          <div class="h-[120px] grid items-center font-bold">Front</div>
          <div class="h-[120px] grid items-center font-bold">Support</div>
          <div class="h-[120px] grid items-center font-bold">Back</div>
        </div>
      </div>
    </div>
  );
};

const AllUnits = () => {
  const units = Object.values(UnitBases).filter((u) => u.type !== "noUnit");
  return (
    <div>
      <h3>All units</h3>

      <div>
        <For each={units}>{(unit) => <UnitWithDescription base={unit}></UnitWithDescription>}</For>
      </div>
    </div>
  );
};

const UnitWithDescription = (props: { base: UnitBase }) => {
  const unit = props.base;
  return (
    <div class="unit-with-description flex flex-row p-1 text-sm text-gray-500" onMouseDown={() => setDraggedUnit(unit)}>
      <div class="unit-image" classList={{ [unit.type]: true }}></div>
      <div class="">
        <div class="">{unit.type}</div>
        <div class="flex flex-row gap-2">
          <div class="affix ">🗡 {unit.attack}</div>
          <div class="affix">❤️ {unit.hp}</div>
          <div class="affix ">⏱️ {unit.hp}</div>
        </div>

        <Show when={unit.passives?.length}>
          <div class="flex flex-row gap-2">
            ✨
            <For each={unit.passives}>
              {(p) => (
                <div>
                  {p.type} {p.value}
                </div>
              )}
            </For>
          </div>
        </Show>

        <Show when={unit.abilities?.length}>
          <div class="flex flex-row gap-2">
            💪
            <For each={unit.abilities}>
              {(v) => (
                <div>
                  {v.type} {v.status} {v.value}
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
};

export type Pos = {
  x: number;
  y: number;
};

const DraggedUnit = (props: { pos: Pos }) => {
  // const [pos, setPos] = createSignal<Pos>({ x: 0, y: 0 });
  // document.onpointermove = (e) => {
  //   if (!isDragging()) return;
  //   setPos({ x: e.clientX, y: e.clientY });
  // };
  return (
    <Show when={isDragging()}>
      <div
        class="dragged-unit unit-image text-sm text-gray-500 overflow-clip"
        classList={unitClass(draggedUnit())}
        style={{ transform: `translate(${props.pos.x}px, ${props.pos.y}px)` }}
      >
        {draggedUnit().type}
      </div>
    </Show>
  );
};

const unitClass = (unit: UnitBase) => ({ [unit.type]: true });

export function Edit() {
  let containerRef;
  let followerRef;

  const [pos, setPos] = createSignal({ x: 0, y: 0 });

  const updatePos = (e: PointerEvent) => {
    if (!containerRef) return;

    // Get container's box (accounts for padding & borders, not margins)
    const rect = (containerRef as HTMLElement).getBoundingClientRect();

    // Cursor position relative to container
    const x = e.clientX - rect.left - 32;
    const y = e.clientY - rect.top - 32;

    setPos({ x, y });
  };

  // Attach event listener to container
  const attach = () => containerRef!.addEventListener("mousemove", updatePos);
  const detach = () => containerRef!.removeEventListener("mousemove", updatePos);

  onCleanup(detach);

  return (
    <section class="container mx-auto flex flex-col" ref={containerRef}>
      <h1>Edit</h1>

      <div class="flex flex-row gap-4">
        <div>
          <EditUnits playerId={0}></EditUnits>
          <hr class="h-2 my-4 bg-gray-600"></hr>
          <EditUnits playerId={1}></EditUnits>
        </div>

        <div>
          <AllUnits></AllUnits>
        </div>

        <div>
          <h3>dragging</h3>
          <div>{draggedUnit().type}</div>
        </div>
      </div>

      <DraggedUnit ref={followerRef} pos={pos()}></DraggedUnit>

      {attach()}
    </section>
  );
}
