"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

const COPIED_DURATION = 2000;

export default function CopyCodeButton({ code }: { code: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (status === "idle") return;
    const timer = window.setTimeout(() => setStatus("idle"), COPIED_DURATION);
    return () => window.clearTimeout(timer);
  }, [status]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-white/15 px-2.5 text-xs font-medium text-slate-200 transition-colors hover:bg-white/10"
    >
      {status === "copied" ? (
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      <span aria-live="polite">
        {status === "copied" ? "Disalin" : status === "failed" ? "Gagal menyalin" : "Salin"}
      </span>
    </button>
  );
}
