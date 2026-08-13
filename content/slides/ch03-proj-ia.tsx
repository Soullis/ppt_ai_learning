import type { Chapter } from "@/components/slide/types";
import { Callout } from "@/components/ui/Callout";
import {
  ArrowRight,
  ImageOff,
  Sun,
  CheckCircle2,
  AlertTriangle,
  Target,
  Maximize,MousePointer2, Crosshair, PieChart, Wand2,
} from "lucide-react";

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
        <div className="space-y-4 text-[14px]">
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
      viz: (
        <div className="flex h-full items-center justify-center gap-3 px-4">
          {["Coleta", "Treinamento", "Métricas"].map((step, i) => (
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
      title: "Extração de características",
      eyebrow: "Fase 1: Coleta",
      layout: "split",
      content: (
        <div className="space-y-4 text-[14px]">
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
        <div className="flex h-full flex-col items-center justify-center rounded-md border border-dashed border-white/20 bg-white/5 p-6 text-center">
          <Maximize className="mb-4 h-8 w-8 text-white/40" />
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
            💡 Ideia de UI: Galeria 3x3
          </span>
          <p className="mt-2 text-[12px] text-white/60">
            Mostrar um grid com o mesmo objeto (ex: Gate) em 3 iluminações diferentes 
            (linha) e 3 ângulos diferentes (coluna).
          </p>
        </div>
      ),
    },
    {
      id: "ch03-02",
      title: "Lidando com ruídos",
      eyebrow: "Limpeza de dados",
      layout: "split",
      content: (
        <div className="space-y-4 text-[14px]">
          <p>
            Tão importante quanto coletar muitas imagens, é eliminar o <strong>"barulho" (noise)</strong> do dataset.
          </p>
          <p>O que são imagens com ruído?</p>
          <ul className="space-y-2">
            <li>
              <strong>Imagens borradas:</strong> Causadas pela vibração do drone ou movimento rápido.
            </li>
            <li>
              <strong>Informações inúteis:</strong> Fotos onde o objeto está coberto por alguém, ou tão distante que é impossível distinguir.
            </li>
          </ul>
          <p className="text-muted">
            Manter essas imagens no treinamento confunde a rede neural, pois ela tenta achar padrões em borrões onde não existem características reais.
          </p>
        </div>
      ),
      viz: (
        <div className="flex h-full flex-col items-center justify-center rounded-md border border-dashed border-white/20 bg-white/5 p-6 text-center">
          <ImageOff className="mb-4 h-8 w-8 text-white/40" />
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
            💡 Ideia de UI: Slider "Antes e Depois"
          </span>
          <p className="mt-2 text-[12px] text-white/60">
            Colocar uma imagem totalmente borrada do drone (marcada com um 'X' vermelho)
            ao lado de uma imagem nítida tratada (marcada com um check verde).
          </p>
        </div>
      ),
    },
    {
      id: "ch03-03",
      title: "Generalização vs Especialização",
      eyebrow: "Os extremos do treinamento",
      layout: "scrollSplit",
      content: (
        <div className="space-y-5 text-[14px]">
          <p>
            O objetivo de todo modelo de IA é encontrar o ponto de equilíbrio: queremos um modelo abrangente, mas preciso.
          </p>
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-honey">
              Generalização e Alucinação
            </h3>
            <p className="mt-2">
              Um modelo abrangente (generalista) lida bem com cenários novos. Porém, se for abrangente *demais* ou mal treinado, ele <strong>alucina</strong>: começa a "ver" objetos onde não tem nada, confundindo uma pessoa de camisa vermelha com um Gate vermelho.
            </p>
          </section>
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-honey">
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
      viz: (
        <div className="flex h-full flex-col items-center justify-center rounded-md border border-dashed border-white/20 bg-white/5 p-6 text-center">
          <Target className="mb-4 h-8 w-8 text-white/40" />
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
            💡 Ideia de UI: O Gráfico do Alvo
          </span>
          <p className="mt-2 text-[12px] text-white/60">
            Desenhar uma curva em 'U'. Lado esquerdo: Alucinação (ver coisas). 
            Lado direito: Overfitting (decorar cenário). 
            No centro do vale: O "Sweet Spot" brilhando em amarelo.
          </p>
        </div>
      ),
    },{
      id: "ch03-04",
      title: "Anotando imagens no Roboflow",
      eyebrow: "O trabalho braçal",
      layout: "split",
      content: (
        <div className="space-y-4 text-[14px]">
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
        <div className="flex h-full flex-col items-center justify-center rounded-md border border-dashed border-white/20 bg-white/5 p-6 text-center">
          <Crosshair className="mb-4 h-8 w-8 text-white/40" />
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
            🎬 Espaço para Vídeo / GIF
          </span>
          <p className="mt-2 text-[12px] text-white/60">
            Gravação de tela mostrando a interface do Roboflow e o cursor 
            desenhando uma bounding box ao redor de um obstáculo.
          </p>
        </div>
      ),
    },
    {
      id: "ch03-05",
      title: "Dividindo o Dataset",
      eyebrow: "Treino, Validação e Teste",
      layout: "split",
      content: (
        <div className="space-y-4 text-[14px]">
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
      viz: (
        <div className="flex h-full flex-col items-center justify-center rounded-md border border-dashed border-white/20 bg-white/5 p-6 text-center">
          <PieChart className="mb-4 h-8 w-8 text-white/40" />
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
            💡 Ideia de UI: Barra de Proporção
          </span>
          <p className="mt-2 text-[12px] text-white/60">
            Uma barra horizontal dividida visualmente (ex: 70% amarelo, 20% cinza claro, 10% cinza escuro), 
            ilustrando os volumes de dados com ícones de caderno (treino), prancheta (validação) e alvo (teste).
          </p>
        </div>
      ),
    },
    {
      id: "ch03-06",
      title: "Data Augmentation",
      eyebrow: "Multiplicando dados",
      layout: "split",
      content: (
        <div className="space-y-4 text-[14px]">
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
      viz: (
        <div className="flex h-full flex-col items-center justify-center rounded-md border border-dashed border-white/20 bg-white/5 p-6 text-center">
          <Wand2 className="mb-4 h-8 w-8 text-white/40" />
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
            💡 Ideia de UI: Fluxo de Transformação
          </span>
          <p className="mt-2 text-[12px] text-white/60">
            Uma imagem original no centro conectada por setas a 4 variações ao redor: 
            uma imagem girada, uma com muito contraste, uma borrada e uma espelhada.
          </p>
        </div>
      ),
    }
  ],
};