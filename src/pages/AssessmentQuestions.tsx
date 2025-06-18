import Report from "@/components/assessment/sampleReport";
import { errorToast } from "@/utils/toastResposnse";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import React, { useState } from "react";
import Confetti from "react-confetti";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface QuestionGallery {
  id: string;
  imageUrl: string;
  options: string[];
  correctAnswer: string;
}

export interface ASSESSMENT_RESULTS {
  responses: Array<{
    questionNumber: number;
    selectedAnswer: string;
    questionImage: string;
    isCorrect: boolean;
  }>;
  score: {
    correct: number;
    total: number;
    percentage: string;
    performance: string;
  };
  assessmentName: string;
}

const AssessmentQuestions: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    questionGallery,
    assessment,
  }: { questionGallery: QuestionGallery[]; assessment: string } =
    location.state || { questionGallery: [], assessment: "" };

  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [assessmentResults, setAssessmentResults] =
    useState<ASSESSMENT_RESULTS>({
      responses: [],
      score: {
        correct: 0,
        total: 0,
        percentage: "0.0",
        performance: "",
      },
      assessmentName: assessment,
    });
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});

  const { getToken, userId } = useAuth();
  const { user } = useUser();

  const handleNext = () => {
    if (questionGallery && currentQuestion < questionGallery.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSelect = (option: string) => {
    setSelectedAnswers((prev) => {
      const newAnswers = { ...prev };
      if (newAnswers[currentQuestion] === option) {
        delete newAnswers[currentQuestion];
      } else {
        newAnswers[currentQuestion] = option;
      }
      return newAnswers;
    });
  };

  const handleAssessmentNav = () => {
    setAssessmentResults({
      responses: [],
      score: {
        correct: 0,
        total: 0,
        percentage: "0.0",
        performance: "",
      },
      assessmentName: "",
    });
    navigate("/assessment-page");
  };

  const handleSubmit = () => {
    if (!questionGallery) return;

    const correctAnswers = questionGallery.reduce((count, question, index) => {
      return selectedAnswers[index] === question.correctAnswer
        ? count + 1
        : count;
    }, 0);

    const totalQuestions = questionGallery.length;
    const percentageScore = (correctAnswers / totalQuestions) * 100;

    let performanceLevel = "";
    if (percentageScore <= 30) {
      performanceLevel = "Below Average";
    } else if (percentageScore <= 70) {
      performanceLevel = "Average";
    } else {
      performanceLevel = "Excellent";
    }

    const userResponses = Object.entries(selectedAnswers).map(
      ([questionIndex, answer]) => ({
        questionNumber: parseInt(questionIndex) + 1,
        selectedAnswer: answer,
        questionImage: questionGallery[parseInt(questionIndex)].imageUrl,
        isCorrect:
          answer === questionGallery[parseInt(questionIndex)].correctAnswer,
      })
    );

    setAssessmentResults({
      responses: userResponses,
      score: {
        correct: correctAnswers,
        total: totalQuestions,
        percentage: percentageScore.toFixed(1),
        performance: performanceLevel,
      },
      assessmentName: assessment,
    });
  };

  const handleAssessmentPayment = async () => {
    setIsLoading(true);
    console.log("Assessment payment handling initiated");
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Please login to continue");
        setIsLoading(false);
        return;
      }

      const paymentData = {
        orderId: `#ASM-${Date.now()}`,
        totalAmount: 15,
        amount: 15,
        currency: "INR",
        productInfo: "Mentoons Assessment Report",
        customerName:
          user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.fullName || "Unknown",
        email: user?.emailAddresses[0].emailAddress,
        phone: user?.phoneNumbers?.[0]?.phoneNumber || "",
        status: "PENDING",
        user: userId,
        items: [
          {
            name: "Assessment Report",
            price: 15,
            quantity: 1,
          },
        ],
        orderStatus: "pending",
        paymentDetails: {
          paymentMethod: "credit_card",
          paymentStatus: "initiated",
        },
        assessmentDetails: {
          score: assessmentResults.score,
          responses: assessmentResults.responses,
          completedAt: new Date().toISOString(),
        },
        sameAsShipping: true,
      };

      console.log("paymentData", paymentData);
      const response = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/payment/initiate`,
        paymentData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response", response);
      console.log("response.data", response.data);

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = response.data;

      const form = tempDiv.querySelector("form");
      if (form) {
        document.body.appendChild(form);
        form.submit();
      } else {
        throw new Error("Payment form not found in response");
      }
    } catch (error: unknown) {
      console.error("Assessment payment error:", error);
      errorToast(
        error instanceof Error
          ? error.message
          : "Failed to process assessment payment. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!questionGallery || questionGallery.length === 0) {
    return <div>No questions available.</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-white sm:p-6">
      <div className="w-full max-w-xl">
        <div className="mb-8">
          <div className="h-1 bg-gray-100 rounded-full">
            <div
              className="h-full transition-all duration-300 bg-orange-500 rounded-full"
              style={{
                width: `${
                  ((currentQuestion + 1) / questionGallery.length) * 100
                }%`,
              }}
            />
          </div>
          <div className="mt-2 text-sm font-medium text-orange-500">
            {currentQuestion + 1} / {questionGallery.length}
          </div>
        </div>

        <div className="mb-8 text-2xl font-light sm:text-3xl">
          <motion.div
            className="relative w-full h-64 overflow-hidden rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <img
              src={questionGallery[currentQuestion].imageUrl}
              alt="Question"
              className="object-cover w-full h-full object-top"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questionGallery[currentQuestion].options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestion] === option;
            return (
              <motion.button
                key={index}
                onClick={() => handleSelect(option)}
                className={`relative w-full h-16 rounded-full overflow-hidden focus:outline-none focus:ring-4 focus:ring-offset-2 shadow-lg ${
                  isSelected
                    ? "bg-gradient-to-r from-green-400 to-green-600 focus:ring-green-300 shadow-green-200"
                    : "bg-gradient-to-r from-gray-300 to-gray-400 focus:ring-gray-300 hover:from-gray-400 hover:to-gray-500"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: isSelected
                      ? "linear-gradient(90deg, #4ade80, #16a34a)"
                      : "linear-gradient(90deg, #d1d5db, #9ca3af)",
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
                <motion.span
                  className={`absolute top-2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center z-10 transition-all duration-500 ease-in-out ${
                    isSelected ? "right-2" : "left-2"
                  }`}
                  animate={{
                    rotate: isSelected ? 180 : 0,
                    boxShadow: isSelected
                      ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                      : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                >
                  <motion.span
                    className="w-3 h-3 rounded-full"
                    animate={{
                      backgroundColor: isSelected ? "#22c55e" : "#9ca3af",
                      scale: isSelected ? 1.2 : 1,
                    }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  />
                </motion.span>
                <motion.span
                  className="absolute inset-0 flex items-center justify-center text-sm font-semibold px-16 z-5"
                  animate={{
                    color: isSelected ? "#ffffff" : "#374151",
                    textShadow: isSelected
                      ? "0 1px 2px rgba(0, 0, 0, 0.1)"
                      : "none",
                  }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  {option}
                </motion.span>
                <motion.div
                  className="absolute inset-0 bg-white rounded-full opacity-0"
                  animate={{
                    scale: isSelected ? [1, 1.5, 1] : 1,
                    opacity: isSelected ? [0.3, 0, 0] : 0,
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </motion.button>
            );
          })}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className={`px-6 py-2 rounded transition-colors ${
              currentQuestion === 0
                ? "text-gray-300 cursor-not-allowed"
                : "text-orange-600 hover:bg-orange-50"
            }`}
          >
            Back
          </button>

          {currentQuestion === questionGallery.length - 1 ? (
            <>
              <button
                onClick={() => {
                  handleSubmit();
                  setShowModal(true);
                }}
                className="px-6 py-2 text-white transition-opacity bg-orange-500 rounded hover:opacity-80"
              >
                Submit
              </button>

              {showModal && (
                <div className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-[99999]">
                  <div className="w-full max-w-md p-6 bg-white rounded-lg">
                    <h2 className="mb-4 text-xl font-semibold">Thank you!</h2>
                    <div className="mb-6 space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Assessment Results
                      </h3>
                      <div className="p-6 transition-transform duration-300 transform shadow-lg bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl hover:scale-105">
                        <h4 className="mb-4 text-xl font-bold text-center text-orange-600 animate-bounce">
                          Your Amazing Score! 🎉
                        </h4>
                        <div className="relative h-32 mb-6">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex items-center justify-center w-24 h-24 transition-transform duration-300 transform bg-white border-8 border-orange-200 rounded-full shadow-inner rotate-3 hover:rotate-0">
                              <span className="text-3xl font-bold text-orange-500">
                                {assessmentResults.score.percentage}%
                              </span>
                            </div>
                          </div>
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#fee2e2"
                              strokeWidth="12"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#f97316"
                              strokeWidth="12"
                              strokeDasharray="251.2"
                              strokeDashoffset={
                                251.2 -
                                (251.2 *
                                  Number(assessmentResults.score.percentage)) /
                                  100
                              }
                              transform="rotate(-90 50 50)"
                              className="transition-all duration-1000 ease-out"
                            />
                          </svg>
                          <div className="text-lg font-bold text-center text-orange-500">
                            {assessmentResults.score.performance}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="p-4 transition-transform duration-300 transform bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl hover:-translate-y-1">
                            <div className="mb-2 font-bold text-center text-orange-600">
                              ✨ Correct ✨
                            </div>
                            <div className="mb-5 text-2xl font-bold text-center text-orange-500">
                              {assessmentResults.score.correct}
                            </div>
                          </div>
                          <div className="p-4 transition-transform duration-300 transform bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl hover:-translate-y-1">
                            <div className="mb-2 font-bold text-center text-orange-600">
                              🎯 Missed 🎯
                            </div>
                            <div className="text-2xl font-bold text-center text-orange-500">
                              {assessmentResults.score.total -
                                assessmentResults.score.correct}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">
                        Get detailed insights and personalized feedback from our
                        experts for just ₹15.
                      </p>
                    </div>
                    <motion.button
                      className={`block w-full px-6 py-2 mb-4 text-center text-white rounded transition-opacity ${
                        isLoading
                          ? "bg-orange-400 cursor-not-allowed"
                          : "bg-orange-500 hover:opacity-80"
                      }`}
                      onClick={handleAssessmentPayment}
                      disabled={isLoading}
                      whileTap={{ scale: isLoading ? 1 : 0.95 }}
                    >
                      <motion.div
                        className="flex items-center justify-center"
                        initial={{ opacity: 1 }}
                        animate={{
                          opacity: isLoading ? [1, 0.5, 1] : 1,
                        }}
                        transition={{
                          opacity: isLoading
                            ? {
                                repeat: Infinity,
                                duration: 1,
                                ease: "easeInOut",
                              }
                            : { duration: 0 },
                        }}
                      >
                        {isLoading ? (
                          <>
                            <motion.span
                              className="mr-2 inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{
                                repeat: Infinity,
                                duration: 0.8,
                                ease: "linear",
                              }}
                            />
                            Submitting
                          </>
                        ) : (
                          "Get your assessment report @ ₹15"
                        )}
                      </motion.div>
                    </motion.button>
                    <button
                      onClick={handleAssessmentNav}
                      className="block w-full px-6 py-2 text-center text-black transition-opacity border border-orange-500 rounded hover:bg-orange-200"
                    >
                      Take another assessment
                    </button>
                  </div>
                  <Confetti className="w-full" />
                </div>
              )}
            </>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 text-white transition-opacity bg-orange-500 rounded hover:opacity-80"
            >
              Next
            </button>
          )}
        </div>
      </div>
      {isOpen && (
        <Report onClose={() => setIsOpen(false)} result={assessmentResults} />
      )}
    </div>
  );
};

export default AssessmentQuestions;
