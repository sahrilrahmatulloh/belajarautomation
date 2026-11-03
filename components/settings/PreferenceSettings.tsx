"use client";

import { LucideIcon, Mail } from "lucide-react";

import { NOTIFICATION_GROUPS } from "@/data/notificationGroups";
import {
  ALWAYS_ON_GROUPS,
  MUTABLE_GROUPS,
  notificationPreferenceActions,
  useNotificationPreferences,
} from "@/lib/notificationPreferences";
import { useSession } from "@/lib/session";

const GROUP_DESCRIPTIONS = {
  progress: "Naik rank, achievement, dan latihan yang kamu selesaikan.",
  content: "Course, latihan, eBook, dan project baru.",
  role: "Kabar terkait tugas di role kamu.",
  transaction: "Status pembayaran dan membership.",
  system: "Keamanan akun, kebijakan, dan jadwal maintenance.",
};

function PreferenceRow({
  id,
  icon: Icon,
  iconStyle,
  label,
  description,
  children,
}: {
  id: string;
  icon: LucideIcon;
  iconStyle: string;
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 py-5 first:pt-0 last:pb-0">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <p id={id} className="text-sm font-semibold">
          {label}
        </p>

        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      {children}
    </div>
  );
}

function PreferenceSwitch({
  labelledBy,
  checked,
  onToggle,
}: {
  labelledBy: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      onClick={onToggle}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-primary" : "bg-muted-foreground/30"
      }`}
    >
      <span
        className={`absolute left-0 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function PreferenceSettings() {
  const session = useSession();
  const { mutedGroups, email } = useNotificationPreferences();

  // Kelompok "Khusus role" hanya untuk pengguna dengan role tersebut.
  const mutableGroups = MUTABLE_GROUPS.filter((group) => group !== "role" || session?.role !== "user");

  return (
    <section id="notifikasi" className="scroll-mt-20 rounded-3xl border border-border bg-card p-6">
      <h2 className="text-xl font-bold">Notifikasi</h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Pilih kabar yang ingin tampil di lonceng dan halaman notifikasi.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        Preferensi tersimpan di browser ini dan belum tersimpan permanen ke akun.
      </p>

      <div className="mt-6 divide-y divide-border">
        {mutableGroups.map((group) => {
          const { label, icon, iconStyle } = NOTIFICATION_GROUPS[group];
          const enabled = !mutedGroups.includes(group);

          return (
            <PreferenceRow
              key={group}
              id={`notification-group-${group}`}
              icon={icon}
              iconStyle={iconStyle}
              label={label}
              description={GROUP_DESCRIPTIONS[group as keyof typeof GROUP_DESCRIPTIONS]}
            >
              <PreferenceSwitch
                labelledBy={`notification-group-${group}`}
                checked={enabled}
                onToggle={() => notificationPreferenceActions.setGroupEnabled(group, !enabled)}
              />
            </PreferenceRow>
          );
        })}

        {ALWAYS_ON_GROUPS.map((group) => {
          const { label, icon, iconStyle } = NOTIFICATION_GROUPS[group];

          return (
            <PreferenceRow
              key={group}
              id={`notification-group-${group}`}
              icon={icon}
              iconStyle={iconStyle}
              label={label}
              description={GROUP_DESCRIPTIONS[group as keyof typeof GROUP_DESCRIPTIONS]}
            >
              <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                Selalu aktif
              </span>
            </PreferenceRow>
          );
        })}
      </div>

      <div className="mt-5 border-t border-border pt-5">
        <PreferenceRow
          id="notification-email"
          icon={Mail}
          iconStyle="bg-muted"
          label="Kirim juga lewat email"
          description="Email aktif setelah backend tersedia, jadi saat ini belum ada email yang dikirim. Email transaksi nantinya selalu dikirim."
        >
          <PreferenceSwitch
            labelledBy="notification-email"
            checked={email}
            onToggle={() => notificationPreferenceActions.setEmail(!email)}
          />
        </PreferenceRow>
      </div>
    </section>
  );
}
