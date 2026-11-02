import { Achievement } from "@/types/Achievement";

// Achievement PRD FR-14. Hanya tampil di profil, tidak memberikan XP, dan tidak
// dapat dibeli. Daftar final ditetapkan kemudian (PRD Bagian 12).
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-steps",
    name: "First Steps",
    description: "Menyelesaikan materi pertama",
    category: "Belajar",
    icon: "Footprints",
  },
  {
    id: "course-finisher",
    name: "Course Finisher",
    description: "Menyelesaikan seluruh materi dalam satu course",
    category: "Belajar",
    icon: "GraduationCap",
  },
  {
    id: "rajin-belajar",
    name: "Rajin Belajar",
    description: "Menyelesaikan 50 materi",
    category: "Belajar",
    icon: "BookOpen",
    target: 50,
  },
  {
    id: "quiz-master",
    name: "Quiz Master",
    description: "Mencapai skor minimal 90% di sebuah kuis",
    category: "Belajar",
    icon: "BrainCircuit",
  },
  {
    id: "bug-hunter",
    name: "Bug Hunter",
    description: "Menyelesaikan challenge kategori bug",
    category: "Testing",
    icon: "Bug",
  },
  {
    id: "test-designer",
    name: "Test Designer",
    description: "Menyelesaikan 8 materi course Test Design & Test Case",
    category: "Testing",
    icon: "ClipboardList",
    target: 8,
  },
  {
    id: "automation-starter",
    name: "Automation Starter",
    description: "Menyelesaikan materi automation pertama",
    category: "Automation",
    icon: "Bot",
  },
  {
    id: "challenge-starter",
    name: "Challenge Starter",
    description: "Menyelesaikan challenge pertama",
    category: "Challenge",
    icon: "Swords",
  },
  {
    id: "challenge-runner",
    name: "Challenge Runner",
    description: "Menyelesaikan 5 challenge",
    category: "Challenge",
    icon: "Target",
    target: 5,
  },
  {
    id: "consistent-learner",
    name: "Consistent Learner",
    description: "Aktif belajar 7 hari berturut-turut",
    category: "Konsistensi",
    icon: "Flame",
  },
  {
    id: "roadmap-finisher",
    name: "Roadmap Finisher",
    description: "Menuntaskan satu roadmap",
    category: "Milestone",
    icon: "Map",
  },
  {
    id: "grand-learner",
    name: "Grand Learner",
    description: "Mencapai rank Master",
    category: "Milestone",
    icon: "Crown",
  },
];

export function getAchievement(id: string) {
  return ACHIEVEMENTS.find((achievement) => achievement.id === id);
}
