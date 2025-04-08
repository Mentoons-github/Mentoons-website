import BookingCalender from "@/components/session/calender";
import { Booking, Hiring } from "@/types";
import React, { useEffect, useState } from "react";
import BookedSession from "./bookedSession";
import SessionBookingForm from "@/components/forms/sessionBooking";
import { errorToast } from "@/utils/toastResposnse";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { HIRING } from "@/constant/constants";
import WeAreHiring from "@/components/assessment/weAreHiring";
import axios from "axios";

const SessionBooking: React.FC = () => {
  const [bookedCalls, setBookedCalls] = useState<Booking[]>([]);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [selectedDateBookings, setSelectedDateBookings] = useState<Booking[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [hiring, setHiring] = useState<Hiring[] | []>([]);

  const { user } = useUser();

  useEffect(() => {
    setHiring(HIRING);
  }, []);

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

      const paymentData = {
        orderId: `#ASM-${Date.now()}`,
        totalAmount: 499,
        amount: 499,
        currency: "INR",
        productInfo: "Mentoons One-On-One Session",
        customerName: name,
        email: email,
        phone: phone,
        status: "PENDING",
        user: user?.id,
        order_type: "consultancy_purchase",
        items: [
          {
            productName: "One-On-One Session",
            price: 499,
            quantity: 1,
            date: selectedDate,
            time: selectedTime,
            description: description || "No additional details provided",
          },
        ],
        orderStatus: "pending",
        paymentDetails: {
          paymentMethod: "credit_card",
          paymentStatus: "initiated",
        },
        bookingDetails: {
          name,
          email,
          phone,
          date: selectedDate,
          time: selectedTime,
          description: description || "No additional details provided",
        },
        sameAsShipping: true,
      };

      console.log("Initiating payment with:", paymentData);

      const response = await axios.post(
        "https://mentoons-backend-zlx3.onrender.com/api/v1/payment/initiate",
        paymentData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success === false) {
        toast.error(response.data.message || "Failed to initiate payment");
        return;
      }

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = response.data;

      const form = tempDiv.querySelector("form");
      if (form) {
        document.body.appendChild(form);
        form.submit();
      } else {
        throw new Error("Payment form not found in response");
      }
    } catch (error) {
      console.error("Payment error:", error);

      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message || "Failed to process payment";
        errorToast(errorMessage);

        if (
          error.response.status === 400 &&
          error.response.data.message?.includes(
            "psychologists are fully booked"
          )
        ) {
          toast.error(
            "All psychologists are fully booked at the selected date and time. Please choose another slot."
          );
        }
      } else {
        errorToast(
          error instanceof Error
            ? error.message
            : "Failed to process payment. Please try again later."
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="lg:hidden sticky top-0 z-20 bg-white p-4 shadow-md">
        <button
          onClick={() =>
            document
              .getElementById("bookedSessions")
              ?.classList.toggle("hidden")
          }
          className="flex items-center justify-between w-full p-2 bg-orange-50 rounded-lg"
        >
          <span className="font-semibold text-orange-500">
            View Booked Sessions
          </span>
          <span>↓</span>
        </button>

        <div id="bookedSessions" className="hidden mt-4">
          <BookedSession
            bookedCalls={bookedCalls}
            cancelBooking={handleCancelBooking}
            selectedDateBookings={selectedDateBookings}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="hidden lg:block lg:w-1/4 sticky top-0 h-screen">
          <BookedSession
            bookedCalls={bookedCalls}
            cancelBooking={handleCancelBooking}
            selectedDateBookings={selectedDateBookings}
          />
        </div>

        <div className="flex flex-col md:flex-row w-full lg:w-3/4">
          <div className="w-full md:w-2/3 p-4 md:p-8 space-y-8">
            <div className="bg-white shadow-lg rounded-lg p-4 md:p-8 max-w-xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-extrabold text-center text-orange-600 mb-4 font-akshar">
                Schedule Your Personalized One-on-One Call
              </h1>

              <p className="text-gray-700 text-base md:text-lg text-center mb-6 font-inter leading-relaxed">
                Curious about your assessment results? Get a personalized,
                in-depth analysis and expert guidance tailored just for you.
                Book a one-on-one session now!
              </p>

              <div className="flex items-center justify-center gap-2 text-green-600 font-semibold text-xl md:text-2xl">
                <span>₹</span>
                <span>Rs 499/hr</span>
              </div>

              <SessionBookingForm handleSubmit={handleSubmit} />
            </div>

            <div className="bg-white shadow-lg rounded-lg p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-blue-600">
                Booked Dates Calendar
              </h2>
              <BookingCalender
                bookedCalls={bookedCalls}
                bookedDates={bookedDates}
                setSelectedDateBookings={setSelectedDateBookings}
              />
            </div>
          </div>
          <div className="w-full md:w-1/3 p-3 flex flex-col justify-start items-center gap-6 md:gap-10">
            <WeAreHiring hiring={hiring} />
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full m-4">
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
