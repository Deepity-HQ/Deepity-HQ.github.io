import type { ReactNode } from "react";
import PageHeader from "../Components/PageHeader.tsx";
import { CONTACT_EMAIL, GITHUB_URL } from "../config.ts";
import { btnClass, glassClass, linkClass } from "../Components/ui.ts";

// Set to a Plausible domain if analytics are ever enabled
const PLAUSIBLE_DOMAIN = "";

const UPDATED = "October 13, 2026";

function Block({ title, eyebrow, children }: { title: string; eyebrow?: string; children: ReactNode }) {
  return (
    <section className="p-6 md:p-8 hover:bg-white/[0.015] transition-colors">
      {eyebrow && <div className="Michroma mb-2 text-xs uppercase tracking-[0.06em] text-[#a99bff]">{eyebrow}</div>}
      <h2 className="Michroma m-0 text-lg font-normal tracking-[-0.01em] text-white md:text-xl">
        {title}
      </h2>
      <div className="Jura mt-3 space-y-3 text-base leading-relaxed text-white/75">{children}</div>
    </section>
  );
}

export default function Privacy() {
  return (
    <div>
      <PageHeader title="Privacy Policy" eyebrow="Data & Privacy">
        What this website collects, in plain terms. Last updated {UPDATED}.
      </PageHeader>

      <div className="mx-auto max-w-3xl px-5 pb-16 md:px-8">
        {/* At a glance pills */}
        <div className="mb-8 flex flex-wrap justify-center gap-2.5">
          <span className="inline-flex items-center gap-2 rounded-xl border Jura border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-white/75">
            <svg
              className="h-3.5 w-3.5 text-emerald-400"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="3.5 8.5 6.5 11.5 12.5 4.5" />
            </svg>
            No tracking cookies
          </span>
          <span className="inline-flex items-center gap-2 rounded-xl border Jura border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-white/75">
            <svg
              className="h-3.5 w-3.5 text-emerald-400"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="3.5 8.5 6.5 11.5 12.5 4.5" />
            </svg>
            No data selling
          </span>
          <span className="inline-flex items-center gap-2 rounded-xl border Jura border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-white/75">
            <svg
              className="h-3.5 w-3.5 text-[#a99bff]"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="3.5 8.5 6.5 11.5 12.5 4.5" />
            </svg>
            100% open source code
          </span>
        </div>

        <div className={`${glassClass} divide-y divide-white/10`}>
          <Block title="What we collect" eyebrow="Information Submission">
            <p className="m-0">
              Only what you send us. If you use the early access form, we receive
              your email address and whatever else you type into it (name, what
              you are building, a message). We use it to reply to you about
              Deepity, and for nothing else.
            </p>
          </Block>

          <Block title="Analytics and cookies" eyebrow="Usage & Storage">
            {PLAUSIBLE_DOMAIN ? (
              <p className="m-0">
                This site uses Plausible Analytics to count visits. It does not
                use cookies and does not track individual visitors across sites.
                We set no other cookies.
              </p>
            ) : (
              <p className="m-0">
                This site does not use analytics, advertising, or tracking
                cookies.
              </p>
            )}
          </Block>

          <Block title="Third parties" eyebrow="Infrastructure">
            <p className="m-0">
              The site is hosted on GitHub Pages, and GitHub may log visitors&apos;
              IP addresses as part of serving it. The early access form is
              processed by Formspree, which receives what you submit and passes
              it on to us. Links to GitHub, Discord and other sites lead to
              services with their own policies.
            </p>
          </Block>

          <Block title="Your data rights" eyebrow="Access & Deletion">
            <p className="m-0">
              To ask what we hold about you, or to have it deleted immediately, email{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className={`${linkClass} font-medium`}>
                {CONTACT_EMAIL}
              </a>
              . We honor all deletion requests without delay.
            </p>
          </Block>

          <Block title="Open source auditability" eyebrow="Transparency">
            <p className="m-0">
              The source code of this site and of Deepity is public at{" "}
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={`${linkClass} font-medium`}>
                github.com/Deepity-HQ/Deepity
              </a>
              , so you can inspect how it works directly.
            </p>
          </Block>
        </div>

        <div className={`${glassClass} mt-8 flex flex-col items-center justify-between gap-4 p-6 text-center sm:flex-row sm:text-left md:p-8`}>
          <div>
            <div className="Michroma text-sm text-white">Questions about privacy?</div>
            <div className="Jura mt-1 text-sm text-white/70">Get in touch directly with the developer.</div>
          </div>
          <a href={`mailto:${CONTACT_EMAIL}`} className={`${btnClass} shrink-0`}>
            Contact developer ↗
          </a>
        </div>
      </div>
    </div>
  );
}
