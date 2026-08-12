import type { Chapter } from "@/components/slide/types";
import { Callout } from "@/components/ui/Callout";
import {
  ArrowRight,
  ImageOff,
  Sun,
  CheckCircle2,
  Image as ImageIcon,
  FlipHorizontal2,
  Sparkles,
  MoonStar,
  AlertTriangle,
} from "lucide-react";

export const ch03: Chapter = {
  id: "ch03",
  number: 4,
  part: 1,
  slug: "building-a-project",
  title: "Montando um projeto",
  subtitle: "Coleta → Treinamento → Avaliação",
  slides: [
    {
      id: "ch03-00",
      title: "O pipeline, de ponta a ponta",
      eyebrow: "Visão geral",
      layout: "split",
      content: (
        <div className="space-y-4 text-[14px]">
          <p>
            Todo projeto de visão para o drone passa pelas mesmas três etapas — nessa ordem, e cada
            uma condiciona a próxima.
          </p>
          <p className="text-muted">
            Um dataset ruim não é salvo por um bom treinamento, e um bom modelo mal avaliado é um
            risco escondido em voo.
          </p>
        </div>
      ),
      viz: (
        <div className="flex h-full items-center justify-center gap-3 px-4">
          {["Coleta", "Treinamento", "Avaliação"].map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className="rounded-md border border-stroke px-4 py-3 text-center">
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-honey">
                  {step}
                </span>
              </div>
              {i < 2 && <ArrowRight className="h-5 w-5 text-white/30" strokeWidth={1.5} />}
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "ch03-01",
      title: "Coleta de dados de qualidade",
      eyebrow: "3.1",
      layout: "scrollSplit",
      content: (
        <div className="space-y-4 text-[14px]">
          <p>
            <strong>Lixo entra, lixo sai</strong> — o modelo só é tão bom quanto as fotos que ele
            viu.
          </p>
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Variabilidade
            </h3>
            <p className="mt-2">
              Diferentes ambientes de voo, posições do drone em relação ao objeto, mudanças de luz —
              tudo isso precisa aparecer no dataset, não só no dia do voo.
            </p>
          </section>
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Balanceamento
            </h3>
            <p className="mt-2">
              Não adianta ter 1000 fotos do gate e 10 fotos da zebra — o modelo vai ficar ótimo em
              uma classe e cego na outra.
            </p>
          </section>
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Generalização vs especialização
            </h3>
            <p className="mt-2">
              Treinar o drone só dentro da quadra da UNIFEI faz ele decorar as paredes da quadra —
              não aprender o que é o obstáculo. Isso é overfitting.
            </p>
          </section>
        </div>
      ),
      viz: (
        <div className="grid h-full grid-cols-2 gap-3 p-4">
          <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-white/20 bg-white/5 p-4">
            <Sun className="h-6 w-6 text-white/40" strokeWidth={1.5} />
            <span className="text-center font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
              ruído — sol na lente
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-white/20 bg-white/5 p-4">
            <ImageOff className="h-6 w-6 text-white/40" strokeWidth={1.5} />
            <span className="text-center font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
              ruído — desfoque
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-honey/40 bg-honey/10 p-4">
            <CheckCircle2 className="h-6 w-6 text-honey" strokeWidth={1.5} />
            <span className="text-center font-mono text-[10px] uppercase tracking-[0.1em] text-honey">
              ideal — nítida
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-honey/40 bg-honey/10 p-4">
            <CheckCircle2 className="h-6 w-6 text-honey" strokeWidth={1.5} />
            <span className="text-center font-mono text-[10px] uppercase tracking-[0.1em] text-honey">
              ideal — bem enquadrada
            </span>
          </div>
          {/* TODO: substituir os 4 quadros acima por uma galeria real de fotos
              da equipe (ruído: sol na lente, desfoque · ideal: nítida, bem enquadrada) */}
        </div>
      ),
    },
    {
      id: "ch03-02",
      title: "Anotação e treinamento",
      eyebrow: "3.2",
      layout: "scrollSplit",
      content: (
        <div className="space-y-4 text-[14px]">
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Anotação — o trabalho braçal
            </h3>
            <p className="mt-2">
              No Roboflow, cada objeto recebe uma caixa delimitadora. O cuidado está em fazer caixas
              justas — nem muito largas, nem cortando o objeto.
            </p>
          </section>
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Divisão de dados
            </h3>
            <p className="mt-2">
              Treino, validação e teste. É como estudar pelas listas de exercícios, fazer um
              simulado, e só então prestar a prova final — cada etapa usa dados que o modelo não
              decorou na etapa anterior.
            </p>
          </section>
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Data augmentation
            </h3>
            <p className="mt-2">
              Multiplica o dataset &ldquo;enganando&rdquo; a IA: cortar, rotacionar, adicionar ruído
              nas imagens para o modelo ficar casca-grossa.
            </p>
          </section>
        </div>
      ),
      viz: (
        <div className="flex h-full flex-col justify-center gap-4 p-4">
          <div className="flex items-center justify-center rounded-md border border-dashed border-white/20 bg-white/5 py-6 text-center">
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
              🎬 gravação de tela — Roboflow desenhando uma bounding box
            </span>
          </div>
          {/* TODO: embutir GIF/vídeo real da plataforma Roboflow aqui */}
          <div className="flex items-center justify-center gap-3">
            {[
              { icon: ImageIcon, label: "original" },
              { icon: FlipHorizontal2, label: "espelhada" },
              { icon: Sparkles, label: "com ruído" },
              { icon: MoonStar, label: "mais escura" },
            ].map(({ icon: Icon, label }, i, arr) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1 rounded-md border border-stroke px-3 py-3">
                  <Icon className="h-5 w-5 text-honey/80" strokeWidth={1.5} />
                  <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-muted">
                    {label}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-white/20" strokeWidth={1.5} />
                )}
              </div>
            ))}
          </div>
          {/* carrossel ilustrativo — trocar por imagens reais do dataset da equipe */}
        </div>
      ),
    },
    {
      id: "ch03-03",
      title: "Análise de métricas",
      eyebrow: "3.3",
      layout: "wideViz",
      content: (
        <div className="space-y-4 text-[14px]">
          <p>O treinamento acabou. Como saber se o drone está pronto para voar?</p>
          <ul className="space-y-2">
            <li>
              <strong>Falso positivo:</strong> o drone &ldquo;vê&rdquo; um obstáculo onde não tem
              nada e desvia bruscamente — pode bater em uma parede.
            </li>
            <li>
              <strong>Falso negativo:</strong> o drone ignora um obstáculo que está na frente dele e
              colide frontalmente.
            </li>
          </ul>
          <p className="text-muted">
            Na matriz de confusão, a diagonal principal são os acertos. Fora dela, os dois tipos de
            erro acima.
          </p>
          <Callout label="Precision vs Recall">
            Trade-off: um modelo com <strong>Recall alto</strong> não deixa passar nada (bom contra
            falso negativo), um modelo com <strong>Precision alta</strong> só aciona quando tem
            certeza (bom contra falso positivo). Não dá para maximizar os dois ao mesmo tempo.
          </Callout>
        </div>
      ),
      viz: (
        <div className="flex h-full items-center justify-center gap-10 p-4">
          <div className="space-y-2">
            <div className="text-center font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
              Matriz de confusão
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div className="flex h-16 w-20 flex-col items-center justify-center rounded-sm bg-honey/40 text-[11px] text-honey">
                <AlertTriangle className="mb-1 h-3 w-3 opacity-0" />
                VP
              </div>
              <div className="flex h-16 w-20 flex-col items-center justify-center rounded-sm bg-white/5 text-[11px] text-muted">
                FP
              </div>
              <div className="flex h-16 w-20 flex-col items-center justify-center rounded-sm bg-white/5 text-[11px] text-muted">
                FN
              </div>
              <div className="flex h-16 w-20 flex-col items-center justify-center rounded-sm bg-honey/40 text-[11px] text-honey">
                VN
              </div>
            </div>
            <div className="text-center font-mono text-[9px] uppercase tracking-[0.08em] text-muted/70">
              diagonal = acertos
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <GaugeArc label="Precision" percent={88} />
            <GaugeArc label="Recall" percent={62} />
          </div>
          {/* Matriz e gauges são ilustrativos (números de exemplo) —
              trocar por componentes conectados às métricas reais do modelo,
              ex. um heatmap estilo Seaborn e gauges animados. */}
        </div>
      ),
    },
    {
      id: "ch03-04",
      title: "Do dataset ao voo",
      eyebrow: "Resumo",
      layout: "prose",
      content: (
        <div className="space-y-3 text-[15px]">
          <p>
            Coleta variada e balanceada, anotação cuidadosa com divisão treino/validação/teste,
            augmentation para robustez, e uma leitura honesta de precision/recall antes de decolar.
          </p>
          <p className="text-muted">
            Cada etapa do pipeline é um lugar onde o projeto pode falhar silenciosamente — a
            avaliação é a última chance de pegar isso no chão, não no ar.
          </p>
        </div>
      ),
    },
  ],
};

/**
 * Small illustrative gauge — not wired to real metrics.
 * Swap for a proper animated Gauge component when one exists.
 */
function GaugeArc({ label, percent }: { label: string; percent: number }) {
  const r = 34;
  const circumference = 2 * Math.PI * r;
  const dash = (percent / 100) * circumference;
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 80 80" className="h-16 w-16 -rotate-90">
        <circle cx="40" cy="40" r={r} className="fill-none stroke-current text-white/10" strokeWidth="6" />
        <circle
          cx="40"
          cy="40"
          r={r}
          className="fill-none stroke-current text-honey"
          strokeWidth="6"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>
      <div>
        <div className="font-mono text-[13px] text-honey">{percent}%</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">{label}</div>
      </div>
    </div>
  );
}