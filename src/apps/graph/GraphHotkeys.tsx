import { useHotkeys } from "react-hotkeys-hook";
import { useGraphStore } from "./stores/graphStore";
import { graphAPI } from "./stores/graphAPI";

export const GraphHotkeys = () => {
  // Cannot use until graph component is more stable
  // const { undo, redo } = useGraphStore.temporal.getState();

  // useHotkeys("ctrl+z, meta+z", (e) => {
  //   console.log("undo");
  //   e.preventDefault();
  //   undo(1);
  // });

  // useHotkeys(["ctrl+shift+z", "meta+shift+z"], (e) => {
  //   console.log("redo");
  //   e.preventDefault();
  //   redo(1);
  // });

  const uiMode = useGraphStore((state) => state.uiMode)

  // Toggles ui mode back and forth
  useHotkeys(["space"], (e) => {
    console.log("select all");
    e.preventDefault();
    graphAPI.setUiMode(uiMode === "draw" ? "move" : "draw")
  });

  return null; // non-visual component
};
