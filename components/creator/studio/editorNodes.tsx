"use client";

import { mergeAttributes, Node, NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { Pencil, Play, Trash2 } from "lucide-react";

import { VIDEO_NODE } from "@/lib/content/document";
import { ContentVideo } from "@/types/ContentWorkflow";

// Blok video meminta dialog Edit lewat event DOM, karena dialognya dimiliki RichTextEditor.
export const EDIT_VIDEO_EVENT = "belajarautomation-edit-video";

const CALLOUTS = [
  {
    name: "tips",
    className: "my-4 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-sm before:mb-1 before:block before:font-semibold before:content-['Tips']",
  },
  {
    name: "peringatan",
    className: "my-4 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm before:mb-1 before:block before:font-semibold before:content-['Peringatan']",
  },
];

export const CalloutNodes = CALLOUTS.map(({ name, className }) =>
  Node.create({
    name,
    group: "block",
    content: "block+",
    defining: true,
    parseHTML: () => [{ tag: `aside[data-callout="${name}"]` }],
    renderHTML: ({ HTMLAttributes }) => ["aside", mergeAttributes(HTMLAttributes, { "data-callout": name, class: className }), 0],
  })
);

const blockActionClass = "inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-colors";

function GambarView({ node, deleteNode }: NodeViewProps) {
  const { src, alt, keterangan } = node.attrs as { src: string; alt: string; keterangan: string };

  return (
    <NodeViewWrapper as="figure" contentEditable={false} className="my-4">
      {/* Data URL hasil simulasi upload, tidak melewati optimasi next/image. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-auto max-h-80 w-auto max-w-full rounded-xl border border-border" />
      <figcaption className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>{keterangan || alt}</span>
        <button type="button" aria-label={`Hapus gambar ${alt}`} onClick={deleteNode} className={`${blockActionClass} border-destructive/40 text-destructive hover:bg-destructive/10`}>
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Hapus
        </button>
      </figcaption>
    </NodeViewWrapper>
  );
}

export const GambarNode = Node.create({
  name: "gambar",
  group: "block",
  atom: true,
  addAttributes: () => ({ src: { default: "" }, alt: { default: "" }, keterangan: { default: "" } }),
  parseHTML: () => [{ tag: "figure[data-gambar]" }],
  renderHTML: ({ HTMLAttributes }) => ["figure", { "data-gambar": "" }, ["img", { src: HTMLAttributes.src, alt: HTMLAttributes.alt }]],
  addNodeView: () => ReactNodeViewRenderer(GambarView),
});

function VideoView({ node, deleteNode, editor }: NodeViewProps) {
  const video = node.attrs as ContentVideo;

  return (
    <NodeViewWrapper data-video-id={video.id} contentEditable={false} className="my-4 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3">
      <span className="flex h-14 w-24 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white">
        <Play className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1 basis-40 text-sm">
        <span className="block font-semibold">{video.judul}</span>
        <span className="block text-muted-foreground">{video.channel} · {video.durasi} · Bahasa {video.bahasa}</span>
        {!video.embed && <span className="block text-muted-foreground">Tampil sebagai tautan karena embed dimatikan.</span>}
      </span>
      <span className="flex gap-2">
        <button
          type="button"
          aria-label={`Edit video ${video.judul}`}
          onClick={() => editor.view.dom.dispatchEvent(new CustomEvent(EDIT_VIDEO_EVENT, { detail: video }))}
          className={`${blockActionClass} border-border hover:bg-accent`}
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Edit
        </button>
        <button type="button" aria-label={`Hapus video ${video.judul}`} onClick={deleteNode} className={`${blockActionClass} border-destructive/40 text-destructive hover:bg-destructive/10`}>
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Hapus
        </button>
      </span>
    </NodeViewWrapper>
  );
}

export const VideoNode = Node.create({
  name: VIDEO_NODE,
  group: "block",
  atom: true,
  addAttributes: () => ({
    id: { default: "" },
    judul: { default: "" },
    channel: { default: "" },
    durasi: { default: "" },
    bahasa: { default: "Indonesia" },
    embed: { default: true },
    alasan: { default: "" },
  }),
  parseHTML: () => [{ tag: "div[data-video-youtube]" }],
  renderHTML: () => ["div", { "data-video-youtube": "" }],
  addNodeView: () => ReactNodeViewRenderer(VideoView),
});
