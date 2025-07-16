import type { Node, Edge } from "@xyflow/react";

export type GraphNode = Node<GraphNodeData, "graphNode">;
export type GraphEdge = Edge<GraphEdgeData, "graphEdge">;

export type GraphNodeData = {
  value: string;
  neighbors: string[];
};

export type GraphEdgeData = {
  weight: number;
};
