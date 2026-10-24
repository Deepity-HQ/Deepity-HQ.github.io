import { useState } from "react";
import SyntaxHighlighter from "./highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyButton } from "./CodeBlock";

export default function CodeTabs({ files }) {
  const [active, setActive] = useState(0);
  const file = files[active];

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-[#0c0c0d]">
      <div className="flex items-center border-b border-line bg-[#141415] px-3 py-2">
        <div role="tablist" className="flex min-w-0 flex-1 gap-1">
          {files.map((f, i) => (
            <button
              key={f.name}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`cursor-pointer rounded-lg border-0 px-4 py-1.5 text-[13px] font-[family-name:var(--font-display)] ${
                i === active
                  ? "bg-white/10 text-[#f2f2f2]"
                  : "bg-transparent text-[#9b9da0] hover:text-[#f2f2f2]"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
        <div className="flex items-center px-4">
          <CopyButton code={file.code} label={file.name} />
        </div>
      </div>
      <div role="tabpanel" className="max-h-[560px] overflow-auto">
        <SyntaxHighlighter
          language={file.language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "1.25rem 1rem",
            fontSize: "13px",
            fontFamily: "var(--font-display)",
            background: "#0c0c0d",
            borderRadius: 0,
          }}
          codeTagProps={{ style: { fontFamily: "var(--font-display)" } }}
        >
          {file.code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
