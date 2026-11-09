import type { MetadataRoute } from "next";

import { isProduction } from "@/lib/env";
import { SITE_URL } from "@/lib/siteUrl";

// Di luar Production halaman tetap boleh dirayapi: mesin pencari hanya bisa membaca meta
// noindex (app/layout.tsx) pada halaman yang tidak diblokir di sini (PRD FR-07).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(isProduction && { sitemap: `${SITE_URL}/sitemap.xml` }),
  };
}
