"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { COLORS, VizFrame } from "./common";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type KernelKey = "edge" | "sharpen" | "blur" | "identity";

const KERNELS: Record<KernelKey, number[][]> = {
  edge: [
    [-1, -1, -1],
    [-1, 8, -1],
    [-1, -1, -1],
  ],
  sharpen: [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0],
  ],
  blur: [
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9],
  ],
  identity: [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ],
};

function genImage(N: number) {
  const img: number[][] = [];
  for (let i = 0; i < N; i++) {
    const row: number[] = [];
    for (let j = 0; j < N; j++) {
      const cx = N / 2;
      const cy = N / 2;
      const r = Math.sqrt((i - cy) ** 2 + (j - cx) ** 2);
      const v =
        Math.max(0, 1 - r / (N * 0.45)) * 0.7 +
        Math.sin(j * 0.4) * 0.1 +
        (i % 2 === 0 ? 0.05 : 0);
      row.push(Math.max(0, Math.min(1, v)));
    }
    img.push(row);
  }
  return img;
}

function convolve(img: number[][], k: number[][]) {
  const N = img.length;
  const out: number[][] = Array.from({ length: N }, () => Array(N).fill(0));
  for (let i = 1; i < N - 1; i++) {
    for (let j = 1; j < N - 1; j++) {
      let acc = 0;
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          acc += img[i + di][j + dj] * k[di + 1][dj + 1];
        }
      }
      out[i][j] = acc;
    }
  }
  return out;
}

export function ConvKernel({
  N = 12,
  width = 880,
  height = 460,
}: {
  N?: number;
  width?: number;
  height?: number;
}) {
  const inputCanvas = useRef<HTMLCanvasElement | null>(null);
  const outputCanvas = useRef<HTMLCanvasElement | null>(null);
  const overlayInput = useRef<HTMLCanvasElement | null>(null);
  const overlayOutput = useRef<HTMLCanvasElement | null>(null);
  const [kernelKey, setKernelKey] = useState<KernelKey>("edge");
  const [pos, setPos] = useState({ i: 1, j: 1 });
  const [running, setRunning] = useState(true);

  const img = useMemo(() => genImage(N), [N]);
  const k = KERNELS[kernelKey];
  const out = useMemo(() => convolve(img, k), [img, k]);

  // Draw bases
  useEffect(() => {
    const cell = 22;
    const drawGrid = (
      canvas: HTMLCanvasElement,
      grid: number[][],
      norm = false,
    ) => {
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let lo = Infinity;
      let hi = -Infinity;
      if (norm) {
        for (const row of grid) for (const v of row) {
          if (v < lo) lo = v;
          if (v > hi) hi = v;
        }
      }
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          const v = norm ? (grid[i][j] - lo) / (hi - lo + 1e-9) : grid[i][j];
          const g = Math.floor(255 - v * 220);
          ctx.fillStyle = `rgb(${g},${g},${g})`;
          ctx.fillRect(j * cell, i * cell, cell, cell);
          ctx.strokeStyle = "rgba(14,14,16,0.06)";
          ctx.strokeRect(j * cell, i * cell, cell, cell);
        }
      }
    };
    if (inputCanvas.current) drawGrid(inputCanvas.current, img);
    if (outputCanvas.current) drawGrid(outputCanvas.current, out, true);
  }, [img, out, N]);

  const reduce = useReducedMotion();
  useEffect(() => {
    if (!running || reduce) return;
    const id = setInterval(() => {
      setPos(({ i, j }) => {
        let nj = j + 1;
        let ni = i;
        if (nj > N - 2) {
          nj = 1;
          ni = i + 1;
        }
        if (ni > N - 2) ni = 1;
        return { i: ni, j: nj };
      });
    }, 220);
    return () => clearInterval(id);
  }, [running, N, reduce]);

  // Draw highlight overlays
  useEffect(() => {
    const cell = 22;
    const drawHi = (canvas: HTMLCanvasElement, x: number, y: number, w: number, h: number) => {
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = COLORS.honey;
      ctx.lineWidth = 2;
      ctx.fillStyle = "rgba(232,181,60,0.18)";
      ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x, y, w, h);
    };
    if (overlayInput.current) {
      drawHi(overlayInput.current, (pos.j - 1) * cell, (pos.i - 1) * cell, cell * 3, cell * 3);
    }
    if (overlayOutput.current) {
      drawHi(overlayOutput.current, pos.j * cell, pos.i * cell, cell, cell);
    }
  }, [pos, N]);

  const cellPx = 22;
  const px = N * cellPx;

  return (
    <div className="flex w-full max-w-full flex-col items-center">
      <VizFrame width={width} height={height}>
        <div className="flex h-full w-full items-center justify-center gap-8 p-6">
          <div className="flex flex-col items-center">
            <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              input
            </div>
            <div className="relative" style={{ width: px, height: px }}>
              <canvas
                ref={inputCanvas}
                width={px}
                height={px}
                className="absolute inset-0 border border-stroke"
              />
              <canvas
                ref={overlayInput}
                width={px}
                height={px}
                className="pointer-events-none absolute inset-0"
              />
            </div>
          </div>
          {/* Kernel display */}
          <div className="flex flex-col items-center">
            <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              kernel
            </div>
            <table className="border-collapse font-mono text-[11px]">
              <tbody>
                {k.map((row, i) => (
                  <tr key={i}>
                    {row.map((v, j) => (
                      <td
                        key={j}
                        className="border border-stroke px-2 py-1 text-center text-ink"
                        style={{ minWidth: 36 }}
                      >
                        {Math.round(v * 100) / 100}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              output[i,j] = Σ
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              output
            </div>
            <div className="relative" style={{ width: px, height: px }}>
              <canvas
                ref={outputCanvas}
                width={px}
                height={px}
                className="absolute inset-0 border border-stroke"
              />
              <canvas
                ref={overlayOutput}
                width={px}
                height={px}
                className="pointer-events-none absolute inset-0"
              />
            </div>
          </div>
        </div>
      </VizFrame>
      <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em]">
        {(Object.keys(KERNELS) as KernelKey[]).map((kk) => (
          <button
            key={kk}
            type="button"
            onClick={() => setKernelKey(kk)}
            aria-pressed={kk === kernelKey}
            className="rounded-md border border-stroke bg-surface px-3 py-1.5 text-muted transition hover:border-ink hover:text-ink data-[active=true]:border-ink data-[active=true]:text-ink"
            data-active={kk === kernelKey}
          >
            {kk}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="rounded-md border border-stroke bg-surface px-3 py-1.5 text-muted transition hover:border-ink hover:text-ink"
        >
          {running ? "pause" : "play"}
        </button>
      </div>
    </div>
  );
}
