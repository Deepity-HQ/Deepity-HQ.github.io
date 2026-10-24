import Reveal from "./Reveal";

export default function PageHeader({
  title,
  eyebrow,
  icon,
  width = 1000,
  children,
}) {
  return (
    <div className="subpage-glow relative">
      <Reveal
        as="header"
        className="mx-auto px-5 pb-10 pt-28 md:px-8 md:pb-14 md:pt-36"
        style={{ maxWidth: width }}
      >
        {icon && (
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-line bg-panel2/90 p-3.5 shadow-[0_0_30px_rgba(178,41,255,0.15)] ring-1 ring-fg/10">
            <img
              src={icon}
              width="44"
              height="44"
              alt=""
              className="h-11 w-11 object-contain"
            />
          </div>
        )}

        {eyebrow && (
          <div className="label mb-4 text-xs tracking-[0.08em] text-accent-text">
            {eyebrow}
          </div>
        )}

        <h1 className="m-0 max-w-4xl text-balance font-[family-name:var(--font-display)] text-3xl font-normal leading-[1.08] tracking-[-0.03em] sm:text-4xl md:text-5xl lg:text-6xl">
          {title}
        </h1>

        {children && (
          <p className="mt-5 max-w-2xl text-balance text-base leading-relaxed text-dim md:mt-6 md:text-xl">
            {children}
          </p>
        )}
      </Reveal>
    </div>
  );
}
