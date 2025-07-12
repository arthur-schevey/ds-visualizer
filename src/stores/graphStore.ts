import { applyNodeChanges, type Edge, type NodeChange } from "@xyflow/react";
import type TreeNode from "../components/TreeNode";
import { create, type StateCreator } from "zustand";
import { temporal } from "zundo";
import { persist, devtools } from "zustand/middleware";
import type GraphNode from "../components/GraphNode";

export interface GraphStore {
  nodes: GraphNode[];
  edges: Edge[];
  nodeCounter: number;

  handleNodesChange: (changes: NodeChange<GraphNode>[]) => void;
  handleNodesDelete: (deleted: GraphNode[]) => void;
  updateNodeLabel: (id: string, label: string) => void;
  setGraph: (nodes: GraphNode[]) => void;
  addNode: (node: GraphNode) => void;
  resetGraph: () => void;
}

const createGraphStore: StateCreator<GraphStore> = (set, get) => ({
  nodes: [],
  edges: [],
  nodeCounter: 1,
  handleNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges<GraphNode>(changes, get().nodes),
    });
  },
  handleNodesDelete: (deleted) => {

  },
  updateNodeLabel: (id, label) => {

  },
  setGraph: (nodes) => {

  },
  addNode: (node) => {
    const { nodes } = get()
    set({
      nodes: nodes.concat(node)
    })
  },
  resetGraph: () => {

  }
})

export const useGraphStore = create<GraphStore>()(
  // Utilizes persist middleware to store tree data in local storage
  // Utilizes temporal middleware from zundo to allow undo/redo
  // persist(temporal(createGraphStore, {}), { name: "graph-storage")
  devtools(temporal(createGraphStore, {}))
);
