import { LuArrowLeft, LuArrowRight, LuArrowUpRight } from "react-icons/lu";

// Inline arrow icons that sit on the text baseline and inherit its colour
const cls = "inline-block h-[1.15em] w-[1.15em] shrink-0";

export const ArrowRight = ({ className = "" }: { className?: string }) => (
  <LuArrowRight aria-hidden="true" className={`${cls} ${className}`} />
);

export const ArrowLeft = ({ className = "" }: { className?: string }) => (
  <LuArrowLeft aria-hidden="true" className={`${cls} ${className}`} />
);

export const ArrowUpRight = ({ className = "" }: { className?: string }) => (
  <LuArrowUpRight aria-hidden="true" className={`${cls} ${className}`} />
);
