"use client";

import { useState } from "react";
import { CircleSlash, Eye, EyeOff, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

import ConfirmDialog from "@/components/common/ConfirmDialog";
import IconAction from "@/components/common/IconAction";
import PrototypeNotice from "@/components/creator/studio/PrototypeNotice";
import { userName } from "@/components/creator/studio/useCreatorData";
import { getRank } from "@/data/ranks";
import { MODERATION_THRESHOLDS } from "@/data/dummy/moderation";
import { runContentAction } from "@/lib/content";
import { formatContentDate } from "@/lib/content/document";
import { formatNumber } from "@/lib/format";
import { useCatalogFilters } from "@/lib/useUrlFilters";
import { ModerationFlag, ModerationFlagStatus, ModerationReason } from "@/types/AdminPlatform";

import AdminList, { AdminColumn } from "./AdminList";
import ReasonDialog from "./ReasonDialog";
import { useAdminData } from "./useAdminData";

const FILTER_KEYS = ["status", "alasan"] as const;
const selectClass = "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm font-medium dark:bg-card";
const fieldClass = "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-normal dark:bg-card";

const REASON_LABELS: Record<ModerationReason, string> = { "lonjakan-xp": "Lonjakan XP harian", "lesson-terlalu-cepat": "Lesson terlalu cepat" };
const STATUS_LABELS: Record<ModerationFlagStatus, string> = { terbuka: "Perlu ditinjau", diabaikan: "Diabaikan", ditangani: "Ditangani" };

type Pending = { kind: "abaikan" | "koreksi" | "sembunyikan" | "tampilkan"; flag: ModerationFlag } | null;

function CorrectionDialog({ flag, name, xp, adminId, onClose }: { flag: ModerationFlag; name: string; xp: number; adminId: string; onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const parsed = Number(amount);
  const next = xp + (Number.isFinite(parsed) ? parsed : 0);

  const save = async (alasan: string) => {
    const result = await runContentAction((repository) => repository.correctXp(adminId, flag.userId, parsed, alasan, flag.id));
    if (result.ok) onClose();
    else setError(result.message);
  };

  return (
    <ReasonDialog
      title={`Koreksi XP ${name}`}
      description="Dicatat sebagai transaksi XP koreksi, dan riwayat lama tidak diubah. Rank dihitung ulang."
      confirmLabel="Simpan koreksi"
      error={error}
      onConfirm={(alasan) => void save(alasan)}
      onClose={onClose}
    >
      <label className="mt-3 block text-sm font-medium">
        Jumlah koreksi (negatif untuk mengurangi)
        <input type="number" value={amount} onChange={(event) => setAmount(event.target.value)} className={fieldClass} />
      </label>
      <p className="mt-2 text-sm text-muted-foreground">
        {formatNumber(xp)} XP menjadi {formatNumber(Math.max(0, next))} XP ({getRank(Math.max(0, next)).name})
      </p>
    </ReasonDialog>
  );
}

// Moderasi (PRD FR-16 D).
export default function ModerationPage() {
  const { userId, data } = useAdminData();
  const { values, setFilters } = useCatalogFilters(FILTER_KEYS);
  const [pending, setPending] = useState<Pending>(null);
  const [error, setError] = useState("");

  if (!data) return <p className="py-10 text-center text-sm text-muted-foreground">Memuat moderasi...</p>;

  const { flags, users } = data;
  const filtered = flags.filter((flag) => (!values.status || flag.status === values.status) && (!values.alasan || flag.reason === values.alasan));
  const userOf = (flag: ModerationFlag) => users.find((user) => user.id === flag.userId);

  const open = (kind: NonNullable<Pending>["kind"], flag: ModerationFlag) => {
    setError("");
    setPending({ kind, flag });
  };

  const finish = (result: { ok: true } | { ok: false; message: string }) => {
    if (result.ok) setPending(null);
    else setError(result.message);
  };

  const ignore = async () => {
    if (pending) finish(await runContentAction((repository) => repository.ignoreFlag(userId, pending.flag.id)));
  };

  const setVisibility = async (alasan: string) => {
    if (pending) finish(await runContentAction((repository) => repository.setLeaderboardVisibility(userId, pending.flag.userId, pending.kind === "tampilkan", alasan, pending.flag.id)));
  };

  const columns: AdminColumn<ModerationFlag>[] = [
    {
      header: "Akun",
      cell: (flag) => (
        <Link href={`/admin/pengguna/${flag.userId}`} className="text-primary-accent underline-offset-2 hover:underline">{userName(users, flag.userId)}</Link>
      ),
    },
    { header: "Alasan", cell: (flag) => REASON_LABELS[flag.reason] },
    { header: "Detail", cell: (flag) => flag.detail },
    { header: "XP", cell: (flag) => formatNumber(userOf(flag)?.xp ?? 0) },
    { header: "Tanggal", cell: (flag) => <span className="whitespace-nowrap">{formatContentDate(flag.createdAt)}</span> },
    { header: "Status", cell: (flag) => STATUS_LABELS[flag.status] },
    {
      header: "Aksi",
      cell: (flag) => {
        const isHidden = userOf(flag)?.hiddenFromLeaderboard;
        const name = userName(users, flag.userId);
        return (
          <span className="flex flex-wrap items-center gap-1">
            {flag.status === "terbuka" && <IconAction label={`Abaikan ${name}`} tooltip="Abaikan" icon={CircleSlash} onClick={() => open("abaikan", flag)} />}
            <IconAction label={`Koreksi XP ${name}`} tooltip="Koreksi XP" icon={SlidersHorizontal} onClick={() => open("koreksi", flag)} />
            {isHidden ? (
              <IconAction label={`Tampilkan kembali ${name}`} tooltip="Tampilkan kembali di leaderboard" icon={Eye} onClick={() => open("tampilkan", flag)} />
            ) : (
              <IconAction label={`Sembunyikan dari leaderboard: ${name}`} tooltip="Sembunyikan dari leaderboard" icon={EyeOff} onClick={() => open("sembunyikan", flag)} />
            )}
          </span>
        );
      },
    },
  ];

  const pendingUser = pending && userOf(pending.flag);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5">
      <PrototypeNotice />

      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Moderasi</h1>
        <p className="mt-1 text-muted-foreground">Akun yang ditandai karena pola XP tidak wajar.</p>
      </header>

      <p role="note" className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-200">
        Simulasi — batas penandaan belum final (PRD Bagian 12). Sementara: lebih dari {MODERATION_THRESHOLDS.dailyXp} XP sehari, atau lesson selesai kurang dari {MODERATION_THRESHOLDS.minLessonSeconds} detik.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <select aria-label="Filter status" value={values.status} onChange={(event) => setFilters({ status: event.target.value })} className={selectClass}>
          <option value="">Semua status</option>
          {(Object.keys(STATUS_LABELS) as ModerationFlagStatus[]).map((status) => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}
        </select>
        <select aria-label="Filter alasan" value={values.alasan} onChange={(event) => setFilters({ alasan: event.target.value })} className={selectClass}>
          <option value="">Semua alasan</option>
          {(Object.keys(REASON_LABELS) as ModerationReason[]).map((reason) => <option key={reason} value={reason}>{REASON_LABELS[reason]}</option>)}
        </select>
      </div>

      {filtered.length > 0 ? (
        <AdminList label="akun ditandai" rows={filtered} columns={columns} rowKey={(flag) => flag.id} />
      ) : (
        <p className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">Tidak ada akun yang cocok.</p>
      )}

      {pending?.kind === "abaikan" && (
        <ConfirmDialog
          title="Abaikan penandaan ini?"
          description={`Penandaan ${pendingUser?.name} ditutup tanpa tindakan, dan tetap tercatat di riwayat.`}
          confirmLabel="Abaikan"
          error={error}
          onConfirm={() => void ignore()}
          onClose={() => setPending(null)}
        />
      )}
      {pending?.kind === "koreksi" && pendingUser && (
        <CorrectionDialog flag={pending.flag} name={pendingUser.name} xp={pendingUser.xp} adminId={userId} onClose={() => setPending(null)} />
      )}
      {(pending?.kind === "sembunyikan" || pending?.kind === "tampilkan") && (
        <ReasonDialog
          title={pending.kind === "sembunyikan" ? "Sembunyikan dari leaderboard?" : "Tampilkan kembali di leaderboard?"}
          description={pending.kind === "sembunyikan" ? `${pendingUser?.name} tidak tampil dan tidak dihitung di leaderboard. XP-nya tidak berubah.` : `${pendingUser?.name} tampil kembali di leaderboard.`}
          confirmLabel={pending.kind === "sembunyikan" ? "Sembunyikan" : "Tampilkan kembali"}
          error={error}
          onConfirm={(alasan) => void setVisibility(alasan)}
          onClose={() => setPending(null)}
        />
      )}
    </div>
  );
}
