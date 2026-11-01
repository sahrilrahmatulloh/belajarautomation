"use client";

import { useState } from "react";
import Image from "next/image";
import { BookOpenText, GraduationCap, Map, Newspaper } from "lucide-react";

interface ContentCoverProps {
  // Kosong berarti belum ada sampul: langsung tampilkan placeholder.
  src?: string;
  title: string;
  category: string;
  kind: "book" | "article" | "course" | "roadmap";
  alt?: string;
  sizes?: string;
  className?: string;
  // "contain" menampilkan gambar utuh dengan latar blur dari gambar yang sama,
  // untuk sampul yang rasionya berbeda dengan area tampilan.
  fit?: "cover" | "contain";
  priority?: boolean;
}

const placeholderIcons = {
  book: BookOpenText,
  article: Newspaper,
  course: GraduationCap,
  roadmap: Map,
};

export default function ContentCover({
  src,
  title,
  category,
  kind,
  alt,
  sizes = "(max-width: 768px) 100vw, 33vw",
  className = "object-cover",
  fit = "cover",
  priority = false,
}: ContentCoverProps) {
  const [unavailable, setUnavailable] = useState(false);
  const Icon = placeholderIcons[kind];

  if (!src || unavailable) {
    return (
      <div
        role="img"
        aria-label={`${title}, sampul belum tersedia`}
        className="absolute inset-0 flex flex-col justify-between overflow-hidden bg-primary/[0.06] p-5 text-foreground"
      >
        <span className="w-fit rounded-full border border-primary/15 bg-background/80 px-3 py-1 text-xs font-medium text-primary">
          {category}
        </span>
        <div>
          <Icon className="mb-3 h-7 w-7 text-primary" aria-hidden="true" />
          <p className="line-clamp-3 font-semibold leading-snug">{title}</p>
        </div>
      </div>
    );
  }

  if (fit === "contain") {
    return (
      <>
        <Image
          src={src}
          alt=""
          aria-hidden="true"
          fill
          sizes={sizes}
          className="scale-110 object-cover opacity-60 blur-2xl"
        />
        <Image
          src={src}
          alt={alt ?? title}
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain"
          onError={() => setUnavailable(true)}
        />
      </>
    );
  }

  return (
    <Image
      src={src}
      alt={alt ?? title}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setUnavailable(true)}
    />
  );
}
