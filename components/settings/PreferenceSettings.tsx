"use client";

import { useState } from "react";
import { Bell, Mail } from "lucide-react";

const preferences = [
  {
    id: "learning",
    title: "Update Materi",
    description:
      "Dapatkan notifikasi saat materi baru tersedia.",
    icon: Bell,
  },
  {
    id: "email",
    title: "Email Notification",
    description:
      "Terima informasi penting melalui email.",
    icon: Mail,
  },
];

export default function PreferenceSettings() {
  const [enabled, setEnabled] = useState([
    "learning",
  ]);

  const togglePreference = (id: string) => {
    setEnabled((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <h2 className="text-xl font-bold">
        Notifications
      </h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Atur notifikasi yang ingin kamu terima.
      </p>

      <div className="mt-6 divide-y divide-border">
        {preferences.map((preference) => {
          const Icon = preference.icon;
          const isEnabled = enabled.includes(
            preference.id
          );

          return (
            <div
              key={preference.id}
              className="flex items-center gap-4 py-5 first:pt-0 last:pb-0"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                <Icon className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold">
                  {preference.title}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {preference.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  togglePreference(preference.id)
                }
                aria-pressed={isEnabled}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  isEnabled
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                    isEnabled
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}