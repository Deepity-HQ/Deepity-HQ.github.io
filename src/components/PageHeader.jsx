import Reveal from "./Reveal";

/** Centered page title block used by the content pages. */
export default function PageHeader({ label, title, children }) {
  return (
    <Reveal as="header" className="mx-auto max-w-3xl px-5 pb-12 pt-32 text-center md:pt-40">
      <div className="label mb-4">{label}</div>
      <h1 className="m-0 font-[family-name:var(--font-display)] text-5xl leading-[1.04] tracking-[-0.03em] md:text-7xl">
        {title}
      </h1>
      {children && <p className="mx-auto mt-6 max-w-2xl text-lg text-dim md:text-xl">{children}</p>}
    </Reveal>
  );
}
