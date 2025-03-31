import BookingCalender from "@/components/session/calender";
import { Booking } from "@/types";
import React, { useState } from "react";
import BookedSession from "./bookedSession";
import SessionBookingForm from "@/components/forms/sessionBooking";
import { errorToast } from "@/utils/toastResposnse";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

const SessionBooking: React.FC = () => {
  const [bookedCalls, setBookedCalls] = useState<Booking[]>([]);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [selectedDateBookings, setSelectedDateBookings] = useState<Booking[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  const { getToken } = useAuth();

  const handleCancelBooking = (id: string): void => {
    setBookingToCancel(id);
    setIsModalOpen(true);
  };

  const confirmCancelBooking = () => {
    if (bookingToCancel) {
      const updatedBookings = bookedCalls.filter(
        (booking) => booking.id !== bookingToCancel
      );
      setBookedCalls(updatedBookings);
      setBookedDates(updatedBookings.map((booking) => booking.date));
      toast.success("Booking canceled successfully");
    }
    setIsModalOpen(false);
    setBookingToCancel(null);
  };

  const handleSubmit = async (values: {
    name: string;
    email: string;
    phone: string;
    selectedDate: string;
    selectedTime: string;
    description?: string;
  }) => {
    try {
      const { name, email, phone, selectedDate, selectedTime, description } =
        values;

      console.log(name, email, phone, selectedDate, selectedTime, description);

      const token = await getToken();
      if (!token) {
        toast.error("Please login to continue");
        return;
      }

      // const paymentData = {
      //   orderId: `#ASM-${Date.now()}`,
      //   totalAmount: 499,
      //   amount: 499,
      //   currency: "INR",
      //   productInfo: "Mentoons One-On-One Session",
      //   customerName:
      //     user?.firstName && user?.lastName
      //       ? `${user.firstName} ${user.lastName}`
      //       : user?.fullName || "Unknown",
      //   email: user?.emailAddresses?.[0]?.emailAddress || email,
      //   phone: user?.phoneNumbers?.[0]?.phoneNumber || phone,
      //   status: "PENDING",
      //   user: userId,
      //   items: [
      //     {
      //       name: "One-On-One Session",
      //       price: 499,
      //       quantity: 1,
      //       date: selectedDate,
      //       time: selectedTime,
      //       description: description || "No additional details provided",
      //     },
      //   ],
      //   orderStatus: "pending",
      //   paymentDetails: {
      //     paymentMethod: "credit_card",
      //     paymentStatus: "initiated",
      //   },
      //   bookingDetails: {
      //     name,
      //     email,
      //     phone,
      //     date: selectedDate,
      //     time: selectedTime,
      //     description: description || "No additional details provided",
      //   },
      //   sameAsShipping: true,
      // };

      // console.log("Initiating payment with:", paymentData);

      // const response = await axios.post(
      //   "https://mentoons-backend-zlx3.onrender.com/api/v1/payment/initiate",
      //   paymentData,
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      // const tempDiv = document.createElement("div");
      // tempDiv.innerHTML = response.data;

      // const form = tempDiv.querySelector("form");
      // if (form) {
      //   document.body.appendChild(form);
      //   form.submit();
      // } else {
      //   throw new Error("Payment form not found in response");
      // }

      toast.error(
        "Psychologists are currently unavailable. Please try again later."
      );
    } catch (error) {
      console.error("Payment error:", error);
      errorToast(
        error instanceof Error
          ? error.message
          : "Failed to process payment. Please try again later."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <BookedSession
        bookedCalls={bookedCalls}
        cancelBooking={handleCancelBooking}
        selectedDateBookings={selectedDateBookings}
      />

      <div className="w-2/3 p-8 space-y-8">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-xl mx-auto">
          <h1 className="text-5xl font-extrabold text-center text-orange-600 mb-4 font-akshar">
            Schedule Your Personalized One-on-One Call
          </h1>

          <p className="text-gray-700 text-lg text-center mb-6 font-inter leading-relaxed">
            Curious about your assessment results? Get a personalized, in-depth
            analysis and expert guidance tailored just for you. Book a
            one-on-one session now!
          </p>

          <div className="flex items-center justify-center gap-2 text-green-600 font-semibold text-2xl">
            <span>₹</span>
            <span>Rs 499/hr</span>
          </div>

          <SessionBookingForm handleSubmit={handleSubmit} />
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">
            Booked Dates Calendar
          </h2>
          <BookingCalender
            bookedCalls={bookedCalls}
            bookedDates={bookedDates}
            setSelectedDateBookings={setSelectedDateBookings}
          />
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Cancellation</h2>
            <p>Are you sure you want to cancel this booking?</p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                No
              </button>
              <button
                onClick={confirmCancelBooking}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionBooking;
