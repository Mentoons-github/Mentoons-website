import { useSessionForm } from "@/utils/formik/sessionForm";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios, { AxiosError } from "axios";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type HandleSubmit = (values: {
  name: string;
  email: string;
  phone: string;
  selectedDate: string;
  selectedTime: string;
  state: string;
  description?: string;
}) => void;

type IndianState = {
  name: string;
  state_code: string;
};

const SessionBookingForm = ({
  handleSubmit,
}: {
  handleSubmit: HandleSubmit;
}) => {
  const [indianStates, setInidanStates] = useState<IndianState[]>([]);
  const { getToken } = useAuth();
  const { user: clerkUser } = useUser();

  const formik = useSessionForm((values, formikHelpers) => {
    handleSubmit(values);
    formikHelpers.resetForm();
  });

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/states",
          {
            country: "India",
          }
        );

        const stateDetail = response.data.data.states;

        const states: IndianState[] = stateDetail.map(
          (state: IndianState) => state
        );

        console.table(states);
        setInidanStates(states);
      } catch (error: unknown) {
        console.error("error in fetching states :", error);
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.msg || "Failed to fetch states.");
        } else {
          toast.error("Something went wrong");
        }
      }
    };

    fetchStates();
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const token = await getToken();
      if (!clerkUser?.id || !token) {
        toast.error("User not authenticated");
        return null;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_PROD_URL}/user/user/${clerkUser?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        return response.data.data;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to fetch user data");
      return null;
    }
  }, [getToken, clerkUser]);
  // Initialize form with user data
  useEffect(() => {
    const initializeForm = async () => {
      const userData = await fetchUser();
      if (userData) {
        formik.setValues({
          ...formik.values,
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phoneNumber || "",
        });
      }
    };

    if (clerkUser) {
      initializeForm();
    }
  }, [clerkUser, fetchUser]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.02,
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    },
    tap: { scale: 0.98 },
  };

  return (
    <motion.form
      onSubmit={formik.handleSubmit}
      className="p-6 mt-8 space-y-6 bg-white shadow-lg rounded-2xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2"
        variants={itemVariants}
      >
        <div className="group">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-700 transition-colors duration-200 font-inter group-focus-within:text-blue-600"
          >
            <span className="inline-block transition-transform duration-200 transform group-hover:scale-110">
              👤
            </span>{" "}
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-blue-500"
              initial={{ width: 0 }}
              whileInView={{ width: formik.values.name ? "100%" : 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>
          {formik.touched.name && formik.errors.name && (
            <motion.p
              className="mt-1 text-sm text-red-500"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {formik.errors.name}
            </motion.p>
          )}
        </div>

        <div className="group">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-700 transition-colors duration-200 font-inter group-focus-within:text-blue-600"
          >
            <span className="inline-block transition-transform duration-200 transform group-hover:scale-110">
              ✉️
            </span>{" "}
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-blue-500"
              initial={{ width: 0 }}
              whileInView={{ width: formik.values.email ? "100%" : 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <motion.p
              className="mt-1 text-sm text-red-500"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {formik.errors.email}
            </motion.p>
          )}
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2"
        variants={itemVariants}
      >
        <div className="group">
          <label
            htmlFor="phone"
            className="block mb-2 text-sm font-medium text-gray-700 transition-colors duration-200 font-inter group-focus-within:text-blue-600"
          >
            <span className="inline-block transition-transform duration-200 transform group-hover:scale-110">
              📞
            </span>{" "}
            Phone Number
          </label>
          <div className="relative">
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-blue-500"
              initial={{ width: 0 }}
              whileInView={{ width: formik.values.phone ? "100%" : 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>
          {formik.touched.phone && formik.errors.phone && (
            <motion.p
              className="mt-1 text-sm text-red-500"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {formik.errors.phone}
            </motion.p>
          )}
        </div>

        <div className="group">
          <label
            htmlFor="selectedDate"
            className="block mb-2 text-sm font-medium text-gray-700 transition-colors duration-200 font-inter group-focus-within:text-blue-600"
          >
            <span className="inline-block transition-transform duration-200 transform group-hover:scale-110">
              📅
            </span>{" "}
            Select Date
          </label>
          <div className="relative">
            <input
              type="date"
              id="selectedDate"
              name="selectedDate"
              value={formik.values.selectedDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              min={new Date().toISOString().split("T")[0]}
            />
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-blue-500"
              initial={{ width: 0 }}
              whileInView={{ width: formik.values.selectedDate ? "100%" : 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>
          {formik.touched.selectedDate && formik.errors.selectedDate && (
            <motion.p
              className="mt-1 text-sm text-red-500"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {formik.errors.selectedDate}
            </motion.p>
          )}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label
          htmlFor="selectedTime"
          className="block mb-2 text-sm font-medium text-gray-700 transition-colors duration-200 font-inter group-focus-within:text-blue-600"
        >
          <span className="inline-block transition-transform duration-200 transform group-hover:scale-110">
            🕒
          </span>{" "}
          Select Time
        </label>
        <div className="relative">
          <input
            type="time"
            id="selectedTime"
            name="selectedTime"
            value={formik.values.selectedTime}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            step="900"
          />
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-blue-500"
            initial={{ width: 0 }}
            whileInView={{ width: formik.values.selectedTime ? "100%" : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>
        {formik.touched.selectedTime && formik.errors.selectedTime && (
          <motion.p
            className="mt-1 text-sm text-red-500"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {formik.errors.selectedTime}
          </motion.p>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label
          htmlFor="state"
          className="block mb-2 text-sm font-medium text-gray-700 transition-colors duration-200 font-inter group-focus-within:text-blue-600"
        >
          <span className="inline-block transition-transform duration-200 transform group-hover:scale-110">
            🏙️
          </span>{" "}
          Select State
        </label>
        <div className="relative">
          <select
            id="state"
            name="state"
            value={formik.values.state || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-3 transition-all duration-200 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="" disabled>
              Select your state
            </option>
            {indianStates.map((state) => (
              <option key={state.state_code} value={state.state_code}>
                {state.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-blue-500"
            initial={{ width: 0 }}
            whileInView={{ width: formik.values.state ? "100%" : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>
        {formik.touched.state && formik.errors.state && (
          <motion.p
            className="mt-1 text-sm text-red-500"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {formik.errors.state}
          </motion.p>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label
          htmlFor="description"
          className="block mb-2 text-sm font-medium text-gray-700 transition-colors duration-200 font-inter group-focus-within:text-blue-600"
        >
          <span className="inline-block transition-transform duration-200 transform group-hover:scale-110">
            ✏️
          </span>{" "}
          Additional Details (Optional)
        </label>
        <div className="relative">
          <textarea
            id="description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Any specific topics or concerns you'd like to discuss?"
          />
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-blue-500"
            initial={{ width: 0 }}
            whileInView={{ width: formik.values.description ? "100%" : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>
        {formik.touched.description && formik.errors.description && (
          <motion.p
            className="mt-1 text-sm text-red-500"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {formik.errors.description}
          </motion.p>
        )}
      </motion.div>

      <motion.div variants={itemVariants}>
        <motion.button
          type="submit"
          className="relative w-full py-4 overflow-hidden text-lg font-medium text-white transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl font-mulish"
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ scale: 0, opacity: 0.3 }}
            whileHover={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
          <motion.span
            className="relative z-10 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Book Your Session
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </motion.span>
        </motion.button>
      </motion.div>
    </motion.form>
  );
};

export default SessionBookingForm;
