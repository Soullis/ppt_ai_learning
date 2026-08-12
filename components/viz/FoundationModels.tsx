"use client";

import { motion } from "framer-motion";
import { COLORS, VizFrame } from "./common";

/** One pretrained backbone, many downstream tasks. */
export function FoundationModels({
  width = 920,
  height = 460,
}: {
  width?: number;
  height?: number;
}) {
  const cx = 240;
  const cy = height / 2;
  const tasks = [
    { label: "Classification", sub: "image · video" },
    { label: "Detection", sub: "boxes" },
    { label: "Segmentation", sub: "masks · pixels" },
    { label: "Captioning", sub: "image → text" },
    { label: "VQA", sub: "image + question → answer" },
    { label: "Robotics", sub: "perception → action" },
  ];

  const taskX = 580;
  const taskBaseY = 70;
  const taskStep = (height - 140) / (tasks.length - 1);

  return (
    <VizFrame width={width} height={height} caption="pretrain once at scale · fine-tune for many tasks · CLIP · DINO · MAE · GPT · SAM">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {/* Pretrained data column */}
        <text
          x={60}
          y={50}
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
          style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}
        >
          unlabelled data, web-scale
        </text>
        {Array.from({ length: 8 }, (_, i) => (
          <motion.rect
            key={i}
            x={60 + (i % 4) * 26}
            y={70 + Math.floor(i / 4) * 26}
            width={22}
            height={22}
            fill={COLORS.ink}
            fillOpacity={0.05 + (i % 3) * 0.18}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          />
        ))}

        {/* Arrow into backbone */}
        <motion.line
          x1={170}
          x2={cx - 80}
          y1={cy}
          y2={cy}
          stroke={COLORS.muted}
          strokeOpacity={0.6}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
        <text x={(170 + cx - 80) / 2} y={cy - 8} textAnchor="middle" fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
          pretrain
        </text>
        <text x={(170 + cx - 80) / 2} y={cy + 16} textAnchor="middle" fontSize={11} fontFamily="JetBrains Mono, monospace" fill={COLORS.muted}>
          self-supervised
        </text>

        {/* Backbone */}
        <motion.g
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <rect
            x={cx - 80}
            y={cy - 70}
            width={160}
            height={140}
            rx={10}
            fill={COLORS.ink}
          />
          <text x={cx} y={cy - 30} textAnchor="middle" fontSize={14} fill={COLORS.bone} fontFamily="JetBrains Mono, monospace">
            Foundation
          </text>
          <text x={cx} y={cy - 12} textAnchor="middle" fontSize={14} fill={COLORS.bone} fontFamily="JetBrains Mono, monospace">
            model
          </text>
          <text x={cx} y={cy + 14} textAnchor="middle" fontSize={11} fill={COLORS.honey} fontFamily="JetBrains Mono, monospace">
            shared representation
          </text>
          <text x={cx} y={cy + 36} textAnchor="middle" fontSize={11} fill={COLORS.honey} fontFamily="JetBrains Mono, monospace">
            ViT · LLaMA · CLIP
          </text>
        </motion.g>

        {/* Branches to tasks */}
        {tasks.map((t, i) => {
          const ty = taskBaseY + i * taskStep;
          return (
            <motion.g
              key={t.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.9 + i * 0.08 }}
            >
              <line
                x1={cx + 80}
                x2={taskX - 16}
                y1={cy}
                y2={ty}
                stroke={COLORS.ink}
                strokeOpacity={0.3}
              />
              <rect
                x={taskX - 16}
                y={ty - 18}
                width={260}
                height={36}
                rx={6}
                fill={COLORS.surface}
                stroke={COLORS.honey}
                strokeWidth={1.2}
              />
              <text x={taskX - 4} y={ty - 2} fontSize={13} fill={COLORS.ink}>
                {t.label}
              </text>
              <text
                x={taskX - 4}
                y={ty + 14}
                fontSize={11}
                fontFamily="JetBrains Mono, monospace"
                fill={COLORS.muted}
              >
                {t.sub}
              </text>
            </motion.g>
          );
        })}

        <text
          x={taskX + 120}
          y={50}
          textAnchor="middle"
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          fill={COLORS.muted}
          style={{ textTransform: "uppercase", letterSpacing: "0.14em" }}
        >
          fine-tune with little labelled data
        </text>
      </svg>
    </VizFrame>
  );
}
