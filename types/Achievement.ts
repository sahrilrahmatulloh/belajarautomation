export type AchievementCategory =
  | "Belajar"
  | "Testing"
  | "Automation"
  | "Challenge"
  | "Konsistensi"
  | "Milestone";

// Nama ikon lucide-react yang dipakai badge achievement.
export type AchievementIcon =
  | "Footprints"
  | "GraduationCap"
  | "BookOpen"
  | "BrainCircuit"
  | "Bug"
  | "ClipboardList"
  | "Bot"
  | "Swords"
  | "Target"
  | "Flame"
  | "Map"
  | "Crown";

export interface Achievement {
  id: string;
  name: string;
  // Syarat memperoleh achievement.
  description: string;
  category: AchievementCategory;
  icon: AchievementIcon;
  // Hanya untuk achievement bertahap, mis. 50 pada "Selesaikan 50 materi".
  target?: number;
}
