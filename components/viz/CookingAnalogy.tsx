"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VizFrame } from "./common";

type Stage = "tradicional" | "ml" | "dl";

const HONEY = "rgba(232,181,60,1)";
const HONEY_SOFT = "rgba(232,181,60,0.16)";

const STAGE_LABELS: Record<Stage, string> = {
  tradicional: "programação tradicional",
  ml: "machine learning",
  dl: "deep learning",
};

/* ---------------------------------------------------------------------- */
/* Small cake glyph, reused across all three stages so it reads as "the   */
/* same cake" moving through different processes.                        */
/* ---------------------------------------------------------------------- */
function CakeIcon({ baked, size = 40 }: { baked: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect
        x="8"
        y="22"
        width="24"
        height="12"
        rx="2"
        fill={baked ? HONEY : "rgba(255,255,255,0.12)"}
        stroke="rgba(255,255,255,0.25)"
      />
      <rect
        x="11"
        y="14"
        width="18"
        height="10"
        rx="2"
        fill={baked ? "rgba(232,181,60,0.75)" : "rgba(255,255,255,0.08)"}
        stroke="rgba(255,255,255,0.2)"
      />
      {baked ? (
        <>
          <circle cx="14" cy="10" r="1.6" fill={HONEY} />
          <circle cx="20" cy="8" r="1.6" fill={HONEY} />
          <circle cx="26" cy="10" r="1.6" fill={HONEY} />
        </>
      ) : null}
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/* 1. Traditional programming — the recipe is given. Steps execute in     */
/*    order, one at a time, until the cake is done. Nothing is inferred.  */
/* ---------------------------------------------------------------------- */
const RECIPE_STEPS = ["200g de farinha", "3 ovos", "misturar bem", "assar · 35 min"];

function RecipeSteps() {
  const [step, setStep] = useState(0); // 0..RECIPE_STEPS.length (last = done)

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s >= RECIPE_STEPS.length ? 0 : s + 1));
    }, 900);
    return () => clearInterval(id);
  }, []);

  const done = step >= RECIPE_STEPS.length;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col gap-2">
        {RECIPE_STEPS.map((label, i) => {
          const active = i < step || done;
          return (
            <div key={label} className="flex items-center gap-3">
              <span
                className="flex h-5 w-5 items-center justify-center rounded border text-[15px]"
                style={{
                  borderColor: active ? HONEY : "rgba(255,255,255,0.25)",
                  background: active ? HONEY_SOFT : "transparent",
                  color: active ? "#E8B53C" : "rgba(255,255,255,0.4)",
                }}
              >
                {active ? "✓" : i + 1}
              </span>
              <span
                className="font-mono text-[18px]"
                style={{ color: active ? "#797878" : "rgba(255,255,255,0.4)" }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <motion.div
        animate={done ? { scale: [1, 1.12, 1] } : { scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-2"
      >
        <CakeIcon baked={done} size={160}/>
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
          {done ? "bolo pronto" : "seguindo a receita…"}
        </span>
      </motion.div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* 2. Machine learning — no recipe is given. A "scanner" passes over many */
/*    example cakes, and a recipe is deduced from what it measured.       */
/* ---------------------------------------------------------------------- */
const SAMPLE_COUNT = 6;
const DEDUCED_RECIPE = ["≈ 210g de farinha", "≈ 3 ovos", "≈ 34 min de forno"];

function CakeScanner() {
  const [phase, setPhase] = useState<"scanning" | "revealed">("scanning");

  useEffect(() => {
    const toRevealed = setTimeout(() => setPhase("revealed"), 1700);
    const toScan = setTimeout(() => setPhase("scanning"), 3600);
    const loop = setInterval(() => {
      setPhase("scanning");
      setTimeout(() => setPhase("revealed"), 1700);
    }, 3600);
    return () => {
      clearTimeout(toRevealed);
      clearTimeout(toScan);
      clearInterval(loop);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        <div className="flex gap-2">
          {Array.from({ length: SAMPLE_COUNT }).map((_, i) => (
            <CakeIcon key={i} baked size={60} />
          ))}
        </div>
        {phase === "scanning" ? (
          <motion.div
            className="absolute top-0 h-full w-[3px]"
            style={{ background: HONEY, boxShadow: `0 0 12px ${HONEY}` }}
            initial={{ left: 0, opacity: 0 }}
            animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.5, ease: "linear" }}
          />
        ) : null}
        <div className="mt-1 text-center font-mono text-[14px] uppercase tracking-[0.1em] text-muted">
          50 bolos de exemplo
        </div>
      </div>

      <span className="text-white/20">↓</span>

      <div
        className="w-[260px] rounded-lg border p-3"
        style={{ borderColor: "rgba(255,255,255,0.15)" }}
      >
        <div className="mb-2 font-mono text-[18px] uppercase tracking-[0.1em] text-honey">
          receita deduzida
        </div>
        <div className="flex flex-col gap-1">
          {DEDUCED_RECIPE.map((line, i) => (
            <AnimatePresence key={line} mode="wait">
              {phase === "revealed" ? (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="font-mono text-[18px] text-ink"
                  style={{ color: "#585858" }}
                >
                  {line}
                </motion.span>
              ) : (
                <span className="font-mono text-[11px] text-white/20">···</span>
              )}
            </AnimatePresence>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* 3. Deep learning — not even the measurements are given. The chef       */
/*    invents steps nobody wrote, one spark at a time.                    */
/* ---------------------------------------------------------------------- */
const INVENTED_STEPS = ["caramelizar a manteiga", "dupla fermentação", "glacê espelhado"];

function InventedProcess() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % INVENTED_STEPS.length), 1400);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex flex-col items-center gap-5">
      <CakeIcon baked size={165} />
      <div className="h-6">
        <AnimatePresence mode="wait">
          <motion.span
            key={INVENTED_STEPS[i]}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[18px] text-honey"
            style={{ color: "#E8B53C" }}
          >
            ✦ {INVENTED_STEPS[i]}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="font-mono text-[14px] uppercase tracking-[0.1em] text-muted">
        processos que ninguém ensinou
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------------- */

export function CookingAnalogy({
  width = 560,
  height = 420,
}: {
  width?: number;
  height?: number;
}) {
  const [stage, setStage] = useState<Stage>("tradicional");

  return (
    <div className="flex w-full max-w-full flex-col items-center">
      <VizFrame width={width} height={height} caption={STAGE_LABELS[stage]}>
        <div className="flex h-full w-full items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {stage === "tradicional" ? <RecipeSteps /> : null}
              {stage === "ml" ? <CakeScanner /> : null}
              {stage === "dl" ? <InventedProcess /> : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </VizFrame>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em]">
        {(Object.keys(STAGE_LABELS) as Stage[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStage(s)}
            aria-pressed={s === stage}
            className="rounded-md border border-stroke bg-surface px-3 py-1.5 text-muted transition hover:border-ink hover:text-ink data-[active=true]:border-ink data-[active=true]:text-ink"
            data-active={s === stage}
          >
            {STAGE_LABELS[s]}
          </button>
        ))}
      </div>
    </div>
  );
}