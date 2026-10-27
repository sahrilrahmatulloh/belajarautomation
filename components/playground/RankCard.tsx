import { Shield } from "lucide-react";

export default function RankCard() {
  return (
    <section className="flex items-start gap-4 rounded-3xl border border-border bg-card p-5 sm:p-6">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-muted">
        <Shield className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      </div>
      <div>
        <h2 className="font-semibold">Peringkat playground</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Poin dan peringkat belum disimpan. Jawaban challenge di sini diperiksa
          sebagai latihan dan belum mengubah progres akun.
        </p>
      </div>
    </section>
  );
}
