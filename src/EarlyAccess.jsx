import { useState } from "react";
import { Link } from "react-router-dom";
import MainFooter from "./components/MainFooter";
import PageHeader from "./components/PageHeader";
import Reveal from "./components/Reveal";
import useDocumentTitle from "./lib/useDocumentTitle";
import { CONTACT_EMAIL, EARLY_ACCESS_ENDPOINT } from "./config";

const USE_CASES = [
  "High-performance computing",
  "Embedded systems or edge devices",
  "Research",
  "Something else",
];

const fieldClass =
  "w-full rounded-2xl border border-line-strong bg-black/40 px-4 py-3 font-[inherit] text-[17px] text-fg placeholder:text-faint focus:border-accent focus:outline-none";

export default function EarlyAccess() {
  useDocumentTitle("Request early access");
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
      <PageHeader title="Request early access" width={768}>
        Tell us what you are building with Deepity and we will get in touch.
      </PageHeader>

      <div className="mx-auto max-w-3xl px-3 pb-16 md:px-6">
        <Reveal className="panel-flat rounded-2xl border border-line p-3 md:p-8">
          <div className="card-dark mx-auto max-w-xl p-6 md:p-10">
          {status === "sent" ? (
            <div role="status" className="text-center">
              <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl">Thanks, we got it.</h2>
              <p className="mt-4 text-lg text-dim">We will reply to the address you gave us.</p>
              <Link to="/" className="btn mt-6">
                Back to home
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-5">
              <label className="flex flex-col gap-2">
                <span className="label">Name</span>
                <input name="name" type="text" autoComplete="name" className={fieldClass} />
              </label>

              <label className="flex flex-col gap-2">
                <span className="label">Email</span>
                <input name="email" type="email" required autoComplete="email" className={fieldClass} />
              </label>

              <div className="flex flex-col gap-3">
                <span className="label">What are you building?</span>
                <div className="flex flex-wrap gap-2">
                  {USE_CASES.map((u) => (
                    <button
                      key={u}
                      type="button"
                      aria-pressed={useCase === u}
                      onClick={() => setUseCase(u)}
                      className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm transition-colors ${
                        useCase === u ? "border-transparent bg-white text-black" : "border-line bg-white/[0.04] text-dim hover:text-fg"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex flex-col gap-2">
                <span className="label">Anything else? (optional)</span>
                <textarea name="message" rows={4} className={fieldClass} />
              </label>

              <input
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />

              <button type="submit" disabled={status === "sending"} className="btn btn--solid mt-1 w-full">
                {status === "sending" ? "Sending…" : "Request early access"}
              </button>

              <div aria-live="polite" className="min-h-6 text-center text-[15px]">
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

              <p className="m-0 text-center text-[14px] text-faint">
                We only use this to reply about Deepity. See the{" "}
                <Link to="/privacy" className="link">
                  privacy page
                </Link>
                .
              </p>
            </form>
          )}
          </div>
        </Reveal>
      </div>

      <MainFooter />
    </div>
  );
}
