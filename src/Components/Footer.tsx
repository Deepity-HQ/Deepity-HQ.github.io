import { Link } from "react-router";
import { DISCORD_WIDGET_ID, GITHUB_URL } from "../config.ts";
import { DiscordMark, GitHubMark } from "./icons.tsx";

const links: { text: string; to: string; external?: boolean }[] = [
  { text: "Docs", to: "/docs/index.html", external: true },
  { text: "Tutorials", to: "/tutorial" },
  { text: "Benchmarks", to: "/benchmarks" },
  { text: "Theory", to: "/theory" },
  { text: "About", to: "/about" },
  { text: "Early access", to: "/early-access" },
  { text: "Privacy", to: "/privacy" },
];

const linkClass = "Jura text-white/70 no-underline transition-colors hover:text-white";
const iconClass =
  "flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/80 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white";

export default function Footer() {
  return (
    <footer className="relative z-10 px-5 pb-10 pt-8 md:px-8">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 border-t border-white/10 pt-8 md:flex-row md:justify-between">
        <nav
          aria-label="Footer"
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[15px]"
        >
          {links.map(({ text, to, external }) =>
            external ? (
              <a key={text} href={to} className={linkClass}>
                {text}
              </a>
            ) : (
              <Link key={text} to={to} className={linkClass}>
                {text}
              </Link>
            ),
          )}
        </nav>

        <p className="Jura m-0 flex items-center gap-3 text-center text-[15px] text-white/65">
          {/* The mark artwork has padding around it, so crop to the glyph */}
          <span className="relative block h-5 w-5 overflow-hidden opacity-70">
            <img
              src="/Branding/Deepity-07.png"
              alt=""
              className="absolute -left-2.5 -top-2.5 h-10 w-10 max-w-none"
            />
          </span>
          © {new Date().getFullYear()} Deepity. MIT licensed.
        </p>

        <div className="flex gap-2">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Deepity on GitHub"
            className={iconClass}
          >
            <GitHubMark size={18} />
          </a>
          <a
            href={`https://discord.com/widget?id=${DISCORD_WIDGET_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Deepity on Discord"
            className={iconClass}
          >
            <DiscordMark size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
