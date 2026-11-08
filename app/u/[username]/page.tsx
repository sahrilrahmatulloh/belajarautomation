import DashboardLayout from "@/components/layout/DashboardLayout";
import PublicProfileGate from "@/components/profile/PublicProfileGate";
import RealPublicProfile from "@/components/profile/RealPublicProfile";
import { DUMMY_PUBLIC_USERNAMES, getPublicProfile } from "@/data/dummy/publicProfiles";

interface PublicProfileRouteProps {
  params: Promise<{
    username: string;
  }>;
}

export function generateStaticParams() {
  return DUMMY_PUBLIC_USERNAMES.map((username) => ({ username }));
}

export default async function Page({ params }: PublicProfileRouteProps) {
  const { username } = await params;
  const profile = getPublicProfile(username);

  // Username di luar data dummy dicari di database (akun sungguhan, PRD FR-13).
  return (
    <DashboardLayout>
      {profile ? <PublicProfileGate profile={profile} /> : <RealPublicProfile username={username} />}
    </DashboardLayout>
  );
}
