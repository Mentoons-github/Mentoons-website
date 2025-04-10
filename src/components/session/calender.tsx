import { SessionDetails } from "@/redux/sessionSlice";
import React, { useState, useEffect } from "react";

interface BookingCalendarProps {
  bookedDates: string[];
  bookedCalls: SessionDetails[];
  setSelectedDate: (val: string) => void;
  setSelectedDateBookings: React.Dispatch<
    React.SetStateAction<SessionDetails[]>
  >;
}

const BookingCalender: React.FC<BookingCalendarProps> = ({
  bookedDates,
  setSelectedDate,
  bookedCalls,
  setSelectedDateBookings,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const sendEmailReminder = (booking: SessionDetails): void => {
    console.log(
      `Sending reminder email to ${booking.email} for booking on ${booking.date}`
    );
    alert(
      `Reminder email sent to ${booking.email} for the booking on ${booking.date}`
    );
  };

  useEffect(() => {
    const checkUpcomingBookings = () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      bookedCalls.forEach((booking: SessionDetails) => {
        const bookingDate = new Date(booking.date);
        if (
          bookingDate.getFullYear() === tomorrow.getFullYear() &&
          bookingDate.getMonth() === tomorrow.getMonth() &&
          bookingDate.getDate() === tomorrow.getDate()
        ) {
          sendEmailReminder(booking);
        }
      });
    };

    const reminderInterval = setInterval(
      checkUpcomingBookings,
      24 * 60 * 60 * 1000
    );
    checkUpcomingBookings();
    return () => clearInterval(reminderInterval);
  }, [bookedCalls]);

  const handleDateClick = (clickedDate: string) => {
    const bookingsOnDay = bookedCalls.filter(
      (booking) =>
        new Date(booking.date).toISOString().split("T")[0] === clickedDate
    );
    setSelectedDateBookings(bookingsOnDay);
    setSelectedDate(clickedDate);
  };

  const goToPreviousMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const generateCalendar = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const startDay = new Date(currentYear, currentMonth, 1).getDay();

    const normalizedBookedDates = bookedDates.map(
      (date) => new Date(date).toISOString().split("T")[0]
    );

    const calendar = [];
    for (let i = 0; i < startDay; i++) {
      calendar.push(<div key={`empty-${i}`} className="h-20"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(currentYear, currentMonth, day);
      const dateString = dayDate.toISOString().split("T")[0];
      const isBooked = normalizedBookedDates.includes(dateString);

      const bookingsOnDay = bookedCalls.filter(
        (booking) =>
          new Date(booking.date).toISOString().split("T")[0] === dateString
      );

      calendar.push(
        <div
          key={day}
          className={`relative border p-2 rounded-lg flex items-center justify-center flex-col cursor-pointer transition-all duration-150 ${
            isBooked ? "bg-orange-100 border-orange-400" : "bg-white"
          } hover:bg-orange-200`}
          onClick={() => handleDateClick(dateString)}
        >
          <span className="font-semibold text-lg">{day}</span>

          <div className="flex flex-wrap justify-center gap-1 mt-1">
            {bookingsOnDay.map((booking, index) => (
              <span
                key={index}
                className={`text-[10px] px-1 py-[1px] rounded-full font-semibold uppercase ${
                  booking.status?.toLowerCase() === "booked"
                    ? "bg-green-100 text-green-700"
                    : booking.status?.toLowerCase() === "completed"
                    ? "bg-blue-100 text-blue-700"
                    : booking.status?.toLowerCase() === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : booking.status?.toLowerCase() === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : booking.status?.toLowerCase() === "aborted"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {booking.status}
              </span>
            ))}
          </div>
        </div>
      );
    }

    return calendar;
  };

  return (
    <div className="min-h-fit bg-gradient-to-br from-sky-100 via-white to-green-100 flex relative overflow-hidden border shadow-xl">
      <div className="w-full relative z-10">
        <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-lg p-2 sm:p-4 md:p-6">
          <div className="flex justify-between items-center mb-2 sm:mb-4">
            <button
              onClick={goToPreviousMonth}
              className="text-blue-600 hover:bg-blue-100 p-1 sm:p-2 rounded-full transition-all text-xs sm:text-sm md:text-base"
            >
              <span className="hidden sm:inline">◀️ Previous</span>
              <span className="sm:hidden">◀️</span>
            </button>
            <h2 className="text-base sm:text-xl md:text-2xl font-bold text-blue-600 truncate px-1">
              {currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <button
              onClick={goToNextMonth}
              className="text-blue-600 hover:bg-blue-100 p-1 sm:p-2 rounded-full transition-all text-xs sm:text-sm md:text-base"
            >
              <span className="hidden sm:inline">Next ▶️</span>
              <span className="sm:hidden">▶️</span>
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <div
                key={day + index}
                className="font-bold text-gray-600 text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][index]}
                </span>
                <span className="sm:hidden">{day}</span>
              </div>
            ))}
            {generateCalendar()}
          </div>
          <div className="mt-2 sm:mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-200 rounded"></div>
              <span className="text-xs sm:text-sm text-gray-600">Booked</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-300 rounded-full"></div>
              <span className="text-xs sm:text-sm text-gray-600">
                Completed
              </span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-300 rounded-full"></div>
              <span className="text-xs sm:text-sm text-gray-600">Pending</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-300 rounded-full"></div>
              <span className="text-xs sm:text-sm text-gray-600">
                Cancelled / Aborted
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalender;
