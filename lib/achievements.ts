import { ACHIEVEMENTS } from "@/data/achievements";
import {
  DUMMY_ACHIEVEMENT_PROGRESS,
  DUMMY_EARNED_ACHIEVEMENTS,
  EarnedAchievement,
} from "@/data/dummy/userAchievements";
import { Achievement } from "@/types/Achievement";

export interface AchievementState {
  achievement: Achievement;
  earned?: EarnedAchievement;
  // Progres saat ini, hanya untuk achievement bertahap yang belum diperoleh.
  progress?: number;
}

// Menggabungkan daftar achievement dengan data milik pengguna.
export function getAchievementStates(): AchievementState[] {
  return ACHIEVEMENTS.map((achievement) => {
    const earned = DUMMY_EARNED_ACHIEVEMENTS.find((item) => item.achievementId === achievement.id);
    return {
      achievement,
      earned,
      progress: !earned && achievement.target ? (DUMMY_ACHIEVEMENT_PROGRESS[achievement.id] ?? 0) : undefined,
    };
  });
}
