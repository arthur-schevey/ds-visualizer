import { applyNodeChanges, type Edge, type NodeChange } from "@xyflow/react";
import TreeNode from "./components/flow/TreeNode";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { getLaidOutTree } from "./utils/getLaidOutTree";

export type TreeStore = {
  nodeMap: Record<string, TreeNode>;
  nodes: TreeNode[];
  edges: Edge[];
  rootId: string | null;

  handleNodesChange: (changes: NodeChange<TreeNode>[]) => void;
  updateNodeLabel: (id: string, label: string) => void;
  nodeAddChild: (parentId: string, side: "left" | "right") => void;
};

const initRootNode: TreeNode = {
  id: "root",
  className: "nopan", // disallows panning viewport when hovering node
  type: "treeNode",
  position: { x: 0, y: 0 },
  data: { label: "1" },
};

export const useTreeStore = create<TreeStore>((set, get) => ({
  nodeMap: { [initRootNode.id]: initRootNode },
  nodes: [initRootNode],
  edges: [],
  rootId: initRootNode.id,

  handleNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges<TreeNode>(changes, get().nodes),
    });
  },
  updateNodeLabel: (id, label) => {
    const { nodes, nodeMap } = get();
    const updatedNode = nodeMap[id];
    updatedNode.data.label = label;

    const updatedNodeMap = {
      ...nodeMap,
      id: updatedNode,
    };

    const updatedNodes = nodes.map((node) =>
      node.id === id ? updatedNode : node
    );

    set({
      nodeMap: updatedNodeMap,
      nodes: updatedNodes,
    });
  },
  nodeAddChild: (parentId, side) => {
    const { nodes, edges, nodeMap } = get();
    const newChild: TreeNode = {
      id: uuidv4(),
      className: "nopan", // disallows panning viewport when hovering node
      type: "treeNode",
      position: { x: 0, y: 0 },
      selected: true,
      data: { label: "child" },
    };
    const newEdge = {
      id: uuidv4(),
      type: "straight",
      source: parentId,
      target: newChild.id,
    };
    const updatedParent = nodeMap[parentId];
    updatedParent.data[`${side}Id`] = newChild.id;
    updatedParent.selected = false;

    // Update parent and add child
    const updatedNodes = nodes
      .map((node) => (node.id === parentId ? updatedParent : node))
      .concat(newChild);

    const updatedNodeMap = {
      ...nodeMap,
      [newChild.id]: newChild,
      [parentId]: updatedParent,
    };

    // TODO: getLaidOutTree needs to be refactored to accept only nodeMap (and nodes if needed)
    // its completely useless to pass edges. Additionally, getLaidOutTree needs to be cleaned up
    // + types improved.
    const { nodes: laidOutNodes, edges: laidOutEdges } = getLaidOutTree(
      updatedNodes,
      edges
    );

    set({
      nodeMap: updatedNodeMap,
      nodes: laidOutNodes as TreeNode[],
      edges: edges.concat(newEdge),
    });
  },
}));
