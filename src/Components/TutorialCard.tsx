import { Link } from "react-router";
import { ArrowRight } from "./ArrowIcons.tsx";

type TutorialCardProps = {
  title: string;
  subtitle: string;
  description: string;
  img?: string;
  link: string;
};

export default function TutorialCard({
  title,
  subtitle,
  description,
  img,
  link,
}: TutorialCardProps) {
  return (
    <Link
      to={link}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0d] text-white no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:border-[#8b7cff] hover:shadow-[6px_6px_0_rgba(139,124,255,0.85)]"
    >
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#8b7cff] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex flex-grow flex-col p-6 md:p-7">
        <div className="mb-3 flex items-center justify-between">
          <span className="Michroma text-[11px] uppercase tracking-wider text-[#a99bff]">
            {subtitle}
          </span>
          <span className="Michroma inline-flex items-center gap-1.5 text-xs text-white/60 transition-all group-hover:text-[#a99bff]">
            Read
            <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>

        <h3 className="Michroma m-0 mb-3 text-lg font-normal leading-snug text-white transition-colors group-hover:text-[#a99bff]">
          {title}
        </h3>

        <p className="Jura m-0 flex-1 text-sm leading-relaxed text-white/70">
          {description}
        </p>
      </div>

      <div className="relative mt-auto h-44 w-full overflow-hidden border-t border-white/10 bg-[#141415]">
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
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0c0c0d] via-transparent to-transparent opacity-60" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center p-6 text-center">
            <span className="Michroma text-xs text-white/50">Deepity Guide</span>
          </div>
        )}
      </div>
    </Link>
  );
}
