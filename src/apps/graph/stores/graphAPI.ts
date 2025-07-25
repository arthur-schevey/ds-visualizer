import type { GraphNode, GraphUiMode } from "../types";
import { createNode, getCounterpart, getNodeMap } from "@graph/utils/graph";
import { useGraphStore } from "./graphStore";

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
      nodes: [createNode("0")],
      edges: [],
      nodeCounter: 1,
    });
  },

  setUiMode: (mode: GraphUiMode) => {
    useGraphStore.setState({
      uiMode: mode,
    });
  },

  setWeighted: (weighted: boolean) => {
    useGraphStore.setState({
      weighted,
    });
  },

  setDirected: (directed: boolean) => {
    let { edges } = useGraphStore.getState();

    // When switching to undirected, drop counterdirectional edges
    if (!directed) {
      edges = edges.filter((edge) => {
        // Undefined if no counterpart exists
        const counterpart = getCounterpart(edge, edges)

        return !counterpart || edge.id < counterpart.id;
      });
    }

    useGraphStore.setState({
      edges,
      directed,
    });
  },
};

