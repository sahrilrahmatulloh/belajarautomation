import DashboardLayout from "@/components/layout/DashboardLayout";

// Blog bisa dibaca tanpa login (PRD FR-07).
export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout publicAccess>{children}</DashboardLayout>;
}
