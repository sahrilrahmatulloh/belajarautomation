"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

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

export default function StudyCalendar() {
  const [today] = useState(getJakartaDate);
  const [displayedMonth, setDisplayedMonth] = useState(
    () => new Date(Date.UTC(today.year, today.month, 1, 12)),
  );
  const [selectedDate, setSelectedDate] = useState(today);

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
          href="/profile"
          className="inline-flex min-h-9 items-center gap-1 text-sm font-medium text-primary hover:underline"
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

          return (
            <button
              key={`${dateParts.year}-${dateParts.month}-${dateParts.day}`}
              type="button"
              aria-label={date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              })}
              aria-pressed={isSelected}
              onClick={() => {
                if (!inCurrentMonth) {
                  setDisplayedMonth(new Date(Date.UTC(dateParts.year, dateParts.month, 1, 12)));
                }
                setSelectedDate(dateParts);
              }}
              className={`mx-auto flex h-8 w-full max-w-8 items-center justify-center rounded-md text-sm transition-colors ${
                isSelected
                  ? "bg-primary font-semibold text-primary-foreground shadow-sm"
                  : isToday
                    ? "border border-primary/40 font-semibold text-primary"
                    : inCurrentMonth
                      ? "text-foreground hover:bg-accent"
                      : "text-muted-foreground/50 hover:bg-accent"
              }`}
            >
              {dateParts.day}
            </button>
          );
        })}
      </div>

      <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
        Aktivitas belajar belum tersimpan, jadi kalender ini belum menandai hari belajar.
      </p>
    </section>
  );
}
