import { useState } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import cpp from "react-syntax-highlighter/dist/esm/languages/prism/cpp";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import CopyButton from "./CopyButton.tsx";

SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("cpp", cpp);

export type CodeFile = {
  name: string;
  language: "python" | "cpp";
  code: string;
};

const MONO =
  '"JetBrains Mono Variable", "JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

export default function CodeTabs({ files }: { files: CodeFile[] }) {
  const [active, setActive] = useState(0);
  const file = files[active];

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0d]/90 backdrop-blur-sm">
      <div className="flex items-center border-b border-white/10 bg-white/[0.04] px-3 py-2">
        <div role="tablist" className="flex min-w-0 flex-1 gap-1">
          {files.map((f, i) => (
            <button
              key={f.name}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`Michroma cursor-pointer rounded-lg border-0 px-4 py-1.5 text-xs ${
                i === active
                  ? "bg-white/10 text-white"
                  : "bg-transparent text-white/65 hover:text-white"
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
            padding: "1.25rem 1.25rem",
            fontSize: "14px",
            lineHeight: 1.6,
            fontFamily: MONO,
            background: "transparent",
            borderRadius: 0,
          }}
          codeTagProps={{ style: { fontFamily: MONO } }}
        >
          {file.code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
