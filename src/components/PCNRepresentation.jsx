import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

export default function PCNRepresentation() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-panel2/60 shadow-lg grid gap-px bg-line lg:grid-cols-2">
      <div className="bg-panel p-6 md:p-8 flex flex-col justify-between">
        <div className="label mb-4 text-xs">Message passing between layers</div>
        <svg
          viewBox="0 0 500 180"
          className="block h-auto w-full"
          role="img"
          aria-label="Layer 1 sends a prediction to layer 2; layer 2 returns a prediction error."
          fontFamily="var(--font-display)"
          fontSize="12"
        >
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="var(--fg)" />
            </marker>
            <marker id="arrowhead-accent" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="var(--accent)" />
            </marker>
          </defs>

          <line x1="125" y1="70" x2="355" y2="70" stroke="var(--fg)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
          <line x1="375" y1="110" x2="145" y2="110" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#arrowhead-accent)" />

          <rect x="40" y="55" width="80" height="70" fill="var(--bg)" stroke="var(--fg)" strokeWidth="1.5" />
          <rect x="380" y="55" width="80" height="70" fill="var(--bg)" stroke="var(--fg)" strokeWidth="1.5" />

          <text x="80" y="90" textAnchor="middle" dominantBaseline="middle" fill="var(--fg)">LAYER 1</text>
          <text x="420" y="90" textAnchor="middle" dominantBaseline="middle" fill="var(--fg)">LAYER 2</text>
          <text x="250" y="55" textAnchor="middle" fill="var(--fg-dim)">PREDICTION</text>
          <text x="250" y="135" textAnchor="middle" fill="var(--accent)">ERROR</text>
        </svg>
      </div>

      <div className="bg-panel p-6">
        <div className="label mb-2">The equations</div>
        <div className="overflow-x-auto text-fg">
          <BlockMath math={String.raw`\mu_l = W_l\, f(x_{l-1}), \qquad \varepsilon_l = x_l - \mu_l`} />
          <BlockMath math={String.raw`E = \tfrac{1}{2} \sum_l \lVert \varepsilon_l \rVert^2`} />
          <BlockMath math={String.raw`x_l \leftarrow x_l - \eta\, \frac{\partial E}{\partial x_l}, \qquad W_l \leftarrow W_l - \alpha\, \frac{\partial E}{\partial W_l}`} />
        </div>
        <p className="mt-2 text-[13px] text-dim">
          μ is a layer&apos;s prediction, ε its prediction error and E the
          total energy. η is the inference rate and α the learning rate. Each
          equation involves one layer and its neighbors.
        </p>
      </div>
    </div>
  );
}
