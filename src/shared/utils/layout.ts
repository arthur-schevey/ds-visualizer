import { hierarchy, tree } from "d3-hierarchy";
import TreeNode from "../../apps/binaryTree/TreeNode";

const g = tree<TreeNode>();

export const getLaidOutTree = (
  nodes: TreeNode[],
  nodeMap: Record<string, TreeNode>,
  rootId: string
): TreeNode[] => {
  if (nodes.length === 0) return nodes; // may be redundant

  // WARNING: may need to set hidden property on dummies

  // Helper creates dummy node to assist with spacing
  const makeDummy = (): TreeNode => {
    return {
      id: "__dummy__" + crypto.randomUUID(),
      type: "treeNode",
      position: { x: 0, y: 0 },
      data: {
        leftId: undefined,
        rightId: undefined,
        value: "",
        dummy: true,
      },
    };
  };

  const getChildren = (datum: TreeNode): TreeNode[] => {
    if (!datum.data.leftId && !datum.data.rightId) return []; // leaf node, don't traverse
    if (datum.data.value === "dummy") return []; // dummy node, don't traverse

    const left = datum.data.leftId ? nodeMap[datum.data.leftId] : makeDummy();
    const right = datum.data.rightId
      ? nodeMap[datum.data.rightId]
      : makeDummy();
    return [left, right];
  };

  const root = nodeMap[rootId];
  if (!root) throw new Error("Root node is missing");
  const tree = hierarchy<TreeNode>(root, getChildren);

  // TODO: Improve separation function to parameterize x
  // and y spacing for later use, also parameterize node size

  // Overrides default separation function: https://d3js.org/d3-hierarchy/tree#tree_separation
  g.separation(() => 1);
  const layout = g.nodeSize([90, 90])(tree); // node size determines spacing

  return layout
    .descendants()
    .filter((node) => !node.data.data.dummy) // remove dummy nodes
    .map((node) => ({
      ...node.data,
      position: { x: node.x, y: node.y },
    })) as TreeNode[];
};
