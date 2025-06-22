import type TreeNode from "../components/TreeNode";

export const getNodeMap = (nodes: TreeNode[]) =>
  Object.fromEntries(nodes.map((n) => [n.id, n]));

export const serializeToLeetcode = (nodes: TreeNode[], rootId: string, ) => {
  const nodeMap = getNodeMap(nodes);
  const result: (string | null)[] = [];
  const queue: (string | null)[] = [rootId];

  // Breadth first search
  while (queue.length > 0) {
    // Pop queue
    const curId = queue.shift();

    if (curId === null) {
      result.push(null);
      continue;
    }

    // If currently traversed node is null, push to result and move to next iteration
    const node = nodeMap[curId!];
    result.push(node.data.label);
    queue.push(node.data.leftId ?? null);
    queue.push(node.data.rightId ?? null);
  }

  // Trim trailing nulls, may be worth to make this optional
  while (result[result.length - 1] === null) result.pop();

  return JSON.stringify(result);
};

const createNode = (value: string): TreeNode => {
  return {
    id: crypto.randomUUID(),
    position: { x: 0, y: 0 },
    type: "treeNode",
    data: {
      label: value,
    },
  };
};

export const deserializeLeetcode = (s: string): {
  nodes: TreeNode[];
  rootId: string;
} => {
  // TODO: Handle failed parse due to malformed string, 
  // probably just throw error and let caller handle with default value

  const nodes: TreeNode[] = [];
  const queue = [];
  const data: string[] = JSON.parse(s);

  if (data.length === 0) throw new Error('Empty string supplied')

  let i = 0
  const root = createNode(data[0])
  const rootId = root.id
  nodes.push(root)
  queue.push(root)
  i += 1

  while (queue.length > 0 && i < data.length) {
    const current = queue.shift()

    // Left child
    if (current && i < data.length && data[i] !== null) {
      const left = createNode(data[i])
      current.data.leftId = left.id
      
      queue.push(left)
      nodes.push(left)
    }
    i += 1

    // Right child
    if (current && i < data.length && data[i] !== null) {
      const right = createNode(data[i])
      current.data.rightId = right.id
      
      queue.push(right)
      nodes.push(right)
    }
    i += 1
  }

  return { nodes, rootId }

};
