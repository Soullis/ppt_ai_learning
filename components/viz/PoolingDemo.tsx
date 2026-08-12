"use client";

import { useState } from "react";
import { COLORS, VizFrame } from "./common";

function makeGrid() {
  return [
    [3, 1, 2, 4, 0, 6],
    [7, 9, 5, 1, 2, 3],
    [4, 0, 8, 2, 5, 1],
    [6, 7, 3, 9, 4, 8],
    [1, 2, 0, 6, 7, 5],
    [3, 8, 4, 1, 2, 9],
  ];
}

export function PoolingDemo({
  width = 720,
  height = 360,
}: {
  width?: number;
  height?: number;
}) {
  const grid = makeGrid();
  const [mode, setMode] = useState<"max" | "avg">("max");
  const out: number[][] = [];
  for (let i = 0; i < 3; i++) {
    const row: number[] = [];
    for (let j = 0; j < 3; j++) {
      const block = [
        grid[i * 2][j * 2],
        grid[i * 2][j * 2 + 1],
        grid[i * 2 + 1][j * 2],
        grid[i * 2 + 1][j * 2 + 1],
      ];
      row.push(
        mode === "max"
          ? Math.max(...block)
          : Math.round((block.reduce((a, b) => a + b, 0) / 4) * 10) / 10,
      );
    }
    out.push(row);
  }

  const cell = 36;

  return (
    <div className="flex w-full max-w-full flex-col items-center">
      <VizFrame width={width} height={height} caption={`${mode} pooling, 2×2 stride 2`}>
        <div className="flex h-full w-full items-center justify-center gap-12">
          <div>
            <div className="mb-2 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              input
            </div>
            <div className="grid grid-cols-6">
              {grid.flatMap((row, i) =>
                row.map((v, j) => {
                  const blockI = Math.floor(i / 2);
                  const blockJ = Math.floor(j / 2);
                  const inBlock =
                    mode === "max" ? grid[i][j] === out[blockI][blockJ] : false;
                  return (
                    <div
                      key={`${i}-${j}`}
                      className="flex items-center justify-center border border-stroke font-mono text-[12px]"
                      style={{
                        width: cell,
                        height: cell,
                        background: inBlock
                          ? "rgba(232,181,60,0.32)"
                          : (i + j) % 2 === 0
                            ? "#FFFFFF"
                            : COLORS.bone,
                        color: COLORS.ink,
                      }}
                    >
                      {v}
                    </div>
                  );
                }),
              )}
            </div>
          </div>
          <div className="text-2xl text-muted">→</div>
          <div>
            <div className="mb-2 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              output
            </div>
            <div className="grid grid-cols-3">
              {out.flatMap((row, i) =>
                row.map((v, j) => (
                  <div
                    key={`o-${i}-${j}`}
                    className="flex items-center justify-center border border-ink/30 bg-surface font-mono text-[13px]"
                    style={{ width: cell + 6, height: cell + 6, color: COLORS.ink }}
                  >
                    {v}
                  </div>
                )),
              )}
            </div>
          </div>
        </div>
      </VizFrame>
      <div className="mt-3 flex gap-2 font-mono text-[11px] uppercase tracking-[0.12em]">
        {(["max", "avg"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            data-active={m === mode}
            className="rounded-md border border-stroke bg-surface px-3 py-1.5 text-muted transition hover:border-ink hover:text-ink data-[active=true]:border-ink data-[active=true]:text-ink"
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}
