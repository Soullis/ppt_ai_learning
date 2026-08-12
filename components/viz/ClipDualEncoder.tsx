"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

/** CLIP style dual encoder: image and text towers into a shared embedding space. */
export function ClipDualEncoder({
  width = 520,
  height = 380,
}: {
  width?: number;
  height?: number;
}) {
  const cx = width / 2;
  const encW = 88;
  const encH = 44;
  const embW = 72;
  const embH = 28;

  const imageY = 52;
  const textY = height - 118;
  const sharedY = height / 2 + 8;

  const leftX = 36;
  const encX = leftX + 78;
  const embX = encX + encW + 36;
  const sharedX = cx - 56;

  return (
    <VizFrame
      width={width}
      height={height}
      fit="fill"
      caption="dual encoders · matched pairs pulled together in shared embedding space"
    >
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {/* Image branch */}
        <g transform={`translate(${leftX}, ${imageY})`}>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
            <text fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
              image
            </text>
            <g transform="translate(0, 16)">
              {Array.from({ length: 16 }, (_, i) => {
                const c = i % 4;
                const r = Math.floor(i / 4);
                const v = 0.15 + ((c + r) % 3) * 0.22;
                return (
                  <rect
                    key={i}
                    x={c * 11}
                    y={r * 11}
                    width={10}
                    height={10}
                    fill={COLORS.ink}
                    fillOpacity={v}
                  />
                );
              })}
            </g>
          </motion.g>
        </g>

        <g transform={`translate(${encX}, ${imageY + 8})`}>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, delay: 0.1 }}>
            <rect width={encW} height={encH} rx={6} fill={COLORS.surface} stroke={COLORS.accent} strokeWidth={1.5} />
            <text x={encW / 2} y={encH / 2 + 4} textAnchor="middle" fontSize={11} fill={COLORS.ink}>
              f_I
            </text>
          </motion.g>
        </g>

        <g transform={`translate(${embX}, ${imageY + 14})`}>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, delay: 0.2 }}>
            <rect width={embW} height={embH} rx={4} fill={COLORS.accent} fillOpacity={0.12} stroke={COLORS.accent} />
            <text x={embW / 2} y={embH / 2 + 4} textAnchor="middle" fontSize={10} fontFamily="JetBrains Mono, monospace" fill={COLORS.ink}>
              z_I ∈ R^D
            </text>
          </motion.g>
        </g>

        {/* Text branch */}
        <g transform={`translate(${leftX}, ${textY})`}>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, delay: 0.15 }}>
            <text fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
              text
            </text>
            {["a", "drone", "over", "field"].map((t, i) => (
              <g key={t} transform={`translate(0, ${16 + i * 18})`}>
                <rect
                  width={t.length * 8 + 12}
                  height={14}
                  rx={3}
                  fill={COLORS.honey}
                  fillOpacity={0.2}
                  stroke={COLORS.honey}
                />
                <text x={6} y={11} fontSize={10} fontFamily="JetBrains Mono, monospace" fill={COLORS.ink}>
                  {t}
                </text>
              </g>
            ))}
          </motion.g>
        </g>

        <g transform={`translate(${encX}, ${textY + 20})`}>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, delay: 0.25 }}>
            <rect width={encW} height={encH} rx={6} fill={COLORS.surface} stroke={COLORS.honey} strokeWidth={1.5} />
            <text x={encW / 2} y={encH / 2 + 4} textAnchor="middle" fontSize={11} fill={COLORS.ink}>
              f_T
            </text>
          </motion.g>
        </g>

        <g transform={`translate(${embX}, ${textY + 26})`}>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, delay: 0.35 }}>
            <rect width={embW} height={embH} rx={4} fill={COLORS.honey} fillOpacity={0.15} stroke={COLORS.honey} />
            <text x={embW / 2} y={embH / 2 + 4} textAnchor="middle" fontSize={10} fontFamily="JetBrains Mono, monospace" fill={COLORS.ink}>
              z_T ∈ R^D
            </text>
          </motion.g>
        </g>

        {/* Arrows image -> encoder -> embedding -> shared */}
        <motion.path
          d={`M ${leftX + 48} ${imageY + 28} L ${encX - 4} ${imageY + 28}`}
          stroke={COLORS.muted}
          strokeWidth={1.2}
          markerEnd="url(#clip-arrow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
        />
        <motion.path
          d={`M ${encX + encW + 4} ${imageY + 28} L ${embX - 4} ${imageY + 28}`}
          stroke={COLORS.muted}
          strokeWidth={1.2}
          markerEnd="url(#clip-arrow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.22 }}
        />
        <motion.path
          d={`M ${embX + embW / 2} ${imageY + 14 + embH} L ${sharedX + 28} ${sharedY - 36}`}
          stroke={COLORS.accent}
          strokeWidth={1.2}
          strokeDasharray="4 3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.32 }}
        />

        {/* Arrows text branch */}
        <motion.path
          d={`M ${leftX + 52} ${textY + 42} L ${encX - 4} ${textY + 42}`}
          stroke={COLORS.muted}
          strokeWidth={1.2}
          markerEnd="url(#clip-arrow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}
        />
        <motion.path
          d={`M ${encX + encW + 4} ${textY + 42} L ${embX - 4} ${textY + 42}`}
          stroke={COLORS.muted}
          strokeWidth={1.2}
          markerEnd="url(#clip-arrow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
        />
        <motion.path
          d={`M ${embX + embW / 2} ${textY + 26} L ${sharedX + 28} ${sharedY + 36}`}
          stroke={COLORS.honey}
          strokeWidth={1.2}
          strokeDasharray="4 3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.38 }}
        />

        {/* Shared embedding space */}
        <g transform={`translate(${sharedX}, ${sharedY - 40})`}>
          <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
            <ellipse cx={56} cy={40} rx={56} ry={40} fill={COLORS.bone} stroke={COLORS.stroke} />
            <text x={56} y={24} textAnchor="middle" fontSize={10} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
              shared
            </text>
            <text x={56} y={38} textAnchor="middle" fontSize={10} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
              R^D
            </text>
            {/* matched pair dots close together */}
            <circle cx={44} cy={52} r={5} fill={COLORS.accent} fillOpacity={0.85} />
            <circle cx={58} cy={48} r={5} fill={COLORS.honey} fillOpacity={0.85} />
            <line x1={44} y1={52} x2={58} y2={48} stroke={COLORS.green} strokeWidth={1.5} />
            {/* unmatched pair far apart */}
            <circle cx={28} cy={30} r={4} fill={COLORS.accent} fillOpacity={0.35} />
            <circle cx={82} cy={58} r={4} fill={COLORS.honey} fillOpacity={0.35} />
          </motion.g>
        </g>

        {/* Similarity matrix hint */}
        <g transform={`translate(${width - 108}, ${sharedY - 28})`}>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
            <text x={0} y={0} fontSize={9} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
              sim = z_I·z_T
            </text>
            {[0, 1, 2].map((r) =>
              [0, 1, 2].map((c) => {
                const hot = r === c;
                return (
                  <rect
                    key={`${r}-${c}`}
                    x={c * 16}
                    y={8 + r * 16}
                    width={14}
                    height={14}
                    fill={hot ? COLORS.green : COLORS.surface}
                    fillOpacity={hot ? 0.55 : 1}
                    stroke={COLORS.stroke}
                  />
                );
              }),
            )}
          </motion.g>
        </g>

        <defs>
          <marker id="clip-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={COLORS.muted} />
          </marker>
        </defs>
      </svg>
    </VizFrame>
  );
}
