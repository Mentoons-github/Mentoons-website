import { feedbackSubmissions, fetchFeedback } from "@/api/feedback/feeedback";
import RightSection from "@/components/adda/feedback/rightSection";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa6";
import { useAuth } from "@clerk/clerk-react";
import { useStatusModal } from "@/context/adda/statusModalContext";
import { useAuthModal } from "@/context/adda/authModalContext";
import { useUser } from "@clerk/clerk-react";

export interface FormValue {
  feedback: string;
  rating: number;
}

export interface FeedbackItem {
  _id?: string;
  feedback: string;
  rating: number;
  createdAt?: string;
  showToUser?: boolean;
  user?: {
    name?: string;
    picture?: string;
    email?: string;
  };
}

const Feedback = () => {
  const { getToken } = useAuth();
  const { showStatus } = useStatusModal();
  const { openAuthModal } = useAuthModal();
  const { isSignedIn } = useUser();

  const [formValues, setFormValues] = useState<FormValue>({
    feedback: "",
    rating: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);
  const [feedbackError, setFeedbackError] = useState("");

  useEffect(() => {
    const loadFeedback = async () => {
      setLoadingFeedback(true);
      setFeedbackError("");

      const result = await fetchFeedback(6, 1);

      if (result?.success && result.data?.data?.feedback) {
        const received = result.data.data.feedback;
        const safeArray = Array.isArray(received) ? received : [];
        const sorted = safeArray
          .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          })
          .slice(0, 3);
        setFeedbacks(sorted);
      } else {
        setFeedbackError(
          result?.message || "Could not load feedback at the moment.",
        );
        setFeedbacks([]);
      }
      setLoadingFeedback(false);
    };

    loadFeedback();
  }, []);

  const handleRatingChange = (value: number) => {
    setFormValues((prev) => ({ ...prev, rating: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      openAuthModal("sign-in");
      return;
    }

    if (!formValues.feedback.trim() || formValues.rating === 0) {
      setErrorMessage("Please enter your feedback and select a rating.");
      showStatus("error", "Please enter your feedback and select a rating.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSubmitStatus("idle");

    const result = await feedbackSubmissions({ formValues, getToken });

    if (result.success) {
      setSubmitStatus("success");
      setFormValues({ feedback: "", rating: 0 });

      const refresh = await fetchFeedback(6, 1);
      if (refresh?.success && refresh.data?.data?.feedback) {
        const received = refresh.data.data.feedback;
        const safeArray = Array.isArray(received) ? received : [];
        const sorted = safeArray
          .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          })
          .slice(0, 3);
        setFeedbacks(sorted);
      }
    } else {
      setSubmitStatus("error");
      const errorMsg =
        result.message || "Failed to submit feedback. Please try again.";
      setErrorMessage(errorMsg);
      showStatus("error", errorMsg);
    }

    setIsSubmitting(false);
  };

  const closeModal = () => {
    setSubmitStatus("idle");
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="flex items-center justify-center gap-4 bg-gradient-to-b from-blue-600 to-blue-400 w-full lg:max-w-[50%] p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col items-center justify-center w-full max-w-xl px-4 sm:px-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white w-full">
            Submit{" "}
            <span className="text-yellow-500">
              Your <br /> Feedback
            </span>
          </h1>
          <p className="text-base sm:text-lg font-light text-white mt-4 sm:mt-6 max-w-3xl">
            We'd love to hear your thoughts! Share your experience, suggestions,
            or ideas to help us improve and build something even better for you.
          </p>

          <form
            onSubmit={handleSubmit}
            className="w-full mt-6 sm:mt-8 lg:mt-10 space-y-4 sm:space-y-5"
          >
            <textarea
              rows={6}
              placeholder="Enter your feedback..."
              value={formValues.feedback}
              onChange={(e) =>
                setFormValues({ ...formValues, feedback: e.target.value })
              }
              className="w-full rounded-lg border border-blue-200 bg-white/95 p-3 sm:p-4 text-lg sm:text-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-y"
              required
            />

            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              {Array.from({ length: 5 }).map((_, i) => {
                const starValue = i + 1;
                return (
                  <label
                    key={i}
                    className="cursor-pointer flex-1 h-12 sm:h-14 lg:h-16 flex items-center justify-center bg-white/90 rounded-xl shadow hover:bg-white transition-colors"
                  >
                    <input
                      type="radio"
                      name="rating"
                      value={starValue}
                      className="hidden"
                      onChange={() => handleRatingChange(starValue)}
                      required
                    />
                    <FaStar
                      className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 transition-colors ${
                        formValues.rating >= starValue
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </label>
                );
              })}
            </div>

            {errorMessage && submitStatus === "idle" && (
              <p className="text-red-400 text-sm font-medium">{errorMessage}</p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-xl bg-yellow-400 text-lg sm:text-xl font-bold text-gray-800 hover:bg-yellow-300 transition-colors shadow-lg ${
                  isSubmitting ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="w-full lg:max-w-[50%] flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-gray-50">
        <div className="w-full max-w-lg space-y-4 sm:space-y-6">
          {loadingFeedback ? (
            <p className="text-center text-gray-500">Loading feedback...</p>
          ) : feedbackError ? (
            <p className="text-center text-red-500">{feedbackError}</p>
          ) : feedbacks.length === 0 ? (
            <p className="text-center text-gray-500">No feedback yet.</p>
          ) : (
            feedbacks
              .filter((feedback) => feedback.showToUser)
              .slice(0, 3)
              .map((item, index) => (
                <RightSection
                  key={item._id || index}
                  feedback={{
                    name: item.user?.name || "Anonymous User",
                    email: item.user?.email,
                    feedback: item.feedback || "",
                    start: item.rating || 0,
                    picture: item.user?.picture || "/404page.png",
                  }}
                  pos={index % 2 === 0 ? "start" : "end"}
                />
              ))
          )}
        </div>
      </div>

      {submitStatus === "success" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="text-6xl mb-6">🙏</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Thank You!
            </h2>
            <p className="text-gray-600 mb-8">
              Your feedback has been successfully submitted. We truly appreciate
              your time and input — it helps us get better every day.
            </p>
            <button
              onClick={closeModal}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
