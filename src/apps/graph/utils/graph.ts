import type { InternalNode, XYPosition } from "@xyflow/react";
import type { GraphNode } from "../types";

export const getNodeMap = (nodes: GraphNode[]) =>
  Object.fromEntries(nodes.map((n) => [n.id, n]));

export const createNode = (value: string = "None", position: XYPosition = { x: 0, y: 0 }): GraphNode => {
  return {
    id: crypto.randomUUID(),
    className: "nopan", // disallows interacting viewport when hovering node
    type: "graphNode",
    position: position,
    data: {
      value: value,
      neighbors: []
    },
  };
} 

// From the center of a circle and some target, find the point of intersection on the circle
function getNodeIntersection(sourceNode: InternalNode, targetNode: InternalNode) {

  if (!sourceNode.measured || sourceNode.measured.width === undefined) {
    throw new Error("Source node does not have valid measured width")
  }

  // Diameter/radius of node
  const width = sourceNode.measured.width;
  const r = width / 2;

  // The origin of the node is top left, so we will adjust it by `r` to obtain the center point
  const sourceNodeOrigin = sourceNode.internals.positionAbsolute;
  const targetNodeOrigin = targetNode.internals.positionAbsolute;

  const sourceNodeCenter = {
    x: sourceNodeOrigin.x + r,
    y: sourceNodeOrigin.y + r,
  };
  const targetNodeCenter = {
    x: targetNodeOrigin.x + r,
    y: targetNodeOrigin.y + r,
  };

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

// Returns (sx, sy, tx, ty) which are the two closest points between two circles
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

// Offsets a line parallel to itself by the given distance
export function offsetLinePerpendicular(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  offsetDistance: number
) {
  // Vector from source to target
  const deltaX = targetX - sourceX;
  const deltaY = targetY - sourceY;

  // Get perpendicular vector (rotate 90 degrees)
  const perpX = deltaY;
  const perpY = -deltaX;
  
  // Normalize to unit vector
  const magnitude = Math.sqrt(perpX * perpX + perpY * perpY);
  const unitX = perpX / magnitude;
  const unitY = perpY / magnitude;

  // Apply offset to both points
  const offsetSourceX = sourceX + unitX * offsetDistance;
  const offsetSourceY = sourceY + unitY * offsetDistance;
  const offsetTargetX = targetX + unitX * offsetDistance;
  const offsetTargetY = targetY + unitY * offsetDistance;

  return {
    sourceX: offsetSourceX,
    sourceY: offsetSourceY,
    targetX: offsetTargetX,
    targetY: offsetTargetY,
  };
}

// Calculate edge path coordinates, handling bidirectional edge offsetting
export function calculateEdgePathCoordinates(
  sourceNode: InternalNode,
  targetNode: InternalNode,
  hasCounterpart: boolean,
) {
  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

  // If there's a bidirectional edge, offset this edge to avoid overlap
  const { sourceX, sourceY, targetX, targetY } = hasCounterpart
    ? offsetLinePerpendicular(sx, sy, tx, ty, 6)
    : { sourceX: sx, sourceY: sy, targetX: tx, targetY: ty };

  return { sourceX, sourceY, targetX, targetY };
}