import { create, type StateCreator } from "zustand";
import { temporal } from "zundo";
import { devtools } from "zustand/middleware";
import type { GraphEdge, GraphNode } from "../types";

export interface GraphStore {
  nodes: GraphNode[];
  edges: GraphEdge[];
  nodeCounter: number;

  setNodes: (nodes: GraphNode[] | ((prev: GraphNode[]) => GraphNode[])) => void;
  setEdges: (edges: GraphEdge[] | ((prev: GraphEdge[]) => GraphEdge[])) => void;
}

export const initGraphNode: GraphNode = {
  id: crypto.randomUUID(),
  className: "nopan", // disallows panning viewport when hovering node
  type: "graphNode",
  position: { x: 0, y: 0 },
  data: { value: "0", neighbors: [] },
};

const createGraphStore: StateCreator<GraphStore> = (set) => ({
  nodes: [initGraphNode],
  edges: [],
  nodeCounter: 1,

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
 