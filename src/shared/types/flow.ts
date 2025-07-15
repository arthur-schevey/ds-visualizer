import type { Node, Edge } from "@xyflow/react";

export type TreeNode = Node<TreeNodeData, "treeNode">;
export type GraphNode = Node<GraphNodeData, "graphNode">;
export type GraphEdge = Edge<GraphEdgeData, "graphEdge">;

export type GraphNodeData = {
  value: string;
  neighbors: string[];
};

export type TreeNodeData = {
  value: string;
  leftId?: string;
  rightId?: string;
  dummy?: boolean;
};

export type GraphEdgeData = {
  weight: number;
};

