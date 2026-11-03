"use client";

import { useState } from "react";
import Image from "next/image";
import { Cat, Check, ChevronRight, Eye, ImageIcon, Lock, Sparkles } from "lucide-react";

import RankEmblem from "@/components/common/RankEmblem";
import FilterChips from "@/components/filters/FilterChips";
import FilterEmptyState from "@/components/filters/FilterEmptyState";
import { AVATARS, getAvatar } from "@/data/avatars";
import { DUMMY_ACCOUNT } from "@/data/dummy/account";
import { useSession } from "@/lib/session";
import { ACTIVE_AVATAR, ACTIVE_THEME } from "@/data/dummy/appearance";
import { getMembershipPlan } from "@/data/membership";
import { getRank } from "@/data/ranks";
import { getTheme, THEMES } from "@/data/themes";
import { canUseAvatar, canUseTheme } from "@/lib/appearance";
import { formatNumber } from "@/lib/format";
import { BannerTheme, CatAvatar } from "@/types/Appearance";

// Tab Kustomisasi (PRD FR-13): koleksi avatar dan tema banner, pratinjau profil,
// dan pilihan yang sedang digunakan. Pilihan baru hanya mengubah pratinjau;
// penyimpanan menunggu data akun tersedia di backend.
type Section = "avatar" | "tema";
type Ownership = "" | "dimiliki" | "terkunci";

const SECTIONS = [
  { value: "avatar" as const, label: "Avatar Kucing", icon: Cat },
  { value: "tema" as const, label: "Tema Banner", icon: ImageIcon },
];

const OWNERSHIP_OPTIONS = [
  { value: "", label: "Semua" },
  { value: "dimiliki", label: "Dimiliki" },
  { value: "terkunci", label: "Terkunci" },
];

const tier = DUMMY_ACCOUNT.membership;

function unlockNote(item: CatAvatar | BannerTheme) {
  const plans = item.includedIn.map((planTier) => getMembershipPlan(planTier).name);
  return plans.length > 0 ? `Tersedia di ${plans.join(" dan ")}` : "Belum tersedia";
}

function StatusBadge({ isActive, isOwned }: { isActive: boolean; isOwned: boolean }) {
  if (isActive) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary-accent">
        <Check className="h-3 w-3" aria-hidden="true" />
        Digunakan
      </span>
    );
  }
  if (isOwned) {
    return (
      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
        Dimiliki
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
      <Lock className="h-3 w-3" aria-hidden="true" />
      Terkunci
    </span>
  );
}

interface CollectionCardProps {
  name: string;
  detail?: string;
  image: string;
  imageClassName: string;
  isOwned: boolean;
  isActive: boolean;
  isSelected: boolean;
  lockNote: string;
  onSelect: () => void;
}

function CollectionCard({
  name,
  detail,
  image,
  imageClassName,
  isOwned,
  isActive,
  isSelected,
  lockNote,
  onSelect,
}: CollectionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={!isOwned}
      aria-pressed={isSelected}
      className={`relative flex flex-col overflow-hidden rounded-2xl border bg-card text-left transition-shadow disabled:cursor-not-allowed ${
        isSelected
          ? "border-primary ring-2 ring-primary/30"
          : "border-border enabled:hover:shadow-md"
      }`}
    >
      <div className={`relative bg-muted ${isOwned ? "" : "opacity-60 grayscale"}`}>
        <Image src={image} alt="" width={480} height={160} className={imageClassName} />
      </div>
      {isSelected && (
        <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      )}
      <div className="flex flex-1 flex-col items-center gap-1.5 p-3 text-center">
        <p className="text-sm font-semibold">{name}</p>
        {detail && <p className="-mt-1 text-xs text-muted-foreground">{detail}</p>}
        <StatusBadge isActive={isActive} isOwned={isOwned} />
        {!isOwned && <p className="text-xs text-muted-foreground">{lockNote}</p>}
      </div>
    </button>
  );
}

// Kartu penanda bahwa koleksi masih akan bertambah (PRD FR-12: rilis awal 5 item).
function UpcomingCard({ label }: { label: string }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
      <Sparkles className="h-5 w-5" aria-hidden="true" />
      {label}
    </div>
  );
}

export default function ProfileCustomization() {
  const session = useSession();
  const [section, setSection] = useState<Section>("avatar");
  const [ownership, setOwnership] = useState<Ownership>("");
  const [avatarId, setAvatarId] = useState(ACTIVE_AVATAR.id);
  const [themeId, setThemeId] = useState(ACTIVE_THEME.id);

  const avatar = getAvatar(avatarId) ?? ACTIVE_AVATAR;
  const theme = getTheme(themeId) ?? ACTIVE_THEME;
  const rank = getRank(DUMMY_ACCOUNT.xp);
  const hasChanges = avatar.id !== ACTIVE_AVATAR.id || theme.id !== ACTIVE_THEME.id;

  const matchesOwnership = (isOwned: boolean) =>
    ownership === "" || (ownership === "dimiliki" ? isOwned : !isOwned);

  const avatars = AVATARS.filter((item) => matchesOwnership(canUseAvatar(item.id, tier)));
  const themes = THEMES.filter((item) => matchesOwnership(canUseTheme(item.id, tier)));
  const avatarGroups = [...new Set(avatars.map((item) => item.catType))].map((catType) => ({
    catType,
    items: avatars.filter((item) => item.catType === catType),
  }));
  const isEmpty = section === "avatar" ? avatars.length === 0 : themes.length === 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
      {/* Pratinjau dan pilihan aktif: di bawah koleksi pada mobile, dua kolom di tablet */}
      <aside aria-label="Pratinjau dan pilihan aktif" className="order-last grid gap-4 sm:order-none sm:grid-cols-2 lg:sticky lg:top-24 lg:grid-cols-1 lg:self-start">
        <section aria-labelledby="pratinjau-profil" className="overflow-hidden rounded-2xl border border-border bg-card">
          <h2 id="pratinjau-profil" className="flex items-center gap-2 px-4 pb-3 pt-4 font-semibold">
            <Eye className="h-4 w-4 text-primary-accent" aria-hidden="true" />
            Pratinjau Profil
          </h2>
          <div className="relative mx-4 h-24 overflow-hidden rounded-xl">
            <Image src={theme.thumbnail} alt="" fill sizes="288px" className="object-cover object-[75%_50%]" />
          </div>
          <div className="-mt-10 flex flex-col items-center px-4 pb-4 text-center">
            <div className="relative rounded-2xl bg-white p-1 shadow-md">
              <Image src={avatar.image} alt="" width={72} height={72} className="h-[72px] w-[72px]" />
            </div>
            <p className="mt-2 font-semibold">{session?.name ?? DUMMY_ACCOUNT.name}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1">
                <RankEmblem rank={rank} variant="compact" size={18} />
                {rank.name}
              </span>
              <span className="rounded-full border border-border px-2.5 py-1 tabular-nums">
                {formatNumber(DUMMY_ACCOUNT.xp)} XP
              </span>
            </div>
          </div>
        </section>

        <section aria-labelledby="digunakan-saat-ini" className="rounded-2xl border border-border bg-card p-4">
          <h2 id="digunakan-saat-ini" className="text-sm font-semibold">Digunakan Saat Ini</h2>
          <ul className="mt-3 space-y-2">
            <li>
              <button
                type="button"
                onClick={() => setSection("avatar")}
                className="flex w-full items-center gap-3 rounded-xl border border-border p-2 text-left transition-colors hover:bg-accent"
              >
                <Image src={ACTIVE_AVATAR.image} alt="" width={40} height={40} className="h-10 w-10 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">Avatar</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {ACTIVE_AVATAR.name} · {ACTIVE_AVATAR.style}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setSection("tema")}
                className="flex w-full items-center gap-3 rounded-xl border border-border p-2 text-left transition-colors hover:bg-accent"
              >
                <Image
                  src={ACTIVE_THEME.thumbnail}
                  alt=""
                  width={60}
                  height={40}
                  className="h-10 w-[60px] shrink-0 rounded-md object-cover object-[75%_50%]"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">Tema</span>
                  <span className="block truncate text-xs text-muted-foreground">{ACTIVE_THEME.name}</span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              </button>
            </li>
          </ul>

          <button
            type="button"
            disabled
            className="mt-4 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            Simpan Pilihan
          </button>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {hasChanges ? "Pilihan baru baru tampil di pratinjau. " : ""}
            Penyimpanan aktif setelah data akun dapat disimpan.
          </p>
        </section>
      </aside>

      {/* Koleksi */}
      <section aria-labelledby="judul-koleksi" className="min-w-0 rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted/60 p-1 sm:inline-grid sm:w-auto">
          {SECTIONS.map((item) => {
            const Icon = item.icon;
            const isActive = item.value === section;
            return (
              <button
                key={item.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => setSection(item.value)}
                className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors ${
                  isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="judul-koleksi" className="text-lg font-bold">
              {section === "avatar" ? "Koleksi Avatar" : "Koleksi Tema"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {section === "avatar"
                ? "Pilih kucing yang tampil sebagai foto profil kamu."
                : "Pilih tema untuk banner profil dan Welcome Banner."}
            </p>
          </div>
          <FilterChips
            label="Kepemilikan"
            layout="scroll"
            options={OWNERSHIP_OPTIONS}
            active={ownership}
            onChange={(value) => setOwnership(value as Ownership)}
          />
        </div>

        <div className="mt-5">
          {isEmpty ? (
            <FilterEmptyState
              title={ownership === "terkunci" ? "Tidak ada item terkunci" : "Belum ada item"}
              description="Coba tampilkan semua item di koleksi ini."
              onReset={() => setOwnership("")}
            />
          ) : section === "avatar" ? (
            <div className="space-y-5">
              {avatarGroups.map((group) => (
                <div key={group.catType}>
                  <h3 className="mb-2 text-sm font-semibold capitalize text-muted-foreground">
                    Kucing {group.catType}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                    {group.items.map((item) => (
                      <CollectionCard
                        key={item.id}
                        name={item.name}
                        detail={item.style}
                        image={item.image}
                        imageClassName="mx-auto aspect-square h-auto w-3/4 p-3"
                        isOwned={canUseAvatar(item.id, tier)}
                        isActive={item.id === ACTIVE_AVATAR.id}
                        isSelected={item.id === avatar.id}
                        lockNote={unlockNote(item)}
                        onSelect={() => setAvatarId(item.id)}
                      />
                    ))}
                    {ownership !== "terkunci" && <UpcomingCard label="Avatar lain segera hadir" />}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 xl:grid-cols-3">
              {themes.map((item) => (
                <CollectionCard
                  key={item.id}
                  name={item.name}
                  image={item.thumbnail}
                  imageClassName="aspect-[3/1] h-auto w-full object-cover"
                  isOwned={canUseTheme(item.id, tier)}
                  isActive={item.id === ACTIVE_THEME.id}
                  isSelected={item.id === theme.id}
                  lockNote={unlockNote(item)}
                  onSelect={() => setThemeId(item.id)}
                />
              ))}
              {ownership !== "terkunci" && <UpcomingCard label="Tema lain segera hadir" />}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
