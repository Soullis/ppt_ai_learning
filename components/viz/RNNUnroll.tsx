"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

/** RNN cell unrolled across 4 time steps with shared weights highlighted. */
export function RNNUnroll({
  width = 920,
  height = 340,
}: {
  width?: number;
  height?: number;
}) {
  const T = 4;
  const padX = 70;
  const stepW = (width - padX * 2) / T;
  const cellY = height / 2;

  return (
    <VizFrame width={width} height={height} caption="recurrent network unrolled — same weights W reused at every time step">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {Array.from({ length: T }, (_, t) => {
          const cx = padX + t * stepW + stepW / 2;
          return (
            <motion.g
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: t * 0.15 }}
            >
              {/* Cell */}
              <rect
                x={cx - 38}
                y={cellY - 28}
                width={76}
                height={56}
                rx={6}
                fill={COLORS.surface}
                stroke={COLORS.ink}
                strokeOpacity={0.5}
              />
              <text x={cx} y={cellY + 5} textAnchor="middle" fontSize={14} fill={COLORS.ink} fontFamily="JetBrains Mono, monospace">
                h_{t}
              </text>
              {/* Input arrow from below */}
              <line x1={cx} x2={cx} y1={cellY + 70} y2={cellY + 30} stroke={COLORS.accent} strokeOpacity={0.7} />
              <text x={cx} y={cellY + 88} textAnchor="middle" fontSize={12} fontFamily="JetBrains Mono, monospace" fill={COLORS.accent}>
                x_{t}
              </text>
              {/* Output arrow above */}
              <line x1={cx} x2={cx} y1={cellY - 30} y2={cellY - 70} stroke={COLORS.honey} strokeOpacity={0.7} />
              <text x={cx} y={cellY - 80} textAnchor="middle" fontSize={12} fontFamily="JetBrains Mono, monospace" fill={COLORS.honey}>
                y_{t}
              </text>
              {/* Recurrent edge to next cell */}
              {t < T - 1 ? (
                <g>
                  <line
                    x1={cx + 38}
                    x2={cx + stepW - 38}
                    y1={cellY}
                    y2={cellY}
                    stroke={COLORS.ink}
                    strokeOpacity={0.6}
                    strokeWidth={1.4}
                  />
                  <text
                    x={cx + stepW / 2}
                    y={cellY - 8}
                    textAnchor="middle"
                    fontSize={11}
                    fontFamily="JetBrains Mono, monospace"
                    fill={COLORS.muted}
                  >
                    W
                  </text>
                </g>
              ) : null}
            </motion.g>
          );
        })}
        <text
          x={width / 2}
          y={height - 12}
          textAnchor="middle"
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
        >
          h_t = φ(W_x x_t + W_h h_(t-1) + b) · LSTM / GRU gate this recurrence
        </text>
      </svg>
    </VizFrame>
  );
}
