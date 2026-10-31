"use client";

import { useState } from "react";
import Image from "next/image";
import { BookOpenText, Newspaper } from "lucide-react";

interface ContentCoverProps {
  src: string;
  title: string;
  category: string;
  kind: "book" | "article";
  sizes?: string;
  className?: string;
}

export default function ContentCover({
  src,
  title,
  category,
  kind,
  sizes = "(max-width: 768px) 100vw, 33vw",
  className = "object-cover",
}: ContentCoverProps) {
  const [unavailable, setUnavailable] = useState(false);
  const Icon = kind === "book" ? BookOpenText : Newspaper;

  if (unavailable) {
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

  return (
    <Image
      src={src}
      alt={title}
      fill
      sizes={sizes}
      className={className}
      onError={() => setUnavailable(true)}
    />
  );
}
