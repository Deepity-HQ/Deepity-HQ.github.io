import Reveal from "./Reveal";

export default function SectionHead({ title, children }) {
  return (
    <Reveal as="header" className="mb-12 max-w-3xl">
      <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl leading-[1.1] tracking-[-0.02em] text-fg md:text-5xl">
        {title}
      </h2>
      {children && <p className="mt-4 text-lg text-dim">{children}</p>}
    </Reveal>
  );
}
