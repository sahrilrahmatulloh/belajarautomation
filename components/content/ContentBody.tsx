"use client";

import { Fragment, useEffect, useState } from "react";

import { Peringatan, Tips } from "@/components/blog/mdx/Callouts";
import CodeFrame from "@/components/blog/mdx/CodeFrame";
import Gambar from "@/components/blog/mdx/Gambar";
import { PROSE_ELEMENTS } from "@/components/blog/mdx/proseElements";
import VideoReferensi from "@/components/content/VideoReferensi";
import { listHeadings, VIDEO_NODE } from "@/lib/content/document";
import { ContentNode, ContentVideo } from "@/types/ContentWorkflow";

const { blockquote: Blockquote, code: InlineCode, h2: H2, h3: H3, ol: Ol, p: P, table: Table, td: Td, th: Th, ul: Ul } = PROSE_ELEMENTS;

// Penyorotan kode di browser, dimuat hanya saat ada blok kode.
function ClientCodeBlock({ code, language }: { code: string; language: string }) {
  const [html, setHtml] = useState<string>();

  useEffect(() => {
    let active = true;
    void import("shiki").then(({ bundledLanguages, codeToHtml }) =>
      codeToHtml(code, { lang: language in bundledLanguages ? language : "text", theme: "github-dark-default" }).then((result) => {
        if (active) setHtml(result);
      })
    );
    return () => {
      active = false;
    };
  }, [code, language]);

  return <CodeFrame code={code} language={language} html={html} />;
}

function renderText(node: ContentNode) {
  return (node.marks ?? []).reduce<React.ReactNode>((element, mark) => {
    if (mark.type === "bold") return <strong>{element}</strong>;
    if (mark.type === "italic") return <em>{element}</em>;
    if (mark.type === "code") return <InlineCode>{element}</InlineCode>;
    return element;
  }, node.text);
}

function NodeList({ nodes, headingIds }: { nodes?: ContentNode[]; headingIds: Map<ContentNode, string> }) {
  return (nodes ?? []).map((node, index) => (
    <Fragment key={index}>
      <ContentNodeView node={node} headingIds={headingIds} />
    </Fragment>
  ));
}

function ContentNodeView({ node, headingIds }: { node: ContentNode; headingIds: Map<ContentNode, string> }) {
  const children = <NodeList nodes={node.content} headingIds={headingIds} />;
  const attrs = node.attrs ?? {};

  switch (node.type) {
    case "text":
      return renderText(node);
    case "paragraph":
      return <P>{children}</P>;
    case "heading":
      return attrs.level === 3 ? <H3 id={headingIds.get(node)}>{children}</H3> : <H2 id={headingIds.get(node)}>{children}</H2>;
    case "bulletList":
      return <Ul>{children}</Ul>;
    case "orderedList":
      return <Ol>{children}</Ol>;
    case "listItem":
      return <li className="[&>p]:my-0">{children}</li>;
    case "blockquote":
      return <Blockquote>{children}</Blockquote>;
    case "horizontalRule":
      return <hr className="my-8 border-border" />;
    case "hardBreak":
      return <br />;
    case "codeBlock":
      return <ClientCodeBlock code={(node.content ?? []).map((item) => item.text ?? "").join("")} language={String(attrs.language ?? "text")} />;
    case "tips":
      return <Tips>{children}</Tips>;
    case "peringatan":
      return <Peringatan>{children}</Peringatan>;
    case "gambar":
      return <Gambar src={String(attrs.src)} alt={String(attrs.alt ?? "")} keterangan={attrs.keterangan ? String(attrs.keterangan) : undefined} />;
    case VIDEO_NODE: {
      const video = attrs as unknown as ContentVideo;
      return <VideoReferensi id={video.id} judul={video.judul} channel={video.channel} durasi={video.durasi} bahasa={video.bahasa} embed={video.embed} />;
    }
    case "table":
      return <Table><tbody>{children}</tbody></Table>;
    case "tableRow":
      return <tr>{children}</tr>;
    case "tableHeader":
      return <Th className="[&>p]:my-0">{children}</Th>;
    case "tableCell":
      return <Td className="[&>p]:my-0">{children}</Td>;
    default:
      return children;
  }
}

// Menampilkan isi konten dari format dokumen editor dengan komponen yang sama seperti
// halaman publik (PRD FR-15).
export default function ContentBody({ body }: { body: ContentNode }) {
  const ids = listHeadings(body);
  const headingIds = new Map<ContentNode, string>();
  let position = 0;
  const assign = (node: ContentNode) => {
    if (node.type === "heading") {
      headingIds.set(node, ids[position].id);
      position += 1;
    }
    node.content?.forEach(assign);
  };
  assign(body);

  return <NodeList nodes={body.content} headingIds={headingIds} />;
}
