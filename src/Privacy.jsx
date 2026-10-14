import MainFooter from "./components/MainFooter";
import PageHeader from "./components/PageHeader";
import useDocumentTitle from "./lib/useDocumentTitle";
import { CONTACT_EMAIL, GITHUB_URL, PLAUSIBLE_DOMAIN } from "./config";

const UPDATED = "October 13, 2026";

function Block({ title, children }) {
  return (
    <section className="mt-10">
      <h2 className="m-0 font-[family-name:var(--font-display)] text-2xl tracking-[-0.01em] md:text-3xl">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-lg text-dim">{children}</div>
    </section>
  );
}

export default function Privacy() {
  useDocumentTitle("Privacy");

  return (
    <div>
      <PageHeader label="Privacy" title="Privacy">
        What this website collects, in plain terms. Last updated {UPDATED}.
      </PageHeader>

      <div className="mx-auto max-w-2xl px-5 pb-16">
        <Block title="What we collect">
          <p className="m-0">
            Only what you send us. If you use the early access form, we receive
            your email address and whatever else you type into it (name, what
            you are building, a message). We use it to reply to you about
            Deepity, and for nothing else.
          </p>
        </Block>

        <Block title="Analytics and cookies">
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

        <Block title="Third parties">
          <p className="m-0">
            The site is hosted on GitHub Pages, and GitHub may log visitors&apos;
            IP addresses as part of serving it. The early access form is
            processed by Formspree, which receives what you submit and passes
            it on to us. Links to GitHub, Discord and other sites lead to
            services with their own policies.
          </p>
        </Block>

        <Block title="Your data">
          <p className="m-0">
            To ask what we hold about you, or to have it deleted, email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="link">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Block>

        <Block title="Open source">
          <p className="m-0">
            The source code of this site and of Deepity is public at{" "}
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="link">
              github.com/Deepity-HQ/Deepity
            </a>
            , so you can check how it works.
          </p>
        </Block>
      </div>

      <MainFooter />
    </div>
  );
}
