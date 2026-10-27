const progressItems = [
  {
    title: "QA Automation Engineer",
    progress: 38,
  },
  {
    title: "Playwright",
    progress: 65,
  },
  {
    title: "Mobile Automation",
    progress: 20,
  },
];

export default function LearningProgress() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <h2 className="text-xl font-bold">
        Learning Progress
      </h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Progress belajar dan roadmap yang sedang kamu jalankan.
      </p>

      <div className="mt-6 space-y-6">
        {progressItems.map((item) => (
          <div key={item.title}>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium">
                {item.title}
              </span>

              <span className="text-sm text-muted-foreground">
                {item.progress}%
              </span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${item.progress}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}