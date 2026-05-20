"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

const ROWS = [
  { precision: "FP32", size: 1.0, latency: 1.0, accuracy: 1.0 },
  { precision: "FP16", size: 0.5, latency: 0.55, accuracy: 0.997 },
  { precision: "INT8", size: 0.25, latency: 0.32, accuracy: 0.984 },
];

export function QuantizationBar({
  width = 720,
  height = 380,
}: {
  width?: number;
  height?: number;
}) {
  const padX = 100;
  const rowH = 70;
  const offsetY = 60;
  const innerW = width - padX * 1.2 - 40;

  return (
    <VizFrame width={width} height={height} caption="quantisation tradeoffs · normalised to FP32">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        <text
          x={padX}
          y={offsetY - 18}
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
          style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}
        >
          model size · latency · accuracy
        </text>
        {ROWS.map((r, i) => {
          const y = offsetY + i * rowH;
          return (
            <g key={r.precision}>
              <text x={padX - 16} y={y + 16} textAnchor="end" fontSize={13} fill={COLORS.ink} fontFamily="JetBrains Mono, monospace">
                {r.precision}
              </text>
              {[
                { v: r.size, color: COLORS.accent, label: "size" },
                { v: r.latency, color: COLORS.honey, label: "latency" },
                { v: r.accuracy, color: COLORS.green, label: "accuracy" },
              ].map((m, j) => (
                <motion.g
                  key={m.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: (i * 3 + j) * 0.1 }}
                >
                  <rect
                    x={padX}
                    y={y + j * 14}
                    width={innerW}
                    height={10}
                    fill={COLORS.bone}
                    stroke={COLORS.stroke}
                  />
                  <motion.rect
                    x={padX}
                    y={y + j * 14}
                    height={10}
                    fill={m.color}
                    fillOpacity={0.55}
                    initial={{ width: 0 }}
                    animate={{ width: m.v * innerW }}
                    transition={{ duration: 0.7, delay: (i * 3 + j) * 0.1 }}
                  />
                  <text
                    x={padX + innerW + 6}
                    y={y + j * 14 + 9}
                    fontSize={10}
                    fill={COLORS.muted}
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {m.label}: {(m.v * 100).toFixed(0)}%
                  </text>
                </motion.g>
              ))}
            </g>
          );
        })}
      </svg>
    </VizFrame>
  );
}
