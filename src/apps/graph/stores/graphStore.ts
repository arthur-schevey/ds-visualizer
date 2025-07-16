import { create, type StateCreator } from "zustand";
import { temporal } from "zundo";
import { persist, devtools } from "zustand/middleware";
import type { GraphEdge, GraphNode } from "../types";
import { getNodeMap } from "@graph/utils/graph";

export interface GraphStore {
  nodes: GraphNode[];
  edges: GraphEdge[];
  nodeCounter: number;

  updateNodeLabel: (id: string, label: string) => void;
  setNodes: (nodes: GraphNode[] | ((prev: GraphNode[]) => GraphNode[])) => void;
  setEdges: (edges: GraphEdge[] | ((prev: GraphEdge[]) => GraphEdge[])) => void;
  addNode: (node: GraphNode) => void;
  resetGraph: () => void;
}

const initGraphNode: GraphNode = {
  id: crypto.randomUUID(),
  className: "nopan", // disallows panning viewport when hovering node
  type: "graphNode",
  position: { x: 0, y: 0 },
  data: { value: "0", neighbors: [] },
};

const createGraphStore: StateCreator<GraphStore> = (set, get) => ({
  nodes: [initGraphNode],
  edges: [],
  nodeCounter: 1,

  updateNodeLabel: (id, label) => {
    const { nodes } = get();
    const nodeMap = getNodeMap(nodes);

    const updatedNode = nodeMap[id];
    updatedNode.data.value = label;

    const updatedNodes = nodes.map((node) =>
      node.id === id ? updatedNode : node
    );

    set({
      nodes: updatedNodes,
    });
  },
  setNodes: (updater) =>
    set((state) => ({
      nodes: typeof updater === 'function' ? updater(state.nodes) : updater,
    })),
  setEdges: (updater) =>
    set((state) => ({
      edges: typeof updater === 'function' ? updater(state.edges) : updater,
    })),
  addNode: (node) => {
    const { nodes, nodeCounter } = get()
    set({
      nodes: nodes.concat(node),
      nodeCounter: nodeCounter + 1, 
    })
  },
  resetGraph: () => {
    throw new Error('Unimplemented store method')
  }
})

export const useGraphStore = create<GraphStore>()(
  // Utilizes persist middleware to store tree data in local storage
  // Utilizes temporal middleware from zundo to allow undo/redo
  // persist(temporal(createGraphStore, {}), { name: "graph-storage")
  devtools(temporal(createGraphStore, {}))
);
