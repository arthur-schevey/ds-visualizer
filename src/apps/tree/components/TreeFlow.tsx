import { ReactFlow, Panel, Background, BackgroundVariant, ConnectionMode } from "@xyflow/react"
import { TreeInput } from "./TreeHeader"
import { useShallow } from "zustand/shallow"
import { useTreeStore, type TreeStore } from "@tree/stores/treeStore"
import TreeNodeComponent from "./TreeNode"
import { TreeHotkeys } from "./TreeHotkeys"
import { useTreeFlowHandlers } from "../utils/useTreeFlowHandlers"

const selector = (state: TreeStore) => ({
  nodes: state.nodes,
  edges: state.edges,
});

const nodeTypes = {
  treeNode: TreeNodeComponent,
};

const TreeFlow = () => {

    const { nodes, edges } = useTreeStore(
        useShallow(selector)
    );

    const { handleNodesChange, handleNodesDelete } = useTreeFlowHandlers()


    return (
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onNodesDelete={handleNodesDelete}
        deleteKeyCode={["Delete", "Backspace"]}
        nodeClickDistance={30} // makes the graph feel more responsive
        fitView // centers view on graph
        fitViewOptions={{maxZoom: 2.0, minZoom: 1.0}}
        maxZoom={3.0}
        minZoom={1.0}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        proOptions={{ hideAttribution: true }}
      >
        <title>Binary Tree Editor</title>
        <TreeHotkeys/>

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
