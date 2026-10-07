export const SLOT_VALUES = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "16:00",
  "16:30",
  "17:00",
];

export const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const AGE_OPTIONS = Array.from({ length: 15 }, (_, i) => i + 4);

export const parseDateKey = (key: string) => {
  if (!key) return null;
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const toMinutes = (value: string) => {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
};

export type SessionDuration = "30min" | "1hr";

export interface SessionOption {
  value: SessionDuration;
  label: "30 Minutes" | "1 Hour";
  minutes: number;
  price: number;
}

export const SESSION_OPTIONS: SessionOption[] = [
  {
    value: "30min",
    label: "30 Minutes",
    minutes: 30,
    price: 499,
  },
  {
    value: "1hr",
    label: "1 Hour",
    minutes: 60,
    price: 899,
  },
];

export const SLOT_START_HOUR = 10;
export const SLOT_END_HOUR = 18;

export const toDateKey = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const addMinutes = (time: string, minutes: number) => {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = Math.floor((total / 60) % 24);
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};

export const formatSlot = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
};

export const formatDate = (
  dateStr: string,
  style: "short" | "long" = "long",
) => {
  const date = new Date(dateStr);
  if (style === "short") {
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const generateDaySlots = (durationMinutes: number): string[] => {
  const slots: string[] = [];
  const startTotal = SLOT_START_HOUR * 60;
  const endTotal = SLOT_END_HOUR * 60;

  for (
    let t = startTotal;
    t + durationMinutes <= endTotal;
    t += durationMinutes
  ) {
    const hh = Math.floor(t / 60);
    const mm = t % 60;
    slots.push(`${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`);
  }

  return slots;
};
