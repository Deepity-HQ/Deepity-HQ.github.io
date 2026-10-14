import Reveal from "./Reveal";

/** Centered section title with an optional one-line description. */
export default function SectionHead({ label, title, children }) {
  return (
    <Reveal as="header" className="mx-auto mb-14 max-w-3xl text-center">
      <div className="label mb-4">{label}</div>
      <h2 className="m-0 font-[family-name:var(--font-display)] text-4xl leading-[1.05] tracking-[-0.02em] text-fg md:text-6xl">
        {title}
      </h2>
      {children && <p className="mx-auto mt-5 max-w-2xl text-lg text-dim">{children}</p>}
    </Reveal>
  );
}
