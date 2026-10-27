import { FlaskConical } from "lucide-react";

export default function PlaygroundHeader() {
  return (
    <section>
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <FlaskConical className="h-5 w-5" />
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            QA Automation Playground
          </h1>

          <p className="mt-1 text-muted-foreground">
            Latih skill QA dan automation melalui challenge interaktif.
          </p>
        </div>
      </div>
    </section>
  );
}