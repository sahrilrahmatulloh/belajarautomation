import { calendarDaysBetween } from "@/lib/notificationTime";
import { Notification } from "@/types/Notification";

// Satu baris di popover atau halaman: satu notifikasi, atau beberapa yang digabung.
export interface NotificationEntry {
  key: string;
  // Terbaru lebih dulu; lebih dari satu berarti notifikasi gabungan.
  items: Notification[];
  title: string;
  body: string;
  group: Notification["group"];
  createdAt: string;
  read: boolean;
}

// Hanya konten baru yang digabung: course dan latihan baru, dikenali dari tujuannya.
const MERGE_KINDS: { prefix: string; noun: string }[] = [
  { prefix: "/learn/", noun: "course" },
  { prefix: "/playground/", noun: "latihan" },
];

const kindOf = (notification: Notification) =>
  notification.group === "content"
    ? MERGE_KINDS.find(({ prefix }) => notification.href?.startsWith(prefix))
    : undefined;

function formatList(names: string[]) {
  if (names.length < 2) return names.join("");
  return `${names.slice(0, -1).join(", ")}, dan ${names.at(-1)}`;
}

function toEntry(items: Notification[]): NotificationEntry {
  const [first] = items;
  const kind = kindOf(first);

  return {
    key: first.id,
    items,
    title: items.length > 1 ? `${items.length} ${kind?.noun} baru tersedia` : first.title,
    body: items.length > 1 ? `Tersedia ${formatList(items.map((item) => item.body))}.` : first.body,
    group: first.group,
    createdAt: first.createdAt,
    read: items.every((item) => item.read),
  };
}

// Menggabungkan notifikasi sejenis di hari yang sama. Masukan terurut terbaru lebih dulu.
export function toNotificationEntries(notifications: Notification[]): NotificationEntry[] {
  const merged = new Map<string, Notification[]>();

  for (const notification of notifications) {
    const kind = kindOf(notification);
    const day = calendarDaysBetween(new Date(notification.createdAt), new Date());
    const key = kind ? `${kind.noun}-${day}` : notification.id;
    merged.set(key, [...(merged.get(key) ?? []), notification]);
  }

  return [...merged.values()].map(toEntry);
}
