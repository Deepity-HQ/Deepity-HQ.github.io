import { useState, memo } from "react";
import SyntaxHighlighter from "./highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const syntaxCustomStyle = {
  margin: 0,
  padding: "1rem",
  fontSize: "13px",
  fontFamily: "var(--font-mono)",
  flex: 1,
  overflow: "auto",
  background: "var(--panel)",
  borderRadius: 0,
};

const codeTagProps = { style: { fontFamily: "var(--font-mono)" } };

export function CopyButton({ code, label }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable; ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`cursor-pointer border-0 bg-transparent px-1 text-[13px] font-[family-name:var(--font-display)] uppercase tracking-[0.05em] ${copied ? "text-accent" : "text-dim hover:text-fg"} transition-colors`}
      aria-label={`Copy ${label} code`}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/** Dark, editor-style code window. */
const CodeBlock = memo(({ language, code, icon, title }) => (
  <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-line bg-panel">
    <div className="flex items-center justify-between border-b border-line bg-panel2 px-4 py-2">
      <div className="flex items-center gap-2">
        {icon && <img src={icon} alt="" className="h-4 w-4 object-contain" />}
        <span className="label text-fg">{title}</span>
      </div>
      <CopyButton code={code} label={title} />
    </div>

    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      customStyle={syntaxCustomStyle}
      codeTagProps={codeTagProps}
    >
      {code}
    </SyntaxHighlighter>
  </div>
));

export default CodeBlock;
