import SyntaxHighlighter from "./highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { codeBoxStyle, codeTagProps } from "./codeStyle";

export default function HighlightedCode({ language, code }) {
  return (
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      customStyle={codeBoxStyle}
      codeTagProps={codeTagProps}
    >
      {code}
    </SyntaxHighlighter>
  );
}
