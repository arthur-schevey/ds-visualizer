import { applyNodeChanges, type Edge, type NodeChange } from "@xyflow/react";
import { create, type StateCreator } from "zustand";
import { getLaidOutTree } from "@tree/utils/layout";
import { temporal } from "zundo";
import { devtools, persist } from "zustand/middleware";
import type { TreeNode } from "../types";
import { getNodeMap } from "@tree/utils/tree";

export interface TreeStore {
  nodes: TreeNode[];
  edges: Edge[];
  rootId: string;
  nodeCounter: number;

  setNodes: (nodes: TreeNode[] | ((prev: TreeNode[]) => TreeNode[])) => void;
  setEdges: (edges: Edge[] | ((prev: Edge[]) => Edge[])) => void;
  updateNodeLabel: (id: string, label: string) => void;
  nodeAddChild: (parentId: string, side: "left" | "right") => void;
  setTree: (nodes: TreeNode[], rootId: string) => void;
  resetTree: () => void;
}

const initRootNode: TreeNode = {
  id: "root",
  className: "nopan", // disallows panning viewport when hovering node
  type: "treeNode",
  deletable: false, // must always have root node
  position: { x: 0, y: 0 },
  data: { value: "0" },
};

const createTreeStore: StateCreator<TreeStore> = (set, get) => ({
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
  nodeAddChild: (parentId, side) => {
    const { nodes, edges, rootId, nodeCounter } = get();
    const nodeMap = getNodeMap(nodes);

    const newChild: TreeNode = {
      // construct new child
      id: crypto.randomUUID(),
      className: "nopan", // disallows panning viewport when hovering over node
      type: "treeNode",
      position: { x: 0, y: 0 },
      selected: true,
      // parentId: parentId, // this could be a good feature which makes child positioning relative and follow its parent, however this would conflict with the current layouting system to due relative vs absolute position switch
      data: { value: nodeCounter.toString() },
    };
    const newEdge = {
      id: crypto.randomUUID(),
      type: "straight",
      source: parentId,
      target: newChild.id,
    };
    const updatedParent = {
      ...nodeMap[parentId],
      data: {
        ...nodeMap[parentId].data,
        [`${side}Id`]: newChild.id,
      },
      selected: false,
    };

    // Update parent and add child
    const updatedNodes = nodes
      .map((node) => (node.id === parentId ? updatedParent : node))
      .concat(newChild);

    const updatedNodeMap = getNodeMap(updatedNodes);
    const laidOutNodes = getLaidOutTree(updatedNodes, updatedNodeMap, rootId);

    set({
      nodes: laidOutNodes,
      edges: edges.concat(newEdge),
      nodeCounter: nodeCounter + 1,
    });
  },
  setTree: (nodes, rootId) => {
    const edges: Edge[] = [];

    const createEdge = (source: string, target: string): Edge => {
      return {
        id: crypto.randomUUID(),
        source: source,
        target: target,
        type: "straight",
      };
    };

    // Generate edges from node relations
    nodes.forEach((node) => {
      if (node.data.leftId) {
        edges.push(createEdge(node.id, node.data.leftId));
      }

      if (node.data.rightId) {
        edges.push(createEdge(node.id, node.data.rightId));
      }
    });

    // Layout the nodes
    const laidOutNodes = getLaidOutTree(nodes, getNodeMap(nodes), rootId);

    set({
      nodes: laidOutNodes,
      edges,
      rootId,
    });
  },
  resetTree: () => {
    set({
      nodes: [initRootNode],
      edges: [],
      rootId: initRootNode.id,
      nodeCounter: 1,
    });
  },
});

// Updates selected property of all nodes to true
export function selectAllNodes() {
  const { nodes } = useTreeStore.getState();

  const updatedNodes = nodes.map((node) => ({
    ...node,
    selected: true,
  }));

  useTreeStore.setState({ nodes: updatedNodes });
}

export const useTreeStore = create<TreeStore>()(
  // Utilizes persist middleware to store tree data in local storage
  // Utilizes temporal middleware from zundo to allow undo/redo
  persist(devtools(temporal(createTreeStore, {})), { name: "tree-storage" })
);
