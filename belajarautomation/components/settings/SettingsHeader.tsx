import { Settings } from "lucide-react";

export default function SettingsHeader() {
  return (
    <section className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
        <Settings className="h-5 w-5" />
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Settings
        </h1>

        <p className="mt-1 text-muted-foreground">
          Kelola informasi akun dan preferensi kamu.
        </p>
      </div>
    </section>
  );
}