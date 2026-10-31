import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import PageHeader from "../Components/PageHeader.tsx";
import Reveal from "../Components/Reveal.tsx";
import { CONTACT_EMAIL, EARLY_ACCESS_ENDPOINT } from "../config.ts";
import { ArrowRight } from "../Components/ArrowIcons.tsx";

const USE_CASES = [
  "High-performance computing",
  "Embedded systems or edge devices",
  "Research",
  "Something else",
];

type Status = "idle" | "sending" | "sent" | "error" | "mailto";

const fieldClass =
  "Jura w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-base text-white placeholder:text-white/45 transition-all focus:border-[#8b7cff] focus:bg-white/[0.08] focus:shadow-[0_0_20px_rgba(139,124,255,0.25)] focus:outline-none";

const labelClass = "Michroma text-xs uppercase tracking-[0.06em] text-white/70";

const linkClass =
  "text-[#b9aeff] underline underline-offset-4 transition-colors hover:text-white";

export default function EarlyAccess() {
  const [status, setStatus] = useState<Status>("idle");
  const [useCase, setUseCase] = useState(USE_CASES[0]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
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
        width={768}
      >
        Tell us what you are building with Deepity and we will get in touch.
      </PageHeader>

      <div className="mx-auto max-w-2xl px-5 pb-16 md:px-8">
        <Reveal className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-sm sm:p-10 md:p-12">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#8b7cff] via-[#7dd3fc] to-[#8b7cff]" />

          {status === "sent" ? (
            <div role="status" className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#8b7cff]/40 bg-[#8b7cff]/20 text-[#b9aeff]">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="Michroma m-0 text-2xl font-normal text-white md:text-3xl">
                Thanks, we got it.
              </h2>
              <p className="Jura mt-3 text-base text-white/75">
                We will reply to the address you gave us.
              </p>
              <Link
                to="/"
                className="Michroma mt-6 inline-flex rounded-lg bg-white px-6 py-3 text-sm text-black no-underline transition-colors hover:bg-fuchsia-400"
              >
                Back to home
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-6">
              <label className="flex flex-col gap-2">
                <span className={labelClass}>Name</span>
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  className={fieldClass}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className={labelClass}>Email</span>
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
                <span className={labelClass}>What are you building?</span>
                <div className="flex flex-wrap gap-2">
                  {USE_CASES.map((u) => (
                    <button
                      key={u}
                      type="button"
                      aria-pressed={useCase === u}
                      onClick={() => setUseCase(u)}
                      className={`Michroma cursor-pointer rounded-lg border px-4 py-2 text-xs transition-all ${
                        useCase === u
                          ? "border-transparent bg-white text-black shadow-sm"
                          : "border-white/10 bg-white/[0.04] text-white/70 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex flex-col gap-2">
                <span className={labelClass}>Anything else? (optional)</span>
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
                className="Michroma mt-2 w-full cursor-pointer rounded-lg border-0 bg-white px-6 py-3 text-sm text-black transition-colors hover:bg-fuchsia-400 disabled:cursor-wait disabled:opacity-70"
              >
                {status === "sending" ? "Sending…" : "Request early access"}
              </button>

              <div
                aria-live="polite"
                className="Jura min-h-6 text-center text-sm"
              >
                {status === "mailto" && (
                  <span className="text-white/75">
                    Your email app should have opened with the message filled in.
                    If it did not, email{" "}
                    <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </span>
                )}
                {status === "error" && (
                  <span className="text-white/75">
                    That did not go through. Please try again, or email{" "}
                    <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </span>
                )}
              </div>

              <div className="flex flex-col items-center gap-2 border-t border-white/10 pt-4">
                <p className="Jura m-0 text-center text-xs text-white/70">
                  We only use this to reply about Deepity. No spam, ever.
                </p>
                <Link to="/privacy" className={`Jura inline-flex items-center gap-1 text-xs ${linkClass}`}>
                  Read our privacy policy
                  <ArrowRight />
                </Link>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </div>
  );
}
