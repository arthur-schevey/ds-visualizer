import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  useInternalNode,
  type EdgeProps,
} from "@xyflow/react";
import { getEdgeParams } from "./utils/graph";
import { useGraphStore } from "@stores/graphStore";
import styles from "./GraphEdge.module.css";

function GraphEdgeComponent({ id, source, target }: EdgeProps) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

  const edges = useGraphStore.getState().edges;
  const hasCounterpart = edges.some(
    (e) => e.source === target && e.target === source
  );

  const translatePerpendicular = (distance: number) => {
    // Vector from source to target
    const vx = tx - sx;
    const vy = ty - sy;

    // Perpendicular vector
    const px = vy;
    const py = -vx;
    const magnitude = Math.sqrt(px * px + py * py);

    // Unit vector of perpendicular vector
    const ux = px / magnitude;
    const uy = py / magnitude;

    // Translate original line distance units in the direction of the unit vector
    const sxt = sx + ux * distance;
    const syt = sy + uy * distance;
    const txt = tx + ux * distance;
    const tyt = ty + uy * distance;

    return { sxt, syt, txt, tyt };
  };

  const { sxt, syt, txt, tyt } = hasCounterpart
    ? translatePerpendicular(6)
    : { sxt: sx, syt: sy, txt: tx, tyt: ty };

  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX: sxt,
    sourceY: syt,
    targetX: txt,
    targetY: tyt,
  });

  return (
    <>
      {/* <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        strokeWidth={5}
        markerEnd={"url(#arrowhead)"}
        style={style}
      /> */}
      <BaseEdge id={id} path={edgePath} markerEnd={"url(#arrowhead)"} label={"1"}/>
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
