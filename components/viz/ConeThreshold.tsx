"use client";

import { useState } from "react";
import { COLORS, VizFrame } from "./common";

const GRID_SIZE = 10;
const CONE_HUE = 28; // the cone's true orange
const HONEY_RGB = "232,181,60";

// Deterministic pseudo-random in [0,1) so the grid is stable across renders.
function seeded(i: number, j: number, salt: number) {
  const x = Math.sin(i * 12.9898 + j * 78.233 + salt * 37.719) * 43758.5453;
  return x - Math.floor(x);
}

function hueDistance(a: number, b: number) {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

// A triangular cone silhouette on a 10x10 grid, apex up, base at the bottom.
function isConePixel(row: number, col: number) {
  if (row <= 1) return col >= 4 && col <= 5;
  if (row <= 3) return col >= 3 && col <= 6;
  if (row <= 5) return col >= 2 && col <= 7;
  if (row <= 7) return col >= 1 && col <= 8;
  return true; // base: full width, like the cone's base stripe
}

// A couple of unrelated warm-ish objects in the scene (e.g. a curb, a
// jacket) — false positives once the tolerance is pushed too wide.
const DISTRACTORS = new Set(["0-0", "0-9", "9-0"]);

function makeGrid() {
  const cells: { hue: number; sat: number; light: number; isCone: boolean }[][] = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    const row = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      const key = `${i}-${j}`;
      if (isConePixel(i, j)) {
        row.push({
          hue: CONE_HUE + (seeded(i, j, 1) - 0.5) * 14,
          sat: 78 + seeded(i, j, 2) * 12,
          light: 46 + seeded(i, j, 3) * 10,
          isCone: true,
        });
      } else if (DISTRACTORS.has(key)) {
        row.push({ hue: 50, sat: 65, light: 55, isCone: false });
      } else {
        row.push({
          hue: 208 + (seeded(i, j, 4) - 0.5) * 20,
          sat: 8 + seeded(i, j, 5) * 6,
          light: 30 + seeded(i, j, 6) * 12,
          isCone: false,
        });
      }
    }
    cells.push(row);
  }
  return cells;
}

export function ConeThresholdDemo({
  width = 560,
  height = 320,
}: {
  width?: number;
  height?: number;
}) {
  const [grid] = useState(makeGrid);
  const [tolerance, setTolerance] = useState(18);

  let selectedCount = 0;
  let conePixelsFound = 0;
  const totalCone = grid.flat().filter((c) => c.isCone).length;

  const cell = 24;

  return (
    <div className="flex w-full max-w-full flex-col items-center">
      <VizFrame width={width} height={height} caption={`limiar HSV · tolerância de matiz ±${tolerance}°`}>
        <div className="flex h-full w-full flex-col items-center justify-center gap-8 sm:flex-row">
          {/* Card 1 — the captured scene, always full color, never reacts to the slider */}
          <div className="flex flex-col items-center gap-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              cena capturada pela câmera
            </div>
            <div
              className="grid gap-[2px] rounded-md p-2"
              style={{
                gridTemplateColumns: `repeat(${GRID_SIZE}, ${cell}px)`,
                background: COLORS.bone,
              }}
            >
              {grid.flatMap((row, i) =>
                row.map((c, j) => (
                  <div
                    key={`scene-${i}-${j}`}
                    style={{
                      width: cell,
                      height: cell,
                      background: `hsl(${c.hue}, ${c.sat}%, ${c.light}%)`,
                      boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
                    }}
                  />
                )),
              )}
            </div>
          </div>

          <div className="text-2xl text-muted">→</div>

          {/* Card 2 — the live binary mask, driven by the slider */}
          <div className="flex flex-col items-center gap-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              máscara binária
            </div>
            <div
              className="grid gap-[2px] rounded-md p-2"
              style={{
                gridTemplateColumns: `repeat(${GRID_SIZE}, ${cell}px)`,
                background: "#0B0B0B",
              }}
            >
              {grid.flatMap((row, i) =>
                row.map((c, j) => {
                  const selected = hueDistance(c.hue, CONE_HUE) <= tolerance;
                  if (selected) selectedCount++;
                  if (selected && c.isCone) conePixelsFound++;
                  return (
                    <div
                      key={`mask-${i}-${j}`}
                      style={{
                        width: cell,
                        height: cell,
                        background: selected ? `rgba(${HONEY_RGB}, 0.95)` : "transparent",
                        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
                        transition: "background 150ms ease",
                      }}
                    />
                  );
                }),
              )}
            </div>
          </div>
        </div>
      </VizFrame>

      <div className="mt-3 font-mono text-[11px] text-muted">
        {selectedCount} pixels selecionados · {conePixelsFound}/{totalCone} do cone capturados
      </div>

      <div className="mt-4 flex w-full max-w-[420px] flex-col items-center gap-1.5">
        <input
          type="range"
          min={4}
          max={90}
          step={2}
          value={tolerance}
          onChange={(e) => setTolerance(Number(e.target.value))}
          className="w-full accent-[rgb(232,181,60)]"
        />
        <div className="flex w-full justify-between font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
          <span>rígido · só o cone</span>
          <span>largo · pega ruído</span>
        </div>
      </div>
    </div>
  );
}