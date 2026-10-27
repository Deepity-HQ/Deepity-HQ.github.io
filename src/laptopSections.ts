// Copy shown on the laptop screen and, on narrow viewports, as real HTML cards
export const laptopSections = [
  {
    title: "Its own engine",
    body: "The core is C++ and CUDA code written for predictive coding, with Python bindings through nanobind. The compiled extension is under 2MB.",
  },
  {
    title: "CPU and GPU",
    body: "SIMD kernels from Google Highway and SLEEF, plus OpenBLAS or Intel MKL, keep it fast on the CPU. A CUDA backend covers NVIDIA GPUs.",
  },
  {
    title: "Documented and tested",
    body: "Doxygen docs and runnable examples. GitHub Actions builds the library on Linux and Windows and type-checks the Python package on every push.",
  },
  {
    title: "Open source",
    body: "",
  },
];

export const openSourceText = {
  before: "Publicly available on GitHub. Developed by a ",
  link: "Data Analytics student at Ohio State",
  after: ".",
};
