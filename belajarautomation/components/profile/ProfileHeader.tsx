import { CalendarDays, MapPin } from "lucide-react";

export default function ProfileHeader() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        {/* Avatar */}
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
          SR
        </div>

        {/* Information */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Sahril Rahmatulloh
          </h1>

          <p className="mt-1 text-muted-foreground">
            QA Automation Engineer
          </p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Indonesia
            </span>

            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Bergabung Juli 2026
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}