import { DUMMY_ACCOUNT } from "@/data/dummy/account";
import { DUMMY_LEADERBOARD_MEMBERS } from "@/data/dummy/leaderboard";
import { getRank, Rank } from "@/data/ranks";

export type LeaderboardPeriod = "weekly" | "all-time";

export const LEADERBOARD_LIMIT = 50;

export const LEADERBOARD_PERIODS: { value: LeaderboardPeriod; slug: string; label: string }[] = [
  { value: "weekly", slug: "mingguan", label: "Mingguan" },
  { value: "all-time", slug: "sepanjang-waktu", label: "Sepanjang Waktu" },
];

export interface LeaderboardRow {
  id: string;
  name: string;
  position: number;
  // XP periode yang dipilih.
  periodXp: number;
  // Rank selalu dari total XP, apa pun periodenya.
  rank: Rank;
  isCurrentUser: boolean;
}

const CURRENT_USER_ID = "current-user";

function periodXp(member: { xp: number; weeklyXp: number }, period: LeaderboardPeriod) {
  return period === "weekly" ? member.weeklyXp : member.xp;
}

// Peserta yang tampil publik: anggota yang tidak memilih privasi dan, untuk
// periode Mingguan, yang punya XP minggu ini. Pengguna saat ini selalu dihitung
// agar tetap bisa melihat posisinya sendiri.
function getRankedRows(period: LeaderboardPeriod): LeaderboardRow[] {
  const participants = [
    ...DUMMY_LEADERBOARD_MEMBERS.filter(
      (member) => !member.hidden && periodXp(member, period) > 0
    ),
    { id: CURRENT_USER_ID, ...DUMMY_ACCOUNT },
  ];

  return participants
    .map((member) => ({ member, value: periodXp(member, period) }))
    .sort((a, b) => b.value - a.value || a.member.name.localeCompare(b.member.name))
    .map(({ member, value }, index) => ({
      id: member.id,
      name: member.name,
      position: index + 1,
      periodXp: value,
      rank: getRank(member.xp),
      isCurrentUser: member.id === CURRENT_USER_ID,
    }));
}

// Bila pengguna memilih tidak tampil, barisnya dikeluarkan dari daftar publik
// dan posisi peserta lain dihitung ulang; posisinya sendiri tetap tersedia.
export function getLeaderboard(period: LeaderboardPeriod, hideCurrentUser = false) {
  const rows = getRankedRows(period);
  const currentUser = rows.find((row) => row.isCurrentUser)!;
  const publicRows = hideCurrentUser
    ? rows
        .filter((row) => !row.isCurrentUser)
        .map((row, index) => ({ ...row, position: index + 1 }))
    : rows;

  return {
    top: publicRows.slice(0, LEADERBOARD_LIMIT),
    currentUser,
    isCurrentUserInTop: !hideCurrentUser && currentUser.position <= LEADERBOARD_LIMIT,
  };
}

export function getCurrentUserPosition(period: LeaderboardPeriod) {
  return getRankedRows(period).find((row) => row.isCurrentUser)!.position;
}
