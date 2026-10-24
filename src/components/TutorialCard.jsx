import { Link } from "react-router-dom";

export default function TutorialCard({ title, subtitle, description, img, link }) {
  return (
    <Link
      to={link}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-panel text-fg no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:border-accent hover:shadow-[6px_6px_0_var(--accent)]"
    >
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex flex-grow flex-col p-6 md:p-7">
        <div className="mb-3 flex items-center justify-between">
          <span className="label text-[11px] tracking-wider text-accent-text">
            {subtitle}
          </span>
          <span className="font-[family-name:var(--font-display)] text-xs text-dim transition-all group-hover:translate-x-0.5 group-hover:text-accent-text">
            Read →
          </span>
        </div>

        <h3 className="m-0 mb-3 font-[family-name:var(--font-display)] text-xl leading-snug font-normal text-fg group-hover:text-accent-text transition-colors">
          {title}
        </h3>

        <p className="m-0 text-sm leading-relaxed text-dim flex-1">
          {description}
        </p>
      </div>

      <div className="relative mt-auto h-44 w-full overflow-hidden border-t border-line bg-panel2">
        {img ? (
          <>
            <img
              src={img}
              alt=""
              width="480"
              height="320"
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover opacity-75 grayscale transition-all duration-300 group-hover:scale-105 group-hover:opacity-95 group-hover:grayscale-0"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent opacity-60" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-panel2/50 p-6 text-center">
            <span className="font-[family-name:var(--font-display)] text-xs text-faint">Deepity Guide</span>
          </div>
        )}
      </div>
    </Link>
  );
}
