import { isValidElement } from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import AuthLink from "@/components/auth/AuthLink";
import VideoReferensi from "@/components/content/VideoReferensi";

import Ajakan from "./Ajakan";
import { Peringatan, Tips } from "./Callouts";
import CodeBlock from "./CodeBlock";
import Gambar from "./Gambar";
import { PROSE_ELEMENTS } from "./proseElements";

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
      <AuthLink href={href} className="font-medium text-primary-accent underline underline-offset-2">
        {children}
      </AuthLink>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" className="font-medium text-primary-accent underline underline-offset-2">
      {children}
    </a>
  );
}

const MDX_COMPONENTS = {
  Ajakan,
  Gambar,
  Peringatan,
  Tips,
  VideoYouTube: VideoReferensi,
  a: Anchor,
  pre: Pre,
  ...PROSE_ELEMENTS,
};

export default async function ArticleContent({ content }: { content: string }) {
  const { default: Content } = await evaluate(content, { ...jsxRuntime, remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] });

  return <Content components={MDX_COMPONENTS} />;
}
