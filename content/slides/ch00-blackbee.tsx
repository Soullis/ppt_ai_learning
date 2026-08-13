import type { Chapter } from "@/components/slide/types";

const TEAM_IMAGES = [
  { src: "/team/photo1.jpg", alt: "Equipe de drones 1" },
  { src: "/team/photo5.JPG", alt: "Equipe de drones 2" },
  { src: "/team/photo3.png", alt: "Equipe de drones 3" },
  { src: "/team/photo4.png", alt: "Equipe de drones 4" },
];

const CHECKLIST_ITEMS = [
  "Introdução à BlackBee Drones",
  "Conceitos de Inteligência Artificial",
  "Visão Computacional",
  "Passo a passo na montagem de projeto",
  "ATIVIDADE 1",
  "ATIVIDADE 2",
];

/**
 * Asymmetric mosaic — one dominant frame, three supporting frames.
 * No card chrome: the photos ARE the layout, not content inside a box.
 */
function TeamGallery() {
  const [hero, ...rest] = TEAM_IMAGES;
  return (
    <div className="grid h-full grid-cols-2 grid-rows-2 gap-1.5">
      <div className="relative col-span-2 row-span-1 overflow-hidden rounded-xl sm:col-span-1 sm:row-span-2">
        <img src={hero.src} alt={hero.alt} className="h-full w-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 h-1 bg-amber-400" />
      </div>
      {rest.map((image) => (
        <div key={image.src} className="overflow-hidden rounded-xl">
          <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
        </div>
      ))}
    </div>
  );
}

const MISSION_CARDS = [
  {
    index: "01",
    images: [
      { src: "/figures/animals.jpg", alt: "Detecção de animal" },
      { src: "/figures/gauges.mp4", alt: "Detecção de painel" },
    ],
    title: "Detecção, identificação, classificação",
  },
  {
    index: "02",
    images: [
      { src: "/figures/gates.mp4", alt: "Gates" },
      { src: "/figures/gestos.mp4", alt: "Reconhecimento de gestos" },
    ],
    title: "Controle de navegação",
  },
  {
    index: "03",
    images: [
      { src: "/figures/hook.mp4", alt: "Hang the hook" },
      { src: "/figures/precision_land.mp4", alt: "Precision landing" },
    ],
    title: "Controle de precisão",
  },
];

function isVideo(src: string) {
  return /\.(mp4|webm|mov)$/i.test(src);
}

/**
 * Renders a video or an image in an identical frame, so mixed media never
 * shifts the layout — same object-cover, same dimensions either way.
 */
function Media({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  if (isVideo(src)) {
    return (
      <video
        src={src}
        aria-label={alt}
        className={className}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }
  return <img src={src} alt={alt} className={className} />;
}

/**
 * Editorial photo-essay style: the frame is the media, title sits directly
 * on it inside a soft scrim. A second frame (if any) becomes a small inset
 * thumbnail, like a contact sheet, instead of a bordered sub-grid.
 */
function MissionGallery() {
  return (
    <div className="grid h-full grid-cols-1 gap-2 md:grid-cols-3">
      {MISSION_CARDS.map((card) => (
        <div key={card.title} className="group relative aspect-[3/4] overflow-hidden rounded-xl">
          <div
            className={
              `h-full w-full grid ${card.images[1] ? "grid-rows-2 auto-rows-fr" : "grid-rows-1"}`
            }
          >
            <div className="overflow-hidden">
              <Media
                src={card.images[0].src}
                alt={card.images[0].alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            {card.images[1] ? (
              <div className="overflow-hidden">
                <Media
                  src={card.images[1].src}
                  alt={card.images[1].alt}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4 pt-10">
            <span className="text-xs font-semibold tracking-[0.2em] text-amber-400">
              {card.index}
            </span>
            <div className="mt-1 text-base font-semibold leading-tight text-white">
              {card.title}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * A quiet index, not a to-do list: hairline dividers, amber numerals,
 * no boxes, no checkmarks standing in for "done".
 */
function PresentationChecklist() {
  return (
    <div className="flex h-full flex-col justify-center">
      {CHECKLIST_ITEMS.map((item, i) => (
        <div
          key={item}
          className="flex items-baseline gap-4 border-b border-stroke/60 py-4 first:pt-0 last:border-b-0"
        >
          <span className="font-mono text-sm text-amber-500">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-base leading-6 text-ink">{item}</span>
        </div>
      ))}
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
            A <b>Black Bee Drones UNIFEI</b> é a primeira equipe de competição de <b>drones autônomos</b> na América Latina.
          </p>
          <p>
            Somos também a equipe mais condecorada das Américas.
          </p>
          <p className="text-muted space-y-">
            <ul className="list-disc pl-6 space-y-1 text-muted italic">
              <li>3º Lugar Mundial IMAV 2015</li>
              <li>Melhor Projeto DroneShow 2017</li>
              <li>1º Lugar Mundial IMAV 2018</li>
              <li>2º Lugar Mundial IMAV 2022</li>
              <li>3º Lugar Mundial IMAV 2023</li>
              <li>Primeiro Voo Autônomo IMAV 2023</li>
              <li>3º Lugar Mundial IMAV 2025</li>
              <li>2º Lugar Nacional SAE 2026</li>
            </ul>
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
        </div>
      ),
      viz: <PresentationChecklist />,
    },
    
  ],
};