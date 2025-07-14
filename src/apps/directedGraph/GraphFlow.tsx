import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import GraphNode from "./GraphNode";
import { createNode } from "./utils/graph";
import { useGraphStore, type GraphStore } from "../../stores/graphStore";
import { useShallow } from "zustand/shallow";

const selector = (state: GraphStore) => ({
  nodes: state.nodes,
  edges: state.edges,
  addNode: state.addNode,
  handleNodesChange: state.handleNodesChange,
});

const nodeTypes = {
  graphNode: GraphNode,
};

const GraphFlowInner = () => {
  const { nodes, edges, addNode, handleNodesChange } = useGraphStore(
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
      zoomOnDoubleClick={false}
      onDoubleClick={handleCanvasDoubleClick}
      onNodeDoubleClick={() => {console.log("Node double clicked!")}}
      onNodesChange={handleNodesChange}
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
