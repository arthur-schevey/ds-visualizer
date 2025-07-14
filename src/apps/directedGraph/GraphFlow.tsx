import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
  ConnectionMode,
  type Connection,
  MarkerType,
} from "@xyflow/react";
import GraphNode from "./GraphNode";
import { createNode } from "./utils/graph";
import { useGraphStore, type GraphStore } from "../../stores/graphStore";
import { useShallow } from "zustand/shallow";
import GraphEdge from "./GraphEdge";
import GraphConnectionLine from "./GraphConnectionLine";
import { useCallback } from "react";

const selector = (state: GraphStore) => ({
  nodes: state.nodes,
  edges: state.edges,
  addNode: state.addNode,
  handleConnect: state.handleConnect,
  handleNodesChange: state.handleNodesChange,
});

const nodeTypes = {
  graphNode: GraphNode,
};

const edgeTypes = {
  graphEdge: GraphEdge,
};

const GraphFlowInner = () => {
  const { nodes, edges, addNode, handleConnect, handleNodesChange } = useGraphStore(
    useShallow(selector)
  );
  const { screenToFlowPosition } = useReactFlow();

  const handleCanvasDoubleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    // Ignore double click if mouse over node
    const isNode = (event.target as HTMLElement).closest('.react-flow__node');
    if (isNode) return;

    const node = createNode(
      screenToFlowPosition({ x: event.clientX, y: event.clientY })
    );
    addNode(node);
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      deleteKeyCode={["Delete", "Backspace"]}
      nodeClickDistance={30} // makes the graph feel more responsive
      fitView // centers view on graph
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      zoomOnDoubleClick={false}
      onDoubleClick={handleCanvasDoubleClick}
      onNodeDoubleClick={() => {console.log("Node double clicked!")}}
      onNodesChange={handleNodesChange}
      onConnect={handleConnect}
      connectionMode={ConnectionMode.Loose}
      connectionLineComponent={GraphConnectionLine}
      proOptions={{ hideAttribution: true }}
    >
      {/* Background */}
      <Background color="#ccc" variant={BackgroundVariant.Dots} />
    </ReactFlow>
  );
};

// Public-facing component with context required by useReactFlow()
const GraphFlow = () => (
  <ReactFlowProvider>
    <GraphFlowInner />
  </ReactFlowProvider>
);

export default GraphFlow;
