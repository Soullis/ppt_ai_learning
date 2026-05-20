"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

/** A clean diagram of one transformer encoder block, à la "Attention Is All You Need". */
export function TransformerBlock({
  width = 720,
  height = 460,
}: {
  width?: number;
  height?: number;
}) {
  const cx = width / 2;
  const blockW = 220;
  // Vertical layout
  const topY = 60;
  const layout = [
    { y: topY, label: "Input embeddings + position", kind: "io" },
    { y: topY + 80, label: "Multi-Head Self-Attention", kind: "core" },
    { y: topY + 140, label: "Add & Norm", kind: "norm" },
    { y: topY + 220, label: "Feed-Forward MLP", kind: "core" },
    { y: topY + 280, label: "Add & Norm", kind: "norm" },
    { y: topY + 360, label: "to next block · or to head", kind: "io" },
  ];

  return (
    <VizFrame width={width} height={height} caption='transformer encoder block · Vaswani et al. 2017'>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {layout.map((b, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <rect
              x={cx - blockW / 2}
              y={b.y - 18}
              width={blockW}
              height={36}
              rx={6}
              fill={
                b.kind === "core"
                  ? COLORS.surface
                  : b.kind === "norm"
                    ? COLORS.bone
                    : COLORS.surface
              }
              stroke={
                b.kind === "core"
                  ? COLORS.accent
                  : b.kind === "norm"
                    ? COLORS.muted
                    : COLORS.ink
              }
              strokeWidth={b.kind === "core" ? 1.6 : 1.1}
              strokeDasharray={b.kind === "norm" ? "3 3" : undefined}
            />
            <text
              x={cx}
              y={b.y + 4}
              textAnchor="middle"
              fontSize={12}
              fill={COLORS.ink}
              fontFamily="JetBrains Mono, monospace"
            >
              {b.label}
            </text>
          </motion.g>
        ))}
        {/* Vertical connectors */}
        {layout.slice(0, -1).map((b, i) => (
          <line
            key={`c-${i}`}
            x1={cx}
            x2={cx}
            y1={b.y + 18}
            y2={layout[i + 1].y - 18}
            stroke={COLORS.ink}
            strokeOpacity={0.4}
          />
        ))}
        {/* Residual paths */}
        <motion.path
          d={`M ${cx + blockW / 2 - 20},${topY + 18} C ${cx + blockW / 2 + 80},${topY + 18} ${cx + blockW / 2 + 80},${topY + 140} ${cx + blockW / 2 - 20},${topY + 140}`}
          fill="none"
          stroke={COLORS.honey}
          strokeWidth={1.5}
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        />
        <motion.path
          d={`M ${cx + blockW / 2 - 20},${topY + 158} C ${cx + blockW / 2 + 80},${topY + 158} ${cx + blockW / 2 + 80},${topY + 280} ${cx + blockW / 2 - 20},${topY + 280}`}
          fill="none"
          stroke={COLORS.honey}
          strokeWidth={1.5}
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        />
        <text
          x={cx + blockW / 2 + 88}
          y={topY + 80}
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.honey}
        >
          residual
        </text>
        <text
          x={cx + blockW / 2 + 88}
          y={topY + 220}
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.honey}
        >
          residual
        </text>
      </svg>
    </VizFrame>
  );
}
