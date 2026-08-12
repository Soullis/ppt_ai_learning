"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

export type ArchEntry = {
  year: number;
  name: string;
  detail?: string;
  params?: string;
};

export function ArchTimeline({
  entries,
  width = 940,
  height = 320,
}: {
  entries: ArchEntry[];
  width?: number;
  height?: number;
}) {
  const padX = 40;
  const padY = 40;
  const stepW = (width - padX * 2) / entries.length;

  return (
    <VizFrame width={width} height={height}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        <line
          x1={padX}
          x2={width - padX}
          y1={height / 2}
          y2={height / 2}
          stroke={COLORS.ink}
          strokeOpacity={0.3}
        />
        {entries.map((e, i) => {
          const x = padX + i * stepW + stepW / 2;
          const isUp = i % 2 === 0;
          const ey = isUp ? height / 2 - 80 : height / 2 + 60;
          return (
            <motion.g
              key={e.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <line
                x1={x}
                x2={x}
                y1={height / 2}
                y2={ey + (isUp ? 30 : -10)}
                stroke={COLORS.ink}
                strokeOpacity={0.2}
                strokeDasharray="2 3"
              />
              <circle cx={x} cy={height / 2} r={4} fill={COLORS.honey} stroke={COLORS.surface} strokeWidth={2} />
              <text
                x={x}
                y={ey - (isUp ? 6 : -22)}
                textAnchor="middle"
                fontSize={11}
                fontFamily="JetBrains Mono, monospace"
                fill={COLORS.muted}
                style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}
              >
                {e.year}
              </text>
              <text x={x} y={ey + (isUp ? 12 : 0)} textAnchor="middle" fontSize={14} fill={COLORS.ink}>
                {e.name}
              </text>
              {e.detail ? (
                <text
                  x={x}
                  y={ey + (isUp ? 28 : 16)}
                  textAnchor="middle"
                  fontSize={11}
                  fill={COLORS.muted}
                >
                  {e.detail}
                </text>
              ) : null}
              {e.params ? (
                <text
                  x={x}
                  y={ey + (isUp ? 44 : 32)}
                  textAnchor="middle"
                  fontSize={11}
                  fontFamily="JetBrains Mono, monospace"
                  fill={COLORS.muted}
                >
                  {e.params}
                </text>
              ) : null}
            </motion.g>
          );
        })}
      </svg>
    </VizFrame>
  );
}
