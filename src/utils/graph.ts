import type { XYPosition } from "@xyflow/react";
import type GraphNode from "../components/GraphNode";

export const createNode = (position: XYPosition): GraphNode => {
  return {
    id: crypto.randomUUID(),
    className: "nopan", // disallows panning viewport when hovering node
    type: "graphNode",
    position: position,
    data: {
      value: "0", // TODO: initialize to a global counter or something, may want to update createNode params to include optional value
      neighbors: []
    },
  };
} 