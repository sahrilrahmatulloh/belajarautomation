import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { CHALLENGES } from "@/data/challenges";

interface ChallengePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Sementara: halaman pengerjaan per jenis latihan menyusul (PRD FR-04).
export default async function ChallengePage({ params }: ChallengePageProps) {
  const { slug } = await params;
  const challenge = CHALLENGES.find((item) => item.slug === slug);

  if (!challenge) {
    notFound();
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <Link
          href="/playground"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Kembali ke Playground
        </Link>

        <section className="rounded-3xl border border-border bg-card p-6">
          <h1 className="text-3xl font-bold">{challenge.title}</h1>
          <p className="mt-2 text-muted-foreground">{challenge.description}</p>
          <p className="mt-4 text-sm text-muted-foreground">Pengerjaan latihan sedang disiapkan.</p>
        </section>
      </div>
    </DashboardLayout>
  );
}
