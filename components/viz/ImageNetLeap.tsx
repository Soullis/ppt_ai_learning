"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

/**
 * ILSVRC top-5 error rates on ImageNet, year by year. Numbers from the
 * official ILSVRC competition leaderboards.
 *
 *   2010  NEC                          28.2 %
 *   2011  XRCE                         25.8 %
 *   2012  AlexNet (Krizhevsky)         16.4 %  ← deep learning arrives
 *   2013  ZFNet (Zeiler & Fergus)      11.7 %
 *   2014  GoogLeNet                     6.7 %
 *   2015  ResNet (He et al.)            3.6 %  ← surpasses human
 *   2016  ResNeXt / Trimps              3.0 %
 *   2017  SENet (Hu et al.)             2.3 %
 */
const ROWS: { year: number; name: string; err: number; emphasis?: boolean }[] = [
  { year: 2010, name: "NEC", err: 28.2 },
  { year: 2011, name: "XRCE", err: 25.8 },
  { year: 2012, name: "AlexNet", err: 16.4, emphasis: true },
  { year: 2013, name: "ZFNet", err: 11.7 },
  { year: 2014, name: "GoogLeNet", err: 6.7 },
  { year: 2015, name: "ResNet", err: 3.6, emphasis: true },
  { year: 2016, name: "ResNeXt", err: 3.0 },
  { year: 2017, name: "SENet", err: 2.3 },
];

const HUMAN_BASELINE = 5.1;

export function ImageNetLeap({
  width = 920,
  height = 420,
}: {
  width?: number;
  height?: number;
}) {
  const padX = 70;
  const padY = 60;
  const innerW = width - padX * 2;
  const innerH = height - padY - 70;
  const stepW = innerW / ROWS.length;
  const yMax = 30;
  const sy = (v: number) => padY + (1 - v / yMax) * innerH;

  return (
    <VizFrame width={width} height={height} caption="ImageNet top-5 error · ILSVRC 2010 – 2017">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {/* Y-axis */}
        <line x1={padX} x2={padX} y1={padY} y2={padY + innerH} stroke={COLORS.ink} strokeOpacity={0.4} />
        <line x1={padX} x2={padX + innerW} y1={padY + innerH} y2={padY + innerH} stroke={COLORS.ink} strokeOpacity={0.4} />
        {[0, 5, 10, 15, 20, 25, 30].map((v) => (
          <g key={v}>
            <line x1={padX} x2={padX + innerW} y1={sy(v)} y2={sy(v)} stroke={COLORS.stroke} />
            <text x={padX - 8} y={sy(v) + 4} textAnchor="end" fontSize={10} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
              {v}%
            </text>
          </g>
        ))}

        {/* Human baseline */}
        <motion.line
          x1={padX}
          x2={padX + innerW}
          y1={sy(HUMAN_BASELINE)}
          y2={sy(HUMAN_BASELINE)}
          stroke={COLORS.honey}
          strokeWidth={1.4}
          strokeDasharray="6 5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        />
        <motion.text
          x={padX + innerW - 8}
          y={sy(HUMAN_BASELINE) - 6}
          textAnchor="end"
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.honey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          human ≈ {HUMAN_BASELINE}%
        </motion.text>

        {/* Bars */}
        {ROWS.map((r, i) => {
          const cx = padX + i * stepW + stepW / 2;
          const barW = Math.min(40, stepW - 14);
          const barX = cx - barW / 2;
          const barTop = sy(r.err);
          const color = r.emphasis ? COLORS.ink : COLORS.accent;
          return (
            <motion.g
              key={r.year}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
            >
              <motion.rect
                x={barX}
                width={barW}
                fill={color}
                fillOpacity={r.emphasis ? 0.85 : 0.45}
                stroke={color}
                strokeWidth={1}
                initial={{ y: padY + innerH, height: 0 }}
                animate={{ y: barTop, height: padY + innerH - barTop }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.07, ease: [0.22, 0.61, 0.36, 1] }}
              />
              <text
                x={cx}
                y={barTop - 8}
                textAnchor="middle"
                fontSize={11}
                fontFamily="JetBrains Mono, monospace"
                fill={COLORS.ink}
              >
                {r.err.toFixed(1)}
              </text>
              <text
                x={cx}
                y={padY + innerH + 18}
                textAnchor="middle"
                fontSize={11}
                fontFamily="JetBrains Mono, monospace"
                fill={COLORS.muted}
              >
                {r.year}
              </text>
              <text
                x={cx}
                y={padY + innerH + 34}
                textAnchor="middle"
                fontSize={11}
                fill={r.emphasis ? COLORS.ink : COLORS.muted}
              >
                {r.name}
              </text>
            </motion.g>
          );
        })}
        <text
          x={width / 2}
          y={height - 16}
          textAnchor="middle"
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
        >
          AlexNet (2012) cuts error in half · ResNet (2015) crosses the human baseline
        </text>
      </svg>
    </VizFrame>
  );
}
