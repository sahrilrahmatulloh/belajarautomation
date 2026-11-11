"use client";

import { ReactElement } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Tombol ikon bulat di banner profil (PRD FR-13, Header profil). Dipakai juga oleh pemicu
// dialog Bagikan profil agar tampilannya sama.
export const BANNER_ACTION_CLASS =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950/50 text-white ring-1 ring-white/20 backdrop-blur-sm transition-colors hover:bg-slate-950/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

interface BannerActionProps {
  // Nama aksesibel sekaligus isi tooltip.
  label: string;
  icon: LucideIcon;
  href?: string;
  // Elemen pemicu lain, mis. Dialog.Trigger; menggantikan tautan.
  render?: ReactElement;
}

export default function BannerAction({ label, icon: Icon, href, render }: BannerActionProps) {
  return (
    <Tooltip>
      <TooltipTrigger aria-label={label} render={render ?? <Link href={href ?? "#"} />} className={BANNER_ACTION_CLASS}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </TooltipTrigger>
      <TooltipContent side="left">{label}</TooltipContent>
    </Tooltip>
  );
}
