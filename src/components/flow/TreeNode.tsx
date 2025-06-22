import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { useEffect, useRef, useState } from "react";
import styles from "./TreeNode.module.css";
import clsx from "clsx";
import { useTreeStore } from "../../store";
import { useShallow } from "zustand/shallow";

type TreeNode = Node<
  { label: string; leftId?: string; rightId?: string, dummy?: boolean },
  "treeNode"
>;

const TreeNode = ({ id, selected, data }: NodeProps<TreeNode>) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null); // reference to component so it can be immediately focused in handleDoubleClick
  const inputOriginalVal = useRef(data.label); // for use with `esc`

  const { updateNodeLabel, nodeAddChild } = useTreeStore(
    useShallow((state) => ({
      updateNodeLabel: state.updateNodeLabel,
      nodeAddChild: state.nodeAddChild,
    }))
  );

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
      updateNodeLabel(id, inputRef.current.value);
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
      className={clsx(styles.treenode, selected && styles.selected)}
    >
      {editing ? (
        <input ref={inputRef} defaultValue={data.label}></input>
      ) : (
        data.label
      )}

      {selected && (
        <>
          {/* TODO: Refactor into add node button component */}
          {!data.leftId && (
            <button
              className={clsx(styles.addNode, styles.left)}
              onClick={() => nodeAddChild(id, "left")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          )}

          {!data.rightId && (
            <button
              className={clsx(styles.addNode, styles.right)}
              onClick={() => nodeAddChild(id, "right")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          )}
        </>
      )}

      {/* Invisible/uninteractable handles required for edge connections */}
      <Handle type="target" position={Position.Left} isConnectable={false} />
      <Handle type="source" position={Position.Left} isConnectable={false} />
    </div>
  );
};

export default TreeNode;
