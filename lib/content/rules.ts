import { ContentItem, ContentNode } from "@/types/ContentWorkflow";

// Checklist Creator sebelum mengirim konten (PRD Bagian 16).
export const CREATOR_CHECKLIST = [
  { id: "kode", label: "Contoh kode sudah diuji dan berjalan dengan benar." },
  { id: "sumber", label: "Data dan informasi memiliki sumber yang jelas." },
  { id: "bahasa", label: "Bahasa dan penulisan sudah diperiksa." },
  { id: "tanpa-video", label: "Konten tetap bisa dipahami tanpa video." },
];

// Checklist Reviewer sebelum menyetujui konten (PRD FR-15 dan Bagian 16).
export const REVIEWER_CHECKLIST = [
  { id: "akurasi", label: "Materi akurat." },
  { id: "kode", label: "Contoh kode benar." },
  { id: "sumber", label: "Data bersumber." },
  { id: "bahasa", label: "Bahasa jelas." },
  { id: "video", label: "Referensi video layak." },
];

export const MAX_VIDEOS = 3;

export function nodeText(node: ContentNode): string {
  if (node.type === "text") return node.text ?? "";
  return (node.content ?? []).map(nodeText).join(node.type === "doc" ? " " : "");
}

export function hasBodyText(body: ContentNode) {
  return nodeText(body).trim().length > 0;
}

// Nama kolom wajib yang masih kosong, untuk pesan error dan teks bantuan.
export function missingRequiredFields(content: Pick<ContentItem, "judul" | "ringkasan" | "kategori" | "sampul" | "body">) {
  const missing: string[] = [];
  if (!content.judul.trim()) missing.push("judul");
  if (!content.ringkasan.trim()) missing.push("ringkasan");
  if (!content.kategori.trim()) missing.push("kategori");
  if (!content.sampul.trim()) missing.push("sampul");
  if (!hasBodyText(content.body)) missing.push("isi");
  return missing;
}
