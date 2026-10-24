import MainFooter from "./components/MainFooter";
import PageHeader from "./components/PageHeader";
import { CONTACT_EMAIL, GITHUB_URL, PLAUSIBLE_DOMAIN } from "./config";

const UPDATED = "October 13, 2026";

function Block({ title, eyebrow, children }) {
  return (
    <section className="p-6 md:p-8 hover:bg-fg/[0.015] transition-colors">
      {eyebrow && <div className="label mb-2 text-xs text-accent-text">{eyebrow}</div>}
      <h2 className="m-0 font-[family-name:var(--font-display)] text-xl font-normal tracking-[-0.01em] md:text-2xl text-fg">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-base leading-relaxed text-dim">{children}</div>
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
          <span className="inline-flex items-center gap-2 rounded-xl border border-line bg-fg/[0.04] px-3.5 py-1.5 text-xs text-dim">
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
          <span className="inline-flex items-center gap-2 rounded-xl border border-line bg-fg/[0.04] px-3.5 py-1.5 text-xs text-dim">
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
          <span className="inline-flex items-center gap-2 rounded-xl border border-line bg-fg/[0.04] px-3.5 py-1.5 text-xs text-dim">
            <svg
              className="h-3.5 w-3.5 text-accent-text"
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

        <div className="glass overflow-hidden rounded-2xl border border-line divide-y divide-line">
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
              <a href={`mailto:${CONTACT_EMAIL}`} className="link font-medium text-fg">
                {CONTACT_EMAIL}
              </a>
              . We honor all deletion requests without delay.
            </p>
          </Block>

          <Block title="Open source auditability" eyebrow="Transparency">
            <p className="m-0">
              The source code of this site and of Deepity is public at{" "}
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="link font-medium text-fg">
                github.com/Deepity-HQ/Deepity
              </a>
              , so you can inspect how it works directly.
            </p>
          </Block>
        </div>

        <div className="glass mt-8 p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="text-fg font-medium">Questions about privacy?</div>
            <div className="text-sm text-dim mt-1">Get in touch directly with the developer.</div>
          </div>
          <a href={`mailto:${CONTACT_EMAIL}`} className="btn shrink-0 text-sm">
            Contact developer ↗
          </a>
        </div>
      </div>

      <MainFooter />
    </div>
  );
}
