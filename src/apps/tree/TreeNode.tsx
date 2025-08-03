import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useState } from "react";
import styles from "./TreeNode.module.css";
import clsx from "clsx";
import type { TreeNode } from "./types";
import { PlusIcon } from "@shared/components/SVGDefs";
import { treeAPI } from "./stores/treeAPI";
import { EditableLabel } from "@shared/components/EditableLabel";

const TreeNodeComponent = ({ id, selected, data }: NodeProps<TreeNode>) => {

  const [editing, setEditing] = useState(false);

  return (
    <div
      onDoubleClick={() => setEditing(true)}
      className={clsx("ds-node", selected && "ds-selected")}
    >
      <EditableLabel
        initialValue={data.value}
        editing={editing}
        setEditing={setEditing}
        onSubmit={(newVal) => treeAPI.updateNodeLabel(id, newVal)}
      />

      {/* If node is selected, show plus icons for any children that can be created */}
      {selected && (
        <>
          {!data.leftId && (
            <button
              className={clsx(styles.addNode, styles.left)}
              onClick={() => treeAPI.nodeAddChild(id, "left")}
            >
              <PlusIcon />
            </button>
          )}

          {!data.rightId && (
            <button
              className={clsx(styles.addNode, styles.right)}
              onClick={() => treeAPI.nodeAddChild(id, "right")}
            >
              <PlusIcon />
            </button>
          )}
        </>
      )}

      {/* Invisible/uninteractable handles required for edge connections */}
      <Handle
        type="source"
        position={Position.Left}
        className={styles.treeHandle}
        isConnectable={false}
      />
    </div>
  );
};

export default TreeNodeComponent;
