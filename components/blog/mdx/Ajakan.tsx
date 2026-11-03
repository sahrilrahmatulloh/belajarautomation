import Image from "next/image";
import { ArrowRight, Map } from "lucide-react";

import AuthLink from "@/components/auth/AuthLink";
import { resolveArticleCta } from "@/lib/articleCta";
import { ArticleCta } from "@/types/Article";

// Kotak ajakan menuju course, latihan, atau roadmap, di tengah maupun di akhir artikel.
export default function Ajakan(props: ArticleCta) {
  const cta = resolveArticleCta(props);
  if (!cta) return null;

  return (
    <aside className="my-6 flex flex-col gap-4 rounded-xl border border-primary/25 bg-primary/5 p-4 sm:flex-row sm:items-center">
      <div className="relative flex aspect-video w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10 sm:w-32">
        {cta.image ? (
          <Image src={cta.image} alt="" fill sizes="(max-width: 640px) 100vw, 128px" className="object-cover" />
        ) : (
          <Map className="h-7 w-7 text-primary" aria-hidden="true" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-semibold leading-snug text-foreground">{cta.title}</p>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">{cta.description}</p>
      </div>

      <AuthLink
        href={cta.href}
        className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground no-underline transition-colors hover:bg-primary/90"
      >
        {cta.action}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </AuthLink>
    </aside>
  );
}
