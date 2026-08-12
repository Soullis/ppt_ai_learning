"use client";

import { useState } from "react";

const MISSION_CARDS = [
  {
    title: "Gate run",
    subtitle: "O drone atravessa o gate com visão e decisão em tempo real.",
  },
  {
    title: "Leitura de manômetro",
    subtitle: "Extrair informação visual de instrumentos e transformar em ação.",
  },
  {
    title: "Precision Land",
    subtitle: "Pouso de alta precisão usando percepção de câmera e controle fino.",
  },
  {
    title: "Hang the Hook",
    subtitle: "Posicionamento exato para pendurar o gancho em um alvo móvel.",
  },
];

const CHALLENGE_CARDS = [
  {
    title: "Detecção e classificação",
    subtitle: "Zebras, manômetros e gates reconhecidos em vídeo de voo.",
    accent: "#E5C05A",
  },
  {
    title: "Navegação autônoma",
    subtitle: "Escolha da rota, manutenção de curso e reação a obstáculos.",
    accent: "#4EA8FF",
  },
  {
    title: "Pouso de precisão",
    subtitle: "Precision Land e Hang the Hook com visão a bordo.",
    accent: "#7DD9A7",
  },
];

const CHECKLIST_ITEMS = [
  "Apresentar a equipe e a missão",
  "Explicar drones que pensam no ar",
  "Mostrar desafios reais de visão",
  "Abrir a caixa preta do workflow",
  "Deixar claro o roteiro do workshop",
];

export function MissionGallery() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {MISSION_CARDS.map((card) => (
        <div key={card.title} className="rounded-3xl border border-stroke bg-surface p-5 shadow-sm">
          <div className="h-36 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-700 p-4 text-white">
            <div className="text-sm uppercase tracking-[0.2em] text-slate-300">Portfólio</div>
            <div className="mt-6 text-xl font-semibold">{card.title}</div>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
}

export function ChallengeGallery() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {CHALLENGE_CARDS.map((card) => (
        <div key={card.title} className="rounded-3xl border border-stroke bg-surface p-5 shadow-sm">
          <div
            className="mb-4 h-2 w-16 rounded-full"
            style={{ backgroundColor: card.accent }}
          />
          <div className="text-xl font-semibold text-ink">{card.title}</div>
          <p className="mt-3 text-sm leading-6 text-muted">{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
}

export function WorkshopChecklist() {
  const [checked, setChecked] = useState<boolean[]>(Array(CHECKLIST_ITEMS.length).fill(false));

  const toggle = (index: number) => {
    setChecked((prev) => prev.map((item, idx) => (idx === index ? !item : item)));
  };

  return (
    <div className="space-y-4 rounded-3xl border border-stroke bg-surface p-5 shadow-sm">
      <div className="text-sm uppercase tracking-[0.24em] text-muted">Checklist do workshop</div>
      <ul className="space-y-3">
        {CHECKLIST_ITEMS.map((item, index) => (
          <li key={item}>
            <button
              type="button"
              onClick={() => toggle(index)}
              className="flex w-full items-start gap-4 rounded-2xl border border-stroke bg-bone px-4 py-4 text-left transition hover:border-ink/50"
              aria-pressed={checked[index]}
            >
              <span
                className={
                  "mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border text-[13px] font-semibold " +
                  (checked[index]
                    ? "border-ink bg-ink text-white"
                    : "border-stroke bg-white text-muted")
                }
              >
                {checked[index] ? "✓" : ""}
              </span>
              <span className="text-sm leading-6 text-ink">{item}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted">
        Clique nos tópicos à medida que avançarmos na apresentação para acompanhar o que já foi coberto.
      </p>
    </div>
  );
}
