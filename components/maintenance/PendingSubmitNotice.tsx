import { ShieldCheck } from "lucide-react";

export default function PendingSubmitNotice() {
  return (
    <p role="status" className="mb-3 flex items-start gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm font-medium text-emerald-800 dark:text-emerald-200">
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      Jawabanmu aman dan akan dikirim setelah maintenance selesai.
    </p>
  );
}
