import { applyNodeChanges, type Edge, type NodeChange } from "@xyflow/react";
import TreeNode from "./components/flow/TreeNode";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { getLaidOutTree } from "./utils/getLaidOutTree";

export type TreeStore = {
  nodeMap: Record<string, TreeNode>;
  nodes: TreeNode[];
  edges: Edge[];
  rootId: string;

  handleNodesChange: (changes: NodeChange<TreeNode>[]) => void;
  handleNodesDelete: (deleted: TreeNode[]) => void;
  updateNodeLabel: (id: string, label: string) => void;
  nodeAddChild: (parentId: string, side: "left" | "right") => void;
};

const initRootNode: TreeNode = {
  id: "root",
  className: "nopan", // disallows panning viewport when hovering node
  type: "treeNode",
  deletable: false, // must always have root node
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
  handleNodesDelete: (deleted) => {
    const { nodes, edges, nodeMap } = get();

    // To prune, we need to obtain a list of descendants
    const collectDescendants = (
      id: string | undefined,
      acc = new Set<string>()
    ) => {
      if (!id) return acc; // node does not exist
      const node = nodeMap[id];
      acc.add(id);
      collectDescendants(node.data.leftId, acc);
      collectDescendants(node.data.rightId, acc);
      return acc;
    };

    // Reduce all deleted nodes and their descendants into one collection
    const toDelete: Set<string> = deleted.reduce((acc, node) => {
      return collectDescendants(node.id, acc);
    }, new Set<string>());

    // Remove deleted from nodes, edges, and nodemap
    const updatedNodeMap = { ...nodeMap };
    toDelete.forEach((node) => {
      delete updatedNodeMap[node];
    });
    const updatedNodes = nodes.filter((n) => !toDelete.has(n.id));
    const updatedEdges = edges.filter(
      (e) => !toDelete.has(e.source) && !toDelete.has(e.target)
    ); // TODO: check the logic here later and ensure this deletes EVERY relevant edge to prevent difficult bugs

    // Find parents of deleted nodes and remove reference to deleted child
    const updatedParents = updatedNodes
      .filter((node) => {
        const leftId = node.data.leftId;
        const rightId = node.data.rightId;
        return toDelete.has(leftId!) || toDelete.has(rightId!);
      })
      .map((node) => {
        const newParent = { ...node }
        if (toDelete.has(node.data.leftId!)) delete newParent.data.leftId
        if (toDelete.has(node.data.rightId!)) delete newParent.data.rightId
        nodeMap[newParent.id] = newParent
        return newParent
      });

      // Lastly modify updatedParents 
      const parentMap = new Map(updatedParents.map(node => [node.id, node]));

      const finalNodes = updatedNodes.map(node =>
        parentMap.has(node.id) ? parentMap.get(node.id)! : node
      );

      set({
        nodeMap: updatedNodeMap,
        nodes: finalNodes,
        edges: updatedEdges,
      })
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
      // parentId: parentId, // this could be a good feature which makes child positioning relative and follow its parent, however this would conflict with the current layouting system to due relative vs absolute position switch
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
