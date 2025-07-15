import { addEdge, applyNodeChanges, MarkerType, type Connection, type NodeChange } from "@xyflow/react";
import { create, type StateCreator } from "zustand";
import { temporal } from "zundo";
import { persist, devtools } from "zustand/middleware";
import type { GraphEdge, GraphNode } from "../shared/types/flow";
import { getNodeMap } from "@graph/utils/graph";

export interface GraphStore {
  nodes: GraphNode[];
  edges: GraphEdge[];
  nodeCounter: number;

  handleNodesChange: (changes: NodeChange<GraphNode>[]) => void;
  handleNodesDelete: (deleted: GraphNode[]) => void;
  handleEdgesDelete: (deleted: GraphEdge[]) => void;
  updateNodeLabel: (id: string, label: string) => void;
  setGraph: (nodes: GraphNode[]) => void;
  addNode: (node: GraphNode) => void;
  handleConnect: (connection: Connection) => void;
  resetGraph: () => void;
}

const initGraphNode: GraphNode = {
  id: crypto.randomUUID(),
  className: "nopan", // disallows panning viewport when hovering node
  type: "graphNode",
  position: { x: 0, y: 0 },
  data: { value: "0", neighbors: [] },
};

const createGraphStore: StateCreator<GraphStore> = (set, get) => ({
  nodes: [initGraphNode],
  edges: [],
  nodeCounter: 1,
  handleNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges<GraphNode>(changes, get().nodes),
    });
  },
  handleNodesDelete: (deleted) => {
    const deletedIds = new Set(deleted.map(n => n.id));
    set((state) => ({
      nodes: state.nodes.filter(node => !deletedIds.has(node.id)),
      edges: state.edges.filter(
        edge => !deletedIds.has(edge.source) && !deletedIds.has(edge.target)
      ),
    }));
  },
  handleEdgesDelete: (deleted) => {
    const deletedIds = new Set(deleted.map(e => e.id));
    set((state) => ({
      edges: state.edges.filter(edge => !deletedIds.has(edge.id)),
    }));
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
  setGraph: (nodes) => {

  },
  addNode: (node) => {
    const { nodes } = get()
    set({
      nodes: nodes.concat(node)
    })
  },
  handleConnect: (connection) => {
    const updated = addEdge({
      ...connection,
      id: crypto.randomUUID(),
      type: 'graphEdge',
      label: '1',
      markerEnd: { type: MarkerType.Arrow },
    }, get().edges);
    set({ edges: updated });
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
