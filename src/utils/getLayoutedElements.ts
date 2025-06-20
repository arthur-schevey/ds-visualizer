import type { Edge, Node } from "@xyflow/react";
import { hierarchy, tree } from "d3-hierarchy";
import { v4 as uuidv4 } from "uuid"
import TreeNode from "../components/flow/TreeNode";

const g = tree<HierarchyNode>();

type TreeNodeWithChildren = TreeNode & { children: [HierarchyNode, HierarchyNode] };
type DummyNode = Node & { data: { dummy: boolean } }
type HierarchyNode = TreeNode | TreeNodeWithChildren | DummyNode;


export const getLaidOutTree = (nodes: TreeNode[], edges: Edge[]) => {
  if (nodes.length === 0) return { nodes, edges };

  // WARNING: may need to set hidden property on dummies

  // Generate node map (id -> node)
  const nodeMap = new Map<string, TreeNode>(nodes.map((n) => [n.id, { ...n }]));

  // Helper creates dummy node to assist with spacing
  const makeDummy = () => {
    return {
      id: uuidv4(),
      position: { x: 0, y: 0 },
      data: { dummy: true },
    };
  }

  // Helper creates d3 hierarchy which requires each node to have 
  // an ordered children property
  const buildHierarchy = (node: TreeNode): HierarchyNode => {

    // base case: leaf node with intentionally undefined `children` property
    if (!node.data.leftId && !node.data.rightId) {
      return { ...node }; 
    }

    const leftChild = node.data.leftId
      ? buildHierarchy(nodeMap.get(node.data.leftId)!) // confident that map will always return a value
      : makeDummy();

    const rightChild = node.data.rightId
      ? buildHierarchy(nodeMap.get(node.data.rightId)!)
      : makeDummy();

    return {
      ...node,
      children: [leftChild, rightChild] as [HierarchyNode, HierarchyNode],
    };

  }

  const rootNode = nodeMap.get("root");
  if (!rootNode) {
    throw new Error("Root node not found");
  }
  const tree = hierarchy<HierarchyNode>(buildHierarchy(rootNode))

  // Overrides default separation function: https://d3js.org/d3-hierarchy/tree#tree_separation
  g.separation(() => 1)
  const layout = g.nodeSize([120, 120])(tree); // node size determines spacing
  
  return {
    nodes: layout
      .descendants()
      .filter((node) => node.data.data.dummy == undefined) // remove dummy nodes
      .map((node) => ({
        ...node.data,
        position: { x: node.x, y: node.y },
      })),
    edges,
  };
};
