import { COURSES } from "@/data/courses";
import { DUMMY_LEARNING_PROGRESS } from "@/data/dummy/learningProgress";
import { Transaction } from "@/types/Commerce";
import { ContentItem, ContentUser, StatusEvent } from "@/types/ContentWorkflow";

const DAY_MS = 86_400_000;

export interface ReportInput {
  users: ContentUser[];
  transactions: Transaction[];
  contents: ContentItem[];
  events: StatusEvent[];
  now: number;
  // Format YYYY-MM-DD; kosong berarti tanpa batas.
  from: string;
  to: string;
}

// Laporan dihitung dari data, tidak ada angka yang ditulis tangan (PRD FR-16 I).
export function buildReport({ users, transactions, contents, events, now, from, to }: ReportInput) {
  const inRange = (iso: string) => {
    const date = iso.slice(0, 10);
    return (!from || date >= from) && (!to || date <= to);
  };
  const activeWithin = (days: number) => users.filter((user) => now - Date.parse(user.lastActiveAt) < days * DAY_MS).length;

  const sales = new Map<string, { title: string; count: number; revenue: number }>();
  for (const item of transactions) {
    if (item.status !== "berhasil" || !inRange(item.createdAt)) continue;
    const current = sales.get(item.itemId) ?? { title: item.itemTitle, count: 0, revenue: 0 };
    sales.set(item.itemId, { title: current.title, count: current.count + 1, revenue: current.revenue + item.amount });
  }

  const courses = DUMMY_LEARNING_PROGRESS.flatMap((entry) => {
    const course = COURSES.find((item) => item.slug === entry.courseSlug);
    const openedAt = new Date(now - entry.lastOpenedDaysAgo * DAY_MS).toISOString();
    if (course?.availability !== "available" || !inRange(openedAt)) return [];
    return [{ title: course.title, started: 1, completed: entry.completedLessons >= course.lessons ? 1 : 0 }];
  });

  const publishedEvents = events.filter((event) => event.action === "terbitkan" && inRange(event.at));

  return {
    newUsers: users.filter((user) => inRange(user.joinedAt)).length,
    active7: activeWithin(7),
    active30: activeWithin(30),
    sales: [...sales.values()].sort((a, b) => b.revenue - a.revenue),
    courses: courses.sort((a, b) => b.started - a.started || b.completed - a.completed),
    published: publishedEvents.map((event) => ({ id: event.id, title: contents.find((item) => item.id === event.contentId)?.judul ?? event.contentId, at: event.at })),
  };
}

export type Report = ReturnType<typeof buildReport>;

// Sel yang diawali tanda rumus bisa dijalankan oleh aplikasi spreadsheet, jadi diberi tanda kutip.
function csvCell(value: string | number) {
  const text = String(value);
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export const REPORT_CSV_COLUMNS = ["Bagian", "Nama", "Jumlah", "Nominal"];

export function reportToCsv(report: Report) {
  const rows: (string | number)[][] = [
    REPORT_CSV_COLUMNS,
    ["Pengguna", "Pengguna baru", report.newUsers, ""],
    ["Pengguna", "Aktif 7 hari", report.active7, ""],
    ["Pengguna", "Aktif 30 hari", report.active30, ""],
    ...report.sales.map((item) => ["Penjualan", item.title, item.count, item.revenue]),
    ...report.courses.flatMap((item) => [
      ["Course dimulai", item.title, item.started, ""],
      ["Course diselesaikan", item.title, item.completed, ""],
    ]),
    ...report.published.map((item) => ["Konten terbit", item.title, 1, ""]),
  ];
  return rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
}
