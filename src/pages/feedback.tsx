import { useState } from "react";
import { Star } from "lucide-react";
import { feedbackSubmissions } from "@/api/feedback/feeedback";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useStatusModal } from "@/context/adda/statusModalContext";
import { useAuthModal } from "@/context/adda/authModalContext";

interface FormValue {
  feedback: string;
  rating: number;
}

const Feedback = () => {
  const { getToken } = useAuth();
  const { isSignedIn } = useUser();
  const { showStatus } = useStatusModal();
  const { openAuthModal } = useAuthModal();

  const [formValues, setFormValues] = useState<FormValue>({
    feedback: "",
    rating: 0,
  });
  const [hoverRating, setHoverRating] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

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
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full h-full bg-amber-50 rounded-lg p-8 flex flex-col gap-5 border border-amber-100"
      >
        <h2 className="text-4xl font-semibold text-neutral-900">
          Give your Feedback
        </h2>

        <p className="text-base text-neutral-500 leading-relaxed">
          We&apos;d love to hear your thoughts! Share your experience,
          suggestions, or ideas to help us improve and build something even
          better for you.
        </p>

        <textarea
          placeholder="Write your feedback here"
          value={formValues.feedback}
          onChange={(e) =>
            setFormValues((prev) => ({ ...prev, feedback: e.target.value }))
          }
          className="w-full h-32 px-4 py-3 bg-white border border-amber-200 rounded-md text-sm resize-none outline-none focus:border-orange-500 transition"
        />

        <div className="flex flex-col gap-2 mt-1">
          <span className="text-sm font-medium text-neutral-600">Rate Us</span>

          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHoverRating(n)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => handleRatingChange(n)}
                aria-label={`Rate ${n} stars`}
              >
                <Star
                  size={24}
                  className={
                    n <= (hoverRating || formValues.rating)
                      ? "fill-orange-500 text-orange-500"
                      : "text-neutral-300"
                  }
                />
              </button>
            ))}
          </div>
        </div>

        {errorMessage && submitStatus === "idle" && (
          <p className="text-red-500 text-sm font-medium">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`self-start mt-2 bg-orange-500 text-white rounded-md px-5 py-3 text-sm font-medium hover:bg-orange-600 transition ${
            isSubmitting ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>

      {submitStatus === "success" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
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
    </>
  );
};

export default Feedback;
