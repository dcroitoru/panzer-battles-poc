import { For, Suspense } from "solid-js";
import { PlayerId } from "../game/types/types";
import { onInitialStateChange, store, units } from "../store/store";
import { playerUnits } from "../game/game";
import { Unit, UnitType, unitTypes } from "../game/types/unit";

const EditUnitView = (props: { unit: Unit; onChange: (unit: Unit, newType: UnitType) => void }) => {
  return (
    <div class="unit">
      {/* <p>{props.unit.type}</p> */}
      <select name="unitType" id="" onChange={(e) => props.onChange(props.unit, e.target.value as UnitType)}>
        <For each={unitTypes}>
          {(ut) => (
            <option value={ut} selected={ut === props.unit.type}>
              {ut}
            </option>
          )}
        </For>
      </select>
    </div>
  );
};

const EditUnits = (props: { playerId: PlayerId }) => {
  const unitsArr = () => units().filter(playerUnits(props.playerId));
  const onChange = (unit: Unit, newType: UnitType) => {
    // console.log("player", props.playerId, "should update unit", unit.position, "with type", newType);
    onInitialStateChange(unit, newType);
  };
  return (
    <div>
      <h3>Player {props.playerId} Units</h3>
      {/* <Show when={props.playerId == 0}>
            <label class="block">
              <input type="checkbox" checked={reorient()} onChange={() => setReorient((prev) => !prev)}></input>
              Orient upside down
            </label>
          </Show> */}

      <div class="flex flex-row gap-4">
        <div class="units-container">
          <For each={unitsArr()}>{(u) => <EditUnitView unit={u} onChange={onChange}></EditUnitView>}</For>
        </div>

        <div class="flex flex-col gap-8">
          <div class="h-[120px] grid items-center font-bold">Front</div>
          <div class="h-[120px] grid items-center font-bold">Support</div>
          <div class="h-[120px] grid items-center font-bold">Back</div>
        </div>
      </div>
    </div>
  );
};

export default function Edit() {
  return (
    <section class="container mx-auto flex flex-col">
      <h1>Edit</h1>

      <EditUnits playerId={0}></EditUnits>
      <hr class="h-2 my-4 bg-gray-600"></hr>
      <EditUnits playerId={1}></EditUnits>
    </section>
  );
}
