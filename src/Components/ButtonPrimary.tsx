import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { Link } from "react-router";

type Props = {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md";
  to?: string;
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

const MAX_TILT = 10;

const sizes = {
  sm: "px-4 py-1.5 text-sm",
  md: "px-5 py-2 text-sm",
};

export default function ButtonPrimary({
  children,
  className = "",
  size = "md",
  to,
  href,
  type = "button",
  disabled = false,
  onClick,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const canTilt = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!ref.current || disabled) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });
    if (!canTilt()) return;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    setTilt({
      rotateX: ((cy - y) / cy) * MAX_TILT,
      rotateY: ((x - cx) / cx) * MAX_TILT,
    });
  };

  const handleLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const pressed = isPressed && !disabled;
  const sx = -tilt.rotateY * 0.3;
  const sy = 6 + tilt.rotateX * 0.3;

  const style = {
    transform: `perspective(700px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateY(${pressed ? 3 : 0}px)`,

    boxShadow: `
      0 ${pressed ? 0 : 2}px 0 0 #6f5bd6,
      0 ${pressed ? 1 : 4}px 0 0 #4f3fa8,
      ${sx}px ${pressed ? 3 : sy + 4}px ${pressed ? 6 : 14}px -2px rgba(8, 4, 30, 0.6),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.7),
      inset 0 -2px 2px 0 rgba(70, 50, 155, 0.45)
    `,
    transition: isHovered
      ? "transform 80ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 80ms cubic-bezier(0.2, 0.8, 0.2, 1)"
      : "transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 400ms cubic-bezier(0.2, 0.8, 0.2, 1)",
  };

  const classes = `
    relative inline-flex items-center justify-center overflow-hidden select-none
    ${sizes[size]} rounded-[10px]
    bg-gradient-to-b from-[#c9c0ff] via-[#a99bff] to-[#9684f5]
    border border-[#d9d3ff]/70
    text-[#15102b] font-semibold tracking-[-0.01em] no-underline
    will-change-transform
    focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a99bff]
    ${disabled ? "cursor-wait opacity-70" : "cursor-pointer"}
    ${className}
  `;

  const handlers = {
    onMouseMove: handleMouseMove,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: handleLeave,
    onMouseDown: () => setIsPressed(true),
    onMouseUp: () => setIsPressed(false),
    style,
    className: classes,
  };

  const inner = (
    <>
      <span
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isHovered && !disabled ? 1 : 0,
          background: `radial-gradient(110px circle at ${coords.x}px ${coords.y}px, rgba(255, 255, 255, 0.35), transparent 75%)`,
        }}
      />
      <span
        className="relative z-10 flex items-center justify-center gap-2"
        style={{ textShadow: "0 1px 0 rgba(255, 255, 255, 0.4)" }}
      >
        {children}
      </span>
    </>
  );

  if (to) {
    return (
      <Link ref={ref as React.Ref<HTMLAnchorElement>} to={to} {...handlers}>
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} {...handlers}>
        {inner}
      </a>
    );
  }
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      onClick={onClick}
      {...handlers}
    >
      {inner}
    </button>
  );
}
