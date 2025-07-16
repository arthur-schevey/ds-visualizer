import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useEffect, useRef, useState } from "react";
import styles from "./GraphNode.module.css"
import clsx from "clsx";
import type { GraphNode } from "./types";
import { graphAPI } from "./stores/graphAPI";

const GraphNodeComponent = ({ id, selected, data }: NodeProps<GraphNode>) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null); // reference to component so it can be immediately focused in handleDoubleClick
  const inputOriginalVal = useRef(data.value); // for use with `esc`

  // Handles changing editing state
  useEffect(() => {
    if (!inputRef.current) return;

    if (editing) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(0, inputRef.current.value.length);
    }
  }, [editing]);

  /**
   * Component lost focus, so we're going to stop editing
   * and conditionally save the current value based on @param doSave.
   *
   * @param doSave
   */
  const handleBlur = (doSave: boolean) => {
    if (doSave && inputRef.current) {
      graphAPI.updateNodeLabel(id, inputRef.current.value);
      inputOriginalVal.current = inputRef.current.value; // Update prev value for use with `Esc`
    }

    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
        handleBlur(true);
        break;

      // Resets the value to the original value
      case "Escape":
        if (inputRef.current) {
          inputRef.current.value = inputOriginalVal.current;
        }
        handleBlur(false);
        break;
    }
  };

  return (
    <div
      onDoubleClick={() => setEditing(true)}
      onBlur={() => handleBlur(true)}
      onKeyDown={handleKeyDown}
      className={clsx("ds-node", selected && "ds-selected")}
    >
      {editing ? (
        <input ref={inputRef} defaultValue={data.value}></input>
      ) : (
        data.value
      )}

      {/* Invisible/uninteractable handle required for edge connections */}
      <Handle type="target" position={Position.Left} className={styles.graphHandle} />
      <Handle type="source" position={Position.Left} className={styles.graphHandle} />
    </div>
  );
};

export default GraphNodeComponent;
