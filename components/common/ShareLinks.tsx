"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

const socialButtonClass =
  "inline-flex min-h-10 items-center justify-center rounded-xl border border-border px-3 text-sm font-medium transition-colors hover:bg-accent";

// Tombol bagikan tautan ke media sosial dan salin tautan. Dipakai kartu Bagikan profil dan
// popup naik rank.
export default function ShareLinks({ title, url, text }: { title: string; url: string; text: string }) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  const socialLinks = [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}` },
    { label: "X", href: `https://x.com/intent/post?text=${encodedText}&url=${encodedUrl}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { label: "Telegram", href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}` },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  };

  return (
    <div className="mt-5">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {socialLinks.map((link) => (
          <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className={socialButtonClass}>
            {link.label}
          </a>
        ))}
        <button type="button" onClick={() => void copyLink()} className={`${socialButtonClass} gap-1.5`}>
          {copyStatus === "copied" ? (
            <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          ) : (
            <Copy className="h-4 w-4" aria-hidden="true" />
          )}
          {copyStatus === "copied" ? "Tersalin" : "Salin tautan"}
        </button>
      </div>
      <p aria-live="polite" className="mt-2 text-xs leading-5 text-muted-foreground">
        {copyStatus === "failed"
          ? "Tautan gagal disalin. Coba lagi."
          : "Tombol di atas membagikan tautan. Untuk membagikan gambarnya, misalnya ke Instagram, unduh PNG lalu unggah."}
      </p>
    </div>
  );
}
