import type { ReactNode } from "react";
import { Link } from "react-router";
import { ArrowLeft, ArrowRight } from "./ArrowIcons.tsx";

type Props = {
  children: ReactNode;
  className?: string;
  // Internal route
  to?: string;
  // External address, such as PyPI or GitHub. Opens in a new tab.
  href?: string;
  // Defaults to a right arrow so buttons side by side always match
  arrow?: "right" | "left" | "none";
  // Without `to` or `href` this renders a button
  onClick?: () => void;
};

const base = `
  group inline-flex items-center justify-center gap-2 rounded-[10px]
  border border-white/15 bg-white/[0.04] px-5 py-2
  text-sm font-medium tracking-[-0.01em] text-white no-underline
  shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]
  transition-[border-color,background-color] duration-150
  hover:border-white/30 hover:bg-white/[0.08]
  active:translate-y-px
  focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a99bff]
`;

const arrowClass =
  "text-[#a99bff] transition-transform duration-150 group-hover:translate-x-0.5";

export default function ButtonSecondary({
  children,
  className = "",
  to,
  href,
  arrow,
  onClick,
}: Props) {
  const kind = arrow ?? (onClick ? "none" : "right");
  const classes = `${base} ${className}`;

  const content = (
    <>
      {kind === "left" && <ArrowLeft className={arrowClass.replace("translate-x-0.5", "-translate-x-0.5")} />}
      {children}
      {kind === "right" && <ArrowRight className={arrowClass} />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }
  if (href) {
    const isWeb = /^https?:/.test(href);
    return (
      <a
        href={href}
        className={classes}
        {...(isWeb ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={`${classes} cursor-pointer`}>
      {content}
    </button>
  );
}
