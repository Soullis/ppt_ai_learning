import type { Chapter } from "@/components/slide/types";

const TEAM_IMAGES = [
  { src: "/team/photo1.jpg", alt: "Equipe de drones 1" },
  { src: "/team/photo5.JPG", alt: "Equipe de drones 2" },
  { src: "/team/photo3.png", alt: "Equipe de drones 3" },
  { src: "/team/photo4.png", alt: "Equipe de drones 4" },
];

const CHECKLIST_ITEMS = [
  "Quem somos e quais competições ganhamos",
  "O que faz uma equipe de drones autônomos",
  "Como a IA entra nas missões",
  "O passo a passo do workshop",
];

function TeamGallery() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {TEAM_IMAGES.map((image) => (
        <div key={image.src} className="overflow-hidden rounded-3xl border border-stroke bg-surface shadow-sm">
          <div className="aspect-[4/3] w-full">
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

const MISSION_CARDS = [
  {
    images: [
      { src: "/figures/animal.jpg", alt: "Detecção de animal" },
      { src: "/figures/gauge.jpg", alt: "Detecção de painel" },
    ],
    title: "Detecção, identificação, classificação",
  },
  {
    images: [
      { src: "/figures/gates.jpg", alt: "Gates" },
    ],
    title: "Controle de Navegação",
  },
  {
    images: [
      { src: "/figures/precision_landing.jpg", alt: "Precision landing" },
      { src: "/figures/hang_the_hook.jpg", alt: "Hang the hook" },
    ],
    title: "Controle de precisão",
  },
];

function MissionGallery() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {MISSION_CARDS.map((card) => (
        <div key={card.title} className="overflow-hidden rounded-3xl border border-stroke bg-surface shadow-sm">
          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2">
            {card.images.map((image) => (
              <div key={image.src} className="overflow-hidden rounded-2xl bg-slate-900">
                <div className="aspect-[4/3] w-full">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ))}
            {card.images.length === 1 ? <div className="rounded-2xl bg-slate-900" /> : null}
          </div>
          <div className="p-5">
            <div className="text-lg font-semibold text-ink">{card.title}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PresentationChecklist() {
  return (
    <div className="rounded-3xl border border-stroke bg-surface p-5 shadow-sm">
      <div className="text-sm uppercase tracking-[0.24em] text-muted">Checklist da apresentação</div>
      <ul className="mt-4 space-y-3">
        {CHECKLIST_ITEMS.map((item) => (
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
      <p className="mt-4 text-sm text-muted">
        Vamos marcar esses pontos à medida que avançamos no capítulo.
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
      title: "Quem somos e o que fazemos",
      eyebrow: "Equipe e conquistas",
      layout: "split",
      content: (
        <div className="space-y-5">
          <p>
            Somos a equipe de drones autônomos mais premiada das Américas. Trabalhamos com
            missões aéreas em que os drones veem, decidem e executam sem controle por rádio.
          </p>
          <p>
            Nosso foco é usar visão computacional para detectar objetos, navegar com precisão e
            completar tarefas complexas em ambientes reais.
          </p>
          <p className="text-muted">
            Já competimos e vencemos desafios de autonomia, navegação e inspeção, levando nossa
            tecnologia para as principais competições da região.
          </p>
        </div>
      ),
      viz: <TeamGallery />,
    },
    {
      id: "ch00-01",
      title: "O que faz uma equipe de drones autônomos?",
      eyebrow: "Missões inteligentes",
      layout: "fullViz",
      viz: <MissionGallery />,
    },
    {
      id: "ch00-02",
      title: "Checklist da apresentação",
      eyebrow: "Gancho",
      layout: "split",
      content: (
        <div className="space-y-5">
          <p>
            Neste capítulo, vamos apresentar nossa equipe, explicar o papel da IA nas missões de
            drones e mostrar como o workshop guia você do conceito até a implementação.
          </p>
          <p className="text-muted">
            Use a checklist ao lado para acompanhar os principais pontos que vão aparecer nos
            próximos slides.
          </p>
        </div>
      ),
      viz: <PresentationChecklist />,
    },
  ],
};
