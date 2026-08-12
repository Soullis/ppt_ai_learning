"use client";

import { useState } from "react";
import { COLORS, VizFrame } from "./common";
import { SCENE_OBJECTS, SceneSVG } from "./Scene";

/** Side-by-side semantic (class mask) vs instance (per-object mask) on the same scene. */
export function SemanticInstanceCompare({
  width = 720,
  height = 400,
}: {
  width?: number;
  height?: number;
}) {
  const [mode, setMode] = useState<"compare" | "semantic" | "instance">("compare");
  const panelW = mode === "compare" ? (width - 24) / 2 : width - 16;
  const panelH = height - 56;

  function renderMasks(kind: "semantic" | "instance", offsetX: number) {
    const gates = SCENE_OBJECTS.filter((o) => o.cls === "gate");
    const others = SCENE_OBJECTS.filter((o) => o.cls !== "gate");

    return (
      <g transform={`translate(${offsetX}, 0)`}>
        {kind === "semantic" ? (
          <>
            {gates.map((o) => {
              const x = o.x * panelW;
              const y = o.y * panelH;
              const w = o.w * panelW;
              const h = o.h * panelH;
              return (
                <rect
                  key={o.id}
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  fill={COLORS.honey}
                  fillOpacity={0.5}
                  stroke={COLORS.honey}
                  strokeWidth={2}
                />
              );
            })}
            {others.map((o) => {
              const x = o.x * panelW;
              const y = o.y * panelH;
              const w = o.w * panelW;
              const h = o.h * panelH;
              const color = o.cls === "drone" ? COLORS.ink : COLORS.green;
              return (
                <rect
                  key={o.id}
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  fill={color}
                  fillOpacity={0.45}
                  stroke={color}
                  strokeWidth={1.5}
                />
              );
            })}
            <text x={8} y={panelH - 8} fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
              class &quot;gate&quot; → one colour for both gates
            </text>
          </>
        ) : (
          <>
            {SCENE_OBJECTS.map((o, i) => {
              const x = o.x * panelW;
              const y = o.y * panelH;
              const w = o.w * panelW;
              const h = o.h * panelH;
              const palette = [COLORS.accent, COLORS.honey, COLORS.green, COLORS.red];
              const color = palette[i % palette.length];
              const label = o.cls === "gate" ? `gate #${gates.indexOf(o) + 1}` : o.cls;
              return (
                <g key={o.id}>
                  <rect x={x} y={y} width={w} height={h} fill={color} fillOpacity={0.45} stroke={color} strokeWidth={2} />
                  <rect x={x} y={y - 16} width={label.length * 7 + 12} height={16} fill={color} />
                  <text x={x + 6} y={y - 4} fontSize={10} fontFamily="JetBrains Mono, monospace" fill={COLORS.surface}>
                    {label}
                  </text>
                </g>
              );
            })}
            <text x={8} y={panelH - 8} fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
              each object → separate mask and ID
            </text>
          </>
        )}
      </g>
    );
  }

  return (
    <VizFrame
      width={width}
      height={height}
      fit="fill"
      caption="semantic: one label per class · instance: one mask per object"
    >
      <div className="flex h-full flex-col">
        <div className="mb-2 flex gap-2 px-2">
          {(["compare", "semantic", "instance"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className="rounded border px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition"
              style={{
                borderColor: mode === m ? COLORS.accent : COLORS.stroke,
                background: mode === m ? "rgba(10,102,194,0.08)" : COLORS.surface,
                color: mode === m ? COLORS.accent : COLORS.muted,
              }}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="relative min-h-0 flex-1">
          {mode === "compare" ? (
            <div className="flex h-full gap-2 px-2">
              <div className="relative flex-1 overflow-hidden rounded border border-stroke">
                <div className="absolute left-0 right-0 top-0 z-10 bg-surface/90 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted">
                  semantic
                </div>
                <SceneSVG width={panelW} height={panelH} showObjects={false} />
                <svg viewBox={`0 0 ${panelW} ${panelH}`} className="pointer-events-none absolute inset-0 h-full w-full">
                  {renderMasks("semantic", 0)}
                </svg>
              </div>
              <div className="relative flex-1 overflow-hidden rounded border border-stroke">
                <div className="absolute left-0 right-0 top-0 z-10 bg-surface/90 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted">
                  instance
                </div>
                <SceneSVG width={panelW} height={panelH} showObjects={false} />
                <svg viewBox={`0 0 ${panelW} ${panelH}`} className="pointer-events-none absolute inset-0 h-full w-full">
                  {renderMasks("instance", 0)}
                </svg>
              </div>
            </div>
          ) : (
            <div className="relative mx-2 h-full overflow-hidden rounded border border-stroke">
              <SceneSVG width={panelW} height={panelH} showObjects={false} />
              <svg viewBox={`0 0 ${panelW} ${panelH}`} className="pointer-events-none absolute inset-0 h-full w-full">
                {renderMasks(mode, 0)}
              </svg>
            </div>
          )}
        </div>
      </div>
    </VizFrame>
  );
}
