import type { Chapter } from "@/components/slide/types";
import { Callout } from "@/components/ui/Callout";
import { Sun, CloudSun, Hand, ScanEye, Boxes, Radio } from "lucide-react";

export const ch02: Chapter = {
  id: "ch02",
  number: 3,
  part: 1,
  slug: "cv-classic-vs-modern",
  title: "Visão computacional: clássica vs moderna",
  subtitle: "Por que abandonamos os filtros puros em favor das redes neurais",
  slides: [
    {
      id: "ch02-00",
      title: "Regras vs padrões",
      eyebrow: "Objetivo",
      layout: "prose",
      content: (
        <div className="space-y-5">
          <p>
            Mostrar, na prática, por que abandonamos — em grande parte — os algoritmos puros em
            favor das redes neurais para desafios complexos.
          </p>
          <p className="text-muted">
            A visão clássica funciona bem em cenários controlados. O problema aparece quando o
            mundo real deixa de cooperar.
          </p>
        </div>
      ),
    },
    {
      id: "ch02-01",
      title: "Visão clássica — regras e filtros",
      eyebrow: "Roteiro",
      layout: "split",
      content: (
        <div className="space-y-4 text-[14px]">
          <p>
            No <strong>Slalom</strong>, um filtro de cor em HSV resolvia bem o problema: leve,
            simples, fácil de depurar.
          </p>
          <ul className="space-y-2">
            <li>· Funciona bem? Sim — para a cor certa, sob a luz certa</li>
            <li>· É leve e simples de rodar embarcado</li>
            <li>· Mas é <strong>frágil</strong>: depende de uma faixa de cor fixa</li>
          </ul>
          <Callout label="Onde quebra">
            Uma nuvem tampa o sol, a cor percebida pela câmera muda, a faixa HSV deixa de bater —
            a regra quebra e o drone erra o gate.
          </Callout>
        </div>
      ),
      viz: (
        <div className="flex h-full flex-col items-center justify-center gap-6 px-6">
          <div className="flex items-center gap-3">
            <Sun className="h-9 w-9 text-honey" strokeWidth={1.5} />
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-honey">
              Sol estável → HSV acerta
            </span>
          </div>
          <div className="h-px w-3/4 bg-stroke" />
          <div className="flex items-center gap-3">
            <CloudSun className="h-9 w-9 text-white/40" strokeWidth={1.5} />
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
              Nuvem passa → HSV erra
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "ch02-02",
      title: "Limitações da visão clássica",
      eyebrow: "Roteiro",
      layout: "split",
      content: (
        <div className="space-y-4 text-[14px]">
          <p>
            Controle por gestos deixa o problema ainda mais claro: como programar um{" "}
            <code className="font-mono text-[13px]">if/else</code> para detectar uma mão?
          </p>
          <ul className="space-y-2">
            <li>· A cor da pele muda de pessoa para pessoa</li>
            <li>· O formato da mão muda de acordo com o ângulo da câmera</li>
            <li>· A iluminação varia entre ambientes e horários</li>
          </ul>
          <p className="text-muted">
            São características demais para escrever à mão, uma por uma, em regras fixas.
          </p>
        </div>
      ),
      viz: (
        <div className="flex h-full flex-col items-center justify-center gap-5 px-6">
          <Hand className="h-10 w-10 text-white/40" strokeWidth={1.5} />
          <div className="space-y-2 text-center">
            <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
              cor da pele · ângulo · iluminação · formato
            </div>
            <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-honey">
              variáveis demais para if/else
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "ch02-03",
      title: "Visão moderna — padrões semânticos",
      eyebrow: "Roteiro",
      layout: "split",
      content: (
        <div className="space-y-4 text-[14px]">
          <p>
            A IA não olha regras de pixel — ela aprende <strong>padrões semânticos</strong>: o que
            é um dedo, o que é uma palma, o que é um gate.
          </p>
          <p className="text-muted">
            Em vez de uma faixa de cor fixa, o modelo generaliza a partir de milhares de exemplos
            variados — luz, ângulo, pele, fundo — e aprende o que é invariante entre eles.
          </p>
        </div>
      ),
      viz: (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6">
          <ScanEye className="h-10 w-10 text-honey" strokeWidth={1.5} />
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-honey">
            padrão semântico, não regra de pixel
          </span>
        </div>
      ),
    },
    {
      id: "ch02-04",
      title: "Clássica vs moderna, lado a lado",
      eyebrow: "Demonstração",
      layout: "wideViz",
      content: (
        <div className="space-y-4 text-[14px]">
          <p>
            Split-screen: metade com o filtro HSV em preto e branco (clássica), metade com as
            bounding boxes coloridas do modelo YOLO da equipe (moderna).
          </p>
          <Callout label="Ao vivo">
            Webcam ligada, simulando a Gradio Web Interface da página{" "}
            <code className="font-mono text-[13px]">ai-learning</code> — o modelo detecta pessoas
            ou gestos com as mãos em tempo real, na plateia.
          </Callout>
        </div>
      ),
      viz: (
        <div className="flex h-full w-full overflow-hidden rounded-md border border-stroke">
          <div className="flex flex-1 flex-col items-center justify-center gap-2 border-r border-stroke bg-white/5 grayscale">
            <Boxes className="h-8 w-8 text-white/50" strokeWidth={1.5} />
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
              HSV mask — clássica
            </span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-2 bg-honey/10">
            <Radio className="h-8 w-8 text-honey" strokeWidth={1.5} />
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-honey">
              YOLO boxes — moderna
            </span>
          </div>
        </div>
      ),
    },
  ],
};