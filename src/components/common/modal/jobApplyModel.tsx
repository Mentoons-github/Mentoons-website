import { useState } from "react";
import { motion } from "framer-motion";
import { useJobForm } from "@/utils/formik/jobAplpyForm";
import { applyForJob } from "@/redux/careerSlice";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import {
  Upload,
  Send,
  Check,
  X,
  FileText,
  Mail,
  Phone,
  User,
  Calendar,
} from "lucide-react";
import { uploadFile } from "@/redux/fileUploadSlice";

const ResumeSubmissionModal = ({
  setIsOpen,
  position,
}: {
  setIsOpen: (val: boolean) => void;
  position: string;
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isSuccess, setIsSuccess] = useState(false);

  const { getToken } = useAuth();

  const formik = useJobForm(async (values) => {
    console.log("form Submitted : ", values);
    const token = await getToken();
    if (!token) {
      navigate("/sign-in");
      return toast.error("Login first to apply");
    }
    if (!values.resume) {
      return toast.error("Please upload a resume.");
    }

    const fileAction = await dispatch(
      uploadFile({
        file: values.resume,
        getToken: async () => token,
      })
    );
    const fileUrl = fileAction.payload?.data?.fileDetails.url;
    if (!fileUrl) {
      return toast.error("Failed to upload resume");
    }

    const res = await dispatch(
      applyForJob({
        jobId: "",
        formData: { ...values, resume: fileUrl },
      })
    );

    if (res.payload?.success) {
      toast.success("Application submitted successfully");
      setIsSuccess(true);
    } else {
      toast.error(res.payload?.message || "Failed to submit application");
    }
  });

  const gradientStyle = "bg-gradient-to-r from-red-600 to-orange-500";

  const successStyle = "bg-gradient-to-r from-green-500 to-green-600";

  const inputVariants = {
    initial: { x: -50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    focus: { boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md relative overflow-hidden border-t-4 border-yellow-500"
      >
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 text-gray-600 hover:text-black bg-white rounded-full p-1 shadow-md z-10"
          onClick={() => setIsOpen(false)}
        >
          <X size={20} />
        </motion.button>
        <div
          className={`${gradientStyle} p-6 text-white relative overflow-hidden`}
        >
          <motion.div
            className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mt-16 -mr-16"
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
            className="text-2xl font-bold flex items-center justify-start gap-2 text-start text-white"
          >
            <FileText size={24} />
            Submit Your Resume for{" "}
            <span className="text-[#FFD700]">{position}</span>
          </motion.h2>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-yellow-100 mt-2 text-sm"
          >
            Complete the form below to apply
          </motion.p>
        </div>
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 flex flex-col items-center justify-center text-center"
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
            <p className="text-gray-600 mt-2">
              Thank you for your application. We'll review it shortly.
            </p>
            <NavLink
              to="/hiring"
              className="mt-4 inline-block px-4 py-2 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition"
            >
              View Other Openings
            </NavLink>
          </motion.div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="p-6">
            <div className="space-y-4">
              <motion.div
                initial="initial"
                animate="animate"
                transition={{ delay: 0.2 }}
                variants={inputVariants}
              >
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
                >
                  <User size={16} className="mr-1 text-red-500" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-500 text-sm mt-1">
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
                  className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
                >
                  <Calendar size={16} className="mr-1 text-orange-500" />
                  Gender
                </label>
                <select
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {formik.touched.gender && formik.errors.gender && (
                  <p className="text-red-500 text-sm mt-1">
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
                  className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
                >
                  <Mail size={16} className="mr-1 text-yellow-500" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />

                {formik.touched.email && formik.errors.email && (
                  <div className="error">{formik.errors.email}</div>
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
                  className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
                >
                  <Phone size={16} className="mr-1 text-blue-500" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.phone}
                  </p>
                )}
              </motion.div>
              <motion.div
                initial="initial"
                animate="animate"
                transition={{ delay: 0.7 }}
                variants={inputVariants}
                className="mt-4"
              >
                <label
                  htmlFor="resume"
                  className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
                >
                  <FileText size={16} className="mr-1 text-blue-500" />
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
                    className={`flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-gray-50 ${
                      formik.values.resume ? "border-green-500 bg-green-50" : ""
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      {formik.values.resume ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring" }}
                        >
                          <Check size={24} className="text-green-500" />
                        </motion.div>
                      ) : (
                        <Upload size={24} className="text-gray-500" />
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
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.resume}
                  </p>
                )}
              </motion.div>
            </div>
            <motion.button
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.97 }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              type="submit"
              disabled={formik.isSubmitting}
              className={`mt-6 w-full py-3 px-4 bg-blue-500 text-white rounded-lg font-medium flex items-center justify-center disabled:opacity-70 shadow-md`}
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
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                  <Send size={18} className="mr-2" />
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
