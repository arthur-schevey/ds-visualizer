import { useHotkeys } from "react-hotkeys-hook";
import { useTreeStore } from "../stores/treeStore";

export const HotkeyBindings = () => {
  const { undo, redo } = useTreeStore.temporal.getState();

  useHotkeys("ctrl+z, meta+z", (e) => {
    console.log("undo");
    e.preventDefault();
    undo(1);
  });

  useHotkeys(["ctrl+shift+z", "meta+shift+z"], (e) => {
    console.log("redo");
    e.preventDefault();
    redo(1);
  });

  return null; // non-visual component
};
