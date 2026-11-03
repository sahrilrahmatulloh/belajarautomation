import { CHALLENGES } from "@/data/challenges";
import { COURSES } from "@/data/courses";
import { ROADMAPS } from "@/data/roadmap";
import { ArticleCta } from "@/types/Article";

export interface ResolvedArticleCta {
  href: string;
  title: string;
  description: string;
  image?: string;
  action: string;
}

// Mengubah tujuan ajakan menjadi isi kotak ajakan. Tujuan tidak valid (undefined)
// sudah digagalkan oleh npm run check:blog sebelum build.
export function resolveArticleCta(cta: ArticleCta): ResolvedArticleCta | undefined {
  if (cta.type === "course") {
    const course = COURSES.find((item) => item.slug === cta.slug && item.availability === "available");
    return (
      course && {
        href: `/learn/${course.slug}`,
        title: `Pelajari lebih lanjut di course ${course.title}`,
        description: course.description,
        image: course.cover,
        action: "Lihat Course",
      }
    );
  }

  if (cta.type === "practice") {
    const challenge = CHALLENGES.find((item) => item.slug === cta.slug);
    if (!challenge) return undefined;
    return {
      href: `/playground/${challenge.slug}`,
      title: `Coba latihan ${challenge.title}`,
      description: challenge.description,
      image: challenge.cover ?? COURSES.find((item) => item.slug === challenge.courseSlug)?.cover,
      action: "Mulai Latihan",
    };
  }

  if (!cta.slug) {
    return {
      href: "/roadmap",
      title: "Lihat roadmap belajar",
      description: "Pilih jalur belajar yang sesuai dengan tujuan kariermu di bidang QA.",
      action: "Lihat Roadmap",
    };
  }

  const roadmap = ROADMAPS.find((item) => item.id === cta.slug);
  return (
    roadmap && {
      href: `/roadmap/${roadmap.id}`,
      title: `Ikuti roadmap ${roadmap.title}`,
      description: roadmap.description,
      image: roadmap.cover,
      action: "Lihat Roadmap",
    }
  );
}
