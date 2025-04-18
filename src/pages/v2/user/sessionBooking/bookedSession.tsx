import React, { useEffect, useState } from "react";
import { SessionDetails } from "@/redux/sessionSlice";

type BookedSessionProps = {
  bookedCalls: SessionDetails[];
  postponeBooking: (data: SessionDetails) => void;
  selectedDateBookings: SessionDetails[];
  loading: boolean;
  error: string | null;
};

const BookedSession: React.FC<BookedSessionProps> = ({
  selectedDateBookings,
  bookedCalls,
  postponeBooking,
  loading,
  error,
}) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const updateNowAtMidnight = () => {
      const current = new Date();
      const nextMidnight = new Date(
        current.getFullYear(),
        current.getMonth(),
        current.getDate() + 1,
        0,
        0,
        0,
        0
      );
      const timeoutMs = nextMidnight.getTime() - current.getTime();

      const midnightTimeout = setTimeout(() => {
        setNow(new Date());
        setInterval(() => setNow(new Date()), 24 * 60 * 60 * 1000);
      }, timeoutMs);

      return () => clearTimeout(midnightTimeout);
    };

    updateNowAtMidnight();
  }, []);

  const formatDateTime = (dateStr: string, timeStr: string) => {
    const combinedDateTime = new Date(`${dateStr.split("T")[0]}T${timeStr}`);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(combinedDateTime);
  };

  const isToday = (dateStr: string) => {
    const sessionDate = new Date(dateStr);
    return (
      now.getFullYear() === sessionDate.getFullYear() &&
      now.getMonth() === sessionDate.getMonth() &&
      now.getDate() === sessionDate.getDate()
    );
  };

  const isCompleted = (dateStr: string, timeStr: string) => {
    const combined = new Date(`${dateStr.split("T")[0]}T${timeStr}`);
    return combined.getTime() < now.getTime();
  };

  const allBookings = (
    selectedDateBookings.length > 0 ? selectedDateBookings : bookedCalls
  ).filter((booking) => booking.status === "booked");

  const upcomingSessions = allBookings.filter(
    (booking) => !isCompleted(booking.date, booking.time)
  );

  const completedSessions = allBookings.filter((booking) =>
    isCompleted(booking.date, booking.time)
  );

  const renderCard = (
    booking: SessionDetails,
    isOver: boolean,
    showTodayTag: boolean
  ) => {
    const baseClass =
      "relative p-3 lg:p-4 rounded-lg shadow-sm transition-all duration-300";
    const statusClass = isOver
      ? "bg-gray-100 text-gray-400 opacity-70"
      : "bg-gray-50";

    return (
      <div key={booking._id} className={`${baseClass} ${statusClass}`}>
        <div className="flex justify-between items-start mb-2 z-20 relative">
          <div>
            <p className="font-semibold text-base lg:text-lg">{booking.name}</p>
            <p className="text-xs lg:text-sm">{booking.email}</p>
            <p className="text-xs lg:text-sm">{booking.phone}</p>
          </div>
          {booking.status !== "cancelled" && (
            <button
              onClick={() => postponeBooking(booking)}
              className="text-red-500 hover:bg-red-50 p-1 lg:p-2 rounded-full"
            >
              {booking.status}
              Postpone Session
            </button>
          )}
        </div>
        <div className="flex items-center text-xs lg:text-sm space-x-2 z-20 relative">
          <span>📅</span>
          <span>{formatDateTime(booking.date, booking.time)}</span>
        </div>
        {booking.description && (
          <div className="mt-2 text-xs lg:text-sm italic z-20 relative">
            <p>Notes: {booking.description}</p>
          </div>
        )}
        {showTodayTag && !isOver && (
          <div className="absolute bottom-2 right-3 bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium shadow z-20">
            Today’s Session
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-white p-4 lg:p-6 lg:border-r overflow-y-auto max-h-96 lg:max-h-screen lg:sticky lg:top-0">
      <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6 text-orange-500 font-akshar">
        Booked Sessions
      </h2>

      {loading && (
        <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm">
            Please wait, Bookings are loading...
          </p>
        </div>
      )}

      {error && !loading && (
        <p className="text-gray-600 font-inter italic">⚠️ {error}</p>
      )}

      {!loading && !error && allBookings.length === 0 && (
        <p className="text-gray-500 font-inter">No bookings are found</p>
      )}

      {!loading && !error && allBookings.length > 0 && (
        <div className="space-y-3 lg:space-y-4">
          {[...upcomingSessions, ...completedSessions].map((booking) => {
            const showTodayTag = isToday(booking.date);
            const sessionIsOver = isCompleted(booking.date, booking.time);
            return renderCard(booking, sessionIsOver, showTodayTag);
          })}
        </div>
      )}
    </div>
  );
};

export default BookedSession;
