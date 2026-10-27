import { useNavigate } from "react-router";

const iconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const buttonClass =
  "flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-white/70 transition-all hover:bg-white/10 hover:text-white active:scale-95";

export default function UtilButton({
  backLink,
  nextLink,
}: {
  backLink?: string;
  nextLink?: string;
}) {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden items-center gap-1 rounded-xl border border-white/10 bg-[#141415]/85 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-md sm:flex">
      <button
        type="button"
        onClick={() => (backLink ? navigate(backLink) : navigate(-1))}
        aria-label="Go back"
        title="Go back"
        className={buttonClass}
      >
        <svg {...iconProps}>
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <span className="h-3.5 w-px bg-white/10" aria-hidden="true" />
      <button
        type="button"
        onClick={() => (nextLink ? navigate(nextLink) : navigate(1))}
        aria-label="Go to next page"
        title="Go to next page"
        className={buttonClass}
      >
        <svg {...iconProps}>
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
