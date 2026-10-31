import { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  icon: LucideIcon;
  // Kosong untuk menu yang belum tersedia.
  href?: string;
  comingSoon?: boolean;
}
