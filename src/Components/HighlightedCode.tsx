import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CODE_FONT, codeBoxStyle } from "./CodeBlock.tsx";

SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("bash", bash);

export default function HighlightedCode({
  language,
  code,
}: {
  language: string;
  code: string;
}) {
  return (
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      customStyle={codeBoxStyle}
      codeTagProps={{ style: { fontFamily: CODE_FONT } }}
    >
      {code}
    </SyntaxHighlighter>
  );
}
