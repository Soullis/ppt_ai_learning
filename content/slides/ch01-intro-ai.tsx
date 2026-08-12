import type { Chapter } from "@/components/slide/types";
import { Callout } from "@/components/ui/Callout";
import { M } from "@/components/math/Math";
import { ChefHat, BookOpenCheck, FlaskConical, Sparkles } from "lucide-react";

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
      title: "O que é IA, de verdade",
      eyebrow: "Objetivo",
      layout: "prose",
      content: (
        <div className="space-y-5">
          <p>
            Antes de falar de modelos, redes e treinamento, precisamos nivelar um ponto: o que
            realmente <strong>é</strong> Inteligência Artificial — sem os robôs de ficção científica.
          </p>
          <ul className="space-y-2 text-[15px]">
            <li>· IA é um campo amplo, não um único tipo de sistema</li>
            <li>· Machine Learning e Deep Learning são subconjuntos — não sinônimos — de IA</li>
            <li>· A diferença entre eles está em <strong>como</strong> o sistema chega ao resultado</li>
          </ul>
          <p className="text-muted">
            Os próximos slides constroem essa taxonomia e uma analogia para fixá-la.
          </p>
        </div>
      ),
    },
    {
      id: "ch01-01",
      title: "Taxonomia: IA, ML e DL",
      eyebrow: "Roteiro",
      layout: "split",
      content: (
        <div className="space-y-4 text-[14px]">
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.1em] text-honey">
              IA — Inteligência Artificial
            </h3>
            <p className="mt-1 text-muted">
              O conceito amplo. Sistemas que simulam a lógica humana — de NPCs de jogos antigos a
              sistemas especialistas com regras escritas à mão.
            </p>
          </div>
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.1em] text-honey">
              ML — Machine Learning
            </h3>
            <p className="mt-1 text-muted">
              Estatística multivariada. A máquina não recebe as regras prontas — ela encontra
              padrões nos dados através de semelhanças.
            </p>
          </div>
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.1em] text-honey">
              DL — Deep Learning
            </h3>
            <p className="mt-1 text-muted">
              Extração profunda de características, via redes neurais. Ideal para imagens: o
              algoritmo aprende sozinho onde focar.
            </p>
          </div>
          <p className="text-muted">
            Cada camada está contida na anterior: <M>{"DL \\subset ML \\subset IA"}</M>.
          </p>
        </div>
      ),
      viz: (
        <svg viewBox="0 0 400 400" className="h-full w-full">
          <circle
            cx="200"
            cy="210"
            r="170"
            className="fill-current text-white/5 stroke-current text-white/25"
            strokeWidth="1.5"
          />
          <circle
            cx="200"
            cy="230"
            r="115"
            className="fill-current text-honey/10 stroke-current text-honey/50"
            strokeWidth="1.5"
          />
          <circle
            cx="200"
            cy="250"
            r="60"
            className="fill-current text-honey/25 stroke-current text-honey"
            strokeWidth="1.5"
          />
          <text
            x="200"
            y="55"
            textAnchor="middle"
            className="fill-current text-white/70"
            style={{ fontFamily: "monospace", fontSize: "13px", letterSpacing: "0.1em" }}
          >
            IA
          </text>
          <text
            x="200"
            y="130"
            textAnchor="middle"
            className="fill-current text-honey/80"
            style={{ fontFamily: "monospace", fontSize: "13px", letterSpacing: "0.1em" }}
          >
            ML
          </text>
          <text
            x="200"
            y="250"
            textAnchor="middle"
            className="fill-current text-honey"
            style={{ fontFamily: "monospace", fontSize: "14px", letterSpacing: "0.1em" }}
          >
            DL
          </text>
        </svg>
      ),
    },
    {
      id: "ch01-02",
      title: "A analogia do cozinheiro",
      eyebrow: "Momento didático",
      layout: "scrollSplit",
      content: (
        <div className="space-y-5 text-[14px]">
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Programação tradicional
            </h3>
            <p className="mt-2">
              O cozinheiro recebe a receita exata: se colocar 200g de farinha, o bolo cresce. As
              regras já vêm prontas — o cozinheiro só executa.
            </p>
          </section>
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Machine Learning
            </h3>
            <p className="mt-2">
              O cozinheiro prova 50 bolos diferentes, anota os ingredientes de cada um e deduz uma
              proporção matemática que funciona. Ninguém deu a receita — ele a inferiu dos exemplos.
            </p>
          </section>
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
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
      viz: (
        <div className="flex h-full flex-col items-center justify-center gap-8 px-4">
          <div className="flex items-center gap-3">
            <BookOpenCheck className="h-8 w-8 text-white/50" strokeWidth={1.5} />
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
              Receita pronta
            </span>
          </div>
          <div className="flex items-center gap-3">
            <FlaskConical className="h-8 w-8 text-honey/70" strokeWidth={1.5} />
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-honey/80">
              Proporção deduzida
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-honey" strokeWidth={1.5} />
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-honey">
              Processo inventado
            </span>
          </div>
          <ChefHat className="mt-2 h-10 w-10 text-white/30" strokeWidth={1.2} />
        </div>
      ),
    },
  ],
};