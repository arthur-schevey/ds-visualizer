import type { TreeNode } from "../types";
import { getLaidOutTree } from "@tree/utils/layout";
import { getNodeMap } from "@tree/utils/tree";
import { initRootNode, useTreeStore } from "./treeStore";
import { type Edge } from "@xyflow/react";

export const treeAPI = {
  updateNodeLabel: (id: string, label: string) => {
    const { nodes } = useTreeStore.getState();
    const nodeMap = getNodeMap(nodes);

    const updatedNode = nodeMap[id];
    updatedNode.data.value = label;

    const updatedNodes = nodes.map((node) =>
      node.id === id ? updatedNode : node
    );

    useTreeStore.setState({
      nodes: updatedNodes,
    });
  },

  nodeAddChild: (parentId: string, side: "left" | "right") => {
    const { nodes, edges, rootId, nodeCounter } = useTreeStore.getState();
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

    useTreeStore.setState({
      nodes: laidOutNodes,
      edges: edges.concat(newEdge),
      nodeCounter: nodeCounter + 1,
    });
  },

  setTree: (nodes: TreeNode[], rootId: string) => {
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

    useTreeStore.setState({
      nodes: laidOutNodes,
      edges,
      rootId,
    });
  },

  resetTree: () => {
    useTreeStore.setState({
      nodes: [initRootNode],
      edges: [],
      rootId: initRootNode.id,
      nodeCounter: 1,
    });
  },

  selectAllNodes: () => {
    const { nodes } = useTreeStore.getState();

    const updatedNodes = nodes.map((node) => ({
      ...node,
      selected: true,
    }));

    useTreeStore.setState({ nodes: updatedNodes });
  },
  
};