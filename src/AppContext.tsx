import { applyNodeChanges, type Edge, type Node, type NodeChange } from "@xyflow/react"
import { createContext, useContext, useReducer } from "react";
import { v4 as uuidv4 } from 'uuid';
import { getLaidOutTree } from "./utils/getLayoutedElements";
import type TreeNode from "./components/flow/TreeNode";


type AppState = {
    nodes: Node[];
    edges: Edge[];
}

type Action = 
    | { type: "UPDATE_NODE_LABEL"; id: string; label: string }
    | { type: "ON_NODE_CHANGE"; changes: NodeChange[] }
    | { type: "NODE_ADD_CHILD"; parentId: string; side: "left" | "right" } // default to left for now
    | { type: "LAYOUT_ELEMENTS" }

const initialAppState: AppState = {
    nodes: [{ id: "root", className: "nopan", type: 'treeNode', position: { x: 0, y: 0 }, data: { label: '1'} }],
    edges: [],
}

const reducer = (state: AppState, action: Action) => {
    switch (action.type) {
        case 'ON_NODE_CHANGE':
            return { ...state, nodes: applyNodeChanges(action.changes, state.nodes)}
        case 'UPDATE_NODE_LABEL':            
            return {
                ...state,
                nodes: state.nodes.map((node) =>
                node.id === action.id
                    ? { ...node, data: { ...node.data, label: action.label } }
                    : node
                ),
            };
        /**
         * 1. Set parent.leftId = newChildId
         * 2. Initialize newChild with newChildId
         * 3. Create edge between parentId and newChildId
         */
        case 'NODE_ADD_CHILD': {
            const newNodeId = uuidv4();
            const parentNode = getNodeById(state.nodes, action.parentId);
            if (!parentNode) throw Error(`Node with id "${action.parentId}" not found.`) // In case of programmer error

            const updatedNodes = state.nodes.map(node => {
                if (node.id === parentNode.id ) {
                    return { ...node, data: {...node.data, [`${action.side}Id`]: newNodeId} }
                } else {
                    return node
                }
            }).concat(
                { id: newNodeId, className: "nopan", type: 'treeNode', position: { x: 0, y: 0 }, data: { label: 'child'} }
            )

            // LAYOUT
            const { nodes, edges } = {
                ...state,
                nodes: updatedNodes,
                edges: state.edges.concat({ id: uuidv4(), type: 'straight', source: action.parentId, target: newNodeId})
            }

            const { nodes: nodesLaid, edges: edgesLaid } = getLaidOutTree(nodes as TreeNode[], edges)
             
            return {
                ...state,
                nodes: nodesLaid,
                edges: edgesLaid,
            }
        }
        case 'LAYOUT_ELEMENTS': {
            const { nodes, edges } = getLaidOutTree(state.nodes as TreeNode[], state.edges)
            return {
                ...state,
                nodes: nodes,
                edges: edges,
            }
        }

        default:
            return state
    }
}

function getNodeById(nodes: Node[], id: string): Node | null {
  return nodes.find((node) => node.id === id) || null;
}

// Creates the app context component which will hold the app state and reference to the reducer's dispatch method
const AppContext = createContext<{state: AppState, dispatch: React.Dispatch<Action>} | null>(null)

export const AppContextProvider = ({children}: {children: React.ReactNode}) => {
    const [state, dispatch] = useReducer(reducer, initialAppState)

    return (
        <AppContext.Provider value={{state, dispatch}}>
            {children}
        </AppContext.Provider>
    )
}

// Custom hook that allows us to access AppContext
export const useAppContext = () => {
    const context = useContext(AppContext)
    if (!context) throw new Error('Regarding AppContext, useAppContext must be used within AppContextProvider.');
    return context;
}

