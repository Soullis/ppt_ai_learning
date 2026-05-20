"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

/**
 * Side-by-side comparison: a fully-connected layer between an image and a
 * single output neuron versus a small convolution sliding the same kernel
 * across all locations. The point is to make the parameter count and the
 * weight-sharing visible.
 */
export function ConvIntuition({
  width = 980,
  height = 380,
}: {
  width?: number;
  height?: number;
}) {
  const N = 6; // image side
  const cellPx = 18;
  const padX = 30;
  const panelW = (width - padX * 3) / 2;
  const panelH = height - 30;

  return (
    <VizFrame width={width} height={height} caption="dense vs convolution — the same operation, different parameter budget">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {/* Left — dense */}
        <g transform={`translate(${padX}, 20)`}>
          <rect width={panelW} height={panelH} fill={COLORS.surface} stroke={COLORS.stroke} />
          <text
            x={14}
            y={20}
            fontSize={11}
            fontFamily="JetBrains Mono, monospace"
            fill={COLORS.muted}
            style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}
          >
            dense layer
          </text>
          {/* Image grid */}
          <g transform="translate(28, 60)">
            {Array.from({ length: N * N }, (_, k) => {
              const r = Math.floor(k / N);
              const c = k % N;
              return (
                <rect
                  key={k}
                  x={c * cellPx}
                  y={r * cellPx}
                  width={cellPx - 1}
                  height={cellPx - 1}
                  fill={COLORS.ink}
                  fillOpacity={0.05 + (((c + r) % 4) / 4) * 0.5}
                />
              );
            })}
          </g>
          {/* Output neuron */}
          <circle cx={panelW - 50} cy={120} r={18} fill={COLORS.honey} fillOpacity={0.18} stroke={COLORS.honey} strokeWidth={1.5} />
          <text x={panelW - 50} y={125} textAnchor="middle" fontSize={13} fontFamily="JetBrains Mono, monospace" fill={COLORS.ink}>
            y
          </text>
          {/* Lines from each pixel */}
          {Array.from({ length: N * N }, (_, k) => {
            const r = Math.floor(k / N);
            const c = k % N;
            const x1 = 28 + c * cellPx + cellPx / 2;
            const y1 = 60 + r * cellPx + cellPx / 2;
            return (
              <line
                key={k}
                x1={x1}
                y1={y1}
                x2={panelW - 60}
                y2={120}
                stroke={COLORS.accent}
                strokeOpacity={0.15}
              />
            );
          })}
          <text x={14} y={panelH - 56} fontSize={12} fill={COLORS.ink} fontFamily="JetBrains Mono, monospace">
            params per output = H · W · C = {N * N}
          </text>
          <text x={14} y={panelH - 36} fontSize={11} fill={COLORS.muted}>
            no spatial bias — must learn translation from scratch
          </text>
          <text x={14} y={panelH - 18} fontSize={11} fill={COLORS.muted}>
            for an HD image: millions of params per neuron
          </text>
        </g>

        {/* Right — convolution */}
        <g transform={`translate(${padX * 2 + panelW}, 20)`}>
          <rect width={panelW} height={panelH} fill={COLORS.surface} stroke={COLORS.stroke} />
          <text
            x={14}
            y={20}
            fontSize={11}
            fontFamily="JetBrains Mono, monospace"
            fill={COLORS.muted}
            style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}
          >
            convolution
          </text>
          {/* Image grid with one 3x3 kernel highlighted at three positions */}
          <g transform="translate(28, 60)">
            {Array.from({ length: N * N }, (_, k) => {
              const r = Math.floor(k / N);
              const c = k % N;
              return (
                <rect
                  key={k}
                  x={c * cellPx}
                  y={r * cellPx}
                  width={cellPx - 1}
                  height={cellPx - 1}
                  fill={COLORS.ink}
                  fillOpacity={0.05 + (((c + r) % 4) / 4) * 0.5}
                />
              );
            })}
            {/* kernel highlights */}
            {[
              [0, 0],
              [1, 2],
              [3, 3],
            ].map(([r, c], i) => (
              <motion.rect
                key={i}
                x={c * cellPx}
                y={r * cellPx}
                width={cellPx * 3}
                height={cellPx * 3}
                fill={COLORS.honey}
                fillOpacity={0.18}
                stroke={COLORS.honey}
                strokeWidth={1.4}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.2 }}
              />
            ))}
          </g>
          {/* Kernel label */}
          <g transform={`translate(${panelW - 110}, 90)`}>
            <text x={0} y={0} fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
              same 3×3 kernel
            </text>
            <text x={0} y={16} fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
              applied everywhere
            </text>
            <g transform="translate(0, 26)">
              {[0, 1, 2].map((r) => (
                <g key={r}>
                  {[0, 1, 2].map((c) => (
                    <rect
                      key={c}
                      x={c * 14}
                      y={r * 14}
                      width={12}
                      height={12}
                      fill={COLORS.honey}
                      fillOpacity={0.4}
                      stroke={COLORS.honey}
                    />
                  ))}
                </g>
              ))}
            </g>
          </g>
          <text x={14} y={panelH - 56} fontSize={12} fill={COLORS.ink} fontFamily="JetBrains Mono, monospace">
            params per filter = K · K · C = 9
          </text>
          <text x={14} y={panelH - 36} fontSize={11} fill={COLORS.muted}>
            translation-equivariant — pattern detected anywhere
          </text>
          <text x={14} y={panelH - 18} fontSize={11} fill={COLORS.muted}>
            ~10⁵× fewer parameters than the dense equivalent
          </text>
        </g>
      </svg>
    </VizFrame>
  );
}
