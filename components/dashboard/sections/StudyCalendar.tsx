"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { getActivityByDaysAgo } from "@/lib/activity";

interface CalendarDate {
  year: number;
  month: number;
  day: number;
}

const weekdays = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

function getJakartaDate(): CalendarDate {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date());
  const getPart = (type: string) => Number(parts.find((part) => part.type === type)?.value);

  return {
    year: getPart("year"),
    month: getPart("month") - 1,
    day: getPart("day"),
  };
}

function dateKey({ year, month, day }: CalendarDate) {
  return `${year}-${month}-${day}`;
}

// Mengubah "N hari sebelum hari ini" menjadi tanggal kalender.
function getActivityByDate(today: CalendarDate) {
  const days = new Map<string, { count: number; xp: number }>();
  for (const [daysAgo, activity] of getActivityByDaysAgo()) {
    const date = new Date(Date.UTC(today.year, today.month, today.day - daysAgo, 12));
    days.set(
      dateKey({ year: date.getUTCFullYear(), month: date.getUTCMonth(), day: date.getUTCDate() }),
      activity
    );
  }
  return days;
}

function selectedDateSummary(date: CalendarDate, activity?: { count: number; xp: number }) {
  const label = new Date(Date.UTC(date.year, date.month, date.day, 12)).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
  if (!activity) return `${label}: tidak ada aktivitas belajar.`;
  return `${label}: ${activity.count} aktivitas${activity.xp > 0 ? `, +${activity.xp} XP` : ""}.`;
}

export default function StudyCalendar() {
  const [today] = useState(getJakartaDate);
  const [displayedMonth, setDisplayedMonth] = useState(
    () => new Date(Date.UTC(today.year, today.month, 1, 12)),
  );
  const [selectedDate, setSelectedDate] = useState(today);
  const [activityByDate] = useState(() => getActivityByDate(today));

  const year = displayedMonth.getUTCFullYear();
  const month = displayedMonth.getUTCMonth();
  const monthLabel = displayedMonth.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const firstWeekday = (new Date(Date.UTC(year, month, 1, 12)).getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0, 12)).getUTCDate();
  const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

  const shiftMonth = (offset: number) => {
    setDisplayedMonth(new Date(Date.UTC(year, month + offset, 1, 12)));
  };

  return (
    <section
      aria-labelledby="study-calendar-title"
      className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="study-calendar-title" className="text-lg font-bold">
          Kalender Belajar
        </h2>
        <Link
          href="/profile?tab=aktivitas"
          className="inline-flex min-h-9 items-center gap-1 text-sm font-medium text-primary-accent hover:underline"
        >
          Aktivitas <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          aria-label="Bulan sebelumnya"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <p className="font-semibold capitalize">{monthLabel}</p>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          aria-label="Bulan berikutnya"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-y-1 text-center">
        {weekdays.map((weekday) => (
          <span key={weekday} className="py-2 text-xs font-medium text-muted-foreground">
            {weekday}
          </span>
        ))}

        {Array.from({ length: cellCount }, (_, index) => {
          const dayOffset = index - firstWeekday + 1;
          const date = new Date(Date.UTC(year, month, dayOffset, 12));
          const dateParts = {
            year: date.getUTCFullYear(),
            month: date.getUTCMonth(),
            day: date.getUTCDate(),
          };
          const inCurrentMonth = dateParts.month === month;
          const isToday =
            dateParts.year === today.year &&
            dateParts.month === today.month &&
            dateParts.day === today.day;
          const isSelected =
            dateParts.year === selectedDate.year &&
            dateParts.month === selectedDate.month &&
            dateParts.day === selectedDate.day;
          const hasActivity = activityByDate.has(dateKey(dateParts));
          const dateLabel = date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "UTC",
          });

          return (
            <button
              key={`${dateParts.year}-${dateParts.month}-${dateParts.day}`}
              type="button"
              aria-label={hasActivity ? `${dateLabel}, ada aktivitas belajar` : dateLabel}
              aria-pressed={isSelected}
              onClick={() => {
                if (!inCurrentMonth) {
                  setDisplayedMonth(new Date(Date.UTC(dateParts.year, dateParts.month, 1, 12)));
                }
                setSelectedDate(dateParts);
              }}
              className={`relative mx-auto flex h-8 w-full max-w-8 items-center justify-center rounded-md text-sm transition-colors ${
                isSelected
                  ? "bg-primary font-semibold text-primary-foreground shadow-sm"
                  : isToday
                    ? "border border-primary/40 font-semibold text-primary-accent"
                    : inCurrentMonth
                      ? "text-foreground hover:bg-accent"
                      : "text-muted-foreground hover:bg-accent"
              }`}
            >
              {dateParts.day}
              {hasActivity && (
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${
                    isSelected ? "bg-primary-foreground" : inCurrentMonth ? "bg-primary" : "bg-primary/50"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-3 space-y-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
        <p aria-live="polite" className="font-medium text-foreground">
          {selectedDateSummary(selectedDate, activityByDate.get(dateKey(selectedDate)))}
        </p>
        <p className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-primary" />
          Hari dengan aktivitas belajar
        </p>
      </div>
    </section>
  );
}
