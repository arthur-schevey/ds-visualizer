import type { GraphNode } from "../types";
import { getNodeMap } from "@graph/utils/graph";
import { initGraphNode, useGraphStore } from "./graphStore";

export const graphAPI = {
  updateNodeLabel: (id: string, label: string) => {
    const { nodes } = useGraphStore.getState();
    const nodeMap = getNodeMap(nodes);

    const updatedNode = nodeMap[id];
    updatedNode.data.value = label;

    const updatedNodes = nodes.map((node) =>
      node.id === id ? updatedNode : node
    );

    useGraphStore.setState({
      nodes: updatedNodes,
    });
  },

  addNode: (node: GraphNode) => {
    const { nodes, nodeCounter } = useGraphStore.getState();
    useGraphStore.setState({
      nodes: nodes.concat(node),
      nodeCounter: nodeCounter + 1, 
    });
  },

  resetGraph: () => {
    useGraphStore.setState({
      nodes: [initGraphNode],
      edges: [],
      nodeCounter: 1,
    });
  },
};
