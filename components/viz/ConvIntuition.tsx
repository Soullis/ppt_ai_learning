"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

/**
 * Side-by-side: dense layer vs convolution on the same 6×6 patch.
 * Weight sharing and parameter count are the teaching goal.
 */
export function ConvIntuition({
  width = 640,
  height = 520,
}: {
  width?: number;
  height?: number;
}) {
  const N = 6;
  const cellPx = 26;
  const padX = 16;
  const padY = 12;
  const gap = 16;
  const panelW = (width - padX * 2 - gap) / 2;
  const gridSize = N * cellPx;
  const gridX = (panelW - gridSize) / 2;
  const gridY = 44;

  return (
    <VizFrame
      width={width}
      height={height}
      fit="fill"
      caption="dense layer: one weight per input pixel · convolution: one kernel reused at every position"
    >
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {/* Dense panel */}
        <g transform={`translate(${padX}, ${padY})`}>
          <rect width={panelW} height={height - padY * 2} rx={6} fill={COLORS.surface} stroke={COLORS.stroke} />
          <text
            x={panelW / 2}
            y={22}
            textAnchor="middle"
            fontSize={12}
            fontFamily="JetBrains Mono, monospace"
            fill={COLORS.muted}
            style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}
          >
            dense layer
          </text>

          <g transform={`translate(${gridX}, ${gridY})`}>
            {Array.from({ length: N * N }, (_, k) => {
              const r = Math.floor(k / N);
              const c = k % N;
              return (
                <rect
                  key={k}
                  x={c * cellPx}
                  y={r * cellPx}
                  width={cellPx - 2}
                  height={cellPx - 2}
                  rx={2}
                  fill={COLORS.ink}
                  fillOpacity={0.06 + (((c + r) % 4) / 4) * 0.45}
                  stroke={COLORS.stroke}
                />
              );
            })}
          </g>

          <circle
            cx={panelW - 36}
            cy={gridY + gridSize / 2}
            r={22}
            fill={COLORS.honey}
            fillOpacity={0.2}
            stroke={COLORS.honey}
            strokeWidth={1.5}
          />
          <text
            x={panelW - 36}
            y={gridY + gridSize / 2 + 5}
            textAnchor="middle"
            fontSize={15}
            fontFamily="JetBrains Mono, monospace"
            fill={COLORS.ink}
          >
            y
          </text>

          {Array.from({ length: N * N }, (_, k) => {
            const r = Math.floor(k / N);
            const c = k % N;
            const x1 = gridX + c * cellPx + cellPx / 2;
            const y1 = gridY + r * cellPx + cellPx / 2;
            return (
              <line
                key={k}
                x1={x1}
                y1={y1}
                x2={panelW - 58}
                y2={gridY + gridSize / 2}
                stroke={COLORS.accent}
                strokeOpacity={0.22}
                strokeWidth={1}
              />
            );
          })}

          <text x={16} y={height - padY * 2 - 72} fontSize={13} fill={COLORS.ink} fontFamily="JetBrains Mono, monospace">
            params = H · W · C
          </text>
          <text x={16} y={height - padY * 2 - 52} fontSize={13} fill={COLORS.ink} fontFamily="JetBrains Mono, monospace">
            = {N} · {N} · 1 = {N * N}
          </text>
          <text x={16} y={height - padY * 2 - 28} fontSize={12} fill={COLORS.muted}>
            every pixel has its own weight
          </text>
        </g>

        {/* Convolution panel */}
        <g transform={`translate(${padX + panelW + gap}, ${padY})`}>
          <rect width={panelW} height={height - padY * 2} rx={6} fill={COLORS.surface} stroke={COLORS.stroke} />
          <text
            x={panelW / 2}
            y={22}
            textAnchor="middle"
            fontSize={12}
            fontFamily="JetBrains Mono, monospace"
            fill={COLORS.muted}
            style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}
          >
            convolution
          </text>

          <g transform={`translate(${gridX}, ${gridY})`}>
            {Array.from({ length: N * N }, (_, k) => {
              const r = Math.floor(k / N);
              const c = k % N;
              return (
                <rect
                  key={k}
                  x={c * cellPx}
                  y={r * cellPx}
                  width={cellPx - 2}
                  height={cellPx - 2}
                  rx={2}
                  fill={COLORS.ink}
                  fillOpacity={0.06 + (((c + r) % 4) / 4) * 0.45}
                  stroke={COLORS.stroke}
                />
              );
            })}
            {[
              [0, 0],
              [1, 2],
              [3, 3],
            ].map(([r, c], i) => (
              <motion.rect
                key={i}
                x={c * cellPx}
                y={r * cellPx}
                width={cellPx * 3 - 2}
                height={cellPx * 3 - 2}
                rx={3}
                fill={COLORS.honey}
                fillOpacity={0.22}
                stroke={COLORS.honey}
                strokeWidth={2}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, delay: 0.15 + i * 0.15 }}
              />
            ))}
          </g>

          <g transform={`translate(${panelW - 78}, ${gridY + 8})`}>
            <text x={0} y={0} fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
              same 3×3 kernel
            </text>
            {[0, 1, 2].map((r) =>
              [0, 1, 2].map((c) => (
                <rect
                  key={`${r}-${c}`}
                  x={c * 18}
                  y={14 + r * 18}
                  width={16}
                  height={16}
                  rx={2}
                  fill={COLORS.honey}
                  fillOpacity={0.45}
                  stroke={COLORS.honey}
                />
              )),
            )}
          </g>

          <text x={16} y={height - padY * 2 - 72} fontSize={13} fill={COLORS.ink} fontFamily="JetBrains Mono, monospace">
            params = K · K · C
          </text>
          <text x={16} y={height - padY * 2 - 52} fontSize={13} fill={COLORS.ink} fontFamily="JetBrains Mono, monospace">
            = 3 · 3 · 1 = 9
          </text>
          <text x={16} y={height - padY * 2 - 28} fontSize={12} fill={COLORS.muted}>
            one kernel slides across the whole image
          </text>
        </g>
      </svg>
    </VizFrame>
  );
}
