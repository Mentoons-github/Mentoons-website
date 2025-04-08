import { Booking } from "@/types";
import React, { useState, useEffect } from "react";

interface BookingCalendarProps {
  bookedDates: string[];
  bookedCalls: Booking[];
  setSelectedDateBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
}

const BookingCalender: React.FC<BookingCalendarProps> = ({
  bookedDates,
  bookedCalls,
  setSelectedDateBookings,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const sendEmailReminder = (booking: Booking): void => {
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

      bookedCalls.forEach((booking: Booking) => {
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
      (booking) => booking.date === clickedDate
    );
    setSelectedDateBookings(bookingsOnDay);
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
    const calendar: JSX.Element[] = [];
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      calendar.push(
        <div key={`empty-${i}`} className="p-1 sm:p-2 bg-sky-50"></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDateString = new Date(year, month, day)
        .toISOString()
        .split("T")[0];
      const bookingsOnDay = bookedCalls.filter(
        (booking) => booking.date === currentDateString
      );
      const isBooked = bookedDates.includes(currentDateString);
      const isPastDate = new Date(year, month, day) < new Date();
      const isCompletedBooking = bookingsOnDay.some(
        (booking) => booking.status === "Completed"
      );

      calendar.push(
        <div
          key={day}
          onClick={() => handleDateClick(currentDateString)}
          className={`p-1 sm:p-2 text-center rounded relative cursor-pointer transition-all duration-300 hover:scale-105 ${
            isBooked
              ? "bg-yellow-100 text-yellow-800 font-bold"
              : "bg-green-100 text-green-600"
          } ${isPastDate ? "opacity-50" : ""}`}
        >
          <span className="text-xs sm:text-sm md:text-base">{day}</span>
          {bookingsOnDay.length > 0 && (
            <div
              className={`absolute bottom-0 left-0 right-0 h-1 ${
                isCompletedBooking ? "bg-green-500" : "bg-rainbow"
              }`}
            ></div>
          )}
          {bookingsOnDay.length > 0 && (
            <div
              className="absolute top-0 right-0 bg-rainbow text-white rounded-full w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 
                         flex items-center justify-center text-xs animate-bounce"
            >
              <span className="text-xxs sm:text-xs">
                {bookingsOnDay.length}
              </span>
            </div>
          )}
          {isCompletedBooking && (
            <div
              className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full w-3 h-3 sm:w-4 sm:h-4 
                         flex items-center justify-center"
            >
              <span className="text-xxs sm:text-xs">✓</span>
            </div>
          )}
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
              <span className="text-xs sm:text-sm text-gray-600">
                Available
              </span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-rainbow rounded-full"></div>
              <span className="text-xs sm:text-sm text-gray-600">Bookings</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full"></div>
              <span className="text-xs sm:text-sm text-gray-600">
                Completed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalender;
