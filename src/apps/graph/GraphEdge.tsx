import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  useInternalNode,
  type EdgeProps,
} from "@xyflow/react";
import { calculateEdgePathCoordinates as getEdgePathCoordinates } from "./utils/graph";
import { useGraphStore } from "@graph/stores/graphStore";
import styles from "./GraphEdge.module.css";
import type { GraphEdge } from "./types";
import { useEffect, useRef, useState } from "react";
import { graphAPI } from "./stores/graphAPI";

function GraphEdgeComponent({
  id,
  source,
  target,
  data,
}: EdgeProps<GraphEdge>) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  // Determine if weights are set to be visible
  const weighted = useGraphStore((state) => state.weighted)

  // Weight editing logic
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const originalVal = useRef(data?.weight);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(0, inputRef.current.value.length);
    }
  }, [editing]);

  const handleBlur = (save: boolean) => {
    if (save && inputRef.current) {
      const weight = Number(inputRef.current.value);

      if (isNaN(weight)) {
        setEditing(false);
        return;
      }

      graphAPI.updateEdgeWeight(id, weight);
      originalVal.current = weight;
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
        handleBlur(true);
        break;
      case "Escape":
        if (inputRef.current && originalVal.current !== undefined) {
          inputRef.current.value = originalVal.current.toString();
        }
        handleBlur(false);
        break;
    }
  };

  if (!sourceNode || !targetNode) {
    return null;
  }

  // Determine if a counter-directional edge exists
  const edges = useGraphStore.getState().edges;
  const hasCounterpart = edges.some(
    (e) => e.source === target && e.target === source
  );

  const [edgePath, labelX, labelY] = getStraightPath(
    getEdgePathCoordinates(sourceNode, targetNode, hasCounterpart)
  );
  

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={"url(#arrowhead)"} />
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20} // invisible hit area
        onDoubleClick={() => setEditing(true)}
        style={{ cursor: "pointer" }}
      />

      {weighted && (
        <EdgeLabelRenderer>
          <div
            className={styles.weightRenderer}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            {editing ? (
              <input
                ref={inputRef}
                defaultValue={originalVal.current}
                onBlur={() => handleBlur(true)}
                onKeyDown={handleKeyDown}
                className={styles.weightInput}
              />
            ) : (
              <div className={styles.weightLabel}>{data?.weight}</div>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export default GraphEdgeComponent;
