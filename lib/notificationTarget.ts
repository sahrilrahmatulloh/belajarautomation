import { BOOKS } from "@/data/books";
import { CHALLENGES } from "@/data/challenges";
import { COURSES } from "@/data/courses";
import { Notification } from "@/types/Notification";

export const UNAVAILABLE_PARAM = "pesan";
export const UNAVAILABLE_VALUE = "tidak-tersedia";
const UNAVAILABLE_HREF = `/notifications?${UNAVAILABLE_PARAM}=${UNAVAILABLE_VALUE}`;

const STATIC_ROUTES = new Set([
  "/",
  "/admin",
  "/creator",
  "/ebooks",
  "/learn",
  "/membership",
  "/notifications",
  "/playground",
  "/profile",
  "/projects",
  "/reviewer",
  "/settings",
]);

// Halaman detail yang isinya bergantung pada data.
const DETAIL_ROUTES: Record<string, { slug: string }[]> = {
  learn: COURSES,
  playground: CHALLENGES,
  ebooks: BOOKS,
};

function isAvailable(href: string) {
  const path = href.split(/[?#]/)[0];
  if (STATIC_ROUTES.has(path)) return true;

  const [, section, slug, ...rest] = path.split("/");
  return rest.length === 0 && Boolean(DETAIL_ROUTES[section]?.some((item) => item.slug === slug));
}

// Tujuan klik notifikasi. Halaman yang sudah tidak ada diarahkan ke halaman notifikasi
// beserta pesan (PRD 4.4). Notifikasi tanpa href dibuka di modal, jadi tidak punya tujuan.
export function resolveNotificationHref({ href }: Notification) {
  if (!href) return undefined;
  return isAvailable(href) ? href : UNAVAILABLE_HREF;
}
