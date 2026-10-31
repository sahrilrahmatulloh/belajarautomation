import Image from "next/image";

export default function AuthLoading() {
  return (
    <div
      role="status"
      className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background"
    >
      <Image
        src="/logo.png"
        alt=""
        width={56}
        height={56}
        className="h-14 w-14 animate-pulse object-contain"
      />
      <span className="text-sm text-muted-foreground">Memuat...</span>
    </div>
  );
}
