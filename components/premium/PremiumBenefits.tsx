import {
  BookOpenCheck,
  CheckCircle2,
  FlaskConical,
  FolderKanban,
  Map,
  Sparkles,
} from "lucide-react";

const benefits = [
  {
    title: "Semua Materi Premium",
    description:
      "Akses seluruh materi QA Automation dari fundamental hingga advanced.",
    icon: BookOpenCheck,
  },
  {
    title: "Roadmap Lengkap",
    description:
      "Ikuti jalur belajar yang terstruktur sesuai target karier kamu.",
    icon: Map,
  },
  {
    title: "Playground Challenge",
    description:
      "Latih kemampuan melalui challenge dan studi kasus praktis.",
    icon: FlaskConical,
  },
  {
    title: "Project Portfolio",
    description:
      "Bangun project automation untuk meningkatkan portfolio teknis.",
    icon: FolderKanban,
  },
  {
    title: "Konten Terbaru",
    description:
      "Dapatkan akses ke materi baru yang terus diperbarui.",
    icon: Sparkles,
  },
  {
    title: "Belajar Tanpa Batas",
    description:
      "Pelajari seluruh konten premium sesuai ritme belajar kamu.",
    icon: CheckCircle2,
  },
];

export default function PremiumBenefits() {
  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          Semua yang kamu butuhkan untuk berkembang
        </h2>

        <p className="mt-2 text-muted-foreground">
          Satu membership untuk mengakses seluruh ekosistem belajar.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    </section>
  );
}