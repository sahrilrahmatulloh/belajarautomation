import { ShieldAlert } from "lucide-react";

export default function RolePreviewNotice() {
  return (
    <p
      role="note"
      className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-800 dark:text-amber-200 sm:text-sm"
    >
      <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
      Mode pratinjau — akses role belum dilindungi autentikasi.
    </p>
  );
}
