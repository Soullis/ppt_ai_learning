"use client";

import { useMemo, useState } from "react";
import { COLORS, FadeIn, VizFrame } from "./common";

function buildPattern(size: number) {
  const values: number[][] = [];
  for (let i = 0; i < size; i++) {
    const row: number[] = [];
    for (let j = 0; j < size; j++) {
      const edge = j < size / 2 ? 0.15 + 0.35 * (j / (size / 2)) : 0.5 + 0.45 * ((j - size / 2) / (size / 2));
      row.push(Math.min(1, Math.max(0, edge + ((i * 7 + j * 3) % 5) * 0.02)));
    }
    values.push(row);
  }
  return values;
}

export function ImagePixelGrid() {
  const size = 8;
  const matrixSize = 4;
  const values = useMemo(() => buildPattern(size), []);
  const [hover, setHover] = useState<{ i: number; j: number } | null>(null);

  return (
    <VizFrame caption="visual image and its numeric matrix representation">
      <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-4 md:flex-row md:gap-10">
        <FadeIn className="flex flex-col items-center">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            image (grayscale)
          </div>
          <div
            className="grid gap-px rounded border border-stroke p-1"
            style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
          >
            {values.map((row, i) =>
              row.map((v, j) => (
                <div
                  key={`${i}-${j}`}
                  className="h-5 w-5 border border-stroke/40 transition"
                  style={{
                    backgroundColor: `rgba(14,14,16,${v})`,
                    outline:
                      hover?.i === i && hover?.j === j && i < matrixSize && j < matrixSize
                        ? `2px solid ${COLORS.accent}`
                        : undefined,
                  }}
                  onMouseEnter={() => setHover({ i, j })}
                  onMouseLeave={() => setHover(null)}
                />
              )),
            )}
          </div>
        </FadeIn>

        <div className="font-mono text-[20px] text-muted">→</div>

        <FadeIn delay={0.15} className="flex flex-col items-center">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            tensor slice (4×4 excerpt)
          </div>
          <table className="border-collapse font-mono text-[11px]">
            <tbody>
              {values.slice(0, matrixSize).map((row, i) => (
                <tr key={i}>
                  {row.slice(0, matrixSize).map((v, j) => (
                    <td
                      key={j}
                      className="h-8 w-10 border border-stroke text-center"
                      style={{
                        backgroundColor: `rgba(10,102,194,${0.08 + v * 0.25})`,
                      }}
                    >
                      {v.toFixed(1)}
                    </td>
                  ))}
                  <td className="h-8 w-8 border border-stroke text-center text-muted">…</td>
                </tr>
              ))}
              <tr>
                {Array.from({ length: matrixSize + 1 }).map((_, j) => (
                  <td key={j} className="h-6 border border-stroke text-center text-muted">
                    …
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <p className="mt-3 max-w-[220px] text-center text-[11px] leading-relaxed text-muted">
            A colour image is <span className="font-mono">H × W × 3</span>; each channel is one matrix of floats, usually in [0, 1] after normalisation.
          </p>
        </FadeIn>
      </div>
    </VizFrame>
  );
}
