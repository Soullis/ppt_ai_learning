"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

const FUNCS = [
  {
    name: "Sigmoid",
    color: COLORS.accent,
    f: (x: number) => 1 / (1 + Math.exp(-x)),
    formula: "\\sigma(x) = 1/(1+e^{-x})",
  },
  {
    name: "Tanh",
    color: COLORS.green,
    f: (x: number) => Math.tanh(x),
    formula: "\\tanh(x)",
  },
  {
    name: "ReLU",
    color: COLORS.honey,
    f: (x: number) => Math.max(0, x),
    formula: "\\max(0, x)",
  },
  {
    name: "GELU",
    color: COLORS.red,
    f: (x: number) =>
      0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3))),
    formula: "x\\cdot\\Phi(x)",
  },
];

export function ActivationsPlot({
  width = 720,
  height = 420,
}: {
  width?: number;
  height?: number;
}) {
  const padX = 60;
  const padY = 50;
  const xMin = -4;
  const xMax = 4;
  const yMin = -1.2;
  const yMax = 2.5;
  const sx = (x: number) => padX + ((x - xMin) / (xMax - xMin)) * (width - padX * 2);
  const sy = (y: number) => height - padY - ((y - yMin) / (yMax - yMin)) * (height - padY * 2);

  const xs = Array.from({ length: 200 }, (_, i) => xMin + ((xMax - xMin) * i) / 199);

  return (
    <VizFrame width={width} height={height}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {/* Axes */}
        <line x1={padX} x2={width - padX} y1={sy(0)} y2={sy(0)} stroke={COLORS.ink} strokeOpacity={0.3} />
        <line x1={sx(0)} x2={sx(0)} y1={padY} y2={height - padY} stroke={COLORS.ink} strokeOpacity={0.3} />
        {FUNCS.map((F, i) => (
          <motion.path
            key={F.name}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.0, delay: i * 0.2 }}
            d={`M ${xs.map((x) => `${sx(x)},${sy(F.f(x))}`).join(" L ")}`}
            fill="none"
            stroke={F.color}
            strokeWidth={1.75}
          />
        ))}
        {/* Legend */}
        <g transform={`translate(${width - padX - 130}, ${padY + 6})`}>
          {FUNCS.map((F, i) => (
            <g key={`leg-${F.name}`} transform={`translate(0, ${i * 22})`}>
              <line x1={0} x2={20} y1={6} y2={6} stroke={F.color} strokeWidth={1.75} />
              <text x={28} y={9} fontSize={12} fill={COLORS.ink}>
                {F.name}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </VizFrame>
  );
}
