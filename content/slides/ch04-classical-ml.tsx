import type { Chapter } from "@/components/slide/types";
import { ScatterFit } from "@/components/viz/ScatterFit";
import { DecisionBoundary } from "@/components/viz/DecisionBoundary";
import { BiasVariance } from "@/components/viz/BiasVariance";
import { TreeSplits } from "@/components/viz/TreeSplits";
import { SVMMargin } from "@/components/viz/SVMMargin";
import { KnnQuery } from "@/components/viz/KnnQuery";
import { KMeans } from "@/components/viz/KMeans";
import { M, MBlock } from "@/components/math/Math";
import { Callout } from "@/components/ui/Callout";

export const ch04: Chapter = {
  id: "ch04",
  number: 4,
  slug: "classical-ml",
  title: "Classical machine learning",
  subtitle: "The methods deep learning sits on top of",
  slides: [
    {
      id: "ch04-00",
      title: "Linear regression",
      eyebrow: "Predict a continuous value",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Predict a scalar from a feature: <M>{"\\hat y = w x + b"}</M>. Choose{" "}
            <M>w, b</M> to minimise the mean squared error:
          </p>
          <MBlock>{"\\mathcal{L}(w, b) = \\frac{1}{N}\\sum_{i=1}^{N}(y_i - w x_i - b)^2"}</MBlock>
          <p>
            Closed form: <M>{"\\hat w = (X^\\top X)^{-1} X^\\top y"}</M>. Drag the
            sliders; the yellow rays are residuals — their squared lengths sum to
            the MSE.
          </p>
          <Callout label="Why we start here" tone="accent">
            Linear regression is the smallest model that already shows every
            piece we'll see in deep learning: parameters, a loss, an optimiser.
          </Callout>
        </div>
      ),
      viz: <ScatterFit />,
    },
    {
      id: "ch04-01",
      title: "Logistic regression",
      eyebrow: "From regression to classification",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>Squash a linear score into a probability with the sigmoid:</p>
          <MBlock>
            {"\\sigma(z) = \\frac{1}{1 + e^{-z}}, \\qquad p(y = 1 \\mid x) = \\sigma(w^\\top x + b)"}
          </MBlock>
          <p>
            Trained with binary cross-entropy, the decision boundary is the
            hyperplane <M>{"w^\\top x + b = 0"}</M>.
          </p>
          <Callout label="A perceptron in disguise">
            One logistic-regression unit is a single artificial neuron. Stack
            them and you get an MLP — chapter 5.
          </Callout>
        </div>
      ),
      viz: <DecisionBoundary mode="linear" />,
    },
    {
      id: "ch04-02",
      title: "Bias and variance",
      eyebrow: "The fundamental tradeoff",
      layout: "fullViz",
      viz: <BiasVariance />,
    },
    {
      id: "ch04-03",
      title: "Bias / variance, in words",
      eyebrow: "What the three plots mean",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            Generalisation error decomposes into three pieces:
          </p>
          <MBlock>
            {"\\mathbb{E}\\big[(y - \\hat f(x))^2\\big] \\;=\\; \\underbrace{\\mathrm{Bias}^2}_{\\text{model too rigid}} + \\underbrace{\\mathrm{Var}}_{\\text{model too wiggly}} + \\underbrace{\\sigma^2}_{\\text{label noise}}"}
          </MBlock>
          <ul className="space-y-2 text-[15px]">
            <li><strong>Underfit</strong> · high bias — the model cannot capture the structure (a line for a sine wave).</li>
            <li><strong>Good fit</strong> · balanced — captures the structure, ignores the noise.</li>
            <li><strong>Overfit</strong> · high variance — fits noise as if it were signal.</li>
          </ul>
          <p className="text-muted">
            More data shifts the variance down. Regularisation shifts the bias
            up — sometimes that's the right trade.
          </p>
        </div>
      ),
    },
    {
      id: "ch04-04",
      title: "Decision trees",
      eyebrow: "Recursive splits",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            At each node, pick the feature and threshold that split the data
            into the purest children. Purity is measured by entropy or Gini:
          </p>
          <MBlock>{"H(p) = -\\sum_k p_k \\log p_k, \\qquad G(p) = 1 - \\sum_k p_k^2"}</MBlock>
          <p>
            One tree overfits; many randomised trees averaged together
            (<strong>random forest</strong>, <strong>gradient boosting</strong>:
            XGBoost, LightGBM, CatBoost) define a class of models that still
            wins on tabular data today.
          </p>
        </div>
      ),
      viz: <TreeSplits />,
    },
    {
      id: "ch04-05",
      title: "k-Nearest Neighbours",
      eyebrow: "No training, just memory",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            For a query point, look up the <M>k</M> closest training points and
            vote on the label.
          </p>
          <MBlock>{"\\hat y(x) = \\mathrm{mode}\\Big(\\{ y_j : x_j \\in \\mathcal{N}_k(x) \\}\\Big)"}</MBlock>
          <ul className="space-y-2 text-[14px] text-ink/85">
            <li>· No model fitted — every prediction is a search.</li>
            <li>· Choice of <M>k</M> trades bias for variance.</li>
            <li>· Distance metric matters; standardise features first.</li>
          </ul>
          <p className="text-muted">
            Conceptually clean, computationally heavy, and the gold-standard
            baseline to beat.
          </p>
        </div>
      ),
      viz: <KnnQuery />,
    },
    {
      id: "ch04-06",
      title: "Support Vector Machines",
      eyebrow: "Maximise the margin",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            Find the hyperplane that <em>maximises</em> the gap between the two
            classes. Only the points sitting on the gap — the{" "}
            <strong>support vectors</strong> — define the solution:
          </p>
          <MBlock>{"\\min_{w, b} \\tfrac{1}{2}\\|w\\|^2 \\quad \\text{s.t. } y_i(w^\\top x_i + b) \\geq 1"}</MBlock>
          <p>
            For non-linearly separable data, the kernel trick maps points to a
            higher-dimensional space where they are separable, without ever
            computing that mapping explicitly.
          </p>
        </div>
      ),
      viz: <SVMMargin />,
    },
    {
      id: "ch04-07",
      title: "k-means — the algorithm",
      eyebrow: "Unsupervised baseline",
      layout: "prose",
      content: (
        <div className="space-y-4">
          <p>
            Given <M>N</M> points <M>{"\\{x_i\\} \\subset \\mathbb{R}^d"}</M>{" "}
            and a chosen number of clusters <M>K</M>, find an assignment{" "}
            <M>{"r_{ik} \\in \\{0, 1\\}"}</M> and centroids{" "}
            <M>{"\\mu_k \\in \\mathbb{R}^d"}</M> that minimise the{" "}
            <em>within-cluster sum of squares</em> (also called inertia):
          </p>
          <MBlock>
            {"J = \\sum_{i=1}^{N}\\sum_{k=1}^{K} r_{ik}\\,\\|x_i - \\mu_k\\|^2"}
          </MBlock>
          <p>
            Joint minimisation over <M>r</M> and{" "}
            <M>{"\\mu"}</M> is NP-hard. Lloyd&apos;s algorithm (1957) is the
            workhorse heuristic — alternate two closed-form steps until
            nothing changes:
          </p>
          <div className="space-y-3 rounded-md border border-stroke bg-surface px-5 py-4 text-[14px]">
            <div>
              <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
                step 1 · assignment
              </div>
              <p className="mb-2">
                Fix the centroids. Send each point to the closest one.
              </p>
              <MBlock>
                {"r_{ik} = \\begin{cases} 1 & k = \\arg\\min_j \\|x_i - \\mu_j\\|^2 \\\\ 0 & \\text{otherwise} \\end{cases}"}
              </MBlock>
            </div>
            <div>
              <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-honey">
                step 2 · update
              </div>
              <p className="mb-2">
                Fix the assignment. Move each centroid to the mean of its
                points (this is the value that minimises <M>J</M> for fixed{" "}
                <M>r</M>):
              </p>
              <MBlock>
                {"\\mu_k = \\frac{\\sum_i r_{ik}\\,x_i}{\\sum_i r_{ik}}"}
              </MBlock>
            </div>
          </div>
          <p className="text-muted">
            Both steps strictly decrease <M>J</M> (or leave it unchanged), so
            the algorithm <em>always converges</em> — typically in fewer than
            20 iterations. Cost per iteration:{" "}
            <M>{"O(N \\cdot K \\cdot d)"}</M>.
          </p>
        </div>
      ),
    },
    {
      id: "ch04-07b",
      title: "k-means in action",
      eyebrow: "Watch J fall",
      layout: "split",
      content: (
        <div className="space-y-4">
          <p>
            <span className="font-mono text-[12px] text-accent">Step</span>{" "}
            advances one half-iteration at a time, alternating between the
            two phases. <span className="font-mono text-[12px] text-accent">Play</span>{" "}
            runs to convergence. <span className="font-mono text-[12px]">J</span>{" "}
            is the inertia; watch it monotonically decrease.
          </p>
          <ul className="space-y-2 text-[14px] text-ink/85">
            <li>
              · Thin lines in the assignment phase show each point pulled to
              its nearest centroid (the <M>{"\\arg\\min"}</M>).
            </li>
            <li>
              · In the update phase, the centroids translate to the cluster
              mean — usually the largest <M>J</M> drop happens here.
            </li>
            <li>
              · The animation stops automatically when no centroid moves.
            </li>
          </ul>
          <Callout label="Gotchas" tone="warm">
            <ul className="space-y-1">
              <li>
                · <strong>Initialisation matters.</strong> Plain k-means is
                sensitive to the starting centroids;{" "}
                <strong>k-means++</strong> seeds them apart on purpose and
                almost always converges to a better minimum.
              </li>
              <li>
                · <strong>You must pick K.</strong> Use the elbow method on{" "}
                <M>J(K)</M> or the silhouette score.
              </li>
              <li>
                · <strong>Assumes spherical, equal-size clusters.</strong>{" "}
                For arbitrary shapes use DBSCAN or a Gaussian mixture model.
              </li>
            </ul>
          </Callout>
        </div>
      ),
      viz: <KMeans />,
    },
    {
      id: "ch04-08",
      title: "When to use which",
      eyebrow: "Cheat sheet",
      layout: "prose",
      content: (
        <div className="overflow-hidden rounded-md border border-stroke">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-bone text-left font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                <th className="border-b border-stroke px-4 py-3">Algorithm</th>
                <th className="border-b border-stroke px-4 py-3">Best for</th>
                <th className="border-b border-stroke px-4 py-3">Watch out</th>
              </tr>
            </thead>
            <tbody className="text-ink">
              {[
                ["Linear / Ridge / Lasso", "small N, linear signal, interpretability", "fails on non-linear structure"],
                ["Logistic regression", "binary classification baseline", "linear boundary only"],
                ["Decision tree (single)", "interpretable rules", "overfits — prefer ensembles"],
                ["Random forest / boosting", "tabular data, mixed types", "large model, slower inference"],
                ["k-NN", "low-dim, slow inference acceptable", "scales poorly, distance-sensitive"],
                ["SVM", "small / medium N, clear margin", "kernel choice, slow on large N"],
                ["k-means", "rough clusters, vector quantisation", "needs k, non-spherical clusters fail"],
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
      ),
    },
  ],
};
