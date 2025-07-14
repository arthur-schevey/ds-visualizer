import { useGraphStore } from "../../stores/graphStore";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react"
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
      <Handle type="target" position={Position.Left} isConnectable={false} />
      <Handle type="source" position={Position.Left} isConnectable={false} />
    </div>
  );
};

export default GraphNode;
