import { useHotkeys } from "react-hotkeys-hook";
import { useTreeStore, selectAllNodes } from "@tree/stores/treeStore";

export const TreeHotkeys = () => {
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

  useHotkeys(["ctrl+a", "meta+a"], (e) => {
    console.log("select all");
    e.preventDefault();
    selectAllNodes();
  });

  return null; // non-visual component
};
