import GithubSlugger from "github-slugger";

import { formatDate } from "@/lib/format";
import { ContentItem, ContentKind, ContentNode, ContentStatusId, ContentVideo, ReviewNote } from "@/types/ContentWorkflow";

export const VIDEO_NODE = "videoYoutube";
const WORDS_PER_MINUTE = 200;

export const STATUS_LABELS: Record<ContentStatusId, string> = {
  draf: "Draf",
  "menunggu-review": "Menunggu Review",
  "perlu-revisi": "Perlu Revisi",
  disetujui: "Disetujui",
  terbit: "Terbit",
};

export const KIND_LABELS: Record<ContentKind, string> = {
  artikel: "Artikel",
  lesson: "Lesson",
  soal: "Soal",
};

function walk(node: ContentNode, visit: (node: ContentNode) => void) {
  visit(node);
  node.content?.forEach((child) => walk(child, visit));
}

function plainText(node: ContentNode): string {
  if (node.type === "text") return node.text ?? "";
  return (node.content ?? []).map(plainText).join(node.type === "paragraph" || node.type === "heading" ? "" : " ");
}

// Id heading dibuat sama seperti rehype-slug di halaman publik.
export function listHeadings(body: ContentNode) {
  const slugger = new GithubSlugger();
  const headings: { id: string; text: string; level: number }[] = [];
  walk(body, (node) => {
    if (node.type !== "heading") return;
    const text = plainText(node);
    headings.push({ id: slugger.slug(text), text, level: Number(node.attrs?.level ?? 2) });
  });
  return headings;
}

export function collectVideos(body: ContentNode) {
  const videos: ContentVideo[] = [];
  walk(body, (node) => {
    if (node.type === VIDEO_NODE) videos.push(node.attrs as unknown as ContentVideo);
  });
  return videos;
}

export function countWords(body: ContentNode) {
  return plainText(body).split(/\s+/).filter(Boolean).length;
}

export function readingMinutes(wordCount: number) {
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

export function noteLabel(note: ReviewNote, content: Pick<ContentItem, "body" | "videos">) {
  if (note.kind === "umum") return "Catatan Umum";
  if (note.kind === "bagian") return `Bagian: ${listHeadings(content.body).find((heading) => heading.id === note.anchor)?.text ?? note.anchor}`;
  return `Video: ${content.videos.find((video) => video.id === note.anchor)?.judul ?? note.anchor}`;
}

// Tanggal di data konten berupa ISO lengkap.
export function formatContentDate(isoDateTime: string) {
  return formatDate(isoDateTime.slice(0, 10));
}
