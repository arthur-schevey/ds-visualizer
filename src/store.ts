import { applyNodeChanges, type Edge, type NodeChange } from "@xyflow/react";
import TreeNode from "./components/TreeNode";
import { create, type StateCreator } from "zustand";
import { getLaidOutTree } from "./utils/getLaidOutTree";
import { temporal } from "zundo";
import { devtools } from "zustand/middleware";
import { getNodeMap } from "./utils/helpers";

export interface TreeStore {
  nodes: TreeNode[];
  edges: Edge[];
  rootId: string;
  nodeCounter: number;

  handleNodesChange: (changes: NodeChange<TreeNode>[]) => void;
  handleNodesDelete: (deleted: TreeNode[]) => void;
  updateNodeLabel: (id: string, label: string) => void;
  nodeAddChild: (parentId: string, side: "left" | "right") => void;
  setTree: (nodes: TreeNode[], rootId: string) => void;
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

  handleNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges<TreeNode>(changes, get().nodes),
    });
  },
  handleNodesDelete: (deleted) => {
    const { nodes, edges } = get();
    const nodeMap = getNodeMap(nodes);

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

    // Remove deleted from nodes/edges
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
        const newParent = { ...node };
        if (toDelete.has(node.data.leftId!)) delete newParent.data.leftId;
        if (toDelete.has(node.data.rightId!)) delete newParent.data.rightId;
        nodeMap[newParent.id] = newParent;
        return newParent;
      });

    // Lastly modify updatedParents
    const parentMap = new Map(updatedParents.map((node) => [node.id, node]));

    const finalNodes = updatedNodes.map((node) =>
      parentMap.has(node.id) ? parentMap.get(node.id)! : node
    );

    set({
      nodes: finalNodes,
      edges: updatedEdges,
    });
  },
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

    // TODO: getLaidOutTree needs to be refactored to accept only nodeMap (and nodes if needed)
    // its completely useless to pass edges. Additionally, getLaidOutTree needs to be cleaned up
    // + types improved.
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

    set({
      nodes,
      edges,
      rootId,
    });
  },
});

export const useTreeStore = create<TreeStore>()(
  // Utilizes temporal middleware from zundo to allow undo/redo
  devtools(temporal(createTreeStore, {}))
);
