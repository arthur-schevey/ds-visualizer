import type { Node } from "@xyflow/react";

export type TreeNode = Node<TreeNodeData, "treeNode">;

export type TreeNodeData = {
  value: string;
  leftId?: string;
  rightId?: string;
  dummy?: boolean;
};

export type TreeFormat = "leetcode-strict" | "leetcode";
