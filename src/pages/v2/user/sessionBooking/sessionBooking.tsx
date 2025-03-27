import React, { useState, useEffect, FormEvent } from "react";

interface Booking {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  status: string;
  description?: string;
}

const SessionBooking: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [bookedCalls, setBookedCalls] = useState<Booking[]>([]);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [selectedDateBookings, setSelectedDateBookings] = useState<Booking[]>(
    []
  );

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const newBooking: Booking = {
      id: Date.now(),
      name,
      email,
      phone,
      date: selectedDate,
      time: selectedTime,
      status: "Confirmed",
      description: description || "No additional details provided",
    };

    setBookedCalls((prevBookings) => [...prevBookings, newBooking]);

    setBookedDates((prevDates) => [...prevDates, selectedDate]);

    setName("");
    setEmail("");
    setPhone("");
    setSelectedDate("");
    setSelectedTime("");
    setDescription("");
  };

  const cancelBooking = (id: number): void => {
    const updatedBookings = bookedCalls.filter((booking) => booking.id !== id);
    setBookedCalls(updatedBookings);

    const updatedDates = updatedBookings.map((booking) => booking.date);
    setBookedDates(updatedDates);
  };

  const handleDateClick = (clickedDate: string) => {
    const bookingsOnDay = bookedCalls.filter(
      (booking) => booking.date === clickedDate
    );
    setSelectedDateBookings(bookingsOnDay);
  };

  const generateCalendar = () => {
    const calendar: JSX.Element[] = [];
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      calendar.push(<div key={`empty-${i}`} className="p-2 bg-gray-50"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day)
        .toISOString()
        .split("T")[0];
      const bookingsOnDay = bookedCalls.filter(
        (booking) => booking.date === currentDate
      );
      const isBooked = bookedDates.includes(currentDate);

      calendar.push(
        <div
          key={day}
          onClick={() => handleDateClick(currentDate)}
          className={`p-2 text-center rounded relative cursor-pointer ${
            isBooked
              ? "bg-blue-100 text-blue-800 font-bold"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {day}
          {bookingsOnDay.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500"></div>
          )}
          {bookingsOnDay.length > 0 && (
            <div
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 
                         flex items-center justify-center text-xs"
            >
              {bookingsOnDay.length}
            </div>
          )}
        </div>
      );
    }

    return calendar;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-1/3 bg-white p-6 border-r overflow-y-auto max-h-screen sticky top-0">
        <h2 className="text-2xl font-bold mb-6 text-orange-500 font-akshar">
          {selectedDateBookings.length > 0
            ? `Bookings on ${selectedDateBookings[0].date}`
            : "Booked Calls"}
        </h2>
        {selectedDateBookings.length === 0 && bookedCalls.length === 0 ? (
          <p className="text-gray-500 font-inter">No booked calls yet</p>
        ) : (
          <div className="space-y-4">
            {(selectedDateBookings.length > 0
              ? selectedDateBookings
              : bookedCalls
            ).map((booking) => (
              <div
                key={booking.id}
                className="bg-gray-50 p-4 rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-lg">{booking.name}</p>
                    <p className="text-sm text-gray-600">{booking.email}</p>
                    <p className="text-sm text-gray-600">{booking.phone}</p>
                  </div>
                  <button
                    onClick={() => cancelBooking(booking.id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-full"
                  >
                    ✖
                  </button>
                </div>
                <div className="flex items-center text-sm text-gray-600 space-x-2">
                  <span>📅</span>
                  <span>{booking.date}</span>
                  <span>🕒</span>
                  <span>{booking.time}</span>
                </div>
                {booking.description && (
                  <div className="mt-2 text-sm text-gray-700 italic">
                    <p>Notes: {booking.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-2/3 p-8">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-orange-600 mb-6 font-akshar">
            Book a One-on-One Call
          </h1>

          <div className="text-center mb-6">
            <p className="text-gray-700 text-md mb-4 font-inter">
              Want to find out a detailed report of your assessment and get the
              right guidance? Book a one-on-one session with us!
            </p>
            <div className="flex items-center justify-center gap-2 text-green-600 font-semibold text-2xl">
              <span>💲</span>
              <span>Rs 499/hr</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                👤 Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                ✉️ Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                📞 Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                📅 Select Date
              </label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                🕒 Select Time
              </label>
              <input
                type="time"
                id="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Additional Details (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Any specific topics or concerns you'd like to discuss?"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-500 text-white py-3 rounded-md hover:bg-yellow-700 transition duration-300"
            >
              Book Your Session
            </button>
          </form>
        </div>

        <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">
            Booked Dates Calendar
          </h2>
          <div className="grid grid-cols-7 gap-2 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="font-bold text-gray-600">
                {day}
              </div>
            ))}
            {generateCalendar()}
          </div>
          <div className="mt-4 flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 rounded"></div>
              <span className="text-sm text-gray-600">Available Days</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Bookings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionBooking;
