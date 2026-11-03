// Membaca tag <VideoYouTube ... /> dari isi artikel. Dipakai check-blog dan check-youtube-links.

const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];

export function findVideos(content) {
  // Contoh kode di dalam artikel bukan video yang dipasang.
  const withoutCode = content.replace(/^```[\s\S]*?^```/gm, "").replace(/`[^`\n]*`/g, "");

  return [...withoutCode.matchAll(/<VideoYouTube\b[^>]*>/g)].map(([tag]) => ({
    id: attribute(tag, "id"),
    judul: attribute(tag, "judul"),
    channel: attribute(tag, "channel"),
    durasi: attribute(tag, "durasi"),
    embed: !/\bembed=\{false\}/.test(tag),
  }));
}
