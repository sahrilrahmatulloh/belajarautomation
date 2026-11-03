import { Info } from "lucide-react";

export default function PlaygroundInfo() {
  return (
    <section className="flex items-start gap-3 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 sm:items-center sm:px-5">
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-accent sm:mt-0" aria-hidden="true" />
      <div className="flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4">
        <h2 className="shrink-0 text-sm font-semibold sm:border-r sm:border-primary/20 sm:pr-4">
          Tempat latihan
        </h2>
        <p className="text-sm leading-5 text-muted-foreground">
          Latihan boleh diulang kapan saja. XP hanya diberikan saat kamu lulus untuk pertama kalinya.
        </p>
      </div>
    </section>
  );
}
