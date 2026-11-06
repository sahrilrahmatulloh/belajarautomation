"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const TONES = {
  default: "text-primary-accent hover:bg-primary/10",
  destructive: "text-destructive hover:bg-destructive/10",
};

interface IconActionProps {
  // Nama lengkap untuk pembaca layar, mis. "Ubah Panduan Test Data".
  label: string;
  // Teks singkat di tooltip. Bawaan sama dengan label.
  tooltip?: string;
  icon: LucideIcon;
  tone?: keyof typeof TONES;
  // Langkah utama alur kerja menampilkan teks di samping ikon, tanpa tooltip.
  showLabel?: boolean;
  href?: string;
  onClick?: () => void;
}

// Aksi di baris tabel dan kartu Creator, Reviewer, dan Admin. Aksi umum hanya berupa ikon
// dengan tooltip; nama lengkapnya tetap terbaca pembaca layar.
export default function IconAction({ label, tooltip = label, icon: Icon, tone = "default", showLabel = false, href, onClick }: IconActionProps) {
  if (showLabel) {
    const className = `inline-flex min-h-9 items-center gap-1.5 whitespace-nowrap rounded-lg px-2 text-sm font-medium transition-colors ${TONES[tone]}`;
    const content = (
      <>
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        {tooltip}
      </>
    );
    const accessibleName = label === tooltip ? undefined : label;
    return href ? (
      <Link href={href} aria-label={accessibleName} className={className}>
        {content}
      </Link>
    ) : (
      <button type="button" aria-label={accessibleName} onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  const className = `inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${TONES[tone]}`;
  return (
    <Tooltip>
      <TooltipTrigger
        aria-label={label}
        render={href ? <Link href={href} /> : <button type="button" onClick={onClick} />}
        className={className}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
