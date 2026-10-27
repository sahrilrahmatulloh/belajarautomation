import { Library } from "lucide-react";

export default function BooksHeader() {
  return (
    <section className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
        <Library className="h-5 w-5" />
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Books
        </h1>

        <p className="mt-1 text-muted-foreground">
          E-book praktis untuk meningkatkan skill QA Automation.
        </p>
      </div>
    </section>
  );
}