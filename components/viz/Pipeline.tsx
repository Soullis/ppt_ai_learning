"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

export type PipelineStep = { label: string; detail?: string };

export function Pipeline({
  steps = [],
  width = 880,
  height = 220,
}: {
  steps?: PipelineStep[];
  width?: number;
  height?: number;
}) {
  // 2. Added early return to prevent division by zero if steps is empty
  if (steps.length === 0) {
    return (
      <VizFrame width={width} height={height}>
        <div className="flex h-full items-center justify-center font-mono text-[12px] text-muted uppercase tracking-[0.12em]">
          No steps provided
        </div>
      </VizFrame>
    );
  }
  const padX = 40;
  const innerW = width - padX * 2;
  const stepW = innerW / steps.length;
  const cy = height / 2;

  return (
    <VizFrame width={width} height={height}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {steps.map((s, i) => {
          const x = padX + i * stepW + stepW / 2;
          return (
            <motion.g
              key={s.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
            >
              <rect
                x={x - stepW / 2 + 12}
                y={cy - 38}
                width={stepW - 24}
                height={76}
                rx={6}
                fill={COLORS.surface}
                stroke={COLORS.ink}
                strokeOpacity={0.3}
              />
              <text
                x={x}
                y={cy - 14}
                textAnchor="middle"
                fontSize={12}
                fontFamily="JetBrains Mono, monospace"
                fill={COLORS.muted}
                style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}
              >
                {String(i + 1).padStart(2, "0")}
              </text>
              <text x={x} y={cy + 6} textAnchor="middle" fontSize={14} fill={COLORS.ink}>
                {s.label}
              </text>
              {s.detail ? (
                <text x={x} y={cy + 24} textAnchor="middle" fontSize={11} fill={COLORS.muted}>
                  {s.detail}
                </text>
              ) : null}
              {i < steps.length - 1 ? (
                <motion.line
                  x1={x + stepW / 2 - 12}
                  x2={x + stepW / 2 + 12}
                  y1={cy}
                  y2={cy}
                  stroke={COLORS.ink}
                  strokeOpacity={0.4}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.12 }}
                />
              ) : null}
              {i < steps.length - 1 ? (
                <motion.polygon
                  points={`${x + stepW / 2 + 8},${cy - 4} ${x + stepW / 2 + 14},${cy} ${x + stepW / 2 + 8},${cy + 4}`}
                  fill={COLORS.ink}
                  fillOpacity={0.4}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.12 }}
                />
              ) : null}
            </motion.g>
          );
        })}
      </svg>
    </VizFrame>
  );
}
