import { lazy, memo, Suspense } from "react";
import CopyButton from "./CopyButton.tsx";

const HighlightedCode = lazy(() => import("./HighlightedCode.tsx"));

export const CODE_FONT =
  '"JetBrains Mono Variable", "JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

export const codeBoxStyle = {
  margin: 0,
  padding: "1rem",
  fontSize: "13px",
  fontFamily: CODE_FONT,
  flex: 1,
  overflow: "auto",
  background: "#0c0c0d",
  borderRadius: 0,
};

type CodeBlockProps = {
  language: "python" | "bash";
  code: string;
  icon?: string;
  title: string;
};

const CodeBlock = memo(({ language, code, icon, title }: CodeBlockProps) => (
  <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0d]">
    <div className="flex items-center justify-between border-b border-white/10 bg-[#141415] px-4 py-2">
      <div className="flex items-center gap-2">
        {icon && <img src={icon} alt="" className="h-4 w-4 object-contain" />}
        <span className="Michroma text-xs text-[#f2f2f2]">{title}</span>
      </div>
      <CopyButton code={code} label={title} />
    </div>

    <Suspense
      fallback={
        <pre style={{ ...codeBoxStyle, color: "#f2f2f2" }}>
          <code>{code}</code>
        </pre>
      }
    >
      <HighlightedCode language={language} code={code} />
    </Suspense>
  </div>
));

export default CodeBlock;
