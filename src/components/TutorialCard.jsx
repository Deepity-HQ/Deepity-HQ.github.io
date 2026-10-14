import { Link } from "react-router-dom";

export default function TutorialCard({ title, subtitle, description, img, link }) {
  return (
    <Link
      to={link}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-panel text-fg no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:border-accent hover:shadow-[6px_6px_0_var(--accent)]"
    >
      <div className="flex-grow p-6">
        <div className="label mb-3">{subtitle}</div>
        <h5 className="m-0 mb-3 font-[family-name:var(--font-display)] text-xl leading-snug">
          {title}
        </h5>
        <p className="m-0 text-[16px] text-dim">{description}</p>
      </div>

      <div className="relative mt-auto overflow-hidden border-t border-line">
        <img
          src={img}
          alt=""
          width="480"
          height="320"
          loading="lazy"
          decoding="async"
          className="h-40 w-full object-cover opacity-70 grayscale transition-[filter,opacity] duration-200 group-hover:opacity-100 group-hover:grayscale-0"
        />
      </div>
    </Link>
  );
}
