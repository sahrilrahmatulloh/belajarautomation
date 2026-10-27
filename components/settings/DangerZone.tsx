import { Trash2 } from "lucide-react";

export default function DangerZone() {
  return (
    <section className="rounded-3xl border border-destructive/30 bg-card p-6">
      <h2 className="text-xl font-bold">
        Danger Zone
      </h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Tindakan ini dapat memengaruhi akun dan data kamu.
      </p>

      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-destructive/20 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">
            Hapus Akun
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Hapus akun dan seluruh data secara permanen.
          </p>
        </div>

        <button
          type="button"
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-destructive px-4 py-2.5 text-sm font-medium text-destructive-foreground"
        >
          <Trash2 className="h-4 w-4" />
          Hapus Akun
        </button>
      </div>
    </section>
  );
}