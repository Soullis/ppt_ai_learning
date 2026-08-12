"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

type Stage = {
  label: string;
  shape: string;
  kind: "input" | "conv" | "pool" | "fc" | "out";
  // Visual hints — height of the box, "depth" rectangles count
  size: number;
  channels: number;
};

const STAGES: Stage[] = [
  { label: "input", shape: "32×32×1", kind: "input", size: 96, channels: 1 },
  { label: "C1 · 5×5 conv", shape: "28×28×6", kind: "conv", size: 86, channels: 6 },
  { label: "S2 · 2×2 pool", shape: "14×14×6", kind: "pool", size: 60, channels: 6 },
  { label: "C3 · 5×5 conv", shape: "10×10×16", kind: "conv", size: 50, channels: 12 },
  { label: "S4 · 2×2 pool", shape: "5×5×16", kind: "pool", size: 30, channels: 12 },
  { label: "C5 · fc-conv", shape: "1×1×120", kind: "conv", size: 18, channels: 18 },
  { label: "F6 · dense", shape: "84", kind: "fc", size: 12, channels: 16 },
  { label: "output · softmax", shape: "10 classes", kind: "out", size: 10, channels: 10 },
];

const COLOR_OF: Record<Stage["kind"], string> = {
  input: COLORS.ink,
  conv: COLORS.accent,
  pool: COLORS.green,
  fc: COLORS.honey,
  out: COLORS.red,
};

export function LeNetArchitecture({
  width = 1040,
  height = 380,
}: {
  width?: number;
  height?: number;
}) {
  const padX = 30;
  const stepW = (width - padX * 2) / STAGES.length;
  const cy = height / 2;

  return (
    <VizFrame width={width} height={height} caption="LeNet-5 · LeCun et al. 1998 — the first practical CNN">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {STAGES.map((s, i) => {
          const cx = padX + i * stepW + stepW / 2;
          const sliceW = Math.max(6, s.size * 0.4);
          return (
            <motion.g
              key={s.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              {/* Stack of "feature maps": draw `channels` overlapping rectangles */}
              {Array.from({ length: Math.min(6, Math.ceil(s.channels / 3)) }, (_, k) => (
                <rect
                  key={k}
                  x={cx - sliceW / 2 + k * 3}
                  y={cy - s.size / 2 + k * 3}
                  width={sliceW}
                  height={s.size}
                  fill={COLOR_OF[s.kind]}
                  fillOpacity={0.18 + k * 0.05}
                  stroke={COLOR_OF[s.kind]}
                  strokeWidth={1}
                />
              ))}
              {/* Top label */}
              <text
                x={cx}
                y={cy - s.size / 2 - 18}
                textAnchor="middle"
                fontSize={11}
                fontFamily="JetBrains Mono, monospace"
                fill={COLORS.muted}
                style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}
              >
                {s.label}
              </text>
              {/* Bottom shape */}
              <text
                x={cx}
                y={cy + s.size / 2 + 18}
                textAnchor="middle"
                fontSize={11}
                fontFamily="JetBrains Mono, monospace"
                fill={COLORS.ink}
              >
                {s.shape}
              </text>
              {/* Connecting arrow */}
              {i < STAGES.length - 1 ? (
                <motion.line
                  x1={cx + sliceW / 2 + 12}
                  x2={cx + stepW - sliceW / 2 - 8}
                  y1={cy}
                  y2={cy}
                  stroke={COLORS.ink}
                  strokeOpacity={0.4}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
                />
              ) : null}
            </motion.g>
          );
        })}
        <text
          x={width / 2}
          y={height - 14}
          textAnchor="middle"
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
        >
          spatial size shrinks · channels grow · ≈ 60 K parameters
        </text>
      </svg>
    </VizFrame>
  );
}
