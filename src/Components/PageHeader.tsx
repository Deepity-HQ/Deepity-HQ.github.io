import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  width?: number;
  children?: ReactNode;
};

export default function PageHeader({
  title,
  width = 1000,
  children,
}: PageHeaderProps) {
  return (
    <div className="subpage-glow relative">
      <header
        className="mx-auto px-5 pb-10 pt-40 md:px-8 md:pb-14 md:pt-48"
        style={{ maxWidth: width }}
      >
        <h1 className="Michroma m-0 max-w-4xl text-balance text-3xl font-normal leading-[1.15] tracking-[-0.02em] text-white sm:text-4xl md:text-5xl lg:text-6xl">
          {title}
        </h1>

        {children && (
          <p className="Jura mt-5 max-w-2xl text-balance text-base leading-relaxed text-white/75 md:mt-6 md:text-xl">
            {children}
          </p>
        )}
      </header>
    </div>
  );
}
