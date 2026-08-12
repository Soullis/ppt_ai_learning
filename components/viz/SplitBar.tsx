"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

export function SplitBar({
  splits = [
    { label: "train", weight: 0.7, color: COLORS.accent },
    { label: "val", weight: 0.15, color: COLORS.honey },
    { label: "test", weight: 0.15, color: COLORS.green },
  ],
  width = 720,
  height = 220,
}: {
  splits?: { label: string; weight: number; color: string }[];
  width?: number;
  height?: number;
}) {
  const total = splits.reduce((a, s) => a + s.weight, 0);
  const padX = 40;
  const innerW = width - padX * 2;
  const barH = 36;
  const cy = height / 2;

  let x = padX;
  return (
    <VizFrame width={width} height={height}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        <rect
          x={padX}
          y={cy - barH / 2}
          width={innerW}
          height={barH}
          fill={COLORS.surface}
          stroke={COLORS.ink}
          strokeOpacity={0.3}
          rx={4}
        />
        {splits.map((s, i) => {
          const w = (s.weight / total) * innerW;
          const segX = x;
          x += w;
          return (
            <motion.g
              key={s.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <rect
                x={segX}
                y={cy - barH / 2}
                width={w}
                height={barH}
                fill={s.color}
                fillOpacity={0.25}
                stroke={s.color}
                strokeWidth={1}
              />
              <text
                x={segX + w / 2}
                y={cy + 5}
                textAnchor="middle"
                fontSize={12}
                fill={COLORS.ink}
              >
                {s.label}
              </text>
              <text
                x={segX + w / 2}
                y={cy + barH / 2 + 22}
                textAnchor="middle"
                fontSize={11}
                fontFamily="JetBrains Mono, monospace"
                fill={COLORS.muted}
                style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}
              >
                {(s.weight * 100).toFixed(0)}%
              </text>
            </motion.g>
          );
        })}
      </svg>
    </VizFrame>
  );
}
