import { useState } from "react";

interface CalendarProps {
  selectedDate: string; // "YYYY-MM-DD"
  onSelectDate: (date: string) => void;
  minDate?: string; // "YYYY-MM-DD" — defaults to today
  maxDate?: string; // "YYYY-MM-DD"
  error?: string;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const toKey = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const Calendar = ({
  selectedDate,
  onSelectDate,
  minDate,
  maxDate,
  error,
}: CalendarProps) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const min = minDate ? new Date(`${minDate}T00:00:00`) : today;
  const max = maxDate ? new Date(`${maxDate}T00:00:00`) : undefined;

  const initialView = selectedDate
    ? new Date(`${selectedDate}T00:00:00`)
    : today;
  const [viewYear, setViewYear] = useState(initialView.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialView.getMonth());

  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++)
    cells.push(new Date(viewYear, viewMonth, d));

  const canGoPrev = () => new Date(viewYear, viewMonth, 0) >= min;

  const goPrev = () => {
    if (!canGoPrev()) return;
    const prev = new Date(viewYear, viewMonth - 1, 1);
    setViewYear(prev.getFullYear());
    setViewMonth(prev.getMonth());
  };

  const goNext = () => {
    const next = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const isDisabled = (date: Date) => {
    if (date < min) return true;
    if (max && date > max) return true;
    return false;
  };

  const monthLabel = firstOfMonth.toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="mx-auto w-full max-w-[260px] rounded-lg border border-stone-200 p-2">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={!canGoPrev()}
          aria-label="Previous month"
          className="rounded px-1.5 py-0.5 text-xs text-stone-600 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-30"
        >
          ‹
        </button>
        <span className="text-xs font-medium text-stone-900">{monthLabel}</span>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next month"
          className="rounded px-1.5 py-0.5 text-xs text-stone-600 hover:bg-stone-100"
        >
          ›
        </button>
      </div>

      <div className="mb-0.5 grid grid-cols-7 gap-0.5 text-center text-[10px] font-medium text-stone-400">
        {WEEKDAYS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((date, idx) => {
          if (!date) return <span key={`empty-${idx}`} className="h-7 w-7" />;
          const key = toKey(date);
          const disabled = isDisabled(date);
          const isSelected = key === selectedDate;
          const isToday = key === toKey(today);

          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              onClick={() => onSelectDate(key)}
              aria-label={date.toDateString()}
              aria-pressed={isSelected}
              className={`h-7 w-7 rounded text-[11px] font-medium transition-colors ${
                isSelected
                  ? "bg-stone-900 text-white"
                  : disabled
                    ? "cursor-not-allowed text-stone-300"
                    : "text-stone-700 hover:bg-stone-100"
              } ${isToday && !isSelected ? "ring-1 ring-stone-300" : ""}`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Calendar;
