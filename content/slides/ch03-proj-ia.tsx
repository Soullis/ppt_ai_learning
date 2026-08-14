import type { Chapter } from "@/components/slide/types";
import { Callout } from "@/components/ui/Callout";
import {
  ArrowRight,
  ImageOff,
  Sun,
  CheckCircle2,
  AlertTriangle,
  Target,
  Maximize,
  MousePointer2,
  Crosshair,
  PieChart,
  Wand2,
  Stethoscope,
  Table,
  Scale,
  ScanSearch,
  Percent,
  Activity
} from "lucide-react";

import { AugmentationGallery } from "@/components/viz/AugmentationGallery";
import { SplitBar } from "@/components/viz/SplitBar";
import { PrecisionRecallSandbox } from "@/components/viz/PrecisionRecallSandbox";
import { ConfusionMatrix } from "@/components/viz/ConfusionMatrix";
import { Pipeline } from "@/components/viz/Pipeline";
import { NoiseVsClean } from "@/components/viz/NoiseVsClean";
import { BiasVariance } from "@/components/viz/BiasVariance";

const passosDaIA = [
  {
    label: "Coleta",
    detail: "Captura de dados brutos"
  },
  {
    label: "Treinamento",
    detail: "Ajuste do modelo de IA"
  },
  {
    label: "Avaliação",
    detail: "Análise de métricas"
  }
];

export const ch03: Chapter = {
  id: "ch03",
  number: 4,
  part: 1,
  slug: "building-a-project",
  title: "Montando um projeto",
  subtitle: "Coleta → Treinamento → Métricas",
  slides: [
    {
      id: "ch03-00",
      title: "O pipeline de treinamento",
      eyebrow: "Visão geral",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Todo projeto de visão computacional na Black Bee segue um fluxo lógico. Cada
            etapa é dependente do sucesso da etapa anterior.
          </p>
          <ul className="space-y-2">
            <li>
              <strong>Coleta:</strong> Juntar os dados brutos que ensinarão o modelo.
            </li>
            <li>
              <strong>Treinamento:</strong> Onde a rede neural aprende a extrair as características.
            </li>
            <li>
              <strong>Métricas:</strong> A prova final para saber se o drone pode voar com segurança.
            </li>
          </ul>
        </div>
      ),
      viz: < Pipeline steps={passosDaIA} width={880} height={220} />,
    },
    {
      id: "ch03-01",
      title: "Extração de características",
      eyebrow: "Fase 1: Coleta",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Para que a rede neural consiga extrair boas características de um objeto (como um
            gate ou zebra), ela precisa ser exposta à diversidade.
          </p>
          <p>
            Ao montar nosso dataset, devemos garantir:
          </p>
          <ul className="list-inside list-disc space-y-1 text-muted marker:text-honey/50">
            <li><strong>Múltiplos ambientes:</strong> Indoor, outdoor, fundos complexos.</li>
            <li><strong>Posicionamentos variados:</strong> Drone de frente, de lado, de cima, longe e perto do objeto.</li>
            <li><strong>Iluminação variada:</strong> Dias ensolarados, nublados, sombras no final da tarde.</li>
          </ul>
        </div>
      ),
      viz: (
        <div className="grid h-full grid-cols-3 grid-rows-2 gap-2 rounded-md border border-white/10 bg-white/5 p-2">
          {Array.from({ length: 6 }, (_, i) => i + 1).map((n) => (
            <div
              key={n}
              className="group relative overflow-hidden rounded-sm border border-white/10"
            >
              <img
                src={`/figures/gate${n}.jpg`}
                alt={`Gate - variação ${n}`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute bottom-0 right-0 bg-black/60 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/70">
                {n}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "ch03-02",
      title: "Lidando com ruídos",
      eyebrow: "Limpeza de dados",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Após o fluxo de anotação no Roboflow, estas são as principais fontes de ruído que prejudicam a performance do modelo:
          </p>
          <ul className="space-y-2">
            <li>
              <strong>Rotulagem incorreta:</strong> Gate anotado como post — o modelo aprende a associação errada.
            </li>
            <li>
              <strong>Bounding box imprecisa:</strong> A caixa inclui muito fundo — o detector aprende uma localização imprecisa.
            </li>
            <li>
              <strong>Frames borrados ou escuros mantidos:</strong> O modelo aprende características que não aparecerão na inferência.
            </li>
            <li>
              <strong>Frames quase duplicados:</strong> Inflam a contagem de amostras sem adicionar diversidade real ao dataset.
            </li>
          </ul>
        </div>
      ),
      viz: < NoiseVsClean />,
    },
    {
      id: "ch03-03",
      title: "Generalização vs Especialização",
      eyebrow: "Os extremos do treinamento",
      layout: "scrollSplit",
      content: (
        <div className="space-y-5">
          <p>
            O objetivo de todo modelo de IA é encontrar o ponto de equilíbrio: queremos um modelo abrangente, mas preciso.
          </p>
          <section>
            <h3 className="font-mono uppercase tracking-[0.12em] text-honey">
              Generalização e Alucinação
            </h3>
            <p className="mt-2">
              Um modelo abrangente (generalista) lida bem com cenários novos. Porém, se for abrangente *demais* ou mal treinado, ele <strong>alucina</strong>: começa a "ver" objetos onde não tem nada, confundindo uma pessoa de camisa vermelha com um Gate vermelho.
            </p>
          </section>
          <section>
            <h3 className="font-mono uppercase tracking-[0.12em] text-honey">
              Especialização e Overfitting
            </h3>
            <p className="mt-2">
              Se você treina o modelo apenas na quadra da faculdade, ele fica hiper-especializado. Ele decora o fundo e as condições exatas daquele local. O resultado é o <strong>overfitting</strong> (sobreajuste): ele acerta 100% no treino, mas erra tudo quando o drone voa em um parque.
            </p>
          </section>
          <Callout label="O Ponto Ideal">
            Queremos um modelo especializado no *objeto*, mas generalista no *ambiente*.
          </Callout>
        </div>
      ),
      viz: < BiasVariance />
    }, {
      id: "ch03-04",
      title: "Anotando imagens no Roboflow",
      eyebrow: "O trabalho braçal",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Anotar uma imagem significa dizer explicitamente para a IA onde está o objeto
            de interesse e o que ele é.
          </p>
          <p>
            Utilizamos o <strong>Roboflow</strong> para desenhar <em>bounding boxes</em> (caixas delimitadoras)
            ao redor de cada alvo. Essa é a base do aprendizado supervisionado:
            nós damos o gabarito para a máquina aprender.
          </p>
          <Callout label="Atenção aos detalhes">
            Caixas muito largas incluem o fundo (ruído). Caixas muito apertadas cortam
            as bordas do objeto. A anotação deve ser justa e consistente.
          </Callout>
        </div>
      ),
      viz: (
        <img
          src="/figures/anotating.gif"
          className="h-full w-full rounded-xl object-cover"
        />
      ),
    },
    {
      id: "ch03-05",
      title: "Dividindo o Dataset",
      eyebrow: "Treino, Validação e Teste",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Nunca mostramos todas as imagens para a IA de uma vez. Dividimos nossos dados
            em três blocos para garantir que ela não está apenas "decorando" as respostas.
          </p>
          <ul className="space-y-2">
            <li>
              <strong className="text-honey">Treino (~70%):</strong> O material de estudo. A IA olha as imagens e tenta aprender os padrões.
            </li>
            <li>
              <strong className="text-honey">Validação (~20%):</strong> O simulado. Usado durante o treinamento para testar se ela está indo no caminho certo e fazer ajustes finos.
            </li>
            <li>
              <strong className="text-honey">Teste (~10%):</strong> A prova final. Imagens que a IA <em>nunca</em> viu antes, usadas apenas no final para medir a precisão real do modelo no mundo real.
            </li>
          </ul>
        </div>
      ),
      viz: < SplitBar />,
    },
    {
      id: "ch03-06",
      title: "Data Augmentation",
      eyebrow: "Multiplicando dados",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Ter milhares de imagens boas é difícil e demorado. O <strong>Data Augmentation</strong> (Aumento de Dados)
            resolve isso aplicando modificações matemáticas nas imagens originais para gerar variações.
          </p>
          <p>
            Ao espelhar, rotacionar, mudar o brilho ou adicionar ruído digital a uma foto,
            nós "enganamos" a IA, simulando novos cenários e ângulos.
          </p>
          <p className="text-muted">
            Isso força a rede a aprender as características reais do objeto (formato, textura)
            em vez de memorizar a foto exata. O resultado é um modelo muito mais resiliente para voar.
          </p>
        </div>
      ),
      viz: <AugmentationGallery />,
    },
    {
      id: "ch03-07",
      title: "Motivações e Riscos",
      eyebrow: "O custo do erro",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            Antes de olhar os números, precisamos perguntar: <strong>qual erro custa mais caro?</strong>
          </p>
          <p>
            Em um cenário médico (como detecção de câncer), os riscos são assimétricos:
          </p>
          <ul className="space-y-2">
            <li>
              <strong className="text-red-400">Falso Negativo:</strong> Dizer que o paciente está saudável quando ele está doente. É o erro fatal: o tratamento não começa.
            </li>
            <li>
              <strong className="text-orange-400">Falso Positivo:</strong> Dizer que o paciente está doente quando ele está saudável. Gera estresse e exames desnecessários, mas não é fatal.
            </li>
          </ul>
          <p className="text-muted italic">
            No drone, um falso negativo (não ver o obstáculo) significa colisão. Um falso positivo (ver onde não tem) significa um desvio brusco no vazio.
          </p>
        </div>
      ),
    },
    {
      id: "ch03-08",
      title: "Matriz de Confusão",
      eyebrow: "Metrificando o Risco",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            A <strong>Matriz de Confusão</strong> é a ferramenta base para visualizar onde o modelo
            está se confundindo. Ela cruza a Realidade com a Predição.
          </p>
          <ul className="grid grid-cols-1 gap-2 text-muted">
            <li><strong>Verdadeiro Positivo (VP):</strong> Acertou o alvo.</li>
            <li><strong>Verdadeiro Negativo (VN):</strong> Acertou o vazio.</li>
            <li><strong>Falso Positivo (FP):</strong> Alucinou um alvo.</li>
            <li><strong>Falso Negativo (FN):</strong> Comeu mosca (não viu).</li>
          </ul>
          <Callout label="Otimização">
            Ao mover os "sliders" de confiança do modelo, nós movemos os dados entre esses quadrantes.
            Mudar a sensibilidade do drone altera diretamente essa matriz.
          </Callout>
        </div>
      ),
      viz: < ConfusionMatrix />,
    },
    {
      id: "ch03-09",
      title: "Precision, Recall e F1-Score",
      eyebrow: "As Três Leis",
      layout: "scrollSplit",
      content: (
        <div className="space-y-5">
          <section>
            <h3 className="font-mono uppercase tracking-[0.12em] text-honey">
              Precision (Precisão)
            </h3>
            <p className="mt-1">
              "De tudo que eu disse que era um objeto, quanto eu realmente acertei?"
              Foca na <strong>qualidade</strong>.
            </p>
          </section>
          <section>
            <h3 className="font-mono uppercase tracking-[0.12em] text-honey">
              Recall (Revocação)
            </h3>
            <p className="mt-1">
              "De todos os objetos que existiam na frente do drone, quantos eu consegui achar?"
              Foca na <strong>quantidade</strong>.
            </p>
          </section>
          <section>
            <h3 className="font-mono uppercase tracking-[0.12em] text-honey">
              F1-Score
            </h3>
            <p className="mt-1">
              A média harmônica entre os dois. É o equilíbrio para quando você quer um modelo
              que não seja nem mentiroso (Precision), nem cego (Recall).
            </p>
          </section>
        </div>
      ),
      viz: < PrecisionRecallSandbox />,
    },
  ],
};