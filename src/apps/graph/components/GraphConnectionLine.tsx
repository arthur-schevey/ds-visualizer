import { getStraightPath, type ConnectionLineComponentProps, type InternalNode } from '@xyflow/react';
import { getEdgeParams } from '@graph/utils/graph';

function GraphConnectionLine({ toX, toY, fromNode, toNode }: ConnectionLineComponentProps) {
  if (!fromNode) {
    return null;
  }

  // Create a mock target node at the cursor position
  const mouseTarget: InternalNode = createMockTarget(toX, toY)

  // If toNode exists, then we are hovering a valid node for connection, otherwise path to mouse position
  const targetNode = toNode ?? mouseTarget

  const { sx, sy, tx, ty } = getEdgeParams(fromNode, targetNode);

  const [edgePath] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: toNode ? tx : toX, 
    targetY: toNode ? ty : toY
  });

  return (
    <path
      fill="none"
      stroke="#A8A8AE"
      strokeWidth={2}
      className="animated"
      markerEnd="url(#arrowhead)"
      d={edgePath}
    />
  );
}

const createMockTarget = (toX: number, toY: number) => {
  return {
    id: 'connection-target',
    position: { x: 0, y: 0 },
    data: {},
    measured: {
      width: 1,
      height: 1,
    },
    internals: {
      // Our mouse position represents the center of a node, but internals expect the
      // origin to be the top left, so we must offset it by the radius of the circle
      positionAbsolute: { x: toX - 25, y: toY - 25 },
      z: 0,
      userNode: {
        id: 'connection-target-usernode',
        position: { x: 0, y: 0 },
        data: {},
      },
    },
  };
}

export default GraphConnectionLine;
