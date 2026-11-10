import { Link } from "react-router";
import { DISCORD_WIDGET_ID, GITHUB_URL } from "../config.ts";
import { DiscordMark, GitHubMark } from "./icons.tsx";

type FooterLink = { text: string; to: string; external?: boolean };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Learn",
    links: [
      { text: "Tutorials", to: "/tutorial" },
      { text: "Theory", to: "/theory" },
      { text: "Docs", to: "/docs/index.html", external: true },
      { text: "Benchmarks", to: "/benchmarks" },
    ],
  },
  {
    title: "Project",
    links: [
      { text: "About", to: "/about" },
      { text: "Early access", to: "/early-access" },
      { text: "GitHub", to: GITHUB_URL, external: true },
      { text: "PyPI", to: "https://pypi.org/project/pydeepity/", external: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { text: "Privacy", to: "/privacy" },
      { text: "MIT license", to: `${GITHUB_URL}/blob/main/LICENSE`, external: true },
    ],
  },
];

const linkClass = "text-sm text-white/55 no-underline transition-colors hover:text-white";
const iconClass =
  "flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/70 transition-colors hover:border-white/25 hover:text-white";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-5 pb-10 pt-14 md:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <img src="/logo.svg" alt="Deepity" className="h-5 w-auto" />
            <p className="mb-0 mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              An open-source engine for training neural networks with predictive
              coding, in C++ and Python.
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Deepity on GitHub"
                className={iconClass}
              >
                <GitHubMark size={17} />
              </a>
              <a
                href={`https://discord.com/widget?id=${DISCORD_WIDGET_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Deepity on Discord"
                className={iconClass}
              >
                <DiscordMark size={17} />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="m-0 mb-4 text-xs font-medium uppercase tracking-[0.08em] text-white/40">
                {col.title}
              </h2>
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {col.links.map(({ text, to, external }) => (
                  <li key={text}>
                    {external ? (
                      <a href={to} className={linkClass}>
                        {text}
                      </a>
                    ) : (
                      <Link to={to} className={linkClass}>
                        {text}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Deepity. MIT licensed.</span>
          <span>Built by one developer.</span>
        </div>
      </div>
    </footer>
  );
}
