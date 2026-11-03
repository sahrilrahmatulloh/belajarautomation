import { isValidElement } from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import AuthLink from "@/components/auth/AuthLink";

import Ajakan from "./Ajakan";
import { Peringatan, Tips } from "./Callouts";
import CodeBlock from "./CodeBlock";
import Gambar from "./Gambar";

type Props<T extends keyof React.JSX.IntrinsicElements> = React.ComponentProps<T>;

// Blok kode dari Markdown berbentuk <pre><code class="language-ts">...</code></pre>.
function Pre({ children }: Props<"pre">) {
  if (!isValidElement<{ className?: string; children?: unknown }>(children)) return null;
  const language = children.props.className?.replace("language-", "") ?? "text";
  return <CodeBlock code={String(children.props.children)} language={language} />;
}

function Anchor({ href = "", children }: Props<"a">) {
  if (href.startsWith("/")) {
    return (
      <AuthLink href={href} className="font-medium text-primary underline underline-offset-2">
        {children}
      </AuthLink>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" className="font-medium text-primary underline underline-offset-2">
      {children}
    </a>
  );
}

// Paragraf dan daftar dibatasi sekitar 70 karakter per baris agar nyaman dibaca, sedangkan
// kode, tabel, dan gambar memakai lebar penuh.
const MDX_COMPONENTS = {
  Ajakan,
  Gambar,
  Peringatan,
  Tips,
  a: Anchor,
  pre: Pre,
  h2: (props: Props<"h2">) => <h2 className="mt-10 scroll-mt-4 text-2xl font-bold tracking-tight first:mt-0" {...props} />,
  h3: (props: Props<"h3">) => <h3 className="mt-8 scroll-mt-4 text-xl font-semibold tracking-tight" {...props} />,
  p: (props: Props<"p">) => <p className="my-4 max-w-[37rem] leading-8" {...props} />,
  ul: (props: Props<"ul">) => <ul className="my-4 max-w-[37rem] list-disc space-y-2 pl-6 leading-8" {...props} />,
  ol: (props: Props<"ol">) => <ol className="my-4 max-w-[37rem] list-decimal space-y-2 pl-6 leading-8" {...props} />,
  blockquote: (props: Props<"blockquote">) => (
    <blockquote className="my-6 max-w-[37rem] border-l-4 border-border pl-4 text-muted-foreground" {...props} />
  ),
  code: (props: Props<"code">) => (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]" {...props} />
  ),
  table: (props: Props<"table">) => (
    <div role="group" tabIndex={0} aria-label="Tabel" className="my-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-left text-sm [&_tbody_tr:last-child_td]:border-b-0" {...props} />
    </div>
  ),
  th: (props: Props<"th">) => <th className="border-b border-border bg-muted px-4 py-2.5 font-semibold" {...props} />,
  td: (props: Props<"td">) => <td className="border-b border-border px-4 py-2.5 align-top" {...props} />,
};

export default async function ArticleContent({ content }: { content: string }) {
  const { default: Content } = await evaluate(content, { ...jsxRuntime, remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] });

  return <Content components={MDX_COMPONENTS} />;
}
