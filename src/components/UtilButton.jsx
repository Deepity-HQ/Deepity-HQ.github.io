import { useNavigate } from "react-router-dom";

export default function UtilButton({ backLink, nextLink }) {
  const navigate = useNavigate();

  const goTo = (link, fallback) => {
    navigate(link ?? fallback);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center gap-1 rounded-xl border border-line bg-panel2/85 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-md">
      <button
        type="button"
        onClick={() => goTo(backLink, -1)}
        aria-label="Go back"
        title="Go back"
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-dim transition-all hover:bg-fg/10 hover:text-fg active:scale-95"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <span className="h-3.5 w-px bg-line" aria-hidden="true" />

      <button
        type="button"
        onClick={() => goTo(nextLink, 1)}
        aria-label="Go to next page"
        title="Go to next page"
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-dim transition-all hover:bg-fg/10 hover:text-fg active:scale-95"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
