import { useSessionForm } from "@/utils/formik/sessionForm";
import { motion } from "framer-motion";

type HandleSubmit = (values: {
  name: string;
  email: string;
  phone: string;
  selectedDate: string;
  selectedTime: string;
  description?: string;
}) => void;

const SessionBookingForm = ({
  handleSubmit,
}: {
  handleSubmit: HandleSubmit;
}) => {
  const formik = useSessionForm((values, formikHelpers) => {
    handleSubmit(values);
    formikHelpers.resetForm();
  });

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
      className="space-y-6 mt-8 p-6 bg-white rounded-2xl shadow-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        variants={itemVariants}
      >
        <div className="group">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2 font-inter group-focus-within:text-blue-600 transition-colors duration-200"
          >
            <span className="inline-block transform transition-transform group-hover:scale-110 duration-200">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
              className="text-red-500 text-sm mt-1"
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
            className="block text-sm font-medium text-gray-700 mb-2 font-inter group-focus-within:text-blue-600 transition-colors duration-200"
          >
            <span className="inline-block transform transition-transform group-hover:scale-110 duration-200">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
              className="text-red-500 text-sm mt-1"
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
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        variants={itemVariants}
      >
        <div className="group">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-2 font-inter group-focus-within:text-blue-600 transition-colors duration-200"
          >
            <span className="inline-block transform transition-transform group-hover:scale-110 duration-200">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
              className="text-red-500 text-sm mt-1"
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
            className="block text-sm font-medium text-gray-700 mb-2 font-inter group-focus-within:text-blue-600 transition-colors duration-200"
          >
            <span className="inline-block transform transition-transform group-hover:scale-110 duration-200">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
              className="text-red-500 text-sm mt-1"
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
          className="block text-sm font-medium text-gray-700 mb-2 font-inter group-focus-within:text-blue-600 transition-colors duration-200"
        >
          <span className="inline-block transform transition-transform group-hover:scale-110 duration-200">
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
            className="text-red-500 text-sm mt-1"
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
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2 font-inter group-focus-within:text-blue-600 transition-colors duration-200"
        >
          <span className="inline-block transform transition-transform group-hover:scale-110 duration-200">
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
            className="text-red-500 text-sm mt-1"
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
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-mulish font-medium text-lg transition-all duration-300 overflow-hidden relative"
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
              className="h-5 w-5"
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
