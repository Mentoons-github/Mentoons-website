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
    <div className="w-1/4 bg-white p-6 border-r overflow-y-auto max-h-screen sticky top-0">
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
          ).map((booking: Booking) => (
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
  );
};

export default BookedSession;
