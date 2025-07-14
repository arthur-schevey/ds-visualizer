import type { InternalNode, Node, XYPosition } from "@xyflow/react";
import type GraphNode from "../GraphNode";

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

// this helper function returns the intersection point
// of the line between the center of the intersectionNode and the target node
// Given a circle
function getNodeIntersection(sourceNode: InternalNode, targetNode: InternalNode) {

  if (!sourceNode.measured || sourceNode.measured.width === undefined) {
    throw new Error("Source node does not have valid measured width")
  }

  // Diameter/radius of node
  const width = sourceNode.measured.width;
  const r = width / 2;
  // console.log("SOURCE NODE", sourceNode)

  // The origin of the node is top left, so we will adjust it by `r` to obtain the center point
  const sourceNodeOrigin = sourceNode.internals.positionAbsolute;
  const targetNodeOrigin = targetNode.internals.positionAbsolute;
  // console.log("Source origin", sourceNodeOrigin, "Target origin", targetNodeOrigin);
  const sourceNodeCenter = {
    x: sourceNodeOrigin.x + r,
    y: sourceNodeOrigin.y + r,
  };
  const targetNodeCenter = {
    x: targetNodeOrigin.x + r,
    y: targetNodeOrigin.y + r,
  };
  // console.log("Source center", sourceNodeCenter, "Target center", targetNodeCenter);

  // Calculate vector from source center to target center
  const dx = targetNodeCenter.x - sourceNodeCenter.x;
  const dy = targetNodeCenter.y - sourceNodeCenter.y;
  const magnitude = Math.sqrt(dx * dx + dy * dy);

  // Calculate unit (pixel) vector
  const ux = dx / magnitude;
  const uy = dy / magnitude;

  // Obtain intersection point by travelling `unit vector * radius`
  const intersectionX = sourceNodeCenter.x + ux * r;
  const intersectionY = sourceNodeCenter.y + uy * r;

  return { x: intersectionX, y: intersectionY };
}

// returns the parameters (sx, sy, tx, ty) which are the closest two points between two circles
export function getEdgeParams(source: InternalNode, target: InternalNode) {
  const sourceIntersectionPoint = getNodeIntersection(source, target);
  const targetIntersectionPoint = getNodeIntersection(target, source);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
  };
}