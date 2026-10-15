import Reveal from "./Reveal";

export default function PageHeader({ title, icon, width = 1000, children }) {
  return (
    <Reveal
      as="header"
      className="mx-auto px-5 pb-12 pt-32 md:px-8 md:pt-40"
      style={{ maxWidth: width }}
    >
      {icon && <img src={icon} width="56" height="56" alt="" className="mb-6 h-14 w-14" />}
      <h1 className="m-0 max-w-3xl font-[family-name:var(--font-display)] text-4xl leading-[1.05] tracking-[-0.03em] md:text-6xl">
        {title}
      </h1>
      {children && <p className="mt-6 max-w-2xl text-lg text-dim md:text-xl">{children}</p>}
    </Reveal>
  );
}
