import katex from "katex";
import "katex/dist/katex.min.css";

const equations = [
  String.raw`\mu_l = W_l\, f(x_{l-1}), \qquad \varepsilon_l = x_l - \mu_l`,
  String.raw`E = \tfrac{1}{2} \sum_l \lVert \varepsilon_l \rVert^2`,
  String.raw`x_l \leftarrow x_l - \eta\, \frac{\partial E}{\partial x_l}, \qquad W_l \leftarrow W_l - \alpha\, \frac{\partial E}{\partial W_l}`,
].map((math) => katex.renderToString(math, { displayMode: true, throwOnError: false }));

export default function PCNRepresentation() {
  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-lg lg:grid-cols-2">
      <div className="flex flex-col justify-between bg-[#0c0c0d] p-6 md:p-8">
        <div className="Michroma mb-4 text-xs uppercase tracking-[0.06em] text-white/70">
          Message passing between layers
        </div>
        <svg
          viewBox="0 0 500 180"
          className="block h-auto w-full"
          role="img"
          aria-label="Layer 1 sends a prediction to layer 2; layer 2 returns a prediction error."
          fontFamily="Michroma, sans-serif"
          fontSize="11"
        >
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#ffffff" />
            </marker>
            <marker id="arrowhead-accent" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#a99bff" />
            </marker>
          </defs>

          <line x1="125" y1="70" x2="355" y2="70" stroke="#ffffff" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
          <line x1="375" y1="110" x2="145" y2="110" stroke="#a99bff" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#arrowhead-accent)" />

          <rect x="40" y="55" width="80" height="70" fill="#020205" stroke="#ffffff" strokeWidth="1.5" />
          <rect x="380" y="55" width="80" height="70" fill="#020205" stroke="#ffffff" strokeWidth="1.5" />

          <text x="80" y="90" textAnchor="middle" dominantBaseline="middle" fill="#ffffff">LAYER 1</text>
          <text x="420" y="90" textAnchor="middle" dominantBaseline="middle" fill="#ffffff">LAYER 2</text>
          <text x="250" y="55" textAnchor="middle" fill="rgba(255,255,255,0.7)">PREDICTION</text>
          <text x="250" y="135" textAnchor="middle" fill="#a99bff">ERROR</text>
        </svg>
      </div>

      <div className="bg-[#0c0c0d] p-6">
        <div className="Michroma mb-2 text-xs uppercase tracking-[0.06em] text-white/70">
          The equations
        </div>
        <div className="overflow-x-auto text-white">
          {equations.map((html, i) => (
            <div key={i} dangerouslySetInnerHTML={{ __html: html }} />
          ))}
        </div>
        <p className="Jura mt-2 text-[13px] text-white/70">
          μ is a layer&apos;s prediction, ε its prediction error and E the
          total energy. η is the inference rate and α the learning rate. Each
          equation involves one layer and its neighbors.
        </p>
      </div>
    </div>
  );
}
