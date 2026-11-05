import { bundledLanguages, codeToHtml } from "shiki";

import CodeFrame from "./CodeFrame";

interface CodeBlockProps {
  code: string;
  language: string;
}

export default async function CodeBlock({ code, language }: CodeBlockProps) {
  // File konten di Windows bisa berakhir baris CRLF, yang tidak boleh ikut tersalin.
  const trimmed = code.replace(/\r\n/g, "\n").replace(/\n$/, "");
  const html = await codeToHtml(trimmed, {
    lang: language in bundledLanguages ? language : "text",
    theme: "github-dark-default",
  });

  return <CodeFrame code={trimmed} language={language} html={html} />;
}
