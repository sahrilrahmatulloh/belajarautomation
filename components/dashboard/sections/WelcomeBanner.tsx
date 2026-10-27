import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WelcomeBanner() {
  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card p-8 text-card-foreground shadow-sm">
      <div className="grid items-center gap-8 lg:grid-cols-2">
        {/* Left */}
        <div>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            👋 Selamat Datang
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-tight text-foreground">
            Belajar QA Automation
            <br />
            dari Nol hingga Siap Kerja.
          </h1>

          <p className="mt-4 max-w-xl text-muted-foreground">
            Kuasai Selenium, Playwright, Appium, API Testing, Git, CI/CD, hingga
            membangun Automation Framework dengan roadmap yang terstruktur.
          </p>

          <div className="mt-8 flex gap-4">
            <Button className="rounded-xl">
              <BookOpen className="mr-2 h-4 w-4" />
              Mulai Belajar
            </Button>

            <Button variant="outline" className="rounded-xl">
              Roadmap
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Right */}
        <div className="flex justify-center">
          <div className="flex h-72 w-72 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
            <span className="text-7xl">👨‍💻</span>
          </div>
        </div>
      </div>
    </section>
  );
}