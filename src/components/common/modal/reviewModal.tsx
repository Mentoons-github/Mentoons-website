import axiosInstance from "@/api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MdStar, MdCheckCircle, MdError, MdClose } from "react-icons/md";
import { useAuth } from "@clerk/clerk-react";

interface ReviewModalProps {
  title: string;
  productId: string;
  onClose: () => void;
  onSubmit: (productId: string) => void;
}

type SubmissionState = "idle" | "loading" | "success" | "error";

const ReviewModal = ({
  title,
  productId,
  onClose,
  onSubmit,
}: ReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const { getToken } = useAuth();

  const handleSubmit = async () => {
    if (rating === 0) return;

    setSubmissionState("loading");
    setErrorMessage("");

    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      await axiosInstance.post(
        "/order/write-review",
        {
          rating,
          review: reviewText,
          productId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSubmissionState("success");
      setTimeout(() => {
        onSubmit(productId);
        setRating(0);
        setReviewText("");
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error("Error submitting review:", error);
      setSubmissionState("error");
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit review. Please try again."
      );
    }
  };

  const handleRetry = () => {
    setSubmissionState("idle");
    setErrorMessage("");
  };

  const handleClose = () => {
    if (submissionState === "loading") return;
    onClose();
  };

  // Enhanced Loading Animation with multiple elements
  const LoadingSpinner = () => (
    <motion.div
      className="flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Main spinning circle */}
      <div className="relative">
        <motion.div
          className="w-12 h-12 border-4 border-blue-200 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        />
        <motion.div
          className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Inner pulsing dot */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Animated dots */}
      <motion.div
        className="flex gap-1 mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-blue-600 rounded-full"
            animate={{
              y: [0, -8, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Loading text with typewriter effect */}
      <motion.div
        className="mt-4 text-gray-600 text-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Submitting your review
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: 1.2,
          }}
        >
          ...
        </motion.span>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        className="w-32 h-1 bg-gray-200 rounded-full mt-4 overflow-hidden"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.8, duration: 0.3 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </motion.div>
  );

  const SuccessAnimation = () => (
    <motion.div
      className="flex flex-col items-center justify-center text-green-600"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
      >
        <MdCheckCircle className="text-6xl mb-4" />
      </motion.div>
      <motion.h3
        className="text-xl font-semibold mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Review Submitted!
      </motion.h3>
      <motion.p
        className="text-gray-600 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Thank you for your feedback
      </motion.p>
    </motion.div>
  );

  // Error Animation Component
  const ErrorAnimation = () => (
    <motion.div
      className="flex flex-col items-center justify-center text-red-600"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
      >
        <MdError className="text-6xl mb-4" />
      </motion.div>
      <motion.h3
        className="text-xl font-semibold mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Submission Failed
      </motion.h3>
      <motion.p
        className="text-gray-600 text-center mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {errorMessage}
      </motion.p>
      <motion.button
        onClick={handleRetry}
        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Try Again
      </motion.button>
    </motion.div>
  );

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClose}
    >
      <motion.div
        className="bg-white rounded-xl max-w-md w-full p-6 relative"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={submissionState === "loading"}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MdClose className="text-xl text-gray-500" />
        </button>

        <AnimatePresence mode="wait">
          {submissionState === "loading" && (
            <motion.div
              key="loading"
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <LoadingSpinner />
            </motion.div>
          )}

          {submissionState === "success" && (
            <motion.div
              key="success"
              className="py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SuccessAnimation />
            </motion.div>
          )}

          {submissionState === "error" && (
            <motion.div
              key="error"
              className="py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ErrorAnimation />
            </motion.div>
          )}

          {submissionState === "idle" && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.h2
                className="text-xl font-semibold mb-6 pr-8"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Write a Review for {title}
              </motion.h2>

              {/* Star Rating */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Rating: {rating > 0 ? `${rating}/5` : "Select a rating"}
                </label>
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <motion.button
                      key={starValue}
                      type="button"
                      onClick={() => setRating(starValue)}
                      className="text-3xl hover:scale-110 transition-all duration-200 focus:outline-none"
                      title={`${starValue} stars`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MdStar
                        className={
                          starValue <= rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    </motion.button>
                  ))}
                </div>
                <AnimatePresence>
                  {rating > 0 && (
                    <motion.div
                      className="text-sm text-gray-600"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {rating === 1
                        ? "Poor"
                        : rating === 2
                        ? "Fair"
                        : rating === 3
                        ? "Good"
                        : rating === 4
                        ? "Very Good"
                        : "Excellent"}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Review Text */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  rows={4}
                  placeholder="Share your thoughts about this product..."
                />
              </motion.div>

              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleSubmit}
                  disabled={rating === 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  whileHover={rating > 0 ? { scale: 1.02 } : {}}
                  whileTap={rating > 0 ? { scale: 0.98 } : {}}
                >
                  Submit Review
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default ReviewModal;
