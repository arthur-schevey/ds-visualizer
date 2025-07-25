import { create, type StateCreator } from "zustand";
import { temporal } from "zundo";
import { devtools } from "zustand/middleware";
import type { GraphEdge, GraphNode } from "../types";
import { createNode } from "@graph/utils/graph";

export interface GraphStore {
  nodes: GraphNode[];
  edges: GraphEdge[];
  nodeCounter: number;
  weighted: boolean;
  directed: boolean;
  uiMode: "move" | "draw"

  // Mimics React set function that accepts the next state OR function that calculates next state
  setNodes: (nodes: GraphNode[] | ((prev: GraphNode[]) => GraphNode[])) => void;
  setEdges: (edges: GraphEdge[] | ((prev: GraphEdge[]) => GraphEdge[])) => void;
}

const createGraphStore: StateCreator<GraphStore> = (set) => ({
  nodes: [createNode("0")],
  edges: [],
  nodeCounter: 1,
  weighted: false,
  directed: true,
  uiMode: "draw",

  setNodes: (updater) =>
    set((state) => ({
      nodes: typeof updater === 'function' ? updater(state.nodes) : updater,
    })),
  setEdges: (updater) =>
    set((state) => ({
      edges: typeof updater === 'function' ? updater(state.edges) : updater,
    })),
})

export const useGraphStore = create<GraphStore>()(
  // Utilizes persist middleware to store tree data in local storage
  // Utilizes temporal middleware from zundo to allow undo/redo
  // persist(temporal(createGraphStore, {}), { name: "graph-storage")
  devtools(temporal(createGraphStore, {}))
);
 