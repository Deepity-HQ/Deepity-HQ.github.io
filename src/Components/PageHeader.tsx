import type { ReactNode } from "react";
import Reveal from "./Reveal.tsx";

type PageHeaderProps = {
  title: string;
  eyebrow?: string;
  icon?: string;
  width?: number;
  children?: ReactNode;
};

export default function PageHeader({
  title,
  eyebrow,
  icon,
  width = 1000,
  children,
}: PageHeaderProps) {
  return (
    <div className="subpage-glow relative">
      <Reveal
        as="header"
        className="mx-auto px-5 pb-10 pt-40 md:px-8 md:pb-14 md:pt-48"
        style={{ maxWidth: width }}
      >
        {icon && (
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] p-3.5 shadow-[0_0_30px_rgba(139,124,255,0.15)] ring-1 ring-white/10">
            {/* The mark artwork has padding around it, so crop to the glyph */}
            <span className="relative block h-9 w-9 shrink-0 overflow-hidden">
              <img
                src={icon}
                alt=""
                className="absolute -left-[18px] -top-[18px] h-[72px] w-[72px] max-w-none"
              />
            </span>
          </div>
        )}

        {eyebrow && (
          <div className="Michroma mb-4 text-xs uppercase tracking-[0.08em] text-[#a99bff]">
            {eyebrow}
          </div>
        )}

        <h1 className="Michroma m-0 max-w-4xl text-balance text-3xl font-normal leading-[1.15] tracking-[-0.02em] text-white sm:text-4xl md:text-5xl lg:text-6xl">
          {title}
        </h1>

        {children && (
          <p className="Jura mt-5 max-w-2xl text-balance text-base leading-relaxed text-white/75 md:mt-6 md:text-xl">
            {children}
          </p>
        )}
      </Reveal>
    </div>
  );
}
