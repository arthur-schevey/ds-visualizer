import { useHotkeys } from "react-hotkeys-hook";
import { useTreeStore } from "@tree/stores/treeStore";
import { treeAPI } from "../stores/treeAPI";

export const TreeHotkeys = () => {
  const { undo, redo } = useTreeStore.temporal.getState();

  useHotkeys("ctrl+z, meta+z", (e) => {
    e.preventDefault();
    undo(1);
  });

  useHotkeys(["ctrl+shift+z", "meta+shift+z"], (e) => {
    e.preventDefault();
    redo(1);
  });

  useHotkeys(["ctrl+a", "meta+a"], (e) => {
    e.preventDefault();
    treeAPI.selectAllNodes();
  });

  return null; // non-visual component
};
