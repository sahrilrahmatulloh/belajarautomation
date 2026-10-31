import {
  BookOpenCheck,
  FolderKanban,
  Info,
  Palette,
  SwatchBook,
} from "lucide-react";

const benefits = [
  {
    title: "Tema Visual",
    description:
      "Akses tema visual eksklusif untuk mempersonalisasi tampilan belajarmu.",
    icon: SwatchBook,
  },
  {
    title: "Warna Aksen Tambahan",
    description:
      "Pilih dari koleksi warna aksen tambahan di luar pilihan standar.",
    icon: Palette,
  },
  {
    title: "3 Klaim eBook",
    description:
      "Klaim hingga 3 eBook pilihan dari koleksi eBook belajarautomation.id.",
    icon: BookOpenCheck,
  },
  {
    title: "3 Klaim Project",
    description:
      "Klaim hingga 3 project pilihan beserta source code-nya.",
    icon: FolderKanban,
  },
];

export default function PremiumBenefits() {
  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          Yang kamu dapatkan dengan Premium
        </h2>

        <p className="mt-2 text-muted-foreground">
          Sekali beli, berlaku selamanya. Seluruh materi belajar tetap gratis untuk semua.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <article
              key={benefit.title}
              className="rounded-3xl border border-border bg-card p-5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="mt-5 font-semibold">
                {benefit.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {benefit.description}
              </p>
            </article>
          );
        })}
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />

        <p>
          Premium tidak memberikan XP, rank, atau keunggulan apa pun di
          leaderboard. Progres dan peringkat hanya didapat dari belajar.
        </p>
      </div>
    </section>
  );
}
