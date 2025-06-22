import {
  ReactFlow,
  Controls,
  BackgroundVariant,
  Background,
  Panel,
  type NodeChange,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import TreeNode from "./components/flow/TreeNode";
import { useTreeStore, type TreeStore } from "./store";
import { useShallow } from "zustand/shallow";
import { HotkeyBindings } from "./components/HotKeyBindings";
import { useEffect } from "react";

const nodeTypes = {
  treeNode: TreeNode,
};

const selector = (state: TreeStore) => ({
  nodes: state.nodes,
  edges: state.edges,
  handleNodesChange: state.handleNodesChange,
  handleNodesDelete: state.handleNodesDelete,
});

function App() {
  const { nodes, edges, handleNodesChange, handleNodesDelete } = useTreeStore(
    useShallow(selector)
  );

  const { pause, resume } = useTreeStore.temporal.getState();
  const tempHandleNodesChange = (changes: NodeChange<TreeNode>[]) => {
    pause()
    handleNodesChange(changes)
    resume()
  }

  // Temporary: For use debugging and watching the undo/redo stack over time
  // useEffect(() => {
  //   console.log('Undo stack:', useTreeStore.temporal.getState().pastStates);
  // }, [useTreeStore((s) => s.nodes)]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <HotkeyBindings/>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={tempHandleNodesChange}
        onNodesDelete={handleNodesDelete}
        deleteKeyCode={["Delete", "Backspace"]}
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
