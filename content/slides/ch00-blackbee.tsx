import type { Chapter } from "@/components/slide/types";

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

function MissionGallery() {
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

function ChallengeGallery() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {CHALLENGE_CARDS.map((card) => (
        <div key={card.title} className="rounded-3xl border border-stroke bg-surface p-5 shadow-sm">
          <div className="mb-4 h-2 w-16 rounded-full" style={{ backgroundColor: card.accent }} />
          <div className="text-xl font-semibold text-ink">{card.title}</div>
          <p className="mt-3 text-sm leading-6 text-muted">{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
}

function WorkshopChecklist() {
  return (
    <div className="space-y-4 rounded-3xl border border-stroke bg-surface p-5 shadow-sm">
      <div className="text-sm uppercase tracking-[0.24em] text-muted">Checklist do workshop</div>
      <ul className="space-y-3">
        {CHECKLIST_ITEMS.map((item, index) => (
          <li key={item}>
            <div className="flex items-start gap-4 rounded-2xl border border-stroke bg-bone px-4 py-4 text-left">
              <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-ink bg-ink text-white text-[13px] font-semibold">
                ✓
              </span>
              <span className="text-sm leading-6 text-ink">{item}</span>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted">
        Os tópicos acima serão abordados ao longo do workshop.
      </p>
    </div>
  );
}

export const ch00: Chapter = {
  id: "ch00",
  number: 0,
  part: 1,
  slug: "black-bee-vision",
  title: "Black Bee Drones",
  subtitle: "Visão computacional e objetivo do workshop",
  slides: [
    {
      id: "ch00-00",
      title: "Black Bee Drones e visão computacional",
      eyebrow: "Abertura",
      layout: "split",
      content: (
        <div className="space-y-5">
          <p>
            Somos a primeira equipe de drones autônomos da América Latina e a mais premiada das
            Américas. Nossa missão é provar que drones podem pensar no ar e executar missões sem
            controle por rádio.
          </p>
          <p>
            Aqui não falamos de joystick: falamos de câmeras, redes neurais e decisões que são
            tomadas a cada frame para manter o drone no caminho certo e cumprir a tarefa.
          </p>
          <p className="text-muted">
            Hoje vamos abrir a "caixa preta" e mostrar o passo a passo de como saímos do zero até uma
            IA capaz de guiar um drone em voo real.
          </p>
        </div>
      ),
      viz: <MissionGallery />,
    },
    {
      id: "ch00-01",
      title: "Desafios resolvidos com câmeras",
      eyebrow: "Aplicações reais",
      layout: "wideViz",
      content: (
        <div className="space-y-5">
          <p>
            A visão computacional é o sensor central das nossas missões. Ela transforma pixels em
            decisões e permite aos drones agir com autonomia.
          </p>
          <ul className="space-y-3 text-[15px]">
            <li>· Detecção e classificação de objetos: zebras, manômetros e gates.</li>
            <li>· Navegação autônoma: entender a cena, seguir o plano e desviar de obstáculos.</li>
            <li>· Pouso de precisão: Precision Land e Hang the Hook com visão a bordo.</li>
          </ul>
          <p className="text-muted">
            Esses são exemplos concretos do que nossa IA já faz em voo: ver, entender e agir.
          </p>
        </div>
      ),
      viz: <ChallengeGallery />,
    },
    {
      id: "ch00-02",
      title: "Objetivo de hoje",
      eyebrow: "Workshop",
      layout: "split",
      content: (
        <div className="space-y-5">
          <p>
            Nosso objetivo é mostrar o fluxo completo: da coleta de dados até a rede que guia o
            drone em tempo real. Não é apenas teoria, é a prática por trás de uma missão real.
          </p>
          <p className="text-muted">
            Você vai sair com uma visão clara de como montar uma solução de IA para drones a partir
            do zero.
          </p>
        </div>
      ),
      viz: <WorkshopChecklist />,
    },
  ],
};
