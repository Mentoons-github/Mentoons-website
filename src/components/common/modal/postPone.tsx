import { Psychologist, SessionDetails } from "@/redux/sessionSlice";
import { useSessionPostpone } from "@/utils/formik/sessionForm";
import axios, { AxiosError } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
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
  const [updateComplete, setUpdateComplete] = useState(false);
  const [isPostponing, setIsPostponing] = useState(false);
  const [updatedSessionData, setUpdatedSessionData] =
    useState<SessionDetails | null>(null);
  const [psychologistData, setPsychologistData] = useState<Psychologist | null>(
    null
  );

  const formik = useSessionPostpone(async (values, formik) => {
    console.log(values);
    const token = await getToken();

    console.log("making api call");
    setIsPostponing(true);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PROD_URL}/sessionbookings/postpone?time=${
          values.time
        }&date=${values.date}&state=${postponeBooking?.state}&sessionID=${
          postponeBooking?._id
        }&type=update`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("response after update : ", response.data);

      if (response.data?.success) {
        console.log("Postpone successful:", response.data);
        setUpdatedSessionData(response.data.updatedSession);
        setPsychologistData(response.data.updatedSession.psychologistId);
        setUpdateComplete(true);
      } else {
        console.log("Postpone failed:", response.data.message);
      }
    } catch (error) {
      console.error("Postpone error:", error);
    } finally {
      setIsPostponing(false);
      formik.setSubmitting(false);
    }
  });

  useEffect(() => {
    if (availabilityStatus !== null) {
      setAvailabilityStatus(null);
    }
  }, [formik.values.date, formik.values.time]);

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

    console.log("postponed booking :", postponeBooking);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PROD_URL}/sessionbookings/postpone?time=${
          formik.values.time
        }&date=${formik.values.date}&state=${
          postponeBooking?.state
        }&sessionID=${postponeBooking?._id}&type=check`,
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
      if (error instanceof AxiosError) {
        const isAvailable = error.response?.data?.isAvailable;

        if (isAvailable === false) {
          setAvailabilityStatus("❌ This slot is not available");
        } else {
          setAvailabilityStatus("Error checking availability");
        }
      } else {
        setAvailabilityStatus("Error checking availability");
      }
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const closeSuccessModal = () => {
    setUpdateComplete(false);
    setIsPostponeModal(false);
  };

  const LoadingSpinner = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-700 font-medium">Postponing session...</p>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isModalOpen && !updateComplete && !isPostponing && (
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
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {availabilityStatus}
                  </motion.p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
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

      {isPostponing && <LoadingSpinner />}

      {updateComplete && updatedSessionData && (
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
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold ml-2 text-green-600 font-figtree">
                Session Postponed Successfully!
              </h2>
            </div>

            <div className="border-t border-b py-4 mb-5">
              <h3 className="font-semibold text-gray-800 mb-3 font-figtree">
                Updated Session Details
              </h3>

              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{updatedSessionData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{updatedSessionData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{updatedSessionData.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium capitalize">
                      {updatedSessionData.status}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-gray-700 font-medium mb-2">New Schedule</h4>
                <div className="flex items-center mb-1">
                  <span className="text-blue-500 mr-2">📅</span>
                  <span>{formatDate(updatedSessionData.date || "")}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-500 mr-2">🕒</span>
                  <span>{formatTime(updatedSessionData.time || "")}</span>
                </div>
              </div>

              {psychologistData && (
                <div className="mt-4">
                  <h4 className="text-gray-700 font-medium mb-2">
                    Psychologist Details
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="text-blue-500 mr-2">👩‍⚕️</span>
                      <span className="font-medium">
                        {psychologistData.name}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Department</p>
                        <p>{psychologistData.department}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Location</p>
                        <p>
                          {psychologistData.place?.city},{" "}
                          {psychologistData.place?.state}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={closeSuccessModal}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostPone;
