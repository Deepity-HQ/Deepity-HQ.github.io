// A small predictive coding network trained entirely with local updates.
// Each layer predicts the layer above it, the mismatch is its error, and both
// the neuron states and the weights change using only neighboring errors.

export type Point = { x: number; y: number; label: 1 | -1 };

export type Dataset = "circles" | "moons" | "xor";

// Seeded so every visit starts from the same picture
export function rng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(r: () => number) {
  return Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(2 * Math.PI * r());
}

export function makeData(kind: Dataset, n = 240, seed = 3): Point[] {
  const r = rng(seed);
  const pts: Point[] = [];
  for (let i = 0; i < n; i++) {
    const label: 1 | -1 = i % 2 === 0 ? 1 : -1;
    if (kind === "circles") {
      const rad = label === 1 ? 0.35 : 0.8;
      const a = r() * Math.PI * 2;
      pts.push({ x: Math.cos(a) * rad + gauss(r) * 0.06, y: Math.sin(a) * rad + gauss(r) * 0.06, label });
    } else if (kind === "moons") {
      const a = r() * Math.PI;
      const up = label === 1;
      pts.push({
        x: (up ? Math.cos(a) : 1 - Math.cos(a)) * 0.55 - 0.27 + gauss(r) * 0.05,
        y: (up ? Math.sin(a) : 0.5 - Math.sin(a)) * 0.65 - 0.2 + gauss(r) * 0.05,
        label,
      });
    } else {
      const sx = r() < 0.5 ? -1 : 1;
      const sy = r() < 0.5 ? -1 : 1;
      pts.push({
        x: sx * (0.25 + r() * 0.6),
        y: sy * (0.25 + r() * 0.6),
        label: sx * sy > 0 ? 1 : -1,
      });
    }
  }
  return pts;
}

// Math.tanh is slow in Firefox (it falls back to a software exp), and this runs
// millions of times per second. A rational approximation is plenty for a demo.
function tanh(x: number) {
  if (x > 3) return 1;
  if (x < -3) return -1;
  const x2 = x * x;
  return (x * (27 + x2)) / (27 + 9 * x2);
}

export class PCNet {
  sizes: number[];
  W: Float32Array[]; // W[l] maps layer l-1 to layer l, shape [sizes[l], sizes[l-1]]
  b: Float32Array[];
  vW: Float32Array[];
  vb: Float32Array[];
  // scratch per sample
  x: Float32Array[];
  mu: Float32Array[];
  act: Float32Array[]; // activation of each layer, refreshed by predict()
  e: Float32Array[];
  gW: Float32Array[];
  gb: Float32Array[];
  // mean absolute error per layer after settling, for display
  layerError: number[];
  energy = 0;

  constructor(sizes: number[], seed = 7) {
    this.sizes = sizes;
    const r = rng(seed);
    const L = sizes.length;
    const mk = (f: (l: number) => number) => sizes.map((_, l) => new Float32Array(l === 0 ? 0 : f(l)));
    this.W = mk((l) => sizes[l] * sizes[l - 1]);
    this.b = mk((l) => sizes[l]);
    this.vW = mk((l) => sizes[l] * sizes[l - 1]);
    this.vb = mk((l) => sizes[l]);
    this.gW = mk((l) => sizes[l] * sizes[l - 1]);
    this.gb = mk((l) => sizes[l]);
    for (let l = 1; l < L; l++) {
      const scale = 1.6 / Math.sqrt(sizes[l - 1]);
      for (let i = 0; i < this.W[l].length; i++) this.W[l][i] = gauss(r) * scale;
    }
    this.x = sizes.map((n) => new Float32Array(n));
    this.mu = sizes.map((n) => new Float32Array(n));
    this.act = sizes.map((n) => new Float32Array(n));
    this.e = sizes.map((n) => new Float32Array(n));
    this.layerError = new Array(L - 1).fill(0);
  }

  // Prediction for layer l from the state of layer l-1
  private predict(l: number) {
    const n = this.sizes[l];
    const m = this.sizes[l - 1];
    const W = this.W[l];
    const prev = this.x[l - 1];
    const act = this.act[l - 1];
    for (let j = 0; j < m; j++) act[j] = l === 1 ? prev[j] : tanh(prev[j]);
    const mu = this.mu[l];
    for (let i = 0; i < n; i++) {
      let s = this.b[l][i];
      const row = i * m;
      for (let j = 0; j < m; j++) s += W[row + j] * act[j];
      mu[i] = s;
    }
  }

  // Plain feedforward readout, used for the picture and for accuracy
  output(px: number, py: number): number {
    this.x[0][0] = px;
    this.x[0][1] = py;
    for (let l = 1; l < this.sizes.length; l++) {
      this.predict(l);
      if (l < this.sizes.length - 1) this.x[l].set(this.mu[l]);
    }
    return this.mu[this.sizes.length - 1][0];
  }

  // One pass over a mini-batch: settle neuron states, then update weights locally
  train(batch: Point[], settle = 20, eta = 0.12, lr = 0.02, momentum = 0.9) {
    const L = this.sizes.length - 1;
    for (let l = 1; l <= L; l++) {
      this.gW[l].fill(0);
      this.gb[l].fill(0);
    }
    let energy = 0;
    const err = new Array(L).fill(0);

    for (const p of batch) {
      this.x[0][0] = p.x;
      this.x[0][1] = p.y;
      for (let l = 1; l <= L; l++) {
        this.predict(l);
        this.x[l].set(this.mu[l]);
      }
      this.x[L][0] = p.label;

      for (let t = 0; t < settle; t++) {
        for (let l = 1; l <= L; l++) {
          this.predict(l);
          for (let i = 0; i < this.sizes[l]; i++) this.e[l][i] = this.x[l][i] - this.mu[l][i];
        }
        for (let l = 1; l < L; l++) {
          const n = this.sizes[l];
          const nxt = this.sizes[l + 1];
          const Wn = this.W[l + 1];
          for (let i = 0; i < n; i++) {
            let back = 0;
            for (let k = 0; k < nxt; k++) back += Wn[k * n + i] * this.e[l + 1][k];
            const a = this.act[l][i];
            this.x[l][i] += eta * (-this.e[l][i] + (1 - a * a) * back);
          }
        }
      }

      for (let l = 1; l <= L; l++) {
        this.predict(l);
        const n = this.sizes[l];
        const m = this.sizes[l - 1];
        for (let i = 0; i < n; i++) {
          const ei = this.x[l][i] - this.mu[l][i];
          this.e[l][i] = ei;
          energy += 0.5 * ei * ei;
          err[l - 1] += Math.abs(ei);
          this.gb[l][i] += ei;
          const row = i * m;
          for (let j = 0; j < m; j++) {
            this.gW[l][row + j] += ei * this.act[l - 1][j];
          }
        }
      }
    }

    const B = batch.length;
    for (let l = 1; l <= L; l++) {
      const W = this.W[l];
      const vW = this.vW[l];
      const gW = this.gW[l];
      for (let i = 0; i < W.length; i++) {
        vW[i] = momentum * vW[i] + (lr * gW[i]) / B;
        W[i] += vW[i];
      }
      const bb = this.b[l];
      const vb = this.vb[l];
      for (let i = 0; i < bb.length; i++) {
        vb[i] = momentum * vb[i] + (lr * this.gb[l][i]) / B;
        bb[i] += vb[i];
      }
      this.layerError[l - 1] = err[l - 1] / (B * this.sizes[l]);
    }
    this.energy = energy / B;
  }

  accuracy(data: Point[]): number {
    let ok = 0;
    for (const p of data) if (this.output(p.x, p.y) * p.label > 0) ok++;
    return ok / data.length;
  }
}
