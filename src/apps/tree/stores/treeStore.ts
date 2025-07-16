import { type Edge } from "@xyflow/react";
import { create, type StateCreator } from "zustand";
import { temporal } from "zundo";
import { devtools, persist } from "zustand/middleware";
import type { TreeNode } from "../types";

export interface TreeStore {
  nodes: TreeNode[];
  edges: Edge[];
  rootId: string;
  nodeCounter: number;

  setNodes: (nodes: TreeNode[] | ((prev: TreeNode[]) => TreeNode[])) => void;
  setEdges: (edges: Edge[] | ((prev: Edge[]) => Edge[])) => void;
}

export const initRootNode: TreeNode = {
  id: "root",
  className: "nopan", // disallows panning viewport when hovering node
  type: "treeNode",
  deletable: false, // must always have root node
  position: { x: 0, y: 0 },
  data: { value: "0" },
};

const createTreeStore: StateCreator<TreeStore> = (set) => ({
  nodes: [initRootNode],
  edges: [],
  rootId: initRootNode.id,
  nodeCounter: 1,

  setNodes: (updater) =>
    set((state) => ({
      nodes: typeof updater === 'function' ? updater(state.nodes) : updater,
    })),
  setEdges: (updater) =>
    set((state) => ({
      edges: typeof updater === 'function' ? updater(state.edges) : updater,
    })),
});

export const useTreeStore = create<TreeStore>()(
  // Utilizes persist middleware to store tree data in local storage
  // Utilizes temporal middleware from zundo to allow undo/redo
  persist(devtools(temporal(createTreeStore, {})), { name: "tree-storage" })
);
