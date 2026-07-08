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
  part: 2,
  slug: "classical-ml",
  title: "Classical machine learning",
  subtitle: "Supervised algorithms before neural networks",
  slides: [
    {
      id: "ch04-00",
      title: "From paradigms to algorithms",
      eyebrow: "Bridge",
      layout: "prose",
      content: (
        <p>
          Chapter 3 introduced supervised learning. Here we study concrete algorithms with closed-form
          or iterative solutions, the same building blocks that appear inside neural networks.
        </p>
      ),
    },
    {
      id: "ch04-01",
      title: "Linear regression",
      eyebrow: "Regression",
      layout: "scrollSplit",
      content: (
        <div className="space-y-4">
          <MBlock>{"\\hat y = w \\cdot x + b"}</MBlock>
          <p>
            The model is a line with slope <M>w</M> and intercept <M>b</M>. With several features,{" "}
            <M>w</M> is a vector holding one weight per feature and <M>b</M> is still a single
            number.
          </p>
          <MBlock>{"\\mathcal{L}_{\\mathrm{MSE}} = \\frac{1}{N}\\sum_i (y_i - \\hat y_i)^2"}</MBlock>
          <p>
            The loss is the mean squared error, the average squared distance between predictions and
            true values. Training means finding the <M>w</M> and <M>b</M> that make it as small as
            possible. This is exactly what the sliders below the plot are doing by hand.
          </p>
          <p>
            <M>{"\\hat w = (X^\\top X)^{-1} X^\\top y"}</M> is the closed form solution. It comes from
            setting the derivative of the MSE to zero and solving directly, so it gives the exact best{" "}
            <M>w</M> in one step, no iteration needed. It is only practical when the number of
            features is small enough for <M>{"X^\\top X"}</M> to be inverted, inverting an F by F
            matrix costs roughly <M>{"F^3"}</M> operations, and it only exists because the model is
            linear in its parameters. That is why gradient descent takes over once we reach logistic
            regression and neural networks.
          </p>
          <Callout label="Worked example">
            <a className="underline" href="https://www.kaggle.com/code/samuellimabraz/sgd-linear-regression" target="_blank" rel="noreferrer">
              Kaggle: SGD linear regression step by step
            </a>
          </Callout>
        </div>
      ),
      viz: <ScatterFit />,
    },
    {
      id: "ch04-02",
      title: "Logistic regression",
      eyebrow: "Classification",
      layout: "scrollSplit",
      content: (
        <div className="space-y-4">
          <p>
            The score is the same linear combination as before, <M>{"z = w \\cdot x + b"}</M>, but it
            is passed through the sigmoid function before being read as a prediction.
          </p>
          <MBlock>{"\\sigma(z) = \\frac{1}{1 + e^{-z}}"}</MBlock>
          <p>
            Sigmoid squashes any real number into a value between 0 and 1, tracing an S shaped curve.
          </p>
          <MBlock>{"p(y=1|x) = \\sigma(w \\cdot x + b)"}</MBlock>
          <p>
            This is read as the estimated probability that the input belongs to class 1. The decision
            rule predicts class 1 when <M>{"p > 0.5"}</M>, which is the same as <M>{"z > 0"}</M>. That
            is why the boundary on the right is a straight line: the same shape as the fitted line in
            linear regression, now separating two classes instead of fitting a curve.
          </p>
          <p>
            Training minimises binary cross entropy, which penalises confident wrong predictions much
            more heavily than uncertain ones. One logistic regression unit is a single neuron, chapter
            5 stacks many of them with a non-linearity in between.
          </p>
        </div>
      ),
      viz: <DecisionBoundary mode="linear" />,
    },
    {
      id: "ch04-03",
      title: "Bias, variance, and overfitting",
      eyebrow: "Generalisation",
      layout: "wideViz",
      content: (
        <div className="space-y-4">
          <MBlock>
            {"\\mathbb{E}[(y - \\hat f)^2] = \\mathrm{Bias}^2 + \\mathrm{Var} + \\sigma^2"}
          </MBlock>
          <p>
            The expected error of a model splits into three parts: how wrong it is on average
            (bias), how much its predictions change with a different training set (variance), and
            noise in the data itself that no model can remove.
          </p>
          <ul className="space-y-2 text-[14px]">
            <li>
              The left panel underfits: the line is too simple to follow the pattern, high bias.
            </li>
            <li>
              The middle panel fits the underlying pattern without chasing individual noisy points.
            </li>
            <li>
              The right panel overfits: it bends to pass through every point including the noise,
              high variance.
            </li>
          </ul>
        </div>
      ),
      viz: <BiasVariance />,
    },
    {
      id: "ch04-04",
      title: "Decision trees and ensembles",
      eyebrow: "Trees",
      layout: "scrollSplit",
      content: (
        <div className="space-y-4">
          <p>
            A tree recursively splits the feature space with threshold rules, is a feature greater
            than a value, until each resulting region contains mostly one class.
          </p>
          <MBlock>{"H(p) = -\\sum_k p_k \\log p_k"}</MBlock>
          <p>
            At each step the tree picks the split that reduces impurity the most. Entropy measures
            how mixed the classes are in a region, it is zero when the region is pure. Gini impurity
            is a cheaper alternative with similar behaviour.
          </p>
          <p>
            A single tree overfits easily since it can keep growing until it memorises the training
            data. Two standard fixes combine many trees:
          </p>
          <ul className="space-y-2 text-[14px]">
            <li>
              Random forest trains many trees on random subsets of data and features, then averages
              their votes. This reduces variance.
            </li>
            <li>
              Gradient boosting (XGBoost, LightGBM) trains trees sequentially, each one correcting the
              errors of the previous ones. This reduces bias.
            </li>
          </ul>
          <p className="text-muted">Trees and their ensembles remain the strongest default on tabular data, structured columns rather than images or text.</p>
          <Callout label="Further reading">
            <a className="underline" href="https://scikit-learn.org/stable/modules/tree.html" target="_blank" rel="noreferrer">
              scikit-learn: decision trees
            </a>
            {" · "}
            <a className="underline" href="https://scikit-learn.org/stable/modules/ensemble.html" target="_blank" rel="noreferrer">
              scikit-learn: ensembles
            </a>
          </Callout>
        </div>
      ),
      viz: <TreeSplits />,
    },
    {
      id: "ch04-05",
      title: "k-nearest neighbours",
      eyebrow: "Instance-based",
      layout: "scrollSplit",
      content: (
        <div className="space-y-4">
          <MBlock>{"\\hat y(x) = \\mathrm{mode}\\big(\\{y_j : x_j \\in \\mathcal{N}_k(x)\\}\\big)"}</MBlock>
          <p>
            There is no training step. All the work happens at prediction time by looking directly at
            the stored data, which is why it is called a lazy learner.
          </p>
          <p>
            To predict a new point, measure the distance to every training point (commonly
            Euclidean), take the <M>k</M> closest, and vote. Classification takes the majority class
            among the <M>k</M> neighbours, regression averages their values.
          </p>
          <ul className="space-y-2 text-[14px]">
            <li>
              A small <M>k</M> follows the data closely and produces a noisy boundary: low bias, high
              variance. A large <M>k</M> smooths the boundary: higher bias, lower variance.
            </li>
            <li>
              Distance is dominated by whichever feature has the largest numeric range, so features
              are normally standardised first.
            </li>
            <li>
              In high dimensions, distances between points stop being meaningful, every point ends up
              roughly equally far from every other. This is the curse of dimensionality, and it is why
              kNN degrades as the number of features grows.
            </li>
          </ul>
          <Callout label="Further reading">
            <a className="underline" href="https://scikit-learn.org/stable/modules/neighbors.html" target="_blank" rel="noreferrer">
              scikit-learn: nearest neighbors
            </a>
          </Callout>
        </div>
      ),
      viz: <KnnQuery />,
    },
    {
      id: "ch04-06",
      title: "Support vector machines",
      eyebrow: "Margin and kernels",
      layout: "scrollSplit",
      content: (
        <div className="space-y-4">
          <p>
            Among all the lines that separate the two classes, SVM picks the one that maximises the
            margin, the distance to the closest point of each class. A wider margin tends to
            generalise better to new data.
          </p>
          <MBlock>{"\\min_{w,b} \\tfrac{1}{2}\\|w\\|^2 \\quad \\text{s.t. } y_i(w^\\top x_i + b) \\geq 1"}</MBlock>
          <p>
            The decision function has the same linear form as before, classify by the sign of{" "}
            <M>{"w \\cdot x + b"}</M>. In practice a soft margin version allows some points to violate
            the margin, controlled by a hyperparameter <M>C</M> that trades margin width against the
            number of misclassified points.
          </p>
          <p>
            Support vectors are the points that sit exactly on the margin. They are the only points
            that determine the solution, every other point could be removed without changing the
            boundary. On the plot, the axes are the two features, the solid line is the decision
            boundary, the dashed lines mark the margin, and the circled points are the support
            vectors.
          </p>
          <p>
            The kernel trick replaces the dot product with a kernel function (RBF, polynomial) to
            separate classes that are not linearly separable in the original features, without ever
            computing that higher dimensional mapping explicitly.
          </p>
          <Callout label="Further reading">
            <a className="underline" href="https://scikit-learn.org/stable/modules/svm.html" target="_blank" rel="noreferrer">
              scikit-learn: support vector machines
            </a>
          </Callout>
        </div>
      ),
      viz: <SVMMargin />,
    },
    {
      id: "ch04-07",
      title: "k-means",
      eyebrow: "Clustering",
      layout: "scrollSplit",
      content: (
        <div className="space-y-4">
          <MBlock>{"J = \\sum_{i,k} r_{ik}\\|x_i - \\mu_k\\|^2"}</MBlock>
          <p>
            The goal is to partition <M>N</M> points into <M>K</M> clusters, minimising the total
            squared distance from each point to its cluster centroid.
          </p>
          <p>Lloyd&apos;s algorithm solves this approximately:</p>
          <ol className="list-decimal space-y-1 pl-5 text-[14px]">
            <li>pick <M>K</M> initial centroids</li>
            <li>assign every point to its nearest centroid</li>
            <li>move each centroid to the mean of its assigned points</li>
            <li>repeat steps 2 and 3 until assignments stop changing</li>
          </ol>
          <p>
            This is exactly what the animation on the right steps through, use Step to see one phase
            at a time or Play to run it automatically.
          </p>
          <p>
            k-means only finds a local minimum. A different random initialisation can converge to a
            different result, which is why it is common to run it several times and keep the lowest{" "}
            <M>J</M>, or use a smarter initialisation such as k-means++. Choosing <M>K</M> is not
            automatic either: the elbow method plots <M>J</M> against <M>K</M> and looks for where
            adding clusters stops helping much, the silhouette score is another common heuristic.
          </p>
          <Callout label="Further reading">
            <a className="underline" href="https://scikit-learn.org/stable/modules/clustering.html#k-means" target="_blank" rel="noreferrer">
              scikit-learn: k-means clustering
            </a>
          </Callout>
        </div>
      ),
      viz: <KMeans />,
    },
    {
      id: "ch04-08",
      title: "When to use which",
      eyebrow: "Summary table",
      layout: "scrollProse",
      content: (
        <div className="overflow-hidden rounded-md border border-stroke">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-bone text-left font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                <th className="border-b border-stroke px-4 py-3">Algorithm</th>
                <th className="border-b border-stroke px-4 py-3">Best for</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Linear / Ridge", "small N, interpretability, linear signal"],
                ["Logistic regression", "binary baseline, one neuron"],
                ["Tree ensembles", "tabular, mixed types"],
                ["k-NN", "low-dim baseline"],
                ["SVM", "small/medium N, clear margin"],
                ["k-means", "clustering, vector quantisation"],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-stroke">
                  <td className="px-4 py-3">{row[0]}</td>
                  <td className="px-4 py-3 text-muted">{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    {
      id: "ch04-09",
      title: "Chapter summary",
      eyebrow: "Summary",
      layout: "prose",
      content: (
        <div className="space-y-3 text-[15px]">
          <p>Linear/logistic regression, trees, kNN, SVM, k-means: all of them optimise a loss on data.</p>
          <p>
            For from-scratch implementations,{" "}
            <a className="underline" href="https://github.com/samuellimabraz/cafedl" target="_blank" rel="noreferrer">
              cafedl
            </a>{" "}
            is a Java library with <code className="font-mono text-[13px]">LinearRegression.java</code> (MSE, gradient descent) and{" "}
            <code className="font-mono text-[13px]">NonLinearFunctions.java</code> (sine, saddle, Rosenbrock surfaces).
          </p>
          <p className="text-muted">Next: chapter 5, stack neurons, add non-linearity, train with backprop.</p>
        </div>
      ),
    },
  ],
};
