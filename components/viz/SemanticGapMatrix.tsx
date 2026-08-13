"use client";

import { useState } from "react";
import { Camera, ArrowRight, BrainCircuit } from "lucide-react";

const PIXEL_GRID = [
  [
    [255, 50, 50],
    [50, 255, 50],
    [50, 50, 255],
  ],
  [
    [255, 255, 50],
    [50, 255, 255],
    [255, 50, 255],
  ],
  [
    [255, 150, 0],
    [150, 0, 255],
    [0, 255, 150],
  ],
] as const;

const CHANNELS = [
  { key: "R", label: "vermelho", color: "rgb(255,90,90)" },
  { key: "G", label: "verde", color: "rgb(90,220,120)" },
  { key: "B", label: "azul", color: "rgb(90,140,255)" },
] as const;

/**
 * Visualiza a 'Lacuna Semântica': de um lado o sensor, no meio a matriz
 * de números RGB — clicável, célula a célula — e do outro a decisão.
 * Clicar num pixel revela seus três canais como barras, para que "só
 * números" pare de ser uma abstração.
 */
export function SemanticGapMatrix() {
  const [selected, setSelected] = useState({ i: 1, j: 2 }); // pixel mais "vermelho"
  const [r, g, b] = PIXEL_GRID[selected.i][selected.j];

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 px-4">

      <div className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-xl">
        <div className="grid grid-cols-3 gap-1">
          {PIXEL_GRID.map((row, i) =>
            row.map(([pr, pg, pb], j) => {
              const isSelected = selected.i === i && selected.j === j;
              return (
                <button
                  key={`${i}-${j}`}
                  type="button"
                  onClick={() => setSelected({ i, j })}
                  className="flex h-12 w-12 items-center justify-center rounded text-[8px] text-white/70 transition"
                  style={{
                    backgroundColor: `rgba(${pr}, ${pg}, ${pb}, 0.45)`,
                    boxShadow: isSelected
                      ? "inset 0 0 0 2px rgba(232,181,60,0.95)"
                      : "inset 0 0 0 1px rgba(255,255,255,0.08)",
                  }}
                  aria-pressed={isSelected}
                >
                  {isSelected ? "✓" : ""}
                </button>
              );
            }),
          )}
        </div>
      </div>

      <div className="flex w-full max-w-[220px] flex-col gap-2">
        {CHANNELS.map((c, idx) => {
          const value = [r, g, b][idx];
          return (
            <div key={c.key} className="flex items-center gap-2">
              <span className="w-4 font-mono text-[10px] text-muted">{c.key}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full transition-all duration-200"
                  style={{ width: `${(value / 255) * 100}%`, background: c.color }}
                />
              </div>
              <span className="w-8 text-right font-mono text-[10px] text-white/60">{value}</span>
            </div>
          );
        })}
      </div>

      <p className="max-w-xs text-center text-[10px] text-white/40">
        Clique em um pixel — é só isso que a câmera entrega: três números por ponto, sem noção do
        que formam.
      </p>
    </div>
  );
}