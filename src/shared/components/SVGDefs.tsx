// SVG definitions accessible globally
export const SVGDefs = () => {
  return (
    <svg style={{ height: 0, width: 0 }}>
      <defs>
        <marker
          id="arrowhead"
          markerWidth="20"
          markerHeight="20"
          viewBox="-10 -10 20 20"
          markerUnits="userSpaceOnUse"
          orient="auto-start-reverse"
          refX="0"
          refY="0"
        >
          <polyline
            stroke="#A8A8AE"
            fill="#A8A8AE"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            points="-5,-4 0,0 -5,4 -5,-4"
          />
        </marker>
      </defs>
    </svg>
  )
};