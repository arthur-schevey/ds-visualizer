import { ReactFlow, Background, BackgroundVariant } from "@xyflow/react";
import GraphNode from "../components/GraphNode";

const nodeTypes = {
  graphNode: GraphNode,
};

const GraphFlow = () => {
    
    function handleDoubleClick(event: React.MouseEvent<HTMLDivElement>): void {
      console.log(event.screenX, event.screenY);
    }

    return (
      <ReactFlow
        nodes={[]}
        edges={[]}
        deleteKeyCode={["Delete", "Backspace"]}
        nodeClickDistance={30} // makes the graph feel more responsive
        fitView // centers view on graph
        nodeTypes={nodeTypes}
        zoomOnDoubleClick={false}
        onDoubleClick={handleDoubleClick}
        proOptions={{ hideAttribution: true }}
      >

        {/* Background */}
        <Background color="#ccc" variant={BackgroundVariant.Dots} />
      </ReactFlow>
    )
}

export default GraphFlow
