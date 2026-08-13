import type { Chapter } from "@/components/slide/types";
import { Callout } from "@/components/ui/Callout";
import { Sun, CloudSun, Hand, ScanEye, Boxes, Radio } from "lucide-react";
import { ConvKernel } from "@/components/viz/ConvKernel";
import { ConeThresholdDemo } from "@/components/viz/ConeThreshold";
import { M, MBlock } from "@/components/math/Math";
import { FaceFeatureProgression } from "@/components/viz/FaceFeatureProgression";

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
      title: "Aplicações em visão computacional",
      eyebrow: "Visão computacional clássica",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Para aplicações mais simples — como identificar um cone laranja em uma pista — não é
            preciso aprender nada: basta descrever a regra.
          </p>
          <p>
            O programa converte a imagem para o espaço de cor <M>HSV</M>, define uma faixa de tom
            que corresponde ao laranja do cone, e marca como positivo todo pixel dentro dela.
          </p>
          <p className="text-muted">
            É um passo a passo determinístico: mesma entrada, mesma saída, sempre. Funciona bem
            quando o alvo tem uma característica fixa e conhecida — aqui, a cor.
          </p>
        </div>
      ),
      viz: <ConeThresholdDemo />,
    },
    {
      id: "ch02-01",
      title: "Aplicações em visão computacional moderna",
      eyebrow: "Deep learning aplicado",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            E se o alvo não tiver cor nem formato fixo? Uma mão pode aparecer em qualquer tom de
            pele, ângulo, iluminação e pose — não existe uma regra simples de cor ou contorno que
            a descreva.
          </p>
          <p>
            Nesses casos, o programa não recebe uma regra pronta: uma rede neural profunda
            aprende, a partir de milhares de exemplos, quais combinações de bordas, texturas e
            formas indicam "isto é uma mão".
          </p>
          <p className="text-muted">
            A rede constrói sua própria representação da mão — pontos-chave, articulações,
            contornos — em vez de seguir um algoritmo escrito por nós.
          </p>
        </div>
      ),
      viz: <ConvKernel />,
    }, {
      id: "ch01-04",
      title: "Detecção em ação",
      eyebrow: "Demonstração",
      layout: "fullViz",
      viz: (
        <video
          src="/figures/gestos.mp4"
          className="h-full w-full rounded-xl object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      ),
    }, {
      id: "ch02-05",
      title: "Da textura ao objeto",
      eyebrow: "Hierarquia de features",
      layout: "fullViz",
      viz: <FaceFeatureProgression />,
    },
  ],
};