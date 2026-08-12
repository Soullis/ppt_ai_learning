"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export function AgentEnvLoop({ width = 640, height = 360 }: { width?: number; height?: number }) {
  const cx = width / 2;
  const cy = height / 2;
  const dx = 180;
  const reduce = useReducedMotion();
  const repeat = reduce ? 0 : Infinity;

  return (
    <VizFrame width={width} height={height}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {[
          { x: cx - dx, y: cy, label: "Agent", sub: "policy π(a | s)" },
          { x: cx + dx, y: cy, label: "Environment", sub: "transition p(s' | s, a)" },
        ].map((b) => (
          <g key={b.label} transform={`translate(${b.x - 80}, ${b.y - 36})`}>
            <rect
              width={160}
              height={72}
              rx={6}
              fill={COLORS.surface}
              stroke={COLORS.ink}
              strokeOpacity={0.35}
            />
            <text x={80} y={28} textAnchor="middle" fontSize={14} fill={COLORS.ink}>
              {b.label}
            </text>
            <text
              x={80}
              y={50}
              textAnchor="middle"
              fontSize={11}
              fill={COLORS.muted}
              fontFamily="JetBrains Mono, monospace"
            >
              {b.sub}
            </text>
          </g>
        ))}
        {/* Top arc: action */}
        <motion.path
          d={`M ${cx - dx + 80},${cy - 30} Q ${cx},${cy - 130} ${cx + dx - 80},${cy - 30}`}
          fill="none"
          stroke={COLORS.accent}
          strokeWidth={1.5}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, repeat, repeatDelay: 1 }}
        />
        <text x={cx} y={cy - 110} textAnchor="middle" fontSize={12} fill={COLORS.accent}>
          action a
        </text>
        {/* Bottom arc: state + reward */}
        <motion.path
          d={`M ${cx + dx - 80},${cy + 30} Q ${cx},${cy + 130} ${cx - dx + 80},${cy + 30}`}
          fill="none"
          stroke={COLORS.honey}
          strokeWidth={1.5}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.5, repeat, repeatDelay: 1 }}
        />
        <text x={cx} y={cy + 122} textAnchor="middle" fontSize={12} fill={COLORS.honey}>
          state s, reward r
        </text>
      </svg>
    </VizFrame>
  );
}
