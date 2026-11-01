import { LucideIcon } from "lucide-react";

// Isi tab profil yang datanya belum tersedia.
export default function ProfilePlaceholder({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <section className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
        <Icon className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      </div>
      <h2 className="mt-3 font-semibold">{title}</h2>
      <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
    </section>
  );
}
