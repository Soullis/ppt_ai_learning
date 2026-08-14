"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

const LABELS = ["gate", "drone", "post", "background"];
const N = LABELS.length;
const BG = N - 1;
const TOTAL = 1000;

type Key = "VP" | "VN" | "FP" | "FN";

const CATEGORY_INFO: Record<Key, { color: string; title: string }> = {
  VP: { color: COLORS.green, title: "Verdadeiro Positivo" },
  VN: { color: COLORS.accent, title: "Verdadeiro Negativo" },
  FP: { color: COLORS.honey, title: "Falso Positivo" },
  FN: { color: COLORS.red, title: "Falso Negativo" },
};

const INITIAL: Record<Key, number> = { VP: 550, VN: 250, FP: 90, FN: 110 };

// Distributes `total` into `parts` random-ish, non-negative integers that
// sum exactly to `total` (largest-remainder rounding, so no drift).
function splitRandom(total: number, parts: number): number[] {
  if (total <= 0) return Array(parts).fill(0);
  const weights = Array.from({ length: parts }, () => Math.random() + 0.08);
  const sumW = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map((w) => (w / sumW) * total);
  const floored = raw.map(Math.floor);
  let remainder = total - floored.reduce((a, b) => a + b, 0);
  const order = raw
    .map((r, i) => ({ i, frac: r - Math.floor(r) }))
    .sort((a, b) => b.frac - a.frac);
  for (let k = 0; k < remainder; k++) floored[order[k % parts].i] += 1;
  return floored;
}

// Moving one slider redistributes the delta across the other three,
// proportional to their current values, so the total stays fixed at 1000.
function adjustValues(values: Record<Key, number>, changed: Key, next: number): Record<Key, number> {
  const clamped = Math.max(0, Math.min(TOTAL, Math.round(next)));
  const others = (Object.keys(values) as Key[]).filter((k) => k !== changed);
  const otherSum = others.reduce((s, k) => s + values[k], 0);
  const result = { ...values, [changed]: clamped };

  if (otherSum <= 0) {
    result[changed] = Math.min(clamped, TOTAL);
    others.forEach((k) => (result[k] = 0));
    return result;
  }

  const remaining = TOTAL - clamped;
  const scale = Math.max(0, remaining / otherSum);
  others.forEach((k) => (result[k] = Math.floor(values[k] * scale)));

  const sum = (Object.keys(result) as Key[]).reduce((s, k) => s + result[k], 0);
  let diff = TOTAL - sum;
  let idx = 0;
  while (diff !== 0 && others.length > 0) {
    const k = others[idx % others.length];
    if (diff > 0) {
      result[k] += 1;
      diff -= 1;
    } else if (result[k] > 0) {
      result[k] -= 1;
      diff += 1;
    }
    idx++;
    if (idx > 4000) break;
  }
  return result;
}

export function ConfusionMatrix({
  width = 1024,
  height = 800,
}: {
  width?: number;
  height?: number;
}) {
  const [values, setValues] = useState<Record<Key, number>>(INITIAL);

  const vpSplit = useMemo(() => splitRandom(values.VP, BG), [values.VP]);
  const fpSplit = useMemo(() => splitRandom(values.FP, BG), [values.FP]);
  const fnSplit = useMemo(() => splitRandom(values.FN, BG), [values.FN]);

  const matrix = useMemo(() => {
    const m: number[][] = Array.from({ length: N }, () => Array(N).fill(0));
    for (let c = 0; c < BG; c++) m[c][c] = vpSplit[c];
    m[BG][BG] = values.VN;
    for (let c = 0; c < BG; c++) m[BG][c] = fpSplit[c]; 
    for (let c = 0; c < BG; c++) m[c][BG] = fnSplit[c]; 
    return m;
  }, [vpSplit, fpSplit, fnSplit, values.VN]);

  const precision = values.VP + values.FP > 0 ? values.VP / (values.VP + values.FP) : 0;
  const recall = values.VP + values.FN > 0 ? values.VP / (values.VP + values.FN) : 0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  const cell = 96;              
  const offsetX = (width - cell * N) / 2 - 40; // Shifted left to make room for right-side label
  const offsetY = 160;          
  const max = Math.max(...matrix.flat(), 1);
  const matrixBottom = offsetY + cell * N;

  const tlBox = { x: offsetX, y: offsetY, w: cell * (N - 1), h: cell * (N - 1) };
  const fpRow = { x: offsetX, y: offsetY + (N - 1) * cell, w: cell * (N - 1), h: cell };
  const fnCol = { x: offsetX + (N - 1) * cell, y: offsetY, w: cell, h: cell * (N - 1) };

  const cellColor = (i: number, j: number) => {
    if (i === j && i !== BG) return COLORS.green;
    if (i === BG && j === BG) return COLORS.accent;
    if (i === BG) return COLORS.honey;
    if (j === BG) return COLORS.red;
    return COLORS.muted;
  };

  return (
    <div className="flex w-full max-w-full flex-col items-center">
      <VizFrame width={width} height={height} fit="fill" caption={`${TOTAL} imagens no total · mova os controles abaixo`}>
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full select-none">
          <motion.rect
            x={tlBox.x - 4}
            y={tlBox.y - 4}
            width={tlBox.w + 8}
            height={tlBox.h + 8}
            fill="none"
            stroke={COLORS.green}
            strokeWidth={1.4}
            strokeDasharray="4 4"
          />
          <motion.rect
            x={fpRow.x - 4}
            y={fpRow.y - 2}
            width={fpRow.w + 8}
            height={fpRow.h + 4}
            fill="none"
            stroke={COLORS.honey}
            strokeWidth={1.4}
            strokeDasharray="4 4"
          />
          <motion.rect
            x={fnCol.x - 2}
            y={fnCol.y - 4}
            width={fnCol.w + 4}
            height={fnCol.h + 8}
            fill="none"
            stroke={COLORS.red}
            strokeWidth={1.4}
            strokeDasharray="4 4"
          />

          {LABELS.map((l, j) => (
            <text
              key={`col-${l}`}
              x={offsetX + j * cell + cell / 2}
              y={offsetY - 24}
              textAnchor="middle"
              fontSize={20}
              fontFamily="JetBrains Mono, monospace"
              fill={COLORS.muted}
            >
              {l}
            </text>
          ))}
          <text
            x={offsetX + (cell * N) / 2}
            y={offsetY - 60}
            textAnchor="middle"
            fontSize={16}
            fontFamily="JetBrains Mono, monospace"
            fill={COLORS.muted}
            style={{ textTransform: "uppercase", letterSpacing: "0.16em" }}
          >
            predicted
          </text>

          {LABELS.map((l, i) => (
            <text
              key={`row-${l}`}
              x={offsetX - 20}
              y={offsetY + i * cell + cell / 2 + 6}
              textAnchor="end"
              fontSize={20}
              fontFamily="JetBrains Mono, monospace"
              fill={COLORS.muted}
            >
              {l}
            </text>
          ))}
          <text
            x={offsetX - 120}
            y={offsetY + (cell * N) / 2}
            textAnchor="middle"
            fontSize={16}
            fontFamily="JetBrains Mono, monospace"
            fill={COLORS.muted}
            style={{ textTransform: "uppercase", letterSpacing: "0.16em" }}
            transform={`rotate(-90, ${offsetX - 120}, ${offsetY + (cell * N) / 2})`}
          >
            ground truth
          </text>

          {matrix.flatMap((row, i) =>
            row.map((v, j) => {
              const t = v / max;
              return (
                <motion.g key={`${i}-${j}`} animate={{ opacity: 1 }} initial={false}>
                  <motion.rect
                    x={offsetX + j * cell}
                    y={offsetY + i * cell}
                    width={cell}
                    height={cell}
                    fill={cellColor(i, j)}
                    animate={{ fillOpacity: 0.16 + t * 0.7 }}
                    transition={{ duration: 0.25 }}
                    stroke={COLORS.surface}
                  />
                  <text
                    x={offsetX + j * cell + cell / 2}
                    y={offsetY + i * cell + cell / 2 + 10}
                    textAnchor="middle"
                    fontSize={32}
                    fontFamily="JetBrains Mono, monospace"
                    fill={t > 0.4 ? COLORS.surface : COLORS.ink}
                  >
                    {v}
                  </text>
                </motion.g>
              );
            }),
          )}

          <text
            x={offsetX + (cell * (N - 1)) / 2}
            y={offsetY - 90}
            textAnchor="middle"
            fontSize={18}
            fontFamily="JetBrains Mono, monospace"
            fill={COLORS.green}
          >
            VP · diagonal
          </text>
          <text
            x={offsetX + fpRow.w / 2}
            y={matrixBottom + 36}
            textAnchor="middle"
            fontSize={18}
            fontFamily="JetBrains Mono, monospace"
            fill={COLORS.honey}
          >
            FP · linha background
          </text>
          <text
            x={offsetX + N * cell + 24}
            y={offsetY + (cell * (N - 1)) / 2 + 6}
            textAnchor="start"
            fontSize={18}
            fontFamily="JetBrains Mono, monospace"
            fill={COLORS.red}
          >
            FN · col. background
          </text>
        </svg>
      </VizFrame>

      <div className="mt-4 flex w-full max-w-[720px] flex-col gap-4">
        {(Object.keys(values) as Key[]).map((k) => {
          const info = CATEGORY_INFO[k];
          return (
            <div key={k} className="flex items-center gap-4">
              <span className="w-10 shrink-0 font-mono text-[14px] font-bold" style={{ color: info.color }}>
                {k}
              </span>
              <input
                type="range"
                min={0}
                max={TOTAL}
                step={1}
                value={values[k]}
                onChange={(e) => setValues((v) => adjustValues(v, k, Number(e.target.value)))}
                className="w-full"
                style={{ accentColor: info.color }}
              />
              <span className="w-14 shrink-0 text-right font-mono text-[14px] font-bold text-ink">
                {values[k]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}