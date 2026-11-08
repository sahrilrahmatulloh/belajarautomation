"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Cat, Check, Eye, ImageIcon, ListFilter, Lock, Sparkles } from "lucide-react";

import RankEmblem from "@/components/common/RankEmblem";
import FilterChips from "@/components/filters/FilterChips";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FilterEmptyState from "@/components/filters/FilterEmptyState";
import { AVATAR_STYLES, AVATARS, getAvatar } from "@/data/avatars";
import { DUMMY_ACCOUNT } from "@/data/dummy/account";
import { useAccountXp } from "@/lib/lessonProgress";
import { saveAppearance } from "@/lib/auth/profileActions";
import { useSession } from "@/lib/session";
import { useAppearance } from "@/lib/useAppearance";
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
type Ownership = "semua" | "dimiliki" | "terkunci";

const SECTIONS = [
  { value: "avatar" as const, label: "Avatar Kucing", icon: Cat },
  { value: "tema" as const, label: "Tema Banner", icon: ImageIcon },
];

const OWNERSHIP_OPTIONS: { value: Ownership; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "dimiliki", label: "Dimiliki" },
  { value: "terkunci", label: "Terkunci" },
];

// Filter kepemilikan sebagai tombol ikon dengan dropdown (PRD FR-13). Titik biru menandai
// filter yang sedang aktif selain Semua.
function OwnershipFilter({ value, onChange }: { value: Ownership; onChange: (value: Ownership) => void }) {
  const label = OWNERSHIP_OPTIONS.find((option) => option.value === value)?.label ?? "Semua";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
        <span className="sr-only">Filter kepemilikan: {label}</span>
        <ListFilter className="h-4 w-4" aria-hidden="true" />
        {value !== "semua" && (
          <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-card" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuRadioGroup value={value} onValueChange={(next) => onChange(next as Ownership)}>
          <DropdownMenuLabel>Kepemilikan</DropdownMenuLabel>
          {OWNERSHIP_OPTIONS.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value} closeOnClick>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


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
  // Pilihan yang sedang dipakai: dari akun Supabase, atau data dummy untuk akun demo.
  const { avatar: activeAvatar, theme: activeTheme, tier, canSave } = useAppearance();
  const [section, setSection] = useState<Section>("avatar");
  const [ownership, setOwnership] = useState<Ownership>("semua");
  const [avatarId, setAvatarId] = useState(activeAvatar.id);
  // Gaya yang sedang dilihat di koleksi; awalnya gaya avatar yang sedang dipakai.
  const [style, setStyle] = useState<string>(activeAvatar.style);
  const [themeId, setThemeId] = useState(activeTheme.id);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  // Pilihan di pratinjau mengikuti akun setelah sesi termuat atau setelah disimpan.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- menyalin pilihan akun ke pratinjau saat akun berubah */
    setAvatarId(activeAvatar.id);
    setThemeId(activeTheme.id);
    setStyle(activeAvatar.style);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [activeAvatar.id, activeAvatar.style, activeTheme.id]);

  const avatar = getAvatar(avatarId) ?? activeAvatar;
  const theme = getTheme(themeId) ?? activeTheme;
  const xp = useAccountXp();
  const rank = getRank(xp);
  const hasChanges = avatar.id !== activeAvatar.id || theme.id !== activeTheme.id;

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    const result = await saveAppearance(avatar.id, theme.id);
    setIsSaving(false);
    setSaveStatus(result.ok ? { tone: "success", text: "Pilihan tersimpan." } : { tone: "error", text: result.message });
  };

  const matchesOwnership = (isOwned: boolean) =>
    ownership === "semua" || (ownership === "dimiliki" ? isOwned : !isOwned);

  // Koleksi avatar dikelompokkan per gaya (PRD FR-13). Gaya yang belum punya gambar tetap
  // tampil sebagai chip dengan keterangan "Segera hadir".
  const styleAvatars = AVATARS.filter((item) => item.style === style);
  const isStyleUpcoming = styleAvatars.length === 0;
  const avatars = styleAvatars.filter((item) => matchesOwnership(canUseAvatar(item.id, tier)));
  const themes = THEMES.filter((item) => matchesOwnership(canUseTheme(item.id, tier)));
  const styleOptions = AVATAR_STYLES.map((name) => ({
    value: name,
    label: name,
    note: AVATARS.some((item) => item.style === name) ? undefined : "Segera hadir",
  }));
  const isEmpty = section === "avatar" ? !isStyleUpcoming && avatars.length === 0 : themes.length === 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
      {/* Pratinjau dan pilihan aktif: di bawah koleksi pada mobile, dua kolom di tablet */}
      <aside aria-label="Pratinjau profil" className="order-last lg:sticky lg:top-24 lg:order-none lg:self-start">
        <section aria-labelledby="pratinjau-profil" className="overflow-hidden rounded-2xl border border-border bg-card">
          <h2 id="pratinjau-profil" className="flex items-center gap-2 px-4 pb-3 pt-4 font-semibold">
            <Eye className="h-4 w-4 text-primary-accent" aria-hidden="true" />
            Pratinjau Profil
          </h2>
          <div className="relative mx-4 h-24 overflow-hidden rounded-xl">
            <Image src={theme.thumbnail} alt="" fill sizes="288px" className="object-cover object-[75%_50%]" />
          </div>
          <div className="-mt-10 flex flex-col items-center px-4 pb-4 text-center">
            <div className="relative rounded-full bg-white p-1 shadow-md">
              <Image src={avatar.image} alt="" width={72} height={72} className="h-[72px] w-[72px] rounded-full" />
            </div>
            <p className="mt-2 font-semibold">{session?.name ?? DUMMY_ACCOUNT.name}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1">
                <RankEmblem rank={rank} variant="compact" size={18} />
                {rank.name}
              </span>
              <span className="rounded-full border border-border px-2.5 py-1 tabular-nums">
                {formatNumber(xp)} XP
              </span>
            </div>
          </div>

          {/* Pilihan aktif ditandai "Digunakan" pada kartu koleksi (PRD FR-13). */}
          <div className="border-t border-border p-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave || !hasChanges || isSaving}
              className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "Menyimpan..." : "Simpan Pilihan"}
            </button>
            {saveStatus ? (
              <p
                role={saveStatus.tone === "error" ? "alert" : "status"}
                className={`mt-2 text-xs font-medium leading-5 ${
                  saveStatus.tone === "error" ? "text-destructive" : "text-emerald-700 dark:text-emerald-300"
                }`}
              >
                {saveStatus.text}
              </p>
            ) : (
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {canSave
                  ? hasChanges
                    ? "Pilihan baru tampil di pratinjau. Simpan untuk memakainya di semua halaman."
                    : "Pilih avatar atau tema dari koleksi."
                  : "Akun demo tidak dapat menyimpan pilihan."}
              </p>
            )}
          </div>
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

        <div className="mt-5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 id="judul-koleksi" className="text-lg font-bold">
              {section === "avatar" ? "Koleksi Avatar" : "Koleksi Tema"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {section === "avatar"
                ? "Pilih kucing yang tampil sebagai foto profil kamu."
                : "Pilih tema untuk banner profil dan Welcome Banner."}
            </p>
          </div>
          <OwnershipFilter value={ownership} onChange={setOwnership} />
        </div>

        {section === "avatar" && (
          <div className="mt-4">
            <FilterChips label="Gaya avatar" layout="scroll" options={styleOptions} active={style} onChange={setStyle} />
          </div>
        )}

        <div className="mt-5">
          {section === "avatar" && isStyleUpcoming ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary-accent">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-3 font-semibold">Gaya {style} segera hadir</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Kostum ini akan tersedia untuk semua jenis kucing di paket Pro dan Premium.
              </p>
            </div>
          ) : isEmpty ? (
            <FilterEmptyState
              title={ownership === "terkunci" ? "Tidak ada item terkunci" : "Belum ada item"}
              description="Coba tampilkan semua item di koleksi ini."
              onReset={() => setOwnership("semua")}
            />
          ) : section === "avatar" ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {avatars.map((item) => (
                <CollectionCard
                  key={item.id}
                  name={item.name}
                  detail={item.style}
                  image={item.image}
                  imageClassName="mx-auto aspect-square h-auto w-3/4 p-3"
                  isOwned={canUseAvatar(item.id, tier)}
                  isActive={item.id === activeAvatar.id}
                  isSelected={item.id === avatar.id}
                  lockNote={unlockNote(item)}
                  onSelect={() => {
                    setAvatarId(item.id);
                    setSaveStatus(null);
                  }}
                />
              ))}
              {ownership !== "terkunci" && <UpcomingCard label="Jenis kucing lain segera hadir" />}
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
                  isActive={item.id === activeTheme.id}
                  isSelected={item.id === theme.id}
                  lockNote={unlockNote(item)}
                  onSelect={() => {
                    setThemeId(item.id);
                    setSaveStatus(null);
                  }}
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
