"use client";

import Link from "next/link";

import { isPublicPath, loginHref } from "@/lib/authRedirect";
import { useSession } from "@/lib/session";

// Tautan ke halaman yang mungkin butuh login: tamu diarahkan ke login dulu, lalu kembali
// ke tujuan ini setelah berhasil masuk.
export default function AuthLink({ href, ...props }: React.ComponentProps<typeof Link> & { href: string }) {
  const session = useSession();

  return <Link href={session || isPublicPath(href) ? href : loginHref(href)} {...props} />;
}
