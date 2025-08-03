import { useHotkeys } from "react-hotkeys-hook";
import { useGraphStore } from "./stores/graphStore";
import { graphAPI } from "./stores/graphAPI";

export const GraphHotkeys = () => {

  const { undo, redo } = useGraphStore.temporal.getState();

  useHotkeys("ctrl+z, meta+z", (e) => {
    e.preventDefault();
    undo(1);
  });

  useHotkeys(["ctrl+shift+z", "meta+shift+z"], (e) => {
    e.preventDefault();
    redo(1);
  });

  const uiMode = useGraphStore((state) => state.uiMode)

  // Toggles ui mode back and forth
  useHotkeys(["space"], (e) => {
    e.preventDefault();
    graphAPI.setUiMode(uiMode === "draw" ? "move" : "draw")
  });

  return null; // non-visual component
};
