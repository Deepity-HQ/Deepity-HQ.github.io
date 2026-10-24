import { useState } from "react";
import { Link } from "react-router-dom";
import MainFooter from "./components/MainFooter";
import PageHeader from "./components/PageHeader";
import Reveal from "./components/Reveal";
import { CONTACT_EMAIL, EARLY_ACCESS_ENDPOINT } from "./config";

const USE_CASES = [
  "High-performance computing",
  "Embedded systems or edge devices",
  "Research",
  "Something else",
];

const fieldClass =
  "w-full rounded-xl border border-line bg-panel2/80 px-4 py-3 font-[inherit] text-base text-fg placeholder:text-faint transition-all focus:border-accent focus:bg-panel2 focus:shadow-[0_0_20px_rgba(178,41,255,0.18)] focus:outline-none";

export default function EarlyAccess() {
  const [status, setStatus] = useState("idle");
  const [useCase, setUseCase] = useState(USE_CASES[0]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (form.get("company")) return;

    const data = {
      name: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim(),
      useCase,
      message: String(form.get("message") || "").trim(),
    };

    if (!EARLY_ACCESS_ENDPOINT) {
      const body = [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Use case: ${data.useCase}`,
        "",
        data.message,
      ].join("\n");
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        "Deepity early access request",
      )}&body=${encodeURIComponent(body)}`;
      setStatus("mailto");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(EARLY_ACCESS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div>
      <PageHeader
        title="Request early access"
        eyebrow="Developer Preview"
        width={768}
      >
        Tell us what you are building with Deepity and we will get in touch.
      </PageHeader>

      <div className="mx-auto max-w-2xl px-5 pb-16 md:px-8">
        <Reveal className="glass relative overflow-hidden rounded-2xl border border-line p-6 sm:p-10 md:p-12 shadow-2xl">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-accent via-cool to-accent" />

          {status === "sent" ? (
            <div role="status" className="text-center py-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/20 border border-accent/40 text-accent-text">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl font-normal">
                Thanks, we got it.
              </h2>
              <p className="mt-3 text-base text-dim">
                We will reply to the address you gave us.
              </p>
              <Link to="/" className="btn btn--solid mt-6">
                Back to home
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-6">
              <label className="flex flex-col gap-2">
                <span className="label text-xs">Name</span>
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  className={fieldClass}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="label text-xs">Email</span>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@domain.com"
                  className={fieldClass}
                />
              </label>

              <div className="flex flex-col gap-3">
                <span className="label text-xs">What are you building?</span>
                <div className="flex flex-wrap gap-2">
                  {USE_CASES.map((u) => (
                    <button
                      key={u}
                      type="button"
                      aria-pressed={useCase === u}
                      onClick={() => setUseCase(u)}
                      className={`cursor-pointer rounded-lg border px-4 py-2 text-xs font-[family-name:var(--font-display)] transition-all ${
                        useCase === u
                          ? "border-transparent bg-fg text-bg font-semibold shadow-sm"
                          : "border-line bg-fg/[0.04] text-dim hover:border-line-strong hover:text-fg"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex flex-col gap-2">
                <span className="label text-xs">Anything else? (optional)</span>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Tell us about your hardware, workload, or research goals..."
                  className={fieldClass}
                />
              </label>

              <input
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />

              <button
                type="submit"
                disabled={status === "sending"}
                className="btn btn--solid mt-2 w-full py-3 text-base font-medium"
              >
                {status === "sending" ? "Sending…" : "Request early access"}
              </button>

              <div aria-live="polite" className="min-h-6 text-center text-sm">
                {status === "mailto" && (
                  <span className="text-dim">
                    Your email app should have opened with the message filled in. If it did not, email{" "}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="link">
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </span>
                )}
                {status === "error" && (
                  <span className="text-dim">
                    That did not go through. Please try again, or email{" "}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="link">
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </span>
                )}
              </div>

              <div className="border-t border-line pt-4 flex flex-col items-center gap-2">
                <p className="m-0 text-center text-xs text-dim">
                  We only use this to reply about Deepity. No spam, ever.
                </p>
                <Link to="/privacy" className="link text-xs text-faint">
                  Read our privacy policy →
                </Link>
              </div>
            </form>
          )}
        </Reveal>
      </div>

      <MainFooter />
    </div>
  );
}
