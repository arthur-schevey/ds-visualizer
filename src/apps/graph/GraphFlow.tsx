import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
  Panel,
} from "@xyflow/react";
import { createNode } from "./utils/graph";
import { useGraphStore, type GraphStore } from "@graph/stores/graphStore";
import { useShallow } from "zustand/shallow";
import GraphEdgeComponent from "./GraphEdge";
import GraphNodeComponent from "./GraphNode";
import GraphConnectionLine from "./GraphConnectionLine";
import { useGraphFlowHandlers } from "./utils/useGraphFlowHandlers";
import { graphAPI } from "./stores/graphAPI";
import { GraphHeader } from "./GraphHeader";
import { GraphHotkeys } from "./GraphHotkeys";

const selector = (state: GraphStore) => ({
  nodes: state.nodes,
  edges: state.edges,
  nodeCounter: state.nodeCounter,
});

const nodeTypes = {
  graphNode: GraphNodeComponent,
};

const edgeTypes = {
  graphEdge: GraphEdgeComponent,
};

const GraphFlowInner = () => {
  const {
    handleNodesChange,
    handleNodesDelete,
    handleEdgesDelete,
    handleConnect,
  } = useGraphFlowHandlers();
  const { nodes, edges, nodeCounter } = useGraphStore(
    useShallow(selector)
  );
  const { screenToFlowPosition } = useReactFlow();

  const handleCanvasDoubleClick = (
    event: React.MouseEvent<HTMLDivElement>
  ): void => {
    // Ignore double click if mouse over node, edge, or floating panels. This may need to be reworked.
    const isNode = (event.target as HTMLElement).closest(".react-flow__node");
    const isEdge = (event.target as HTMLElement).closest(".react-flow__edge");
    const isPanel = (event.target as HTMLElement).closest(".react-flow__panel");
    if (isNode || isEdge || isPanel) return;

    const pos = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const node = createNode(nodeCounter.toString(), pos);
    graphAPI.addNode(node);
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      deleteKeyCode={["Delete", "Backspace"]}
      nodeClickDistance={30} // makes the graph feel more responsive
      fitView // centers view on graph
      fitViewOptions={{ maxZoom: 2.0, minZoom: 1.0 }}
      maxZoom={3.0}
      minZoom={1.0}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      zoomOnDoubleClick={false}
      onDoubleClick={handleCanvasDoubleClick}
      onNodesChange={handleNodesChange}
      onNodesDelete={handleNodesDelete}
      onEdgesDelete={handleEdgesDelete}
      onConnect={handleConnect}
      connectionDragThreshold={10}
      connectionLineComponent={GraphConnectionLine}
      proOptions={{ hideAttribution: true }}
      nodeOrigin={[0.5, 0.5]}
    >
      <GraphHotkeys/>

      {/* Background */}
      <Background color="#ccc" variant={BackgroundVariant.Dots} />

      {/* Header */}
      <Panel position="top-center">
        <GraphHeader />
      </Panel>
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
