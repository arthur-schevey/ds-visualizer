import type { Node, Edge } from "@xyflow/react";

export type GraphNode = Node<GraphNodeData, "graphNode">;
export type GraphEdge = Edge<GraphEdgeData, "graphEdge">;

export type GraphNodeData = {
  value: string;
};

export type GraphEdgeData = {
  weight: number;
};

export type GraphUiMode = "move" | "draw"

// Serialization types
export type GraphFormat = "json" | "edge-list" | "node-edge-list";
export type SerializedGraph = {
  header?: string; // for displaying node count and edge count 
  body: string; // main serialization result
};