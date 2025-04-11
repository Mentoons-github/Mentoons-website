import { SessionDetails } from "@/redux/sessionSlice";
import { useSessionPostpone } from "@/utils/formik/sessionForm";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";

const PostPone = ({
  isModalOpen,
  setIsPostponeModal,
  postponeBooking,
}: {
  isModalOpen: boolean;
  setIsPostponeModal: (val: boolean) => void;
  postponeBooking: SessionDetails | null;
}) => {
  const { getToken } = useAuth();

  const [availabilityStatus, setAvailabilityStatus] = useState<string | null>(
    null
  );
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  const formik = useSessionPostpone((values, formik) => {
    formik.resetForm();
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  const checkAvailability = async () => {
    if (!formik.values.date || !formik.values.time) {
      setAvailabilityStatus("Please select both date and time first");
      return;
    }

    const token = await getToken();

    setIsCheckingAvailability(true);
    setAvailabilityStatus(null);

    try {
      const response = await axios.get(
        `https://mentoons-backend-zlx3.onrender.com/api/v1/sessionbookings/availability?time=${formik.values.time}&date=${formik.values.date}&state=${postponeBooking?.state}&sessionID=${postponeBooking?._id}&type=check`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("availability result: ", response.data);

      if (response.data?.isAvailable) {
        setAvailabilityStatus("✅ This slot is available");
      } else {
        setAvailabilityStatus("❌ This slot is not available");
      }
    } catch (error: unknown) {
      console.log(error);
      setAvailabilityStatus("Error checking availability");
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full m-4"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <h2 className="text-xl font-bold mb-4 text-blue-600 font-figtree">
              Postpone Session
            </h2>

            <div className="mb-5 p-3 bg-gray-50 rounded-lg font-outfit">
              <h3 className="font-semibold text-gray-700 mb-2 font-figtree">
                Current Schedule
              </h3>
              <div className="flex items-center mb-1">
                <span className="text-blue-500 mr-2">📅</span>
                <span>{formatDate(postponeBooking?.date || "")}</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-500 mr-2">🕒</span>
                <span>{formatTime(postponeBooking?.time || "")}</span>
              </div>
            </div>
            <motion.form onSubmit={formik.handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="postpone-date"
                  className="block text-sm font-medium text-gray-700 mb-1 font-firasans"
                >
                  New Date
                </label>
                <input
                  type="date"
                  id="postpone-date"
                  name="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  min={new Date().toISOString().split("T")[0]}
                />
                {formik.touched.date && formik.errors.date && (
                  <motion.p
                    className="text-red-500 text-sm mt-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {formik.errors.date}
                  </motion.p>
                )}
              </div>

              <div className="mb-6">
                <label
                  htmlFor="postpone-time"
                  className="block text-sm font-medium text-gray-700 mb-1 font-firasans"
                >
                  New Time
                </label>
                <input
                  type="time"
                  id="postpone-time"
                  name="time"
                  value={formik.values.time}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                {formik.touched.time && formik.errors.time && (
                  <motion.p
                    className="text-red-500 text-sm mt-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {formik.errors.time}
                  </motion.p>
                )}
              </div>

              <div className="mb-4 flex flex-col">
                <button
                  type="button"
                  onClick={checkAvailability}
                  className="text-blue-600 hover:text-blue-800 underline font-medium text-sm mb-2 self-start"
                  disabled={isCheckingAvailability}
                >
                  {isCheckingAvailability
                    ? "Checking..."
                    : "Check availability"}
                </button>

                {availabilityStatus && (
                  <motion.p
                    className={`text-sm mt-1 ${
                      availabilityStatus.includes("✅")
                        ? "text-green-600"
                        : availabilityStatus.includes("❌")
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {availabilityStatus}
                  </motion.p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsPostponeModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  disabled={
                    !formik.isValid || !formik.dirty || formik.isSubmitting
                  }
                >
                  <span className="mr-1">🕒</span> Postpone Session
                </button>
              </div>
            </motion.form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostPone;
