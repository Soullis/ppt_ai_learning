"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

const LABELS = ["gate", "drone", "post", "background"];
const N = LABELS.length;
const BG = N - 1; // index of the "background" class

const INITIAL_MATRIX: number[][] = [
  [212, 3, 1, 18],
  [2, 87, 0, 7],
  [4, 1, 64, 12],
  [9, 4, 6, 3],
];

type CategoryKey = "VP" | "VN" | "FP" | "FN" | "confusao";

function categoryFor(i: number, j: number): { key: CategoryKey; label: string; color: string } {
  if (i === j && i !== BG) {
    return { key: "VP", label: `Verdadeiro Positivo — ${LABELS[i]} identificado corretamente`, color: COLORS.green };
  }
  if (i === BG && j === BG) {
    return { key: "VN", label: "Verdadeiro Negativo — nada ali, e o modelo não viu nada", color: COLORS.accent };
  }
  if (i === BG && j !== BG) {
    return { key: "FP", label: `Falso Positivo — alucinou um "${LABELS[j]}" que não existia`, color: COLORS.honey };
  }
  if (j === BG && i !== BG) {
    return { key: "FN", label: `Falso Negativo — havia um "${LABELS[i]}" e o modelo não viu`, color: COLORS.red };
  }
  return {
    key: "confusao",
    label: `Confusão de classe — era "${LABELS[i]}", o modelo disse "${LABELS[j]}"`,
    color: COLORS.muted,
  };
}

function cloneMatrix(m: number[][]) {
  return m.map((row) => [...row]);
}

export function ConfusionMatrix({
  width = 720,
  height = 620,
}: {
  width?: number;
  height?: number;
}) {
  const [matrix, setMatrix] = useState<number[][]>(INITIAL_MATRIX);
  const [selected, setSelected] = useState<{ i: number; j: number } | null>(null);
  const dragRef = useRef<{ i: number; j: number; startY: number; startValue: number } | null>(null);

  const cell = 64;
  const offsetX = (width - cell * N) / 2;
  const offsetY = 88;
  const max = Math.max(...matrix.flat(), 1);
  const matrixBottom = offsetY + cell * N;

  const tlBox = { x: offsetX, y: offsetY, w: cell * (N - 1), h: cell * (N - 1) };
  const fpRow = { x: offsetX, y: offsetY + (N - 1) * cell, w: cell * (N - 1), h: cell };
  const fnCol = { x: offsetX + (N - 1) * cell, y: offsetY, w: cell, h: cell * (N - 1) };

  useEffect(() => {
    function onMove(e: PointerEvent) {
      const d = dragRef.current;
      if (!d) return;
      const dy = d.startY - e.clientY; // dragging up = more, down = less
      const next = Math.max(0, d.startValue + Math.round(dy / 6));
      setMatrix((m) => {
        const copy = cloneMatrix(m);
        copy[d.i][d.j] = next;
        return copy;
      });
    }
    function onUp() {
      dragRef.current = null;
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  // Micro-averaged precision/recall over the object classes (excludes
  // the background-vs-background cell, which is the VN, not a VP).
  let tp = 0;
  let fp = 0;
  let fn = 0;
  for (let c = 0; c < BG; c++) {
    const rowSum = matrix[c].reduce((a, b) => a + b, 0);
    const colSum = matrix.reduce((a, row) => a + row[c], 0);
    tp += matrix[c][c];
    fp += colSum - matrix[c][c];
    fn += rowSum - matrix[c][c];
  }
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  const selectedCat = selected ? categoryFor(selected.i, selected.j) : null;

  return (
    <div className="flex w-full max-w-full flex-col items-center">
      <VizFrame
        width={width}
        height={height}
        fit="fill"
        caption="arraste uma célula para cima/baixo para mudar sua contagem"
      >
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.5 }}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.7 }}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.9 }}
          />

          {LABELS.map((l, j) => (
            <text
              key={`col-${l}`}
              x={offsetX + j * cell + cell / 2}
              y={offsetY - 16}
              textAnchor="middle"
              fontSize={11}
              fontFamily="JetBrains Mono, monospace"
              fill={COLORS.muted}
            >
              {l}
            </text>
          ))}
          <text
            x={offsetX + (cell * N) / 2}
            y={offsetY - 40}
            textAnchor="middle"
            fontSize={10}
            fontFamily="JetBrains Mono, monospace"
            fill={COLORS.muted}
            style={{ textTransform: "uppercase", letterSpacing: "0.16em" }}
          >
            predicted
          </text>

          {LABELS.map((l, i) => (
            <text
              key={`row-${l}`}
              x={offsetX - 10}
              y={offsetY + i * cell + cell / 2 + 4}
              textAnchor="end"
              fontSize={11}
              fontFamily="JetBrains Mono, monospace"
              fill={COLORS.muted}
            >
              {l}
            </text>
          ))}
          <text
            x={offsetX - 52}
            y={offsetY + (cell * N) / 2}
            textAnchor="middle"
            fontSize={10}
            fontFamily="JetBrains Mono, monospace"
            fill={COLORS.muted}
            style={{ textTransform: "uppercase", letterSpacing: "0.16em" }}
            transform={`rotate(-90, ${offsetX - 52}, ${offsetY + (cell * N) / 2})`}
          >
            ground truth
          </text>

          {matrix.flatMap((row, i) =>
            row.map((v, j) => {
              const t = v / max;
              const cat = categoryFor(i, j);
              const isSelected = selected?.i === i && selected?.j === j;
              return (
                <motion.g
                  key={`${i}-${j}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: (i * N + j) * 0.04 }}
                >
                  <rect
                    x={offsetX + j * cell}
                    y={offsetY + i * cell}
                    width={cell}
                    height={cell}
                    fill={cat.color}
                    fillOpacity={0.18 + t * 0.67}
                    stroke={isSelected ? COLORS.ink : COLORS.surface}
                    strokeWidth={isSelected ? 2 : 1}
                    style={{ cursor: "ns-resize", touchAction: "none" }}
                    onPointerDown={(e) => {
                      (e.target as Element).setPointerCapture(e.pointerId);
                      dragRef.current = { i, j, startY: e.clientY, startValue: v };
                      setSelected({ i, j });
                    }}
                  >
                    <title>{cat.label}</title>
                  </rect>
                  <text
                    x={offsetX + j * cell + cell / 2}
                    y={offsetY + i * cell + cell / 2 + 5}
                    textAnchor="middle"
                    fontSize={13}
                    fontFamily="JetBrains Mono, monospace"
                    fill={t > 0.4 ? COLORS.surface : COLORS.ink}
                    style={{ pointerEvents: "none" }}
                  >
                    {v}
                  </text>
                </motion.g>
              );
            }),
          )}
        </svg>
      </VizFrame>

      <div className="mt-3 flex min-h-[20px] items-center gap-2 font-mono text-[11px]">
        {selectedCat ? (
          <>
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ background: selectedCat.color }}
            />
            <span className="text-ink">{selectedCat.key}</span>
            <span className="text-muted">— {selectedCat.label}</span>
          </>
        ) : (
          <span className="text-muted">clique e arraste qualquer célula para testar um cenário</span>
        )}
      </div>

      <div className="mt-4 grid w-full max-w-[640px] grid-cols-3 gap-4 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
        <div>
          precision = <span className="text-ink">{precision.toFixed(3)}</span>
        </div>
        <div>
          recall = <span className="text-ink">{recall.toFixed(3)}</span>
        </div>
        <div>
          f1 = <span className="text-ink">{f1.toFixed(3)}</span>
        </div>
        <div className="col-span-3 mt-1 flex gap-1">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stroke">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${precision * 100}%`, background: COLORS.honey }}
            />
          </div>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stroke">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${recall * 100}%`, background: COLORS.red }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm" style={{ background: COLORS.green }} /> VP · acertou o alvo
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm" style={{ background: COLORS.accent }} /> VN · acertou o vazio
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm" style={{ background: COLORS.honey }} /> FP · alucinou um alvo
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm" style={{ background: COLORS.red }} /> FN · comeu mosca
        </span>
      </div>
    </div>
  );
}