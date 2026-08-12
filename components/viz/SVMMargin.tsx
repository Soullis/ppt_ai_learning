"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

/**
 * 2D scatter with a separating hyperplane and explicit margin lines. The
 * support vectors (points sitting on the margin) are highlighted.
 */
export function SVMMargin({
  width = 720,
  height = 420,
}: {
  width?: number;
  height?: number;
}) {
  const padX = 40;
  const padY = 30;
  const sx = (x: number) => padX + x * (width - padX * 2);
  const sy = (y: number) => height - padY - y * (height - padY * 2);

  // Two clusters of points, well separated
  const class0 = [
    [0.18, 0.32], [0.22, 0.46], [0.30, 0.30], [0.36, 0.5], [0.28, 0.62],
    [0.40, 0.28], [0.16, 0.54], [0.32, 0.74], [0.44, 0.40], [0.24, 0.22],
  ];
  const class1 = [
    [0.62, 0.74], [0.70, 0.62], [0.78, 0.50], [0.74, 0.86], [0.66, 0.92],
    [0.84, 0.66], [0.58, 0.58], [0.92, 0.74], [0.80, 0.34], [0.68, 0.46],
  ];

  // Hyperplane: y = -x + 1 (slope -1, intercept 1) → normal (1, 1)/sqrt(2)
  // Decision line passes through (0, 1) and (1, 0).
  // Margin offset perpendicular to normal.
  const margin = 0.15;
  const support = [
    [0.40, 0.40], // class 0 on left margin (≈ x+y = 0.85)
    [0.30, 0.55],
    [0.62, 0.55], // class 1 on right margin (≈ x+y = 1.15)
    [0.55, 0.62],
  ];

  return (
    <VizFrame width={width} height={height} caption="maximum-margin separation; circled points are support vectors">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        <rect width={width} height={height} fill={COLORS.surface} />
        <line x1={padX} x2={width - padX} y1={sy(0)} y2={sy(0)} stroke={COLORS.ink} strokeOpacity={0.3} />
        <line x1={sx(0)} x2={sx(0)} y1={sy(0)} y2={sy(1)} stroke={COLORS.ink} strokeOpacity={0.3} />

        {/* Margin band fill */}
        <motion.path
          d={`M ${sx(0)},${sy(1 + margin)} L ${sx(1 + margin)},${sy(0)} L ${sx(1 - margin)},${sy(0)} L ${sx(0)},${sy(1 - margin)} Z`}
          fill={COLORS.honey}
          fillOpacity={0.12}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />

        {/* Decision boundary */}
        <motion.line
          x1={sx(0)}
          y1={sy(1)}
          x2={sx(1)}
          y2={sy(0)}
          stroke={COLORS.ink}
          strokeWidth={1.6}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7 }}
        />
        {/* Margin lines */}
        <motion.line
          x1={sx(0)}
          y1={sy(1 - margin)}
          x2={sx(1 - margin)}
          y2={sy(0)}
          stroke={COLORS.ink}
          strokeOpacity={0.5}
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        />
        <motion.line
          x1={sx(0)}
          y1={sy(1 + margin)}
          x2={sx(1 + margin)}
          y2={sy(0)}
          stroke={COLORS.ink}
          strokeOpacity={0.5}
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        />

        {/* Points */}
        {class0.map(([x, y], i) => (
          <circle key={`a-${i}`} cx={sx(x)} cy={sy(y)} r={3.5} fill={COLORS.accent} />
        ))}
        {class1.map(([x, y], i) => (
          <circle key={`b-${i}`} cx={sx(x)} cy={sy(y)} r={3.5} fill={COLORS.honey} />
        ))}
        {/* Support vectors */}
        {support.map(([x, y], i) => (
          <motion.circle
            key={`s-${i}`}
            cx={sx(x)}
            cy={sy(y)}
            r={9}
            fill="none"
            stroke={COLORS.ink}
            strokeWidth={1.5}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
          />
        ))}

        {/* Labels */}
        <text x={sx(0.05)} y={sy(0.05)} fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.accent}>
          class −1
        </text>
        <text x={sx(0.78)} y={sy(0.95)} fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.honey}>
          class +1
        </text>
        <text x={sx(0.5) + 30} y={sy(0.5) - 8} fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
          w·x + b = 0
        </text>
      </svg>
    </VizFrame>
  );
}
