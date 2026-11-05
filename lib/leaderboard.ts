import { DUMMY_ACCOUNT } from "@/data/dummy/account";
import { ACTIVE_AVATAR } from "@/data/dummy/appearance";
import { DUMMY_LEADERBOARD_USERS } from "@/data/dummy/leaderboard";
import { getRank, Rank } from "@/data/ranks";

// Leaderboard PRD FR-06: tab Global dan tab rank pengguna, diurutkan dari total XP.
export type LeaderboardTab = "global" | "rank";

export const LEADERBOARD_LIMIT = 50;

export interface LeaderboardRow {
  id: string;
  displayName: string;
  avatarId: string;
  position: number;
  totalXp: number;
  rank: Rank;
  isCurrentUser: boolean;
}

interface Participant {
  id: string;
  displayName: string;
  avatarId: string;
  totalXp: number;
}

const CURRENT_USER_ID = "current-user";

function toRows(participants: Participant[]): LeaderboardRow[] {
  return [...participants]
    .sort((a, b) => b.totalXp - a.totalXp || a.displayName.localeCompare(b.displayName))
    .map((participant, index) => ({
      ...participant,
      position: index + 1,
      rank: getRank(participant.totalXp),
      isCurrentUser: participant.id === CURRENT_USER_ID,
    }));
}

// Pengguna lain yang memilih tidak tampil tidak ikut ditampilkan maupun
// dihitung dalam posisi orang lain. Jika pengguna saat ini memilih tidak tampil,
// barisnya dikeluarkan dari daftar publik, tetapi posisinya sendiri tetap
// dihitung agar ia bisa melihatnya.
export function getLeaderboard(
  tab: LeaderboardTab,
  currentUser: Participant = {
    id: CURRENT_USER_ID,
    displayName: DUMMY_ACCOUNT.name,
    avatarId: ACTIVE_AVATAR.id,
    totalXp: DUMMY_ACCOUNT.xp,
  },
  showCurrentUser = DUMMY_ACCOUNT.showOnLeaderboard,
  // Akun nonaktif atau disembunyikan Admin tidak tampil dan tidak dihitung (PRD FR-16 C dan D).
  excludedIds: readonly string[] = [],
  // XP setelah koreksi Admin, per id pengguna.
  xpOverrides: Readonly<Record<string, number>> = {}
) {
  const currentRank = getRank(currentUser.totalXp);
  const inTab = (participant: Participant) =>
    tab === "global" || getRank(participant.totalXp).name === currentRank.name;

  const others = DUMMY_LEADERBOARD_USERS.filter((user) => user.showOnLeaderboard && !excludedIds.includes(user.id))
    .map((user) => ({ ...user, totalXp: xpOverrides[user.id] ?? user.totalXp }))
    .filter(inTab);

  const rowsWithUser = toRows([...others, currentUser]);
  const currentUserRow = rowsWithUser.find((row) => row.isCurrentUser)!;
  const publicRows = showCurrentUser ? rowsWithUser : toRows(others);

  return {
    top: publicRows.slice(0, LEADERBOARD_LIMIT),
    total: publicRows.length,
    currentUser: currentUserRow,
    isCurrentUserInTop: showCurrentUser && currentUserRow.position <= LEADERBOARD_LIMIT,
  };
}

export function getCurrentUserPosition(tab: LeaderboardTab) {
  return getLeaderboard(tab).currentUser.position;
}
