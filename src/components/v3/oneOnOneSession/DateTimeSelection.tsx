import {
  SessionDuration,
  formatSlot,
  SESSION_OPTIONS,
} from "@/config/sessionConfig";
import { SessionDetails, SlotAvailability } from "@/redux/sessionSlice";
import Calendar from "./calender";

interface DateTimeSectionProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  selectedSlot: string;
  onSelectSlot: (slot: string) => void;
  duration: SessionDuration;
  onSelectDuration: (duration: SessionDuration) => void;
  bookedCalls: SessionDetails[];
  dateError?: string;
  slotError?: string;
  slots: SlotAvailability[];
  slotsLoading: boolean;
}

const DateTimeSection = ({
  selectedDate,
  onSelectDate,
  selectedSlot,
  onSelectSlot,
  duration,
  onSelectDuration,
  dateError,
  slotError,
  slots,
  slotsLoading,
}: DateTimeSectionProps) => {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <h2 className="mb-3 text-base font-semibold text-stone-900">
        Pick Date & Time
      </h2>

      <div className="mb-4">
        <span className="mb-2 block text-sm font-medium text-stone-700">
          Session Duration
        </span>
        <div className="flex gap-2">
          {SESSION_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelectDuration(option.value)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                duration === option.value
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-200 text-stone-700 hover:bg-stone-50"
              }`}
            >
              {option.label} · ₹{option.price}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="shrink-0">
          <span className="mb-2 block text-sm font-medium text-stone-700">
            Date
          </span>
          <Calendar
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
            minDate={today}
            error={dateError}
          />
        </div>

        <div className="flex-1">
          <span className="mb-2 block text-sm font-medium text-stone-700">
            Available Slots (10 AM – 6 PM)
          </span>

          {slotsLoading ? (
            <p className="text-sm text-stone-400">Checking availability...</p>
          ) : slots.length === 0 ? (
            <p className="text-sm text-stone-400">
              Pick a date to see available slots.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => onSelectSlot(slot.time)}
                  className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                    selectedSlot === slot.time
                      ? "border-stone-900 bg-stone-900 text-white"
                      : slot.available
                        ? "border-stone-200 text-stone-700 hover:bg-stone-50"
                        : "cursor-not-allowed border-stone-100 bg-stone-50 text-stone-300 line-through"
                  }`}
                >
                  {formatSlot(slot.time)}
                </button>
              ))}
            </div>
          )}
          {slotError && (
            <p className="mt-1 text-xs text-red-500">{slotError}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateTimeSection;
