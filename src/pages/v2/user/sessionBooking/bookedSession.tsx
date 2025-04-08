import { Booking } from "@/types";

type BookedSessionProps = {
  bookedCalls: Booking[];
  cancelBooking: (id: string) => void;
  selectedDateBookings: Booking[];
};

const BookedSession: React.FC<BookedSessionProps> = ({
  selectedDateBookings,
  bookedCalls,
  cancelBooking,
}) => {
  return (
    <div className="w-full bg-white p-4 lg:p-6 lg:border-r overflow-y-auto max-h-96 lg:max-h-screen lg:sticky lg:top-0">
      <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6 text-orange-500 font-akshar">
        {selectedDateBookings.length > 0
          ? `Bookings on ${selectedDateBookings[0].date}`
          : "Booked Sessions"}
      </h2>

      {selectedDateBookings.length === 0 && bookedCalls.length === 0 ? (
        <p className="text-gray-500 font-inter">No booked sessions yet</p>
      ) : (
        <div className="space-y-3 lg:space-y-4">
          {(selectedDateBookings.length > 0
            ? selectedDateBookings
            : bookedCalls
          ).map((booking: Booking) => (
            <div
              key={booking.id}
              className="bg-gray-50 p-3 lg:p-4 rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-base lg:text-lg">
                    {booking.name}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-600">
                    {booking.email}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-600">
                    {booking.phone}
                  </p>
                </div>
                <button
                  onClick={() => cancelBooking(booking.id)}
                  className="text-red-500 hover:bg-red-50 p-1 lg:p-2 rounded-full"
                >
                  ✖
                </button>
              </div>
              <div className="flex items-center text-xs lg:text-sm text-gray-600 space-x-2">
                <span>📅</span>
                <span>{booking.date}</span>
                <span>🕒</span>
                <span>{booking.time}</span>
              </div>
              {booking.description && (
                <div className="mt-2 text-xs lg:text-sm text-gray-700 italic">
                  <p>Notes: {booking.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookedSession;
