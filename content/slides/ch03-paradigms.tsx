import type { Chapter } from "@/components/slide/types";
import { ScatterFit } from "@/components/viz/ScatterFit";
import { KMeans } from "@/components/viz/KMeans";
import { AgentEnvLoop } from "@/components/viz/AgentEnvLoop";
import { MaskedPatch } from "@/components/viz/MaskedPatch";
import { Callout } from "@/components/ui/Callout";
import { M, MBlock } from "@/components/math/Math";

export const ch03: Chapter = {
  id: "ch03",
  number: 3,
  slug: "paradigms",
  title: "Learning paradigms",
  subtitle: "Four ways to extract signal from data",
  slides: [
    {
      id: "ch03-00",
      title: "The four families",
      eyebrow: "Overview",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-md border border-stroke">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-bone text-left font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                  <th className="border-b border-stroke px-4 py-3">Paradigm</th>
                  <th className="border-b border-stroke px-4 py-3">Given</th>
                  <th className="border-b border-stroke px-4 py-3">Goal</th>
                  <th className="border-b border-stroke px-4 py-3">Typical algorithms</th>
                </tr>
              </thead>
              <tbody className="text-ink">
                {[
                  ["Supervised", "(x, y) pairs", "predict y from x", "linear/logistic regression · trees · SVM · CNN · DETR"],
                  ["Unsupervised", "x only", "find structure", "k-means · DBSCAN · PCA · GMM · autoencoders"],
                  ["Self-supervised", "x only, with pretext", "learn representations", "MAE · DINO · CLIP · SimCLR · BERT"],
                  ["Reinforcement", "states · actions · reward", "maximise long-term reward", "Q-learning · policy gradient · PPO · SAC"],
                ].map((row) => (
                  <tr key={row[0]} className="border-b border-stroke last:border-b-0">
                    {row.map((cell) => (
                      <td key={cell} className="px-4 py-3 align-top">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted">
            Most of perception in Black Bee is supervised; the next chapters
            unpack each paradigm.
          </p>
        </div>
      ),
    },
    {
      id: "ch03-01",
      title: "Supervised",
      eyebrow: "(x, y) pairs",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Pairs <M>(x_i, y_i)</M> are given; we search for{" "}
            <M>f_\theta</M> that minimises a loss on those pairs.
          </p>
          <MBlock>
            {"\\theta^* = \\arg\\min_\\theta \\frac{1}{N}\\sum_{i=1}^{N} \\ell\\big(f_\\theta(x_i), y_i\\big)"}
          </MBlock>
          <ul className="space-y-2 text-[14px] text-ink/85">
            <li>
              <strong>Regression</strong> → numeric{" "}
              <span className="font-mono text-muted">y</span>: linear, ridge,
              lasso, gradient-boosted trees.
            </li>
            <li>
              <strong>Classification</strong> → discrete{" "}
              <span className="font-mono text-muted">y</span>: logistic, SVM,
              random forest, neural networks.
            </li>
            <li>
              <strong>Structured</strong> → boxes, masks, sequences: DETR,
              YOLO, transformers.
            </li>
          </ul>
        </div>
      ),
      viz: <ScatterFit />,
    },
    {
      id: "ch03-02",
      title: "Unsupervised",
      eyebrow: "Structure without labels",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Only inputs <M>{"\\{x_i\\}"}</M>. We look for clusters, density,
            low-dimensional manifolds.
          </p>
          <ul className="space-y-2 text-[14px] text-ink/85">
            <li>
              <strong>Clustering</strong> · k-means, DBSCAN, hierarchical
            </li>
            <li>
              <strong>Density estimation</strong> · GMM, kernel density
            </li>
            <li>
              <strong>Dimensionality reduction</strong> · PCA, t-SNE, UMAP
            </li>
            <li>
              <strong>Generative</strong> · autoencoders, normalising flows,
              diffusion
            </li>
          </ul>
          <Callout>
            In Nectar we use k-means in HSV space to calibrate colour
            thresholds for ArUco / line detection — no labels needed.
          </Callout>
        </div>
      ),
      viz: <KMeans />,
    },
    {
      id: "ch03-03",
      title: "Self-supervised",
      eyebrow: "Make your own labels",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Invent a pretext task whose labels come from the data itself, then
            fine-tune on a small labelled set:
          </p>
          <ul className="space-y-2 text-[14px] text-ink/85">
            <li>
              <strong>Masked reconstruction</strong> · MAE for images, BERT for
              text
            </li>
            <li>
              <strong>Contrastive</strong> · two augmentations of the same
              image must be close, different images far apart (SimCLR, DINO)
            </li>
            <li>
              <strong>Cross-modal</strong> · image and caption pulled together
              in a shared space (CLIP)
            </li>
            <li>
              <strong>Next token</strong> · GPT family, the ML method that
              built modern LLMs
            </li>
          </ul>
          <Callout tone="accent">
            For us this matters because flight footage is plentiful while
            labelled boxes are expensive. Pretraining on unlabelled video and
            fine-tuning on a small labelled set is a real practical option.
          </Callout>
        </div>
      ),
      viz: <MaskedPatch />,
    },
    {
      id: "ch03-04",
      title: "Reinforcement",
      eyebrow: "Learn by interaction",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            An agent observes state <M>s</M>, takes action <M>a</M>, receives
            reward <M>r</M>, lands in a new state. The goal is a policy{" "}
            <M>{"\\pi"}</M> that maximises the expected return:
          </p>
          <MBlock>{"J(\\pi) = \\mathbb{E}_\\pi\\!\\left[\\sum_{t=0}^{T} \\gamma^t r_t\\right]"}</MBlock>
          <ul className="space-y-2 text-[14px] text-ink/85">
            <li>
              <strong>Value-based</strong> · Q-learning, DQN — learn{" "}
              <M>Q(s, a)</M>
            </li>
            <li>
              <strong>Policy-based</strong> · REINFORCE, PPO — learn{" "}
              <M>{"\\pi(a \\mid s)"}</M> directly
            </li>
            <li>
              <strong>Actor-critic</strong> · A3C, SAC — combine both
            </li>
          </ul>
          <p className="text-muted">
            Used in robotics for control loops; less practical when good
            supervised data is available.
          </p>
        </div>
      ),
      viz: <AgentEnvLoop />,
    },
    {
      id: "ch03-llm",
      title: "Modern LLMs use all three",
      eyebrow: "Pretrain · fine-tune · align",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            The training pipeline behind GPT-4, LLaMA, and Gemini composes the
            paradigms we just saw, in this order:
          </p>
          <ol className="space-y-2 text-[14px] text-ink/85">
            <li>
              <strong>1. Self-supervised pretraining</strong> — predict the
              next token on trillions of tokens of unlabelled text. Produces a
              general-purpose base model.
            </li>
            <li>
              <strong>2. Supervised fine-tuning (SFT)</strong> — train on a
              much smaller set of high-quality instruction / answer pairs.
              Teaches the format.
            </li>
            <li>
              <strong>3. RLHF</strong> — reinforcement learning from human
              feedback. A reward model learns from human preferences; the
              policy is then optimised against it (PPO or DPO).
            </li>
          </ol>
          <p className="text-muted">
            Yann LeCun&apos;s 2016 &quot;cake&quot; analogy survives in this
            form: most of the calories come from unsupervised pretraining;
            SFT and RLHF are the icing and the cherry.
          </p>
        </div>
      ),
      viz: (
        <figure className="mx-auto flex w-full max-w-[760px] flex-col items-center">
          <div className="w-full overflow-hidden rounded-md border border-stroke bg-surface">
            <img
              src="/figures/llm-paradigms.jpg"
              alt="Unsupervised pretraining, supervised fine-tuning, and RLHF, drawn as a monstrous creature with a cherry on top."
              className="block w-full"
            />
          </div>
          <figcaption className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
            modern reimagining of LeCun&apos;s &quot;cake&quot; analogy
          </figcaption>
        </figure>
      ),
    },
    {
      id: "ch03-05",
      title: "Where each fits in Black Bee",
      eyebrow: "Decision rules",
      layout: "prose",
      content: (
        <div className="space-y-3 text-[15px]">
          <p>
            <strong>Have labels?</strong> Use supervised learning. This is most
            of our perception today (gates, drones, posts).
          </p>
          <p>
            <strong>Have raw data, no labels, just want structure?</strong> Use
            unsupervised — colour calibration, anomaly detection in
            telemetry.
          </p>
          <p>
            <strong>Have lots of unlabelled data and a small labelled set?</strong>{" "}
            Self-supervised pretraining of a backbone, then fine-tune.
          </p>
          <p>
            <strong>Need to learn an action policy from rewards?</strong>{" "}
            Reinforcement learning — research-level for now in our team
            (PID auto-tune, trajectory optimisation).
          </p>
        </div>
      ),
    },
  ],
};
