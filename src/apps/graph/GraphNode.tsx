import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useState } from "react";
import styles from "./GraphNode.module.css"
import clsx from "clsx";
import type { GraphNode } from "./types";
import { graphAPI } from "./stores/graphAPI";
import { EditableLabel } from "@shared/EditableLabel";

const GraphNodeComponent = ({ id, selected, data }: NodeProps<GraphNode>) => {
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
        onSubmit={(newVal) => graphAPI.updateNodeLabel(id, newVal)}
      />

      {/* Invisible/uninteractable handle required for edge connections */}
      <Handle type="target" position={Position.Left} className={styles.graphHandle} />
      <Handle type="source" position={Position.Left} className={styles.graphHandle} />
    </div>
  );
};

export default GraphNodeComponent;
