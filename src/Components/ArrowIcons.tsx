import { HiArrowLongLeft, HiArrowLongRight, HiArrowUpRight } from "react-icons/hi2";

// Inline arrow icons that sit on the text baseline and inherit its colour
const cls = "inline-block h-[1.15em] w-[1.15em] shrink-0";

export const ArrowRight = ({ className = "" }: { className?: string }) => (
  <HiArrowLongRight aria-hidden="true" className={`${cls} ${className}`} />
);

export const ArrowLeft = ({ className = "" }: { className?: string }) => (
  <HiArrowLongLeft aria-hidden="true" className={`${cls} ${className}`} />
);

export const ArrowUpRight = ({ className = "" }: { className?: string }) => (
  <HiArrowUpRight aria-hidden="true" className={`${cls} ${className}`} />
);

// A layer-size chain such as 784 > 512 > 10, joined with arrow icons
export const Dims = ({ sizes }: { sizes: number[] }) => (
  <span className="whitespace-nowrap">
    {sizes.map((n, i) => (
      <span key={i}>
        {i > 0 && <HiArrowLongRight aria-hidden="true" className="mx-[0.15em] inline-block h-[1.1em] w-[1.1em] align-[-0.2em]" />}
        {n}
      </span>
    ))}
  </span>
);
