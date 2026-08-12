"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

type ModalityKey = "tabular" | "image" | "text" | "audio" | "video";

const W_DEFAULT = 1040;
const H_DEFAULT = 460;

const MODS: { key: ModalityKey; title: string; shape: string; example: string }[] = [
  { key: "tabular", title: "Tabular", shape: "(N, F)", example: "rows × features · sensor logs, telemetry" },
  { key: "image", title: "Image", shape: "(H, W, C)", example: "pixels × channels · drone camera frame" },
  { key: "text", title: "Text", shape: "(T,)", example: "sequence of tokens · radio chatter" },
  { key: "audio", title: "Audio", shape: "(T,)  ·  (F, T)", example: "waveform → spectrogram · motor sounds" },
  { key: "video", title: "Video", shape: "(T, H, W, C)", example: "frames over time · flight footage" },
];

function Tabular({ w, h }: { w: number; h: number }) {
  const rows = 5;
  const cols = 4;
  const cellW = (w - 24) / cols;
  const cellH = (h - 30) / rows;
  return (
    <g transform="translate(12, 22)">
      {Array.from({ length: rows * cols }, (_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const v = ((c * 31 + r * 17) % 9) / 9;
        return (
          <g key={i}>
            <rect
              x={c * cellW}
              y={r * cellH}
              width={cellW - 2}
              height={cellH - 2}
              fill={COLORS.bone}
              stroke={COLORS.stroke}
            />
            <text
              x={c * cellW + cellW / 2}
              y={r * cellH + cellH / 2 + 3}
              textAnchor="middle"
              fontSize={10}
              fontFamily="JetBrains Mono, monospace"
              fill={COLORS.muted}
            >
              {v.toFixed(2)}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function ImageMod({ w, h }: { w: number; h: number }) {
  const N = 10;
  const cellW = (w - 24) / N;
  const cellH = (h - 30) / N;
  return (
    <g transform="translate(12, 22)">
      {Array.from({ length: N * N }, (_, i) => {
        const r = Math.floor(i / N);
        const c = i % N;
        const cx = N / 2;
        const cy = N / 2;
        const dist = Math.sqrt((c - cx) ** 2 + (r - cy) ** 2);
        const v = Math.max(0, 1 - dist / (N * 0.6));
        return (
          <rect
            key={i}
            x={c * cellW}
            y={r * cellH}
            width={cellW}
            height={cellH}
            fill={COLORS.ink}
            fillOpacity={0.05 + v * 0.85}
          />
        );
      })}
    </g>
  );
}

function TextMod({ w }: { w: number; h: number }) {
  const tokens = ["the", "drone", "approaches", "a", "yellow", "gate"];
  const ids = [102, 451, 9882, 19, 6022, 309];
  return (
    <g transform="translate(12, 22)">
      {tokens.map((t, i) => {
        const px = (i % 3) * ((w - 24) / 3);
        const py = Math.floor(i / 3) * 40;
        return (
          <g key={t} transform={`translate(${px}, ${py})`}>
            <rect
              x={0}
              y={0}
              width={(w - 24) / 3 - 8}
              height={32}
              rx={4}
              fill={COLORS.honey}
              fillOpacity={0.15}
              stroke={COLORS.honey}
            />
            <text
              x={8}
              y={13}
              fontSize={11}
              fontFamily="JetBrains Mono, monospace"
              fill={COLORS.ink}
            >
              {t}
            </text>
            <text
              x={8}
              y={26}
              fontSize={9}
              fontFamily="JetBrains Mono, monospace"
              fill={COLORS.muted}
            >
              id {ids[i]}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function AudioMod({ w, h }: { w: number; h: number }) {
  const N = 36;
  const innerW = w - 24;
  const innerH = h - 30;
  const cy = 22 + innerH / 2;
  return (
    <g>
      <line
        x1={12}
        x2={12 + innerW}
        y1={cy}
        y2={cy}
        stroke={COLORS.stroke}
      />
      {Array.from({ length: N }, (_, i) => {
        const phase = (i / N) * Math.PI * 4;
        const env = 1 - Math.abs(i / N - 0.5) * 1.4;
        const a = Math.sin(phase) * 0.6 * Math.max(0.1, env);
        const x = 12 + (i / (N - 1)) * innerW;
        const len = a * (innerH * 0.4);
        return (
          <line
            key={i}
            x1={x}
            x2={x}
            y1={cy - len}
            y2={cy + len}
            stroke={COLORS.accent}
            strokeWidth={1.2}
          />
        );
      })}
    </g>
  );
}

function VideoMod({ w, h }: { w: number; h: number }) {
  const frames = 4;
  const innerW = w - 24;
  const fw = innerW / frames - 6;
  const fh = h - 36;
  return (
    <g transform="translate(12, 22)">
      {Array.from({ length: frames }, (_, i) => (
        <g key={i} transform={`translate(${i * (fw + 6)}, 0)`}>
          <rect width={fw} height={fh} fill={COLORS.bone} stroke={COLORS.stroke} />
          {/* Sky */}
          <rect width={fw} height={fh * 0.6} fill={COLORS.surface} />
          {/* Ground */}
          <rect y={fh * 0.6} width={fw} height={fh * 0.4} fill={COLORS.bone} />
          {/* Moving target */}
          <circle
            cx={fw * 0.2 + fw * 0.18 * i}
            cy={fh * 0.5 - i * 4}
            r={4}
            fill={COLORS.honey}
          />
          <text
            x={4}
            y={fh - 4}
            fontSize={9}
            fontFamily="JetBrains Mono, monospace"
            fill={COLORS.muted}
          >
            t={i}
          </text>
        </g>
      ))}
    </g>
  );
}

export function DataModalities({
  width = W_DEFAULT,
  height = H_DEFAULT,
}: {
  width?: number;
  height?: number;
}) {
  // 5 modalities — render a 3×2 grid (last cell empty)
  const cols = 3;
  const rows = 2;
  const padX = 16;
  const padY = 16;
  const gap = 14;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;
  const cellW = (innerW - gap * (cols - 1)) / cols;
  const cellH = (innerH - gap * (rows - 1)) / rows;

  return (
    <VizFrame width={width} height={height} caption="five common data modalities">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {MODS.map((m, i) => {
          const c = i % cols;
          const r = Math.floor(i / cols);
          const x = padX + c * (cellW + gap);
          const y = padY + r * (cellH + gap);
          return (
            // Static positioning wrapper; motion lives inside so it cannot
            // overwrite the translate with its own transform.
            <g key={m.key} transform={`translate(${x}, ${y})`}>
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: i * 0.12 }}
              >
                <rect
                  width={cellW}
                  height={cellH}
                  rx={6}
                  fill={COLORS.surface}
                  stroke={COLORS.stroke}
                />
                <text x={12} y={16} fontSize={12} fill={COLORS.ink}>
                  {m.title}
                </text>
                <text
                  x={cellW - 12}
                  y={16}
                  fontSize={10}
                  textAnchor="end"
                  fontFamily="JetBrains Mono, monospace"
                  fill={COLORS.muted}
                  style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}
                >
                  {m.shape}
                </text>
                <g transform="translate(0, 22)">
                  {m.key === "tabular" && <Tabular w={cellW} h={cellH - 64} />}
                  {m.key === "image" && <ImageMod w={cellW} h={cellH - 64} />}
                  {m.key === "text" && <TextMod w={cellW} h={cellH - 64} />}
                  {m.key === "audio" && <AudioMod w={cellW} h={cellH - 64} />}
                  {m.key === "video" && <VideoMod w={cellW} h={cellH - 64} />}
                </g>
                <text x={12} y={cellH - 12} fontSize={11} fill={COLORS.muted}>
                  {m.example}
                </text>
              </motion.g>
            </g>
          );
        })}
      </svg>
    </VizFrame>
  );
}
