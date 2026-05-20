"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

/**
 * The imitation game. An interrogator on the left exchanges messages with
 * two hidden players (A and B), one human and one machine. The interrogator
 * has to decide which is which based only on the text exchanged.
 */
export function TuringTest({
  width = 760,
  height = 380,
}: {
  width?: number;
  height?: number;
}) {
  const interrogatorX = 110;
  const cy = height / 2;
  const playerAX = width - 180;
  const playerAY = cy - 80;
  const playerBY = cy + 80;
  const wallX = width / 2 + 30;

  return (
    <VizFrame width={width} height={height} caption='the imitation game (Turing 1950) — can the interrogator tell which is which?'>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {/* Hidden wall */}
        <motion.line
          x1={wallX}
          x2={wallX}
          y1={50}
          y2={height - 50}
          stroke={COLORS.muted}
          strokeOpacity={0.6}
          strokeDasharray="6 4"
          strokeWidth={1.4}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7 }}
        />
        <text
          x={wallX}
          y={42}
          textAnchor="middle"
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
          style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}
        >
          hidden barrier
        </text>

        {/* Interrogator */}
        <motion.g
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <rect
            x={interrogatorX - 70}
            y={cy - 40}
            width={140}
            height={80}
            rx={6}
            fill={COLORS.surface}
            stroke={COLORS.ink}
            strokeWidth={1.4}
          />
          <text x={interrogatorX} y={cy - 8} textAnchor="middle" fontSize={14} fill={COLORS.ink}>
            Interrogator
          </text>
          <text
            x={interrogatorX}
            y={cy + 14}
            textAnchor="middle"
            fontSize={11}
            fontFamily="JetBrains Mono, monospace"
            fill={COLORS.muted}
          >
            asks questions
          </text>
        </motion.g>

        {/* Player A — labelled "?" since the role is unknown */}
        {[
          { y: playerAY, label: "Player A", subtitle: "human or machine?" },
          { y: playerBY, label: "Player B", subtitle: "human or machine?" },
        ].map((p, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.15 }}
          >
            <rect
              x={playerAX - 70}
              y={p.y - 30}
              width={140}
              height={60}
              rx={6}
              fill={COLORS.surface}
              stroke={COLORS.honey}
              strokeWidth={1.4}
            />
            <text x={playerAX} y={p.y - 4} textAnchor="middle" fontSize={14} fill={COLORS.ink}>
              {p.label}
            </text>
            <text
              x={playerAX}
              y={p.y + 14}
              textAnchor="middle"
              fontSize={11}
              fontFamily="JetBrains Mono, monospace"
              fill={COLORS.muted}
            >
              {p.subtitle}
            </text>
          </motion.g>
        ))}

        {/* Animated message bubbles */}
        {[playerAY, playerBY].map((py, i) => (
          <motion.g
            key={`msg-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 + i * 0.2 }}
          >
            <line
              x1={interrogatorX + 70}
              x2={playerAX - 70}
              y1={py}
              y2={py}
              stroke={COLORS.accent}
              strokeOpacity={0.4}
              strokeDasharray="3 4"
            />
            <motion.circle
              cx={interrogatorX + 70}
              cy={py}
              r={5}
              fill={COLORS.accent}
              animate={{ cx: [interrogatorX + 70, playerAX - 70, interrogatorX + 70] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "loop", delay: i * 0.6 }}
            />
          </motion.g>
        ))}

        <text
          x={width / 2}
          y={height - 18}
          textAnchor="middle"
          fontSize={11}
          fill={COLORS.muted}
        >
          if the interrogator cannot reliably tell, the machine has &quot;passed&quot;
        </text>
      </svg>
    </VizFrame>
  );
}
