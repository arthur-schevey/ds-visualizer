import { useGraphStore } from "../../stores/graphStore";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react"
import styles from "./GraphNode.module.css"
import clsx from "clsx";

type GraphNode = Node<
  { value: string; neighbors: string[] },
  "graphNode"
>;

const GraphNode = ({ id, selected, data }: NodeProps<GraphNode>) => {

  return (
    <div
      className={clsx("ds-node", selected && "ds-selected")}
    >
        {data.value}

      {/* Invisible/uninteractable handles required for edge connections */}
      {/* <Handle type="target" position={Position.Left} className={styles.graphHandle} /> */}
      <Handle type="source" position={Position.Left} className={styles.graphHandle} />
    </div>
  );
};

export default GraphNode;
