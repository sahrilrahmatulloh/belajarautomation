import { NextResponse } from "next/server";

import { isDev } from "@/lib/env";
import { isYoutubeId } from "@/lib/content/rules";

export type YoutubeLookup =
  | { status: "ok"; judul: string; channel: string }
  | { status: "embed-mati" | "tidak-ditemukan" | "tidak-tersedia" };

// Mengambil judul dan channel video untuk dialog Sisipkan Video (PRD FR-15). Lewat server
// agar browser tidak memanggil YouTube langsung. Editor hanya ada di DEV.
export async function GET(request: Request) {
  if (!isDev) return new NextResponse(null, { status: 404 });

  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (!isYoutubeId(id)) return NextResponse.json({ status: "tidak-ditemukan" } satisfies YoutubeLookup, { status: 400 });

  try {
    const watchUrl = `https://www.youtube.com/watch?v=${id}`;
    const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (response.ok) {
      const data = (await response.json()) as { title?: string; author_name?: string };
      return NextResponse.json({ status: "ok", judul: data.title ?? "", channel: data.author_name ?? "" } satisfies YoutubeLookup);
    }
    // 401 dan 403 berarti video ada tetapi embed dimatikan; 400 dan 404 berarti video tidak ada.
    if (response.status === 401 || response.status === 403) return NextResponse.json({ status: "embed-mati" } satisfies YoutubeLookup);
    if (response.status === 400 || response.status === 404) return NextResponse.json({ status: "tidak-ditemukan" } satisfies YoutubeLookup);
  } catch {
    // Jaringan atau YouTube bermasalah; Creator mengisi judul dan channel sendiri.
  }
  return NextResponse.json({ status: "tidak-tersedia" } satisfies YoutubeLookup);
}
