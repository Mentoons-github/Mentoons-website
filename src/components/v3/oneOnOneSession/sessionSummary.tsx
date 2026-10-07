import { Calendar, Clock, User, Video } from "lucide-react";
import { ReactNode } from "react";
import {
  SessionOption,
  addMinutes,
  formatDate,
  formatSlot,
} from "@/config/sessionConfig";
import { Psychologist } from "@/redux/sessionSlice";

interface SessionSummaryProps {
  selectedDate: string;
  selectedSlot: string;
  option: SessionOption;
  submitting: boolean;
  onBook: () => void;
  psychologist?: Psychologist | null;
  children?: ReactNode;
}

const SessionSummary = ({
  selectedDate,
  selectedSlot,
  option,
  submitting,
  onBook,
  psychologist,
  children,
}: SessionSummaryProps) => {
  return (
    <div className="space-y-4 lg:sticky lg:top-6">
      <div className="rounded-2xl border border-stone-200 bg-white p-5">
        <h2 className="mb-4 text-base font-semibold text-stone-900">
          Session Summary
        </h2>

        <div className="space-y-3 text-sm text-stone-700">
          <div className="flex items-center gap-2.5">
            <Calendar className="h-4 w-4 text-stone-400" />
            {selectedDate ? formatDate(selectedDate, "short") : "Select a date"}
          </div>
          <div className="flex items-center gap-2.5">
            <Clock className="h-4 w-4 text-stone-400" />
            {selectedSlot
              ? `${formatSlot(selectedSlot)} – ${formatSlot(
                  addMinutes(selectedSlot, option.minutes),
                )} (${option.minutes} minutes)`
              : "Select a slot"}
          </div>
          <div className="flex items-center gap-2.5">
            <Video className="h-4 w-4 text-stone-400" />
            Online (Google Meet)
          </div>
          <div className="flex items-center gap-2.5">
            <User className="h-4 w-4 text-stone-400" />
            <span>
              {psychologist ? psychologist.name : "Child Psychologist"}
              <span className="block text-xs text-stone-400">
                {psychologist
                  ? psychologist.department || "Psychologist"
                  : "Select a psychologist above"}
              </span>
            </span>
          </div>
        </div>

        <div className="my-4 border-t border-stone-200" />

        <div>
          <span className="text-sm text-stone-500">Price</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-semibold text-stone-900">
              ₹{option.price}
            </span>
          </div>
          <span className="text-xs text-stone-400">
            per session ({option.minutes} minutes)
          </span>
        </div>

        <p className="mt-3 text-xs text-stone-400">
          You'll be taken to a secure payment page next.
        </p>

        <button
          type="button"
          onClick={onBook}
          disabled={submitting}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-stone-900 py-3 text-sm font-medium text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Booking..." : "Book Slot"}
        </button>

        <p className="mt-3 text-center text-xs text-stone-400">
          By booking, you agree to our{" "}
          <a href="#" className="underline hover:text-stone-600">
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-stone-600">
            Privacy Policy
          </a>
          .
        </p>
      </div>

      {children}

      <div className="rounded-2xl border border-stone-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-stone-900">Need Help?</h3>
        <p className="mt-1 text-xs text-stone-500">
          Have questions or need assistance with booking?
        </p>
        <button
          type="button"
          className="mt-3 w-full rounded-lg border border-stone-200 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default SessionSummary;
