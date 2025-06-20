import { 
  ReactFlow,
  Controls,
  BackgroundVariant,
  Background,
  Panel,
} from '@xyflow/react';
 
import '@xyflow/react/dist/style.css';
import TreeNode from './components/flow/TreeNode';
import { useAppContext } from './AppContext';
  
const nodeTypes = {
  treeNode: TreeNode,
}

function App() {
  const { state, dispatch } = useAppContext();

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow 
        nodes={state.nodes} 
        edges={state.edges}
        onNodesChange={(changes) => {dispatch({ type: 'ON_NODE_CHANGE', changes: changes})}}
        // onEdgesChange={onEdgesChange}
        nodeDragThreshold={5}
        nodeClickDistance={30}
        fitView // centers view on graph
        nodeTypes={nodeTypes}
      >
        <Controls/>
        <Panel position="top-right">
          <button onClick={() => dispatch({ type: 'LAYOUT_ELEMENTS' })}>layout</button>
        </Panel>
        <Background color="#ccc" variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </div>
  )
}

export default App
