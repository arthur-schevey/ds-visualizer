import { useGraphStore } from "../stores/graphStore";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react"
import styles from "./TreeNode.module.css";
import clsx from "clsx";

type GraphNode = Node<
  { value: string; leftId?: string; rightId?: string, dummy?: boolean },
  "graphNode"
>;

const GraphNode = ({ id, selected, data }: NodeProps<GraphNode>) => {

  return (
    <div
      className={clsx(styles.treenode, selected && styles.selected)}
    >
        data.value

      {/* Invisible/uninteractable handles required for edge connections */}
      <Handle type="target" position={Position.Left} isConnectable={false} />
      <Handle type="source" position={Position.Left} isConnectable={false} />
    </div>
  );
};

export default GraphNode;
