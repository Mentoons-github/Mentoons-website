import { Position } from "@/components/assessment/weAreHiring";
import { applyForJob } from "@/redux/careerSlice";
import { uploadFile } from "@/redux/fileUploadSlice";
import { AppDispatch } from "@/redux/store";
import { useJobForm } from "@/utils/formik/jobAplpyForm";
import { useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  Check,
  Edit3,
  FileText,
  Link,
  Loader,
  Mail,
  Phone,
  Send,
  Upload,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ResumeSubmissionModal = ({
  setIsOpen,
  position,
}: {
  setIsOpen: (val: boolean) => void;
  position: Position;
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentState, setCurrentState] = useState(0);
  const [isLoading, setIsloading] = useState(false);
  const loadingStatus = [
    "Started Uploading",
    "File Uploading",
    "Verifying data",
    "Please upload resume",
    "Failed to Submit Data",
  ];
  const { getToken } = useAuth();

  const formik = useJobForm(async (values) => {
    setIsloading(true);
    setCurrentState(0);
    const token = await getToken();
    if (!token) {
      navigate("/sign-in");
      return toast.error("Login first to apply");
    }
    if (!values.resume) {
      setCurrentState(3);
      return toast.error("Please upload a resume.");
    }

    setCurrentState(1);
    const fileAction = await dispatch(
      uploadFile({
        file: values.resume,
        getToken: async () => token,
      })
    );

    const fileUrl = fileAction.payload?.data?.fileDetails.url;
    if (!fileUrl) {
      setCurrentState(3);
      return toast.error("Failed to upload resume");
    }

    setCurrentState(2);

    const res = await dispatch(
      applyForJob({
        jobId: position._id,
        formData: { ...values, resume: fileUrl },
      })
    );
    if (res.payload?.success) {
      setIsloading(false);
      toast.success("Application submitted successfully");
      setIsSuccess(true);
    } else {
      setCurrentState(4);
      toast.error(res.payload?.message || "Failed to submit application");
    }
  });

  const gradientStyle = "bg-gradient-to-r from-red-600 to-orange-500";
  const successStyle = "bg-gradient-to-r from-green-500 to-green-600";
  const errorStyle = "bg-gradient-to-r from-red-500 to-red-600";
  const inputVariants = {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    focus: { boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" },
  };

  const isErrorMessage =
    loadingStatus[currentState] === "Please upload resume" ||
    loadingStatus[currentState] === "Failed to Submit Data";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="relative w-full max-w-3xl overflow-hidden bg-white border-t-4 border-yellow-500 shadow-2xl rounded-xl"
      >
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="absolute z-10 p-1 text-gray-600 bg-white rounded-full shadow-md top-4 right-4 hover:text-black"
          onClick={() => setIsOpen(false)}
        >
          <X size={20} />
        </motion.button>
        <div
          className={`${gradientStyle} p-4 text-white relative overflow-hidden`}
        >
          <motion.div
            className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 bg-white rounded-full opacity-10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "easeInOut",
            }}
          />
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-start gap-2 text-xl font-bold text-white text-start"
          >
            <FileText size={20} />
            Submit Your Resume for{" "}
            <span className="text-[#FFD700]">{position.position}</span>
          </motion.h2>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-1 text-xs text-yellow-100"
          >
            Complete the form below to apply
          </motion.p>
        </div>
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-8"
          >
            <motion.div
              animate={
                isErrorMessage
                  ? { scale: [0.9, 1.1, 1] }
                  : {
                      rotate: 360,
                      borderRadius: ["25%", "50%", "25%"],
                    }
              }
              transition={
                isErrorMessage
                  ? {
                      scale: { duration: 0.5, type: "spring" },
                    }
                  : {
                      rotate: { repeat: Infinity, duration: 2, ease: "linear" },
                      borderRadius: {
                        repeat: Infinity,
                        duration: 1,
                        ease: "easeInOut",
                      },
                    }
              }
              className={`w-20 h-20 ${
                isErrorMessage
                  ? errorStyle
                  : "bg-gradient-to-r from-blue-500 to-purple-600"
              } flex items-center justify-center mb-6 shadow-lg rounded-lg`}
            >
              {isErrorMessage ? (
                <X size={32} className="text-white" />
              ) : (
                <Loader size={32} className="text-white animate-pulse" />
              )}
            </motion.div>

            <h3
              className={`text-xl font-semibold ${
                isErrorMessage ? "text-red-600" : "text-gray-800"
              } mb-2`}
            >
              {isErrorMessage
                ? "Error Occurred"
                : "Processing Your Application"}
            </h3>

            {!isErrorMessage && (
              <motion.div className="w-full h-2 max-w-md mb-4 overflow-hidden bg-gray-100 rounded-full">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${(currentState + 1) * 33}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                />
              </motion.div>
            )}

            <motion.div
              key={currentState}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`text-center flex items-center gap-2 ${
                isErrorMessage ? "text-red-600" : "text-gray-600"
              }`}
            >
              {isErrorMessage && (
                <AlertCircle size={16} className="text-red-600" />
              )}
              <span>{loadingStatus[currentState]}</span>
            </motion.div>

            <div className="mt-6 text-sm text-center text-gray-500">
              {isErrorMessage ? (
                <>
                  <p>
                    Please try again or contact support if the issue persists.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsloading(false)}
                    className="px-4 py-2 mt-4 text-white transition bg-blue-600 rounded-lg shadow hover:bg-blue-700"
                  >
                    Go Back
                  </motion.button>
                </>
              ) : (
                <>
                  <p>
                    Please don't close this window while we process your
                    application.
                  </p>
                  <p>This may take a few moments.</p>
                </>
              )}
            </div>
          </motion.div>
        ) : isSuccess ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ type: "spring", damping: 8, stiffness: 100 }}
              className={`w-16 h-16 ${successStyle} rounded-full flex items-center justify-center mb-4 shadow-lg text-white`}
            >
              <Check size={32} />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-800">
              Submission Successful!
            </h3>
            <p className="mt-2 text-gray-600">
              Thank you for your application. We'll review it shortly.
            </p>
            <NavLink
              to="/hiring"
              className="inline-block px-4 py-2 mt-4 text-white transition bg-blue-600 rounded-lg shadow hover:bg-blue-700"
            >
              View Other Openings
            </NavLink>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full max-w-md p-5 mt-8 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <h4 className="flex items-center justify-center gap-2 text-lg font-semibold text-gray-800">
                <Phone size={18} className="text-blue-600" />
                Contact Us
              </h4>
              <div className="h-px my-3 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <p className="text-sm text-gray-600">
                Have questions? We're here to help!
              </p>

              <div className="flex flex-col gap-3 mt-4">
                <a
                  href="tel:9036033300"
                  className="flex items-center gap-3 p-2 transition rounded-md hover:bg-blue-50 group"
                >
                  <div className="flex items-center justify-center w-10 h-10 transition bg-blue-100 rounded-full group-hover:bg-blue-200">
                    <Phone size={18} className="text-blue-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Phone</span>
                    <span className="font-medium text-gray-800">
                      9036033300
                    </span>
                  </div>
                </a>

                <a
                  href="mailto:info@mentoons.com"
                  className="flex items-center gap-3 p-2 transition rounded-md hover:bg-blue-50 group"
                >
                  <div className="flex items-center justify-center w-10 h-10 transition bg-blue-100 rounded-full group-hover:bg-blue-200">
                    <Mail size={18} className="text-blue-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Email</span>
                    <span className="font-medium text-gray-800">
                      info@mentoons.com
                    </span>
                  </div>
                </a>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="p-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <motion.div
                initial="initial"
                animate="animate"
                transition={{ delay: 0.2 }}
                variants={inputVariants}
              >
                <label
                  htmlFor="name"
                  className="flex items-center block mb-1 text-sm font-medium text-gray-700"
                >
                  <User size={14} className="mr-1 text-red-500" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {formik.errors.name}
                  </p>
                )}
              </motion.div>

              <motion.div
                initial="initial"
                animate="animate"
                transition={{ delay: 0.3 }}
                variants={inputVariants}
              >
                <label
                  htmlFor="gender"
                  className="flex items-center block mb-1 text-sm font-medium text-gray-700"
                >
                  <Calendar size={14} className="mr-1 text-orange-500" />
                  Gender
                </label>
                <select
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {formik.touched.gender && formik.errors.gender && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {formik.errors.gender}
                  </p>
                )}
              </motion.div>

              <motion.div
                initial="initial"
                animate="animate"
                transition={{ delay: 0.4 }}
                variants={inputVariants}
              >
                <label
                  htmlFor="email"
                  className="flex items-center block mb-1 text-sm font-medium text-gray-700"
                >
                  <Mail size={14} className="mr-1 text-yellow-500" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {formik.errors.email}
                  </p>
                )}
              </motion.div>

              <motion.div
                initial="initial"
                animate="animate"
                transition={{ delay: 0.5 }}
                variants={inputVariants}
              >
                <label
                  htmlFor="phone"
                  className="flex items-center block mb-1 text-sm font-medium text-gray-700"
                >
                  <Phone size={14} className="mr-1 text-blue-500" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {formik.errors.phone}
                  </p>
                )}
              </motion.div>

              <motion.div
                initial="initial"
                animate="animate"
                transition={{ delay: 0.6 }}
                variants={inputVariants}
              >
                <label
                  htmlFor="portfolioLink"
                  className="flex items-center block mb-1 text-sm font-medium text-gray-700"
                >
                  <Link size={14} className="mr-1 text-purple-500" />
                  Portfolio Link
                </label>
                <input
                  type="url"
                  name="portfolioLink"
                  value={formik.values.portfolioLink}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  placeholder="https://your-portfolio.com"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                />
                {formik.touched.portfolioLink &&
                  formik.errors.portfolioLink && (
                    <p className="text-red-500 text-xs mt-0.5">
                      {formik.errors.portfolioLink}
                    </p>
                  )}
              </motion.div>

              <motion.div
                initial="initial"
                animate="animate"
                transition={{ delay: 0.65 }}
                variants={inputVariants}
              >
                <label
                  htmlFor="coverLetterLink"
                  className="flex items-center block mb-1 text-sm font-medium text-gray-700"
                >
                  <FileText size={14} className="mr-1 text-indigo-500" />
                  Cover Letter Link
                </label>
                <input
                  type="url"
                  name="coverLetterLink"
                  value={formik.values.coverLetterLink}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  placeholder="https://drive.google.com/your-cover-letter"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                />
                {formik.touched.coverLetterLink &&
                  formik.errors.coverLetterLink && (
                    <p className="text-red-500 text-xs mt-0.5">
                      {formik.errors.coverLetterLink}
                    </p>
                  )}
              </motion.div>

              <motion.div
                initial="initial"
                animate="animate"
                transition={{ delay: 0.7 }}
                variants={inputVariants}
                className="col-span-2"
              >
                <label
                  htmlFor="coverNote"
                  className="flex items-center block mb-1 text-sm font-medium text-gray-700"
                >
                  <Edit3 size={14} className="mr-1 text-green-500" />
                  Cover Note
                </label>
                <textarea
                  name="coverNote"
                  value={formik.values.coverNote}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  rows={2}
                  placeholder="Tell us why you're interested in this position..."
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                ></textarea>
                {formik.touched.coverNote && formik.errors.coverNote && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {formik.errors.coverNote}
                  </p>
                )}
              </motion.div>

              <motion.div
                initial="initial"
                animate="animate"
                transition={{ delay: 0.75 }}
                variants={inputVariants}
                className="col-span-2"
              >
                <label
                  htmlFor="resume"
                  className="flex items-center block mb-1 text-sm font-medium text-gray-700"
                >
                  <FileText size={14} className="mr-1 text-blue-500" />
                  Resume (PDF)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf"
                    name="resume"
                    required
                    className="hidden"
                    id="resume-file"
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0];
                      if (file) {
                        formik.setFieldValue("resume", file);
                      }
                    }}
                    onBlur={formik.handleBlur}
                  />
                  <label
                    htmlFor="resume-file"
                    className={`flex items-center justify-center w-full p-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-gray-50 ${
                      formik.values.resume ? "border-green-500 bg-green-50" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {formik.values.resume ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring" }}
                        >
                          <Check size={18} className="text-green-500" />
                        </motion.div>
                      ) : (
                        <Upload size={18} className="text-gray-500" />
                      )}
                      <span
                        className={`text-sm ${
                          formik.values.resume
                            ? "text-green-600 font-medium"
                            : "text-gray-500"
                        }`}
                      >
                        {formik.values.resume
                          ? formik.values.resume.name
                          : "Click to upload PDF resume"}
                      </span>
                    </div>
                  </label>
                </div>
                {formik.touched.resume && formik.errors.resume && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {formik.errors.resume}
                  </p>
                )}
              </motion.div>
            </div>

            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0 5px 10px -3px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              type="submit"
              disabled={formik.isSubmitting}
              className={`mt-4 w-full py-2 px-4 bg-blue-500 text-white rounded-lg font-medium flex items-center justify-center disabled:opacity-70 shadow-md text-sm`}
            >
              {formik.isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                    className="mr-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  </motion.div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={16} className="mr-2" />
                  Submit Application
                </>
              )}
            </motion.button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ResumeSubmissionModal;
