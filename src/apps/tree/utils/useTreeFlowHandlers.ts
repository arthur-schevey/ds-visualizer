import { useTreeStore } from "@tree/stores/treeStore";
import type { TreeNode } from "@tree/types";
import { applyNodeChanges, type NodeChange } from "@xyflow/react";
import { useCallback } from "react";
import { getNodeMap } from "./tree";

export function useTreeFlowHandlers() {
  const setNodes = useTreeStore((state) => state.setNodes);
  const setEdges = useTreeStore((state) => state.setEdges);

  // Callback from React Flow to handle node selections and drags
  const handleNodesChange = useCallback(
    (changes: NodeChange<TreeNode>[]) => {
      // The use of pause/resume disallows undo/redo state tracking on node drag/select
      useTreeStore.temporal.getState().pause()
      setNodes((nodes) => applyNodeChanges(changes, nodes));
      useTreeStore.temporal.getState().resume()
    },
    [setNodes]
  );

  // Callback from React Flow to handle node deletion, also handles pruning child nodes
  const handleNodesDelete = useCallback((deleted: TreeNode[]) => {
    const { nodes, edges } = useTreeStore.getState();
    const nodeMap = getNodeMap(nodes);

    // To prune, we need to obtain a list of descendants
    const collectDescendants = (
      id: string | undefined,
      acc = new Set<string>()
    ) => {
      if (!id) return acc; // node does not exist
      const node = nodeMap[id];
      acc.add(id);
      collectDescendants(node.data.leftId, acc);
      collectDescendants(node.data.rightId, acc);
      return acc;
    };

    // Reduce all deleted nodes and their descendants into one collection
    const toDelete: Set<string> = deleted.reduce((acc, node) => {
      return collectDescendants(node.id, acc);
    }, new Set<string>());

    // Remove deleted from nodes/edges
    const updatedNodes = nodes.filter((n) => !toDelete.has(n.id));
    const updatedEdges = edges.filter(
      (e) => !toDelete.has(e.source) && !toDelete.has(e.target)
    );

    // Find parents of deleted nodes and remove reference to deleted child
    const updatedParents = updatedNodes
      .filter((node) => {
        const leftId = node.data.leftId;
        const rightId = node.data.rightId;
        return toDelete.has(leftId!) || toDelete.has(rightId!);
      })
      .map((node) => {
        const newParent = { ...node };
        if (toDelete.has(node.data.leftId!)) delete newParent.data.leftId;
        if (toDelete.has(node.data.rightId!)) delete newParent.data.rightId;
        nodeMap[newParent.id] = newParent;
        return newParent;
      });

    // Lastly modify updatedParents
    const parentMap = new Map(updatedParents.map((node) => [node.id, node]));

    const finalNodes = updatedNodes.map((node) =>
      parentMap.has(node.id) ? parentMap.get(node.id)! : node
    );

    setNodes(finalNodes)
    setEdges(updatedEdges)
  }, [setNodes, setEdges]);

  return { handleNodesChange, handleNodesDelete };
}
