import type { Chapter } from "@/components/slide/types";
import { Callout } from "@/components/ui/Callout";
import { BookOpenCheck, FlaskConical, Sparkles, ChefHat } from "lucide-react";
import { NestedVenn } from "../../components/viz/NestedVenn";
import { CookingAnalogy } from "../../components/viz/CookingAnalogy";
import { SemanticGapMatrix } from "../../components/viz/SemanticGapMatrix";

/**
 * Vertical timeline, not a bordered grid of boxes: three stages, growing
 * honey intensity as the system takes on more of the work itself. The
 * connecting line is the pipeline — order carries the meaning here.
 */
function CookingPipeline() {
  const stages = [
    {
      icon: BookOpenCheck,
      label: "Receita pronta",
      tag: "regra dada por nós",
      ring: "border-white/20",
      tone: "text-white/50",
    },
    {
      icon: FlaskConical,
      label: "Proporção deduzida",
      tag: "regra aprendida dos exemplos",
      ring: "border-honey/40",
      tone: "text-honey/75",
    },
    {
      icon: Sparkles,
      label: "Processo inventado",
      tag: "regra criada pela própria rede",
      ring: "border-honey",
      tone: "text-honey",
    },
  ];
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-4">
      {stages.map((stage, i) => (
        <div key={stage.label} className="flex flex-col items-center">
          <div className="flex w-[220px] flex-col items-center gap-2 text-center">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full border ${stage.ring}`}
            >
              <stage.icon className={`h-6 w-6 ${stage.tone}`} strokeWidth={1.5} />
            </div>
            <span className={`font-mono text-[11px] uppercase tracking-[0.1em] ${stage.tone}`}>
              {stage.label}
            </span>
            <span className="text-[10px] text-muted">{stage.tag}</span>
          </div>
          {i < stages.length - 1 ? <div className="my-2 h-6 w-px bg-white/15" /> : null}
        </div>
      ))}
      <ChefHat className="mt-4 h-8 w-8 text-white/25" strokeWidth={1.2} />
    </div>
  );
}

export const ch01: Chapter = {
  id: "ch01",
  number: 1,
  part: 1,
  slug: "intro-ai",
  title: "Introdução à Inteligência Artificial",
  subtitle: "Nivelando o conhecimento — da ficção científica à estatística aplicada",
  slides: [
    {
      id: "ch01-00",
      title: "O que é Inteligência Artificial?",
      eyebrow: "Definições",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            <strong>Inteligência Artificial</strong> — sistemas que percebem, raciocinam,
            planejam e agem. Exemplos: sistemas especialistas, planejadores simbólicos,
            programas que jogam jogos.
          </p>
          <p>
            <strong>Machine Learning</strong> — aprende padrões estatísticos a partir de
            dados, em vez de regras explícitas. Melhora com mais exemplos.
          </p>
          <p>
            <strong>Deep Learning</strong> — redes neurais de múltiplas camadas que
            aprendem suas próprias características a partir de dados brutos e não estruturados
            (imagens, áudio, texto).
          </p>
        </div>
      ),
      viz: <NestedVenn />,
    },
    {
      id: "ch01-01",
      title: "A analogia do cozinheiro",
      eyebrow: "Momento didático",
      layout: "scrollSplit",
      content: (
        <div className="space-y-5 text-[18px]">
          <section>
            <h3 className="font-mono text-[13px] uppercase tracking-[0.12em] text-muted">
              Programação tradicional
            </h3>
            <p className="mt-2">
              O cozinheiro recebe a receita exata: se colocar 200g de farinha, o bolo cresce. As
              regras já vêm prontas — o cozinheiro só executa.
            </p>
          </section>
          <section>
            <h3 className="font-mono text-[13px] uppercase tracking-[0.12em] text-muted">
              Machine Learning
            </h3>
            <p className="mt-2">
              O cozinheiro prova 50 bolos diferentes, anota os ingredientes de cada um e deduz
              uma proporção matemática que funciona. Ninguém deu a receita — ele a inferiu dos
              exemplos.
            </p>
          </section>
          <section>
            <h3 className="font-mono text-[13px] uppercase tracking-[0.12em] text-muted">
              Deep Learning
            </h3>
            <p className="mt-2">
              O chef que, além de deduzir os ingredientes, inventa novos processos culinários
              complexos para chegar ao bolo perfeito — sem que ninguém tenha ensinado os passos.
            </p>
            <Callout label="Fixando a ideia">
              Mesmo objetivo (o bolo perfeito), três caminhos diferentes até ele: regra dada,
              regra deduzida, e processo inventado.
            </Callout>
          </section>
        </div>
      ),
      viz: <CookingAnalogy />,
    }, {
      id: "ch01-02",
      title: "O que a máquina realmente vê?",
      eyebrow: "A Lacuna Semântica",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Para nós, reconhecer um obstáculo é instintivo. Para o drone, a câmera entrega
            apenas "ingredientes crus": uma matriz de números $I(x, y) = [R, G, B]$.
          </p>
          <p>
            Cada pixel da imagem carrega três valores de intensidade (Vermelho, Verde e Azul). 
            Como vemos ao lado, é exatamente assim — como uma grade numérica fria — que a máquina 
            enxerga o mundo.
          </p>
          <Callout label="A falha das regras fixas">
            Se uma nuvem passar e escurecer a imagem, todos esses números mudam instantaneamente. 
            É por isso que a Visão Computacional precisa do <em>Deep Learning</em>: para aprender a 
            identificar padrões (bordas e formas) no meio dessa matriz, em vez de depender de "receitas prontas" que quebram com qualquer sombra.
          </Callout>
        </div>
      ),
      viz: <SemanticGapMatrix />,
    },

  ],
};