import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  useInternalNode,
  type EdgeProps,
} from "@xyflow/react";
import { calculateEdgePathCoordinates } from "./utils/graph";
import { useGraphStore } from "@stores/graphStore";
import styles from "./GraphEdge.module.css";
import type { GraphEdge } from "@shared/types/flow";

function GraphEdgeComponent({ id, source, target }: EdgeProps<GraphEdge>) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  
  const edges = useGraphStore.getState().edges;
  const hasCounterpart = edges.some(
    (e) => e.source === sourceNode.id && e.target === targetNode.id
  );

  const [edgePath, labelX, labelY] = getStraightPath(
    calculateEdgePathCoordinates(sourceNode, targetNode, hasCounterpart)
  );

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={"url(#arrowhead)"}
        label={"1"}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
          className={styles.edgeWeightLabel}
        >
          1
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default GraphEdgeComponent;
