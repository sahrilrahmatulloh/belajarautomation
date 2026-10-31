import { Notification } from "@/types/Notification";

export const NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    title: "Materi baru tersedia",
    description:
      "Materi Playwright Locator & Assertions sekarang sudah bisa dipelajari.",
    type: "course",
    time: "5 menit lalu",
    read: false,
    href: "/learn",
  },
  {
    id: 2,
    title: "Challenge baru di Playground",
    description:
      "Challenge API Response Validation sekarang bisa dicoba di Playground.",
    type: "playground",
    time: "2 jam lalu",
    read: false,
    href: "/playground",
  },
  {
    id: 3,
    title: "eBook baru tersedia",
    description:
      "Playwright from Zero to Hero sekarang tersedia di eBook.",
    type: "book",
    time: "1 hari lalu",
    read: true,
    href: "/ebooks",
  },
  {
    id: 4,
    title: "Selamat datang!",
    description:
      "Selamat datang di belajarautomation.id. Mulai perjalanan QA Automation kamu.",
    type: "system",
    time: "3 hari lalu",
    read: true,
  },
];