import { useGraphStore } from "@graph/stores/graphStore";
import type { GraphNode, GraphEdge } from "@graph/types";
import {
  type NodeChange,
  applyNodeChanges,
  type Connection,
  addEdge,
  MarkerType,
} from "@xyflow/react";
import { useCallback } from "react";

export function useGraphFlowHandlers() {
  const setNodes = useGraphStore((state) => state.setNodes);
  const setEdges = useGraphStore((state) => state.setEdges);

  // Callback from React Flow to handle node additions, removals, selections, and dragging 
  const handleNodesChange = useCallback(
    (changes: NodeChange<GraphNode>[]) => {
      setNodes((nodes) => applyNodeChanges(changes, nodes));
    },
    [setNodes]
  );

  // Callback from React Flow to handle node deletion, while also deleting orphaned edges
  const handleNodesDelete = useCallback(
    (deleted: GraphNode[]) => {
      const deletedIds = new Set(deleted.map((n) => n.id));

      setNodes((prevNodes) => prevNodes.filter((n) => !deletedIds.has(n.id)));
      setEdges((prevEdges) =>
        prevEdges.filter(
          (e) => !deletedIds.has(e.source) && !deletedIds.has(e.target)
        )
      );
    },
    [setNodes, setEdges] // minimal stable deps
  );

  // Callback from React Flow to handle edge deletion
  const handleEdgesDelete = useCallback(
    (deleted: GraphEdge[]) => {
      const deletedIds = new Set(deleted.map((e) => e.id));
      setEdges((prevEdges) => prevEdges.filter((e) => !deletedIds.has(e.id)));
    },
    [setEdges]
  );

  // Callback from React Flow to handle successful drag connections 
  const handleConnect = useCallback(
    (connection: Connection) => {
      setEdges((prevEdges) =>
        addEdge(
          {
            ...connection,
            id: crypto.randomUUID(),
            type: "graphEdge",
            label: "1",
            markerEnd: { type: MarkerType.Arrow },
          },
          prevEdges
        )
      );
    },
    [setEdges]
  );

  return { handleNodesChange, handleNodesDelete, handleEdgesDelete, handleConnect };
}
