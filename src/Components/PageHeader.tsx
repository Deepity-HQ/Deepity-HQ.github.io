import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  eyebrow?: string;
  width?: number;
  children?: ReactNode;
};

export default function PageHeader({
  title,
  eyebrow,
  width = 1000,
  children,
}: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden border-b border-white/10">
      <div className="grid-fade pointer-events-none absolute inset-0" aria-hidden="true" />
      <header
        className="relative mx-auto px-5 pb-14 pt-36 md:px-8 md:pb-20 md:pt-44"
        style={{ maxWidth: width }}
      >
        {eyebrow && (
          <p className="mono m-0 mb-5 text-xs uppercase tracking-[0.12em] text-[#a99bff]">
            {eyebrow}
          </p>
        )}
        <h1 className="m-0 max-w-4xl text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-5xl md:text-6xl">
          {title}
        </h1>

        {children && (
          <p className="mb-0 mt-6 max-w-2xl text-balance text-base leading-relaxed text-white/60 md:text-lg">
            {children}
          </p>
        )}
      </header>
    </div>
  );
}
