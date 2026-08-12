"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

export function SkipBlock({
  width = 720,
  height = 280,
}: {
  width?: number;
  height?: number;
}) {
  const cy = height / 2;
  const w = 110;
  const h = 56;
  const positions = [120, 320, 520];

  return (
    <VizFrame width={width} height={height} caption="residual block — F(x) + x">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {/* Main path */}
        {positions.map((x, i) => (
          <g key={`b-${i}`}>
            <rect
              x={x - w / 2}
              y={cy - h / 2}
              width={w}
              height={h}
              rx={6}
              fill={COLORS.surface}
              stroke={COLORS.ink}
              strokeOpacity={0.35}
            />
            <text x={x} y={cy + 5} textAnchor="middle" fontSize={13} fill={COLORS.ink}>
              {i === 0 ? "x" : i === 1 ? "F(x)" : "x + F(x)"}
            </text>
          </g>
        ))}
        {/* Forward */}
        {positions.slice(0, -1).map((x, i) => (
          <line
            key={`l-${i}`}
            x1={x + w / 2}
            x2={positions[i + 1] - w / 2}
            y1={cy}
            y2={cy}
            stroke={COLORS.ink}
            strokeOpacity={0.5}
          />
        ))}
        {/* Skip arc */}
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.0, delay: 0.3 }}
          d={`M ${positions[0] + w / 2 - 30},${cy - h / 2} C ${positions[0] + 100},${cy - 110} ${positions[2] - 100},${cy - 110} ${positions[2] - w / 2 + 30},${cy - h / 2}`}
          fill="none"
          stroke={COLORS.honey}
          strokeWidth={1.75}
          strokeDasharray="3 4"
        />
        <text
          x={(positions[0] + positions[2]) / 2}
          y={cy - 90}
          textAnchor="middle"
          fontSize={12}
          fill={COLORS.honey}
        >
          identity (skip)
        </text>
      </svg>
    </VizFrame>
  );
}
