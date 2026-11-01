"use client";

import { useState } from "react";
import Image from "next/image";

import { Rank } from "@/data/ranks";

interface RankEmblemProps {
  rank: Rank;
  // "full": gambar emblem lengkap untuk ukuran 48px ke atas.
  // "compact": tameng SVG sederhana untuk ukuran 24–32px.
  variant: "full" | "compact";
  size: number;
  className?: string;
  priority?: boolean;
}

// Tameng ringkas: warna rank dengan cap kaki kucing, tanpa bintang dan sayap.
// Master memakai tepi gold (accentColor) di atas tameng crimson.
function CompactEmblem({ rank, size, className = "" }: Omit<RankEmblemProps, "variant" | "priority">) {
  return (
    <svg
      role="img"
      aria-label={`Emblem rank ${rank.name}`}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
    >
      <path
        d="M12 1.8 20.2 4.9V11c0 5.6-3.6 9.7-8.2 11.2C7.4 20.7 3.8 16.6 3.8 11V4.9Z"
        fill={rank.color}
        stroke={rank.accentColor ?? "rgba(15, 23, 42, 0.35)"}
        strokeWidth={rank.accentColor ? 1.6 : 1}
        strokeLinejoin="round"
      />
      <g fill="#FFFFFF" fillOpacity={0.95}>
        <ellipse cx="12" cy="14.3" rx="3.1" ry="2.5" />
        <circle cx="8.7" cy="10.8" r="1.15" />
        <circle cx="10.85" cy="9.3" r="1.2" />
        <circle cx="13.15" cy="9.3" r="1.2" />
        <circle cx="15.3" cy="10.8" r="1.15" />
      </g>
    </svg>
  );
}

// Emblem tameng rank (PRD FR-05). Sama untuk semua pengguna di rank yang sama
// dan tidak dipengaruhi skin maupun mode terang/gelap.
export default function RankEmblem({
  rank,
  variant,
  size,
  className = "",
  priority,
}: RankEmblemProps) {
  const [failed, setFailed] = useState(false);

  // Varian full jatuh ke compact bila file emblem tidak ada.
  if (variant === "compact" || failed) {
    return <CompactEmblem rank={rank} size={size} className={className} />;
  }

  return (
    <Image
      src={rank.emblem}
      alt={`Emblem rank ${rank.name}`}
      width={size}
      height={size}
      priority={priority}
      onError={() => setFailed(true)}
      className={`shrink-0 object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
