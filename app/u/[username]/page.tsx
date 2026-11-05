import { notFound } from "next/navigation";

import DashboardLayout from "@/components/layout/DashboardLayout";
import PublicProfileGate from "@/components/profile/PublicProfileGate";
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

  if (!profile) {
    notFound();
  }

  return (
    <DashboardLayout>
      <PublicProfileGate profile={profile} />
    </DashboardLayout>
  );
}
