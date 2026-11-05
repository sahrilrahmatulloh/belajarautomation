// DATA DUMMY — hapus sebelum rilis (PRD FR-15).
// Pengguna untuk tahap antarmuka dengan data dummy. Akun demo memakai id yang sama.
import { ContentUser } from "@/types/ContentWorkflow";

export const DUMMY_USERS: ContentUser[] = [
  { id: "user-sobat", name: "Sobat QA", email: "user@demo.belajarautomation.com", roles: ["user"] },
  { id: "user-andi", name: "Andi Pratama", email: "creator@demo.belajarautomation.com", roles: ["user", "creator"] },
  { id: "user-galih", name: "Galih Ramadhan", email: "galih@demo.belajarautomation.com", roles: ["user", "creator"] },
  { id: "user-rahma", name: "Rahma Putri", email: "reviewer@demo.belajarautomation.com", roles: ["user", "reviewer"] },
  // Reviewer yang juga Creator, tanpa akun demo. Akun lain bisa merangkap peran lewat Kelola Peran.
  { id: "user-bima", name: "Bima Santoso", email: "bima@demo.belajarautomation.com", roles: ["user", "reviewer", "creator"] },
  { id: "user-admin", name: "Admin Belajar", email: "admin@demo.belajarautomation.com", roles: ["user", "admin"] },
  { id: "user-dewi", name: "Dewi Lestari", email: "dewi@demo.belajarautomation.com", roles: ["user"] },
  { id: "user-budi", name: "Budi Santika", email: "budi@demo.belajarautomation.com", roles: ["user"] },
];
