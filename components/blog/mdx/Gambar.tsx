import Image from "next/image";

interface GambarProps {
  src: string;
  alt: string;
  keterangan?: string;
  width?: number;
  height?: number;
}

export default function Gambar({ src, alt, keterangan, width = 1200, height = 675 }: GambarProps) {
  return (
    <figure className="my-6">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 768px) 100vw, 720px"
        className="h-auto w-full rounded-xl border border-border"
      />
      {keterangan && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">{keterangan}</figcaption>
      )}
    </figure>
  );
}
