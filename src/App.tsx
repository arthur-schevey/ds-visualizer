import {
  ReactFlow,
  Controls,
  BackgroundVariant,
  Background,
  Panel,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import TreeNode from "./components/flow/TreeNode";
import { useTreeStore, type TreeStore } from "./store";
import { useShallow } from "zustand/shallow";

const nodeTypes = {
  treeNode: TreeNode,
};

const selector = (state: TreeStore) => ({
  nodes: state.nodes,
  edges: state.edges,
  handleNodesChange: state.handleNodesChange,
});

function App() {
  const { nodes, edges, handleNodesChange } = useTreeStore(
    useShallow(selector)
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        // onEdgesChange={onEdgesChange}
        nodeClickDistance={30} // makes the app feel more responsive
        fitView // centers view on graph
        nodeTypes={nodeTypes}
      >
        <Controls />
        <Background color="#ccc" variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </div>
  );
}

export default App;
