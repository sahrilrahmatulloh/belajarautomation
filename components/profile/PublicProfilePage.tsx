import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, Lock } from "lucide-react";

import { PublicProfile } from "@/data/dummy/publicProfiles";

import FeaturedAchievements from "./FeaturedAchievements";
import ProfileAchievements from "./ProfileAchievements";
import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";
import ProfileTabs from "./ProfileTabs";

// Profil yang dilihat pengguna lain (PRD FR-13): hanya header, Ringkasan, dan
// Pencapaian. Tanpa aktivitas detail, Kustomisasi, email, pembelian, atau membership.
export default function PublicProfilePage({ profile }: { profile: PublicProfile }) {
  if (!profile.isProfilePublic) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-border bg-card px-6 py-14 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
          <Lock className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
        </div>
        <h1 className="mt-3 text-xl font-bold">Profil ini privat</h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Pemilik profil memilih untuk tidak menampilkannya kepada pengguna lain.
        </p>
      </div>
    );
  }

  const summary = (
    <div className="space-y-6">
      <ProfileStats
        xp={profile.xp}
        lessons={profile.lessons}
        challenges={profile.challenges}
        achievements={profile.achievements.filter((state) => state.earned).length}
      />
      <FeaturedAchievements featured={profile.featured} allHref={`/u/${profile.username}?tab=pencapaian`} />
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {profile.isCurrentUser && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/[0.06] px-4 py-3 text-sm">
          <p className="flex items-center gap-2 font-medium">
            <Eye className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            Ini tampilan profilmu bagi pengguna lain.
          </p>
          <Link href="/profile" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Kembali ke profil
          </Link>
        </div>
      )}

      <ProfileHeader
        displayName={profile.displayName}
        username={profile.username}
        bio={profile.bio}
        avatarImage={profile.avatarImage}
        avatarName={profile.avatarName}
        themeImage={profile.themeImage}
        xp={profile.xp}
        isOwner={false}
      />

      {/* Tab dibaca dari URL, jadi butuh Suspense saat prerender. */}
      <Suspense fallback={summary}>
        <ProfileTabs
          panels={{
            ringkasan: summary,
            pencapaian: <ProfileAchievements states={profile.achievements} />,
          }}
        />
      </Suspense>
    </div>
  );
}
