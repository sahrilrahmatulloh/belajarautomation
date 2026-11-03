"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Clock3, ExternalLink, Play } from "lucide-react";

interface VideoReferensiProps {
  // ID video YouTube, 11 karakter.
  id: string;
  judul: string;
  channel: string;
  // Mis. "12:34".
  durasi: string;
  bahasa?: string;
  // false bila pemilik video menonaktifkan embed; hanya tampil sebagai tautan.
  embed?: boolean;
}

const INDONESIAN = "Indonesia";

// Referensi video YouTube untuk blog dan lesson (PRD FR-02 bagian G). Player baru dimuat saat
// diklik, agar halaman tidak memuat skrip YouTube sebelum pengguna memutuskan menonton.
export default function VideoReferensi({ id, judul, channel, durasi, bahasa = INDONESIAN, embed = true }: VideoReferensiProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  // Tombol putar hilang setelah diklik, jadi fokus keyboard pindah ke player.
  useEffect(() => {
    if (isPlaying) frameRef.current?.focus();
  }, [isPlaying]);

  const thumbnail = (
    <Image
      src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
      alt=""
      fill
      sizes="(max-width: 640px) 100vw, 512px"
      className="object-cover"
    />
  );

  return (
    <figure className="my-6 w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative aspect-video bg-muted">
        {!embed ? (
          thumbnail
        ) : isPlaying ? (
          <iframe
            ref={frameRef}
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
            title={judul}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            aria-label={`Putar video: ${judul}`}
            onClick={() => setIsPlaying(true)}
            className="group absolute inset-0 flex items-center justify-center outline-none"
          >
            {thumbnail}
            <span className="relative flex h-12 w-16 items-center justify-center rounded-xl bg-red-700 text-white shadow-md transition-transform group-hover:scale-105 group-focus-visible:ring-4 group-focus-visible:ring-ring">
              <Play className="h-6 w-6 fill-current" aria-hidden="true" />
            </span>
          </button>
        )}
      </div>

      <figcaption className="p-3 text-sm">
        <p className="font-semibold leading-snug text-foreground">{judul}</p>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
          <span>{channel}</span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            {durasi}
          </span>
          {bahasa !== INDONESIAN && (
            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
              Bahasa {bahasa}
            </span>
          )}
        </p>
        {!embed && (
          <a
            href={`https://www.youtube.com/watch?v=${id}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Tonton di YouTube: ${judul}`}
            className="mt-2 inline-flex items-center gap-1.5 font-semibold text-blue-700 underline underline-offset-2 dark:text-blue-300"
          >
            Tonton di YouTube
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        )}
        <p className="mt-2 text-xs text-muted-foreground">Video dari YouTube · materi pelengkap</p>
      </figcaption>
    </figure>
  );
}
