"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

export type TimelineEvent = {
  year: number;
  label: string;
  detail?: string;
  emphasis?: boolean;
};

/**
 * Equal-spaced events along a horizontal axis. We do not place by year (that
 * over-crowds the modern era). The year is shown above the dot; the label and
 * detail alternate above / below to avoid collisions.
 */
export function Timeline({
  events,
  width = 940,
  height = 320,
}: {
  events: TimelineEvent[];
  width?: number;
  height?: number;
}) {
  const padX = 60;
  const stepW = (width - padX * 2) / Math.max(events.length - 1, 1);
  const axisY = height / 2;

  return (
    <VizFrame width={width} height={height}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        <motion.line
          x1={padX}
          x2={width - padX}
          y1={axisY}
          y2={axisY}
          stroke={COLORS.ink}
          strokeOpacity={0.4}
          strokeWidth={1}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
        />
        {events.map((e, i) => {
          const isUp = i % 2 === 0;
          const ex = padX + i * stepW;
          const blockY = isUp ? axisY - 78 : axisY + 50;
          return (
            <motion.g
              key={`${e.year}-${e.label}`}
              initial={{ opacity: 0, y: isUp ? -4 : 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
            >
              <line
                x1={ex}
                x2={ex}
                y1={axisY}
                y2={blockY + (isUp ? 50 : -10)}
                stroke={COLORS.ink}
                strokeOpacity={0.2}
                strokeDasharray="2 3"
              />
              <circle
                cx={ex}
                cy={axisY}
                r={e.emphasis ? 5.5 : 3.5}
                fill={e.emphasis ? COLORS.honey : COLORS.ink}
                stroke={COLORS.surface}
                strokeWidth={2}
              />
              <text
                x={ex}
                y={blockY}
                textAnchor="middle"
                fontSize={11}
                fontFamily="JetBrains Mono, monospace"
                fill={COLORS.muted}
                style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}
              >
                {e.year}
              </text>
              <text
                x={ex}
                y={blockY + 18}
                textAnchor="middle"
                fontSize={13}
                fill={COLORS.ink}
              >
                {e.label}
              </text>
              {e.detail ? (
                <text
                  x={ex}
                  y={blockY + 34}
                  textAnchor="middle"
                  fontSize={11}
                  fill={COLORS.muted}
                >
                  {e.detail}
                </text>
              ) : null}
            </motion.g>
          );
        })}
      </svg>
    </VizFrame>
  );
}
