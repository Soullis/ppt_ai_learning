"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

export type RadialNode = { label: string; sub?: string };

export function Radial({
  center,
  nodes,
  width = 760,
  height = 480,
}: {
  center: string;
  nodes: RadialNode[];
  width?: number;
  height?: number;
}) {
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) / 2.7;

  return (
    <VizFrame width={width} height={height}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {nodes.map((n, i) => {
          const a = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          return (
            <motion.line
              key={`l-${n.label}`}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke={COLORS.ink}
              strokeOpacity={0.16}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.05 }}
            />
          );
        })}
        <motion.circle
          cx={cx}
          cy={cy}
          r={48}
          fill={COLORS.ink}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        />
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          fontSize={12}
          fill={COLORS.bone}
          fontFamily="JetBrains Mono, monospace"
        >
          {center}
        </text>
        {nodes.map((n, i) => {
          const a = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
          const ux = Math.cos(a);
          const uy = Math.sin(a);
          const x = cx + ux * r;
          const y = cy + uy * r;
          // Push label outward from the dot to keep it clear of neighbours.
          const lx = cx + ux * (r + 24);
          const ly = cy + uy * (r + 24);
          // Anchor based on horizontal direction; vertical centre on the line.
          const anchor: "start" | "middle" | "end" =
            ux > 0.25 ? "start" : ux < -0.25 ? "end" : "middle";
          // Sub line below or above depending on vertical position.
          const subDy = uy > 0 ? 14 : -14;
          const subY = uy > 0 ? ly + subDy : ly + subDy;
          return (
            <motion.g
              key={`n-${n.label}`}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.07 }}
            >
              <circle cx={x} cy={y} r={5} fill={COLORS.honey} />
              <text
                x={lx}
                y={ly}
                textAnchor={anchor}
                fontSize={12}
                fill={COLORS.ink}
              >
                {n.label}
              </text>
              {n.sub ? (
                <text
                  x={lx}
                  y={subY}
                  textAnchor={anchor}
                  fontSize={10}
                  fill={COLORS.muted}
                  fontFamily="JetBrains Mono, monospace"
                >
                  {n.sub}
                </text>
              ) : null}
            </motion.g>
          );
        })}
      </svg>
    </VizFrame>
  );
}
