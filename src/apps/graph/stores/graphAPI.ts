import type { GraphNode, GraphUiMode } from "../types";
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

  updateEdgeWeight: (id: string, weight: number) => {
    // const parsedWeight = Number(weight);
    // if (!isNaN(parsedWeight)) return;

    const { edges } = useGraphStore.getState();
    const updatedEdges = edges.map((edge) =>
      edge.id === id
        ? { ...edge, data: { ...edge.data, weight: weight } }
        : edge
    );

    useGraphStore.setState({
      edges: updatedEdges,
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

  setUiMode: (mode: GraphUiMode) => {
    useGraphStore.setState({
      uiMode: mode,
    });
  }
};
