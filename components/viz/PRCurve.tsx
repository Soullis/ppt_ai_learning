"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

function genCurve(ap: number) {
  const N = 80;
  const pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const r = i / (N - 1);
    const p = Math.max(0, Math.min(1, 1 - (1 - ap) * Math.pow(r, 1.6) - r * 0.05));
    pts.push([r, p]);
  }
  return pts;
}

export function PRCurve({
  width = 720,
  height = 460,
  classes = [
    { name: "gate", ap: 0.92, color: COLORS.accent },
    { name: "drone", ap: 0.78, color: COLORS.honey },
    { name: "post", ap: 0.65, color: COLORS.green },
  ],
}: {
  width?: number;
  height?: number;
  classes?: { name: string; ap: number; color: string }[];
}) {
  const padX = 60;
  const padY = 50;
  const sx = (x: number) => padX + x * (width - padX * 2);
  const sy = (y: number) => height - padY - y * (height - padY * 2);

  return (
    <VizFrame width={width} height={height} caption="precision–recall curves · area under = AP">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        <line x1={padX} x2={width - padX} y1={height - padY} y2={height - padY} stroke={COLORS.ink} strokeOpacity={0.4} />
        <line x1={padX} x2={padX} y1={padY} y2={height - padY} stroke={COLORS.ink} strokeOpacity={0.4} />
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <g key={g}>
            <line x1={sx(g)} x2={sx(g)} y1={padY} y2={height - padY} stroke={COLORS.stroke} />
            <text x={sx(g)} y={height - padY + 16} textAnchor="middle" fontSize={10} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
              {g.toFixed(2)}
            </text>
            <line x1={padX} x2={width - padX} y1={sy(g)} y2={sy(g)} stroke={COLORS.stroke} />
            <text x={padX - 8} y={sy(g) + 4} textAnchor="end" fontSize={10} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
              {g.toFixed(2)}
            </text>
          </g>
        ))}
        <text
          x={(padX + (width - padX)) / 2}
          y={height - padY + 30}
          textAnchor="middle"
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
          style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}
        >
          recall
        </text>
        <text
          x={padX - 32}
          y={(padY + (height - padY)) / 2}
          textAnchor="middle"
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
          style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}
          transform={`rotate(-90, ${padX - 32}, ${(padY + (height - padY)) / 2})`}
        >
          precision
        </text>
        {classes.map((c, i) => {
          const pts = genCurve(c.ap);
          const path = `M ${pts.map((p) => `${sx(p[0])},${sy(p[1])}`).join(" L ")}`;
          return (
            <motion.path
              key={c.name}
              d={path}
              fill="none"
              stroke={c.color}
              strokeWidth={1.75}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: i * 0.2 }}
            />
          );
        })}
        {/* Legend */}
        <g transform={`translate(${width - 200}, ${padY + 6})`}>
          {classes.map((c, i) => (
            <g key={c.name} transform={`translate(0, ${i * 20})`}>
              <line x1={0} x2={20} y1={6} y2={6} stroke={c.color} strokeWidth={1.6} />
              <text x={28} y={9} fontSize={12} fontFamily="JetBrains Mono, monospace" fill={COLORS.ink}>
                {c.name}
              </text>
              <text x={120} y={9} fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
                AP {c.ap.toFixed(2)}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </VizFrame>
  );
}
