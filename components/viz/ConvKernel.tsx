"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { COLORS, VizFrame } from "./common";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type KernelKey = "bordas" | "sobelX" | "sobelY" | "nitidez" | "desfoque" | "identidade";

const KERNELS: Record<KernelKey, number[][]> = {
  bordas: [
    [-1, -1, -1],
    [-1, 8, -1],
    [-1, -1, -1],
  ],
  sobelX: [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
  ],
  sobelY: [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1],
  ],
  nitidez: [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0],
  ],
  desfoque: [
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9],
  ],
  identidade: [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ],
};

// What each kernel actually reveals when the input is a hand, not an
// abstract blob — this is the point being taught, not decoration.
const KERNEL_INFO: Record<KernelKey, string> = {
  bordas: "realça todo contorno da mão de uma vez — a silhueta contra o fundo",
  sobelX: "responde a bordas verticais — os dois lados de cada dedo",
  sobelY: "responde a bordas horizontais — a junção entre dedos e palma",
  nitidez: "acentua as bordas mantendo a mão reconhecível",
  desfoque: "apaga a textura da pele — e some com os contornos dos dedos",
  identidade: "kernel neutro — a imagem passa sem alteração, para comparação",
};

// A pixel-art hand silhouette: palm + four fingers rising to different
// heights + an angled thumb. Fixed to a 16x16 grid so the shape stays
// recognizable regardless of N.
function isHandPixel(row: number, col: number) {
  const palm = row >= 9 && row <= 13 && col >= 3 && col <= 11;
  const thumb = row >= 11 && row <= 13 && col >= 1 && col <= 2;
  const index = col === 4 && row >= 4 && row <= 8;
  const middle = col === 6 && row >= 2 && row <= 8;
  const ring = col === 8 && row >= 3 && row <= 8;
  const pinky = col === 10 && row >= 6 && row <= 8;
  return palm || thumb || index || middle || ring || pinky;
}

function genHandImage(N: number) {
  const img: number[][] = [];
  for (let i = 0; i < N; i++) {
    const row: number[] = [];
    for (let j = 0; j < N; j++) {
      const inside = isHandPixel(i, j);
      const base = inside ? 0.74 : 0.06;
      const texture = Math.sin(i * 0.7 + j * 0.5) * 0.03;
      row.push(Math.max(0, Math.min(1, base + texture)));
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
  N = 16,
  width = 980,
  height = 520,
}: {
  N?: number;
  width?: number;
  height?: number;
}) {
  const inputCanvas = useRef<HTMLCanvasElement | null>(null);
  const outputCanvas = useRef<HTMLCanvasElement | null>(null);
  const overlayInput = useRef<HTMLCanvasElement | null>(null);
  const overlayOutput = useRef<HTMLCanvasElement | null>(null);
  const [kernelKey, setKernelKey] = useState<KernelKey>("bordas");
  const [pos, setPos] = useState({ i: 1, j: 1 });
  const [running, setRunning] = useState(true);

  const img = useMemo(() => genHandImage(N), [N]);
  const k = KERNELS[kernelKey];
  const out = useMemo(() => convolve(img, k), [img, k]);

  const cell = 18;

  // Draw bases
  useEffect(() => {
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

  const px = N * cell;

  return (
    <div className="flex w-full max-w-full flex-col items-center">
      <VizFrame width={width} height={height}>
        <div className="flex h-full w-full items-center justify-center gap-8 p-6">
          <div className="flex flex-col items-center">
            <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              input · mão
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

      <div className="mt-3 max-w-[560px] text-center font-mono text-[11px] text-muted">
        {KERNEL_INFO[kernelKey]}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em]">
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