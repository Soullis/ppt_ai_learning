"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

export function ParetoCurve({
  width = 640,
  height = 380,
  xLabel = "annotation hours",
  yLabel = "mAP gain",
}: {
  width?: number;
  height?: number;
  xLabel?: string;
  yLabel?: string;
}) {
  const padX = 60;
  const padY = 50;
  const sx = (x: number) => padX + x * (width - padX * 2);
  const sy = (y: number) => height - padY - y * (height - padY * 2);

  const pts = Array.from({ length: 80 }, (_, i) => {
    const x = i / 79;
    const y = 1 - Math.exp(-x * 3.2);
    return [x, y] as [number, number];
  });

  const path = `M ${pts.map((p) => `${sx(p[0])},${sy(p[1])}`).join(" L ")}`;

  return (
    <VizFrame width={width} height={height}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {/* axes */}
        <line
          x1={padX}
          x2={width - padX}
          y1={height - padY}
          y2={height - padY}
          stroke={COLORS.ink}
          strokeOpacity={0.4}
        />
        <line
          x1={padX}
          x2={padX}
          y1={padY}
          y2={height - padY}
          stroke={COLORS.ink}
          strokeOpacity={0.4}
        />
        <text
          x={(padX + (width - padX)) / 2}
          y={height - padY + 32}
          textAnchor="middle"
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
          style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}
        >
          {xLabel}
        </text>
        <text
          x={padX - 14}
          y={(padY + (height - padY)) / 2}
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
          textAnchor="middle"
          style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}
          transform={`rotate(-90, ${padX - 14}, ${(padY + (height - padY)) / 2})`}
        >
          {yLabel}
        </text>
        <motion.path
          d={path}
          fill="none"
          stroke={COLORS.accent}
          strokeWidth={1.75}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
        {/* Knee marker */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <circle cx={sx(0.35)} cy={sy(1 - Math.exp(-0.35 * 3.2))} r={5} fill={COLORS.honey} />
          <line
            x1={sx(0.35)}
            x2={sx(0.35) + 60}
            y1={sy(1 - Math.exp(-0.35 * 3.2))}
            y2={sy(1 - Math.exp(-0.35 * 3.2)) - 30}
            stroke={COLORS.muted}
            strokeOpacity={0.4}
          />
          <text
            x={sx(0.35) + 64}
            y={sy(1 - Math.exp(-0.35 * 3.2)) - 32}
            fontSize={11}
            fill={COLORS.muted}
          >
            diminishing returns
          </text>
        </motion.g>
      </svg>
    </VizFrame>
  );
}
