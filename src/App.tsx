import {
  ReactFlow,
  BackgroundVariant,
  Background,
  Panel,
  type NodeChange,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import TreeNode from "./components/TreeNode";
import { useTreeStore, type TreeStore } from "./store";
import { useShallow } from "zustand/shallow";
import { HotkeyBindings } from "./components/HotKeyBindings";
import { TreeInput } from "./components/TreeInputHeader";
import { Tag, Tooltip } from "antd";
import { AiOutlineGithub } from "react-icons/ai";
import { APP_VERSION } from "./version";

const nodeTypes = {
  treeNode: TreeNode,
};

const selector = (state: TreeStore) => ({
  nodes: state.nodes,
  edges: state.edges,
  rootId: state.rootId,
  handleNodesChange: state.handleNodesChange,
  handleNodesDelete: state.handleNodesDelete,
});

function App() {
  const { nodes, edges, handleNodesChange, handleNodesDelete } = useTreeStore(
    useShallow(selector)
  );

  const { pause, resume } = useTreeStore.temporal.getState();
  const tempHandleNodesChange = (changes: NodeChange<TreeNode>[]) => {
    pause();
    handleNodesChange(changes);
    resume();
  };

  // Temporary: For use debugging and watching the undo/redo stack over time
  // useEffect(() => {
  //   console.log('Undo stack:', useTreeStore.temporal.getState().pastStates);
  // }, [useTreeStore((s) => s.nodes)]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <HotkeyBindings />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={tempHandleNodesChange}
        onNodesDelete={handleNodesDelete}
        deleteKeyCode={["Delete", "Backspace"]}
        nodeClickDistance={30} // makes the graph feel more responsive
        fitView // centers view on graph
        nodeTypes={nodeTypes}
        proOptions={{ hideAttribution: true }}
      >
        {/* Header */}
        <Panel position="top-center">
          <TreeInput />
        </Panel>

        {/* Version and GitHub link */}
        <Panel position="bottom-right">
          <Tooltip title="View on GitHub">
            <a
              href="https://github.com/arthur-schevey/ds-visualizer"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Repository"
            >
              <Tag icon={<AiOutlineGithub style={{ fontSize: "20px" }} />} />
            </a>
          </Tooltip>

          <Tag>v{APP_VERSION}</Tag>
        </Panel>
        <Background color="#ccc" variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </div>
  );
}

export default App;
