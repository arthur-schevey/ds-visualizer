import type {
  GraphEdge,
  GraphFormat,
  GraphNode,
  SerializedGraph,
} from "@graph/types";
import { getNodeMap } from "./graph";

export const serialize = (
  format: GraphFormat,
  weighted: boolean,
  nodes: GraphNode[],
  edges: GraphEdge[]
): SerializedGraph => {
  const nodeMap = getNodeMap(nodes);

  switch (format) {
    case "json":
      return {
        header: `${nodes.length} ${edges.length}`,
        body: JSON.stringify(
          { nodes, edges },
          [
            "nodes",
            "id",
            "position",
            "data",
            "x",
            "y",
            "value",
            "edges",
            "source",
            "target",
            "weight",
          ],
          4
        ),
      };

    case "edge-list":
      return {
        header: `${nodes.length} ${edges.length}`,
        body: edges
          .map(
            (e) =>
              `${nodeMap[e.source].data.value} ${nodeMap[e.target].data.value}${
                weighted ? ` ${e.data?.weight}` : ""
              }`
          )
          .join("\n"),
      };

    case "node-edge-list": {
      const edgesString = edges
        .map(
          (e) =>
            `${nodeMap[e.source].data.value} ${nodeMap[e.target].data.value}${
              weighted ? ` ${e.data?.weight}` : ""
            }`
        )
        .join("\n");

      const nodesString = nodes.map((n) => n.data.value).join("\n");

      return {
        header: `${nodes.length} ${edges.length}`,
        body: `${nodesString}\n${edgesString}`,
      };
    }
    default:
      throw new Error(`Unknown format: ${format}`);
  }
};
