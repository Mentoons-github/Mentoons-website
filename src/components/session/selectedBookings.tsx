import React from "react";
import { SessionDetails } from "@/redux/sessionSlice";

interface SelectedBookingsProps {
  bookings: SessionDetails[];
  date: string;
  scrollToBookingForm?: () => void;
}

const SelectedDateBookings: React.FC<SelectedBookingsProps> = ({
  bookings,
  date,
  scrollToBookingForm,
}) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Time unavailable";
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "booked":
        return "bg-green-100 text-green-800 border border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border border-red-300";
      default:
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
    }
  };
  const handleBookAgain = () => {
    if (scrollToBookingForm) {
      scrollToBookingForm();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        const nameInput = document.getElementById("name");
        if (nameInput) {
          nameInput.focus();
        }
      }, 500);
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="p-6 text-center bg-white rounded-xl border border-gray-200 shadow-sm">
        <p className="text-lg font-semibold text-gray-600">
          No bookings on{" "}
          <span className="text-blue-600">{formatDate(date)}</span>
        </p>
        <p className="text-sm mt-2 text-gray-400">
          Try selecting another date to see other sessions.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm mt-10 w-full">
      <h3 className="text-xl font-bold text-blue-700 mb-5">
        Bookings for <span className="underline">{formatDate(date)}</span>
      </h3>

      <div className="space-y-4">
        {bookings.map((booking, index) => (
          <div
            key={index}
            className="border border-gray-100 rounded-lg p-4 bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-200"
          >
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h4 className="text-md font-semibold text-gray-800">
                  {booking.name}
                </h4>
                <p className="text-sm text-gray-500">{booking.email}</p>
                <p className="text-sm text-gray-400">
                  Time: {formatTime(booking.date)}
                </p>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full font-semibold capitalize ${getStatusStyle(
                  booking.status
                )}`}
              >
                {booking.status}
              </span>
            </div>

            {(booking.status === "cancelled" ||
              booking.status === "aborted") && (
              <div className="mt-3 text-right">
                <button
                  onClick={handleBookAgain}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Book Again
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedDateBookings;
