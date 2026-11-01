import Image from "next/image";

import { Rank } from "@/data/ranks";

interface RankEmblemProps {
  rank: Rank;
  size: number;
  className?: string;
  priority?: boolean;
}

// Emblem tameng rank (PRD FR-05). Sama untuk semua pengguna di rank yang sama
// dan tidak dipengaruhi skin maupun mode terang/gelap.
export default function RankEmblem({ rank, size, className = "", priority }: RankEmblemProps) {
  return (
    <Image
      src={rank.emblem}
      alt={`Emblem rank ${rank.name}`}
      width={size}
      height={size}
      priority={priority}
      className={`shrink-0 object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
