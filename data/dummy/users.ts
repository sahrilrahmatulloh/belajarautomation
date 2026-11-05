// DATA DUMMY — hapus sebelum rilis (PRD FR-15 dan FR-16).
// Pengguna untuk tahap antarmuka dengan data dummy. Akun demo memakai id yang sama, dan
// peserta leaderboard ikut masuk agar Admin mengelola orang yang sama dengan yang tampil di sana.
import { DUMMY_ACCOUNT } from "@/data/dummy/account";
import { DUMMY_LEADERBOARD_USERS } from "@/data/dummy/leaderboard";
import { DUMMY_LEARNING_PROGRESS } from "@/data/dummy/learningProgress";
import { ContentUser } from "@/types/ContentWorkflow";
import { MembershipTier } from "@/types/Membership";

const daysAgo = (days: number) => new Date(Date.now() - days * 86_400_000).toISOString();

type Person = Pick<ContentUser, "id" | "name" | "username" | "email" | "roles"> & Partial<Pick<ContentUser, "membership" | "xp" | "coursesStudied">> & { joinedDaysAgo: number };

const PEOPLE: Person[] = [
  { id: "user-sobat", name: "Sobat QA", username: "sobatqa", email: "user@demo.belajarautomation.com", roles: ["user"], membership: DUMMY_ACCOUNT.membership, xp: DUMMY_ACCOUNT.xp, coursesStudied: DUMMY_LEARNING_PROGRESS.length, joinedDaysAgo: 40 },
  { id: "user-andi", name: "Andi Pratama", username: "andi-pratama", email: "creator@demo.belajarautomation.com", roles: ["user", "creator"], membership: "pro", joinedDaysAgo: 120 },
  { id: "user-galih", name: "Galih Ramadhan", username: "galih-ramadhan", email: "galih@demo.belajarautomation.com", roles: ["user", "creator"], joinedDaysAgo: 100 },
  { id: "user-rahma", name: "Rahma Putri", username: "rahma-putri", email: "reviewer@demo.belajarautomation.com", roles: ["user", "reviewer"], membership: "premium", joinedDaysAgo: 200 },
  // Reviewer yang juga Creator, tanpa akun demo. Akun lain bisa merangkap peran lewat Pengguna dan Peran.
  { id: "user-bima", name: "Bima Santoso", username: "bima-santoso", email: "bima@demo.belajarautomation.com", roles: ["user", "reviewer", "creator"], joinedDaysAgo: 180 },
  { id: "user-admin", name: "Admin Belajar", username: "admin-belajar", email: "admin@demo.belajarautomation.com", roles: ["user", "admin"], joinedDaysAgo: 365 },
  { id: "user-dewi", name: "Dewi Lestari", username: "dewi-lestari", email: "dewi@demo.belajarautomation.com", roles: ["user"], joinedDaysAgo: 3 },
  { id: "user-budi", name: "Budi Santika", username: "budi-santika", email: "budi@demo.belajarautomation.com", roles: ["user"], joinedDaysAgo: 5 },
];

const MEMBERSHIP_CYCLE: MembershipTier[] = ["basic", "basic", "basic", "pro", "basic", "premium"];

function toUser({ joinedDaysAgo, ...person }: Person): ContentUser {
  return { membership: "basic", xp: 0, coursesStudied: 0, ...person, status: "aktif", joinedAt: daysAgo(joinedDaysAgo), lastActiveAt: daysAgo(Math.min(joinedDaysAgo, 2)) };
}

export const DUMMY_USERS: ContentUser[] = [
  ...PEOPLE.map(toUser),
  ...DUMMY_LEADERBOARD_USERS.map((user, index) =>
    toUser({
      id: user.id,
      name: user.displayName,
      username: user.username,
      email: `${user.username}@contoh.belajarautomation.com`,
      roles: ["user"],
      membership: MEMBERSHIP_CYCLE[index % MEMBERSHIP_CYCLE.length],
      xp: user.totalXp,
      coursesStudied: Math.min(5, Math.ceil(user.totalXp / 800)),
      joinedDaysAgo: 30 + index * 3,
    })
  ),
];
