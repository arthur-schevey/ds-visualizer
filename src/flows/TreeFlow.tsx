import { ReactFlow, Panel, Background, BackgroundVariant, type NodeChange } from "@xyflow/react"
import { TreeInput } from "../components/TreeInputHeader"
import { useShallow } from "zustand/shallow"
import TreeNode from "../components/TreeNode"
import { useTreeStore, type TreeStore } from "../stores/treeStore"

const selector = (state: TreeStore) => ({
  nodes: state.nodes,
  edges: state.edges,
  handleNodesChange: state.handleNodesChange,
  handleNodesDelete: state.handleNodesDelete,
});

const nodeTypes = {
  treeNode: TreeNode,
};

const TreeFlow = () => {

    const { nodes, edges, handleNodesChange, handleNodesDelete } = useTreeStore(
        useShallow(selector)
    );

    // Disallow undo/redo state tracking on node drag/select
    const { pause, resume } = useTreeStore.temporal.getState();
    const handleNodesChangeTemporal = (changes: NodeChange<TreeNode>[]) => {
        pause();
        handleNodesChange(changes);
        resume();
    };

    return (
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChangeTemporal}
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

        {/* Background */}
        <Background color="#ccc" variant={BackgroundVariant.Dots} />
      </ReactFlow>
    )
}

export default TreeFlow
