import SessionBookingForm from "@/components/forms/sessionBooking";
import BookingCalender from "@/components/session/calender";
import { fetchSessions, SessionDetails } from "@/redux/sessionSlice";
import { Hiring } from "@/types";
import { useAuth, useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BookedSession from "./bookedSession";

import WeAreHiring from "@/components/assessment/weAreHiring";
import PostPone from "@/components/common/modal/postPone";
import SelectedDateBookings from "@/components/session/selectedBookings";
import { HIRING } from "@/constant/constants";
import { AppDispatch, RootState } from "@/redux/store";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

const SessionBooking: React.FC = () => {
  const [bookedCalls, setBookedCalls] = useState<SessionDetails[]>([]);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateBookings, setSelectedDateBookings] = useState<
    SessionDetails[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingToPostpone, setBookingToPostpone] =
    useState<SessionDetails | null>(null);
  const [hiring, setHiring] = useState<Hiring[] | []>([]);

  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const { error, loading, sessions } = useSelector(
    (root: RootState) => root.session
  );

  const { user } = useUser();

  useEffect(() => {
    setHiring(HIRING);

    const fetchData = async () => {
      const token = await getToken();
      if (token) {
        dispatch(fetchSessions(token));
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (sessions && sessions.length > 0) {
      setBookedCalls(sessions);
      setBookedDates(sessions.map((session) => session.date));
    }
  }, [sessions]);

  const { getToken } = useAuth();

  const handlePostponeBooking = (data: SessionDetails): void => {
    setBookingToPostpone(data);
    setIsModalOpen(true);
  };

  const showErrorModal = (message: string) => {
    setErrorMessage(message);
    setErrorModalOpen(true);
  };

  const handleSubmit = async (values: {
    name: string;
    email: string;
    phone: string;
    selectedDate: string;
    state: string;
    selectedTime: string;
    description?: string;
  }) => {
    try {
      const {
        name,
        email,
        phone,
        selectedDate,
        selectedTime,
        description,
        state,
      } = values;

      const token = await getToken();
      if (!token) {
        showErrorModal("Please login to continue");
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
            price: 1,
            quantity: 1,
            date: selectedDate,
            time: selectedTime,
            description: description || "No additional details provided",
            state,
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
          state,
        },
        sameAsShipping: true,
      };

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

      console.log("response data :", response.data);

      if (!response.data) {
        showErrorModal(response.data.message || "Failed to initiate payment");
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

        if (
          error.response.status === 400 &&
          error.response.data.message?.includes(
            "psychologists are fully booked"
          )
        ) {
          showErrorModal(
            "All psychologists are fully booked at the selected date and time. Please choose another slot."
          );
        } else {
          showErrorModal(errorMessage);
        }
      } else {
        showErrorModal(
          error instanceof Error
            ? error.message
            : "Failed to process payment. Please try again later."
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="sticky top-0 z-20 p-4 bg-white shadow-md lg:hidden">
        <button
          onClick={() =>
            document
              .getElementById("bookedSessions")
              ?.classList.toggle("hidden")
          }
          className="flex items-center justify-between w-full p-2 rounded-lg bg-orange-50"
        >
          <span className="font-semibold text-orange-500">
            View Booked Sessions
          </span>
          <span>↓</span>
        </button>

        <div id="bookedSessions" className="hidden mt-4">
          <BookedSession
            error={error}
            loading={loading}
            bookedCalls={bookedCalls}
            postponeBooking={handlePostponeBooking}
            selectedDateBookings={selectedDateBookings}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="sticky hidden h-screen lg:block lg:w-1/4 top-20">
          <BookedSession
            error={error}
            loading={loading}
            bookedCalls={bookedCalls}
            postponeBooking={handlePostponeBooking}
            selectedDateBookings={selectedDateBookings}
          />
        </div>

        <div className="flex flex-col w-full md:flex-row lg:w-3/4">
          <div className="w-full p-4 space-y-8 md:w-2/3 md:p-8">
            <div className="max-w-xl p-4 mx-auto bg-white rounded-lg shadow-lg md:p-8">
              <h1 className="mb-4 text-3xl font-extrabold text-center text-orange-600 md:text-5xl font-akshar">
                Schedule Your Personalized One-on-One Call
              </h1>

              <p className="mb-6 text-base leading-relaxed text-center text-gray-700 md:text-lg font-inter">
                Curious about your assessment results? Get a personalized,
                in-depth analysis and expert guidance tailored just for you.
                Book a one-on-one session now!
              </p>

              <div className="flex items-center justify-center gap-2 text-xl font-semibold text-green-600 md:text-2xl">
                <span>₹</span>
                <span>Rs 499/hr</span>
              </div>

              <SessionBookingForm handleSubmit={handleSubmit} />
            </div>

            <div className="p-4 bg-white rounded-lg shadow-lg md:p-6">
              <h2 className="mb-4 text-xl font-bold text-blue-600 md:text-2xl">
                Booked Dates Calendar
              </h2>
              <BookingCalender
                bookedCalls={bookedCalls}
                bookedDates={bookedDates}
                setSelectedDateBookings={setSelectedDateBookings}
                setSelectedDate={setSelectedDate}
              />
            </div>
          </div>
          <div className="flex flex-col-reverse items-center justify-start w-full gap-6 p-3 md:w-1/3 md:flex-col md:gap-10">
            <WeAreHiring hiring={hiring} />
            {selectedDate && (
              <div className="w-full md:sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
                <SelectedDateBookings
                  date={selectedDate}
                  bookings={selectedDateBookings}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <PostPone
        isModalOpen={isModalOpen}
        setIsPostponeModal={setIsModalOpen}
        postponeBooking={bookingToPostpone}
      />

      <AnimatePresence>
        {errorModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setErrorModalOpen(false)}
          >
            <motion.div
              className="w-full max-w-md p-6 m-4 bg-white rounded-lg shadow-xl"
              initial={{ scale: 0.5, y: -50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: -50, opacity: 0 }}
              transition={{
                type: "spring",
                damping: 15,
                stiffness: 150,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center mb-5">
                <motion.div
                  className="flex items-center justify-center w-20 h-20 rounded-full bg-amber-100"
                  initial={{ rotate: 0, scale: 0.5 }}
                  animate={{
                    rotate: [0, -10, 10, -10, 10, 0],
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.8,
                    times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                    type: "spring",
                  }}
                >
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 text-amber-600"
                    viewBox="0 0 24 24"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      stroke="currentColor"
                      fill="none"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </motion.svg>
                </motion.div>
              </div>
              <motion.h2
                className="mb-3 text-2xl font-bold text-center text-amber-600"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Oops!
              </motion.h2>
              <motion.p
                className="mb-6 text-center text-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {errorMessage}
              </motion.p>
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <button
                  onClick={() => setErrorModalOpen(false)}
                  className="flex items-center gap-2 px-6 py-2 text-white transition-all rounded-lg shadow-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                >
                  <span>Dismiss</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SessionBooking;
