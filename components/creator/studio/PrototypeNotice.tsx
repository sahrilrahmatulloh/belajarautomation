import { FlaskConical } from "lucide-react";

// Prototipe hanya tampil di DEV. Penulisan sungguhan masih lewat Google Docs (PRD FR-15).
export default function PrototypeNotice() {
  return (
    <p
      role="note"
      className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-800 dark:text-amber-200 sm:text-sm"
    >
      <FlaskConical className="h-4 w-4 shrink-0" aria-hidden="true" />
      Prototipe dengan data dummy. Perubahan hanya tersimpan di browser ini dan tidak benar-benar terbit.
    </p>
  );
}
