"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ComingSoonButtonProps {
  label: string;
  // Elemen ikon yang sudah dirender, karena komponen tidak bisa dioper
  // dari Server Component ke Client Component.
  icon?: React.ReactNode;
  variant?: "primary" | "outline";
  size?: "default" | "sm";
  // Label aksesibel bila label tampilan kurang spesifik (mis. di baris tabel).
  ariaLabel?: string;
}

const variantStyles = {
  primary: "bg-primary text-primary-foreground",
  outline: "border border-border bg-background text-foreground",
};

const sizeStyles = {
  default: "min-h-11 px-4 text-sm",
  sm: "min-h-9 px-3 text-xs",
};

// Memakai aria-disabled (bukan disabled) agar tetap bisa difokus dan tooltip muncul.
export default function ComingSoonButton({
  label,
  icon,
  variant = "primary",
  size = "default",
  ariaLabel,
}: ComingSoonButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        aria-disabled="true"
        aria-label={`${ariaLabel ?? label} (Segera hadir)`}
        onClick={(event) => event.preventDefault()}
        className={`inline-flex cursor-not-allowed items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold opacity-60 ${variantStyles[variant]} ${sizeStyles[size]}`}
      >
        {icon}
        {label}
      </TooltipTrigger>
      <TooltipContent>Segera hadir</TooltipContent>
    </Tooltip>
  );
}
