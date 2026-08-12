"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

/**
 * Schematic adaptation of Figure 1 from "Deep Residual Learning" (He 2015):
 * a plain (no-skip) network gets *worse* as depth grows past ≈ 30 layers,
 * while a residual network keeps improving.
 */
export function ResNetDepth({
  width = 760,
  height = 420,
}: {
  width?: number;
  height?: number;
}) {
  const padX = 70;
  const padY = 60;
  const innerW = width - padX * 2;
  const innerH = height - padY - 60;
  const xMax = 160;
  const yMax = 14;
  const sx = (x: number) => padX + (x / xMax) * innerW;
  const sy = (y: number) => padY + (1 - y / yMax) * innerH;

  // Synthetic but qualitatively faithful shapes.
  const depths = [18, 34, 50, 100, 152];
  const plain = [9.0, 9.8, 10.7, 12.2, 13.4];
  const resnet = [8.4, 7.6, 6.5, 5.6, 5.1];

  const plainPath = `M ${depths.map((d, i) => `${sx(d)},${sy(plain[i])}`).join(" L ")}`;
  const resnetPath = `M ${depths.map((d, i) => `${sx(d)},${sy(resnet[i])}`).join(" L ")}`;

  return (
    <VizFrame width={width} height={height} caption="ImageNet test error · plain vs residual networks">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {/* Axes */}
        <line x1={padX} x2={padX} y1={padY} y2={padY + innerH} stroke={COLORS.ink} strokeOpacity={0.4} />
        <line x1={padX} x2={padX + innerW} y1={padY + innerH} y2={padY + innerH} stroke={COLORS.ink} strokeOpacity={0.4} />
        {[2, 4, 6, 8, 10, 12, 14].map((v) => (
          <g key={v}>
            <line x1={padX} x2={padX + innerW} y1={sy(v)} y2={sy(v)} stroke={COLORS.stroke} />
            <text x={padX - 8} y={sy(v) + 4} textAnchor="end" fontSize={10} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
              {v}%
            </text>
          </g>
        ))}
        {[18, 34, 50, 100, 152].map((d) => (
          <text
            key={d}
            x={sx(d)}
            y={padY + innerH + 16}
            textAnchor="middle"
            fontSize={11}
            fontFamily="JetBrains Mono, monospace"
            fill={COLORS.muted}
          >
            {d}
          </text>
        ))}
        <text
          x={padX + innerW / 2}
          y={padY + innerH + 38}
          textAnchor="middle"
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
          style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}
        >
          depth (layers)
        </text>
        <text
          x={padX - 38}
          y={padY + innerH / 2}
          textAnchor="middle"
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
          style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}
          transform={`rotate(-90, ${padX - 38}, ${padY + innerH / 2})`}
        >
          test error
        </text>

        <motion.path
          d={plainPath}
          fill="none"
          stroke={COLORS.red}
          strokeWidth={1.8}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2 }}
        />
        <motion.path
          d={resnetPath}
          fill="none"
          stroke={COLORS.green}
          strokeWidth={1.8}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        />

        {depths.map((d, i) => (
          <g key={`pts-${d}`}>
            <circle cx={sx(d)} cy={sy(plain[i])} r={4} fill={COLORS.red} />
            <circle cx={sx(d)} cy={sy(resnet[i])} r={4} fill={COLORS.green} />
          </g>
        ))}

        {/* Legend */}
        <g transform={`translate(${padX + innerW - 200}, ${padY})`}>
          <line x1={0} x2={20} y1={6} y2={6} stroke={COLORS.red} strokeWidth={1.8} />
          <text x={26} y={10} fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.ink}>
            plain — gets worse with depth
          </text>
          <line x1={0} x2={20} y1={26} y2={26} stroke={COLORS.green} strokeWidth={1.8} />
          <text x={26} y={30} fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.ink}>
            residual — keeps improving
          </text>
        </g>

        <text
          x={width / 2}
          y={height - 16}
          textAnchor="middle"
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
        >
          schematic adaptation of He et al. 2015, Figure 1
        </text>
      </svg>
    </VizFrame>
  );
}
