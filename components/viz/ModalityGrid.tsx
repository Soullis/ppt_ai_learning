"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

function TabularViz() {
  const cols = 5;
  const rows = 4;
  const cells = Array.from({ length: cols * rows });
  return (
    <g transform="translate(0, 30)">
      {cells.map((_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        return (
          <rect
            key={i}
            x={c * 22}
            y={r * 22}
            width={20}
            height={20}
            rx={2}
            fill={COLORS.surface}
            stroke={COLORS.ink}
            strokeOpacity={0.35}
          />
        );
      })}
    </g>
  );
}

function ImageViz() {
  const N = 8;
  return (
    <g transform="translate(0, 25)">
      {Array.from({ length: N * N }, (_, i) => {
        const c = i % N;
        const r = Math.floor(i / N);
        const v = (Math.sin(c * 0.7) + Math.cos(r * 0.6)) * 0.5 + 0.5;
        return (
          <rect
            key={i}
            x={c * 13}
            y={r * 13}
            width={12}
            height={12}
            fill={COLORS.ink}
            fillOpacity={v}
          />
        );
      })}
    </g>
  );
}

function TextViz() {
  const tokens = ["the", "drone", "sees", "a", "gate"];
  return (
    <g transform="translate(0, 30)">
      {tokens.map((t, i) => (
        <g key={t} transform={`translate(0, ${i * 18})`}>
          <rect
            x={0}
            y={0}
            width={t.length * 10 + 8}
            height={14}
            rx={3}
            fill={COLORS.honey}
            fillOpacity={0.25}
            stroke={COLORS.honey}
          />
          <text x={4} y={11} fontSize={10} fontFamily="JetBrains Mono, monospace" fill={COLORS.ink}>
            {t}
          </text>
        </g>
      ))}
    </g>
  );
}

function AudioViz() {
  const N = 30;
  return (
    <g transform="translate(0, 50)">
      {Array.from({ length: N }, (_, i) => {
        const h = Math.abs(Math.sin(i * 0.6)) * 30 + 4 + (i % 3) * 4;
        return (
          <rect
            key={i}
            x={i * 4}
            y={-h / 2}
            width={2}
            height={h}
            fill={COLORS.accent}
            fillOpacity={0.7}
          />
        );
      })}
    </g>
  );
}

const MODES: {
  label: string;
  desc: string;
  shape: string;
  draw: () => JSX.Element;
}[] = [
  { label: "Tabular", desc: "rows × columns", shape: "(N, F)", draw: TabularViz },
  { label: "Image", desc: "pixels with channels", shape: "(H, W, C)", draw: ImageViz },
  { label: "Text", desc: "sequence of tokens", shape: "(T,)", draw: TextViz },
  { label: "Audio", desc: "waveform / spectrogram", shape: "(T,) or (F, T)", draw: AudioViz },
];

export function ModalityGrid({
  width = 880,
  height = 320,
}: {
  width?: number;
  height?: number;
}) {
  const padX = 30;
  const padY = 20;
  const cellW = (width - padX * 2) / MODES.length;

  return (
    <VizFrame width={width} height={height}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {MODES.map((m, i) => (
          <motion.g
            key={m.label}
            transform={`translate(${padX + i * cellW + 10}, ${padY})`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.15 }}
          >
            <text fontSize={13} fill={COLORS.ink}>
              {m.label}
            </text>
            <text
              y={16}
              fontSize={11}
              fontFamily="JetBrains Mono, monospace"
              fill={COLORS.muted}
              style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}
            >
              {m.shape}
            </text>
            <g transform="translate(0, 28)">{m.draw()}</g>
            <text y={height - padY * 2} fontSize={11} fill={COLORS.muted}>
              {m.desc}
            </text>
          </motion.g>
        ))}
      </svg>
    </VizFrame>
  );
}
