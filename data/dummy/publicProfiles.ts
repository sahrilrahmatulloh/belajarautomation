// DATA DUMMY — hapus sebelum rilis (PRD FR-13, aturan bisnis #16).
// Profil publik contoh. Akun demo memakai data aslinya; pengguna leaderboard lain
// hanya punya total XP, jadi statistik dan achievement-nya diturunkan dari XP secara
// deterministik agar tetap masuk akal dan sama di setiap pemuatan.
// Sengaja tidak memuat email, pembelian, maupun membership (PRD FR-13).
import { ACHIEVEMENTS } from "@/data/achievements";
import { getAvatar } from "@/data/avatars";
import { getCatModel } from "@/data/catModels";
import { DUMMY_ACCOUNT } from "@/data/dummy/account";
import { ACTIVE_AVATAR, ACTIVE_THEME } from "@/data/dummy/appearance";
import { DUMMY_LEADERBOARD_USERS, LeaderboardUser } from "@/data/dummy/leaderboard";
import { DUMMY_PROFILE } from "@/data/dummy/profile";
import { DEFAULT_THEME_ID, getTheme } from "@/data/themes";
import { XP_PER_CHALLENGE, XP_PER_LESSON } from "@/data/xp";
import { AchievementState, getAchievementStates } from "@/lib/achievements";
import { getCompletedLessonCount } from "@/lib/learningProgress";

export interface PublicProfile {
  username: string;
  displayName: string;
  bio: string;
  avatarImage: string;
  avatarName: string;
  themeImage: string;
  themeVideo?: string;
  // Model 3D kucing di banner (PRD FR-12); undefined bila tidak ditampilkan.
  catModel?: string;
  xp: number;
  isProfilePublic: boolean;
  isCurrentUser: boolean;
  lessons: number;
  challenges: number;
  achievements: AchievementState[];
}

const TOTAL_CHALLENGES = 6;

function isEarned(id: string, xp: number, lessons: number, challenges: number) {
  switch (id) {
    case "first-steps": return lessons >= 1;
    case "course-finisher": return lessons >= 20;
    case "rajin-belajar": return lessons >= 50;
    case "quiz-master": return xp >= 600;
    case "bug-hunter": return challenges >= 2;
    case "test-designer": return xp >= 1000;
    case "automation-starter": return xp >= 400;
    case "challenge-starter": return challenges >= 1;
    case "challenge-runner": return challenges >= 5;
    case "consistent-learner": return xp >= 800;
    case "roadmap-finisher": return xp >= 2200;
    case "grand-learner": return xp >= 5500;
    default: return false;
  }
}

function toPublicProfile(user: LeaderboardUser): PublicProfile {
  const xp = user.totalXp;
  const challenges = Math.min(Math.floor((xp * 0.35) / XP_PER_CHALLENGE), TOTAL_CHALLENGES);
  const lessons = Math.floor((xp - challenges * XP_PER_CHALLENGE) / XP_PER_LESSON);
  const avatar = getAvatar(user.avatarId) ?? ACTIVE_AVATAR;

  const progressOf: Record<string, number> = {
    "rajin-belajar": lessons,
    "test-designer": Math.min(Math.floor(xp / 125), 7),
    "challenge-runner": challenges,
  };

  const achievements = ACHIEVEMENTS.map((achievement, index) => {
    const earned = isEarned(achievement.id, xp, lessons, challenges);
    return {
      achievement,
      earned: earned ? { achievementId: achievement.id, daysAgo: 30 + index * 11, time: "20:00" } : undefined,
      progress: !earned && achievement.target ? progressOf[achievement.id] : undefined,
    };
  });

  return {
    username: user.username,
    displayName: user.displayName,
    bio: user.bio,
    avatarImage: avatar.image,
    avatarName: avatar.name,
    themeImage: getTheme(DEFAULT_THEME_ID)!.image,
    themeVideo: getTheme(DEFAULT_THEME_ID)!.video,
    catModel: getCatModel(avatar, getTheme(DEFAULT_THEME_ID)),
    xp,
    isProfilePublic: user.isProfilePublic,
    isCurrentUser: false,
    lessons,
    challenges,
    achievements,
  };
}

function currentUserProfile(): PublicProfile {
  return {
    username: DUMMY_PROFILE.username,
    displayName: DUMMY_PROFILE.displayName,
    bio: DUMMY_PROFILE.bio,
    avatarImage: ACTIVE_AVATAR.image,
    avatarName: ACTIVE_AVATAR.name,
    themeImage: ACTIVE_THEME.image,
    themeVideo: ACTIVE_THEME.video,
    catModel: getCatModel(ACTIVE_AVATAR, ACTIVE_THEME),
    xp: DUMMY_ACCOUNT.xp,
    isProfilePublic: DUMMY_PROFILE.isProfilePublic,
    isCurrentUser: true,
    lessons: getCompletedLessonCount(),
    challenges: DUMMY_ACCOUNT.completedChallenges,
    achievements: getAchievementStates(),
  };
}

export const DUMMY_PUBLIC_USERNAMES = [
  DUMMY_PROFILE.username,
  ...DUMMY_LEADERBOARD_USERS.map((user) => user.username),
];

export function getPublicProfile(username: string): PublicProfile | undefined {
  if (username === DUMMY_PROFILE.username) return currentUserProfile();
  const user = DUMMY_LEADERBOARD_USERS.find((item) => item.username === username);
  return user && toPublicProfile(user);
}
