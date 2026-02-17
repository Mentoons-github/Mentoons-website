import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BLOCK_REASONS, REPORT_REASONS } from "@/constant/constants";
import { X, Shield, Flag, HelpCircle } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "sonner";

interface ReportAbuseModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalType: "report" | "block" | "unblock";
  userId?: string;
  contentId?: string;
  reportType?: string;
  onSuccess?: () => void;
}

interface FormValues {
  selectedReason: string;
  customReason: string;
}

interface ResponseState {
  type: "success" | "error" | null;
  message: string;
}

const ReportAbuseModal = ({
  isOpen,
  setIsOpen,
  modalType,
  userId,
  contentId,
  reportType = "post",
  onSuccess,
}: ReportAbuseModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<ResponseState>({
    type: null,
    message: "",
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const textareaSectionRef = useRef<HTMLDivElement>(null);
  const { getToken } = useAuth();

  const currentReasons =
    modalType === "report" ? REPORT_REASONS : BLOCK_REASONS;

  const validationSchema =
    modalType === "unblock"
      ? Yup.object({}) // 👈 no validation needed
      : Yup.object({
          selectedReason: Yup.string().required("Please select a reason"),
          customReason: Yup.string().when("selectedReason", {
            is: "other",
            then: (schema) =>
              schema
                .required("Please provide details")
                .min(15, "Please provide at least 15 characters"),
            otherwise: (schema) => schema.notRequired(),
          }),
        });

  const initialValues: FormValues = {
    selectedReason: "",
    customReason: "",
  };

  const scrollToTextarea = () => {
    setTimeout(() => {
      if (textareaSectionRef.current && modalContentRef.current) {
        const elementTop = textareaSectionRef.current.offsetTop;
        const elementHeight = textareaSectionRef.current.offsetHeight;
        const containerHeight = modalContentRef.current.clientHeight;

        modalContentRef.current.scrollTo({
          top: elementTop - containerHeight / 2 + elementHeight / 2,
          behavior: "smooth",
        });

        setTimeout(() => {
          textareaRef.current?.focus();
        }, 400);
      }
    }, 200);
  };

  const handleSubmit = async (values: FormValues) => {
    console.log("first");
    setIsSubmitting(true);
    setResponse({ type: null, message: "" });

    try {
      const token = await getToken();
      let endpoint: string;
      let payload: any;

      if (modalType === "report") {
        const type = reportType || "post";

        if (type === "post" && !contentId) {
          throw new Error("Missing post ID for post report");
        }
        if (type === "conversation" && !contentId) {
          throw new Error("Missing conversation ID for conversation report");
        }

        endpoint =
          type === "post"
            ? `${import.meta.env.VITE_PROD_URL}/adda/report-user`
            : `${import.meta.env.VITE_PROD_URL}/adda/report-conversation`;

        payload = {
          ...(type === "post"
            ? { postId: contentId }
            : { conversationId: contentId }),
          reason:
            values.selectedReason === "other"
              ? values.customReason
              : values.selectedReason,
        };

        if (userId && type === "post") {
          payload.friendId = userId;
        }
      } else if (modalType === "block") {
        if (!userId) {
          throw new Error("Missing user ID for block");
        }
        endpoint = `${import.meta.env.VITE_PROD_URL}/user/block`;
        payload = {
          userId,
        };

        if (contentId) {
          payload.conversationId = contentId;
        }
      } else if (modalType === "unblock") {
        if (!userId) {
          throw new Error("Missing user ID for unblock");
        }
        endpoint = `${import.meta.env.VITE_PROD_URL}/user/unblock`;
        payload = { userId };

        if (contentId) {
          payload.conversationId = contentId;
        }
      } else {
        throw new Error("Invalid modal type");
      }

      const response = await axios.post(endpoint, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        if ((modalType === "block" || modalType === "unblock") && onSuccess) {
          onSuccess();
        }
        toast.success(response.data.message);

        setResponse({
          type: "success",
          message:
            response.data.message ||
            (modalType === "report"
              ? "Report submitted successfully! We'll review it soon."
              : modalType === "block"
                ? "User blocked successfully! They can no longer contact you."
                : "User unblocked successfully!"),
        });
        setIsOpen(false);
      } else {
        toast.error(response.data.message);
        setResponse({
          type: "error",
          message:
            response.data.message || `Failed to ${modalType} user/content`,
        });
      }
    } catch (error: any) {
      console.error(`Error during ${modalType}:`, error);
      toast.error(error.response.data.error);
      setResponse({
        type: "error",
        message:
          error?.response?.data?.error ||
          `An error occurred while ${
            modalType === "report"
              ? "submitting the report"
              : modalType === "block"
                ? "blocking the user"
                : "unblocking the user"
          }. Please try again.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.85, rotateX: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.85,
      rotateX: 10,
      transition: { duration: 0.3 },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: 0.08 * i,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-gradient-to-br from-gray-900/90 via-black/90 to-gray-900/90 flex items-center justify-center p-4 z-[9999]"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden font-sans"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-r from-gray-50 to-blue-50 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-full bg-gradient-to-br ${
                      modalType === "report"
                        ? "from-red-500 to-rose-500"
                        : modalType === "block"
                          ? "from-amber-500 to-orange-500"
                          : "from-green-500 to-teal-500"
                    } shadow-md`}
                  >
                    {modalType === "report" ? (
                      <Flag className="w-5 h-5 text-white" />
                    ) : modalType === "block" ? (
                      <Shield className="w-5 h-5 text-white" />
                    ) : (
                      <Shield className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                      {modalType === "report"
                        ? "Report User"
                        : modalType === "block"
                          ? "Block User"
                          : "Unblock User"}
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">
                      {modalType === "report"
                        ? "Help us maintain a safe community"
                        : modalType === "block"
                          ? "Control your interactions"
                          : "Restore communication with this user"}
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close modal"
                >
                  <X size={18} className="text-gray-600" />
                </motion.button>
              </div>
            </div>
            <div
              ref={modalContentRef}
              className="flex-1 overflow-y-auto p-6 space-y-6"
              style={{ scrollBehavior: "smooth" }}
            >
              {/* Response Display */}
              {/* <AnimatePresence>
                {response.type && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { duration: 0.3, ease: "easeOut" },
                    }}
                    exit={{
                      opacity: 0,
                      y: -20,
                      scale: 0.95,
                      transition: { duration: 0.2 },
                    }}
                    className={`p-4 rounded-xl border-l-4 ${
                      response.type === "success"
                        ? "bg-green-50 border-green-400"
                        : "bg-red-50 border-red-400"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex-shrink-0 ${
                          response.type === "success"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {response.type === "success" ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <AlertCircle className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium ${
                            response.type === "success"
                              ? "text-green-800"
                              : "text-red-800"
                          }`}
                        >
                          {response.type === "success" ? "Success" : "Error"}
                        </p>
                        <p
                          className={`text-sm mt-1 ${
                            response.type === "success"
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          {response.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence> */}

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, setFieldValue, errors, touched }) => (
                  <Form className="space-y-6">
                    {modalType !== "unblock" && (
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                          Select a Reason
                        </h2>
                        <div className="grid grid-cols-1 gap-3">
                          {currentReasons.map((reason, index) => {
                            const IconComponent = reason.icon;
                            const isSelected =
                              values.selectedReason === reason.id;

                            return (
                              <motion.div
                                key={reason.id}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                custom={index}
                                className="relative"
                              >
                                <label className="block cursor-pointer">
                                  <Field
                                    type="radio"
                                    name="selectedReason"
                                    value={reason.id}
                                    className="sr-only"
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>,
                                    ) => {
                                      setFieldValue(
                                        "selectedReason",
                                        e.target.value,
                                      );
                                      if (e.target.value === "other") {
                                        scrollToTextarea();
                                      }
                                    }}
                                  />
                                  <motion.div
                                    className={`p-4 rounded-xl border transition-all duration-300 ${
                                      isSelected
                                        ? "border-blue-400 bg-blue-50 shadow-md"
                                        : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
                                    }`}
                                    whileHover={{ y: -3, scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                  >
                                    <div className="flex items-start gap-3">
                                      <div
                                        className={`p-2 rounded-lg bg-gradient-to-br ${reason.gradient} flex-shrink-0`}
                                      >
                                        <IconComponent className="w-4 h-4 text-white" />
                                      </div>
                                      <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 text-sm">
                                          {reason.label}
                                        </h3>
                                        <p className="text-gray-500 text-xs mt-1">
                                          {reason.description}
                                        </p>
                                      </div>
                                      <div
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                          isSelected
                                            ? "border-blue-500 bg-blue-500"
                                            : "border-gray-300"
                                        }`}
                                      >
                                        {isSelected && (
                                          <div className="w-2.5 h-2.5 bg-white rounded-full" />
                                        )}
                                      </div>
                                    </div>
                                  </motion.div>
                                </label>
                              </motion.div>
                            );
                          })}
                        </div>
                        <ErrorMessage
                          name="selectedReason"
                          component="div"
                          className="text-red-500 text-xs mt-2 ml-2"
                        />
                      </div>
                    )}

                    <AnimatePresence>
                      {values.selectedReason === "other" &&
                        modalType !== "unblock" && (
                          <motion.div
                            ref={textareaSectionRef}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{
                              opacity: 1,
                              height: "auto",
                              transition: {
                                height: { duration: 0.3 },
                                opacity: { duration: 0.2, delay: 0.1 },
                              },
                            }}
                            exit={{
                              opacity: 0,
                              height: 0,
                              transition: {
                                opacity: { duration: 0.2 },
                                height: { duration: 0.3 },
                              },
                            }}
                            className="overflow-hidden"
                          >
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                              <div className="flex items-center gap-2 mb-3">
                                <HelpCircle className="w-4 h-4 text-blue-500" />
                                <h3 className="text-sm font-medium text-gray-800">
                                  Provide Details
                                </h3>
                              </div>
                              <Field
                                as="textarea"
                                name="customReason"
                                ref={textareaRef}
                                placeholder="Please describe the issue in detail to help us address it effectively..."
                                className={`w-full p-3 border rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ${
                                  errors.customReason && touched.customReason
                                    ? "border-red-300"
                                    : "border-gray-200"
                                }`}
                                rows={4}
                              />
                              <div className="flex justify-between mt-2 text-xs">
                                <ErrorMessage
                                  name="customReason"
                                  component="div"
                                  className="text-red-500"
                                />
                                <span className="text-gray-400">
                                  {values.customReason.length}/500
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <motion.button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 py-2 px-4 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-2 transition-all ${
                          isSubmitting
                            ? "bg-gray-400 cursor-not-allowed"
                            : modalType === "report"
                              ? "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"
                              : modalType === "block"
                                ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                                : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                        }`}
                        whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            />
                            Processing...
                          </>
                        ) : (
                          <>
                            {modalType === "report" ? (
                              <Flag size={16} />
                            ) : (
                              <Shield size={16} />
                            )}
                            {modalType === "report"
                              ? "Submit Report"
                              : modalType === "block"
                                ? "Block User"
                                : "Unblock User"}
                          </>
                        )}
                      </motion.button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReportAbuseModal;
