import { Link } from "react-router-dom";
import { DISCORD_WIDGET_ID, GITHUB_URL } from "../config";
import { DiscordMark, GitHubMark } from "./icons";

const linkClass = "text-dim no-underline transition-colors hover:text-accent-text";
const iconClass =
  "flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-[color:var(--btn-bg)] text-fg transition-colors hover:border-accent hover:bg-[color:var(--btn-bg-hover)] hover:text-accent-text";

export default function MainFooter() {
  return (
    <footer className="px-5 pb-10 pt-8 md:px-8">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 border-t border-line pt-8 md:flex-row md:justify-between">
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[15px]">
          <a href="/docs/index.html" className={linkClass}>Docs</a>
          <Link to="/tutorial" className={linkClass}>Tutorials</Link>
          <Link to="/benchmarks" className={linkClass}>Benchmarks</Link>
          <Link to="/theory" className={linkClass}>Theory</Link>
          <Link to="/about" className={linkClass}>About</Link>
          <Link to="/early-access" className={linkClass}>Early access</Link>
          <Link to="/privacy" className={linkClass}>Privacy</Link>
        </nav>

        <p className="m-0 flex items-center gap-3 text-center text-[15px] text-faint">
          <img src="/brand/mark-white.svg" width="20" height="20" alt="" className="logo-themed h-5 w-5 opacity-70" />
          © {new Date().getFullYear()} Deepity. MIT licensed.
        </p>

        <div className="flex gap-2">
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="Deepity on GitHub" className={iconClass}>
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
