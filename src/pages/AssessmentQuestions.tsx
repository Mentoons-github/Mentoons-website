import Report from "@/components/assessment/sampleReport";
import { errorToast } from "@/utils/toastResposnse";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import React, { useState } from "react";
import Confetti from "react-confetti";
import { useLocation, useNavigate } from "react-router-dom";


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
    location.state || {};

  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
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
  }>({}); // { 0: "Paris", 1: "Mars" }

  const { getToken, userId } = useAuth();
  const { user } = useUser();

  const handleNext = () => {
    if (currentQuestion < questionGallery.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSelect = (option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion]: option,
    }));
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
    // Calculate total correct answers
    const correctAnswers = questionGallery.reduce((count, question, index) => {
      return selectedAnswers[index] === question.correctAnswer
        ? count + 1
        : count;
    }, 0);

    // Calculate percentage score
    const totalQuestions = questionGallery.length;
    const percentageScore = (correctAnswers / totalQuestions) * 100;

    // Determine performance level
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

    // Add score information to the responses
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
    console.log("Assessment payment handling initiated");
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Please login to continue");
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
        "https://mentoons-backend-zlx3.onrender.com/api/v1/payment/initiate",
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

      // Handle HTML form response
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
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-white sm:p-6">
      <div className="w-full max-w-xl">
        {/* Progress */}
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

        {/* Question */}
        <div className="mb-8 text-2xl font-light sm:text-3xl">
          {/* { questions[currentQuestion].question } */}
          {questionGallery && (
            <img
              src={questionGallery[currentQuestion].imageUrl}
              alt="Question"
              className="object-cover"
            />
          )}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {questionGallery[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              className={`w-full p-4 text-left rounded transition-colors
                    ${
                      selectedAnswers[currentQuestion] === option
                        ? "bg-orange-500 text-white"
                        : "bg-gray-50 hover:bg-orange-50"
                    }
                  `}
            >
              <span className="text-base">{option}</span>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className={`px-6 py-2 rounded transition-colors
                  ${
                    currentQuestion === 0
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-orange-600 hover:bg-orange-50"
                  }
                `}
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
                <div className="fixed inset-0 bg-black  backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-[50]">
                  <div className="w-full max-w-md p-6 bg-white rounded-lg">
                    <h2 className="mb-4 text-xl font-semibold">Thank you!</h2>
                    <div className="mb-6 space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Assessment Results
                      </h3>
                      {/* <div className="p-6 rounded-lg shadow-md bg-gradient-to-r from-purple-100 to-pink-100">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-lg text-purple-700">
                            Score:
                          </span>
                          <span className="text-xl font-bold text-pink-600">
                            {assessmentResults.score?.percentage}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-lg text-purple-700">
                            Performance:
                          </span>
                          <span className="text-xl font-bold text-pink-600">
                            {assessmentResults.score?.performance}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg text-purple-700">
                            Correct Answers:
                          </span>
                          <span className="text-xl font-bold text-pink-600">
                            {assessmentResults.score?.correct}/
                            {assessmentResults.score?.total}
                          </span>
                        </div>
                      </div> */}

                      {/* Performance visualization */}
                      <div className="p-6 transition-transform duration-300 transform shadow-lg bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl hover:scale-105">
                        <h4 className="mb-4 text-xl font-bold text-center text-orange-600 animate-bounce">
                          Your Amazing Score! 🎉
                        </h4>
                        <div className="relative h-32 mb-6">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex items-center justify-center w-24 h-24 transition-transform duration-300 transform bg-white border-8 border-orange-200 rounded-full shadow-inner rotate-3 hover:rotate-0">
                              <span className="text-3xl font-bold text-orange-500">
                                {assessmentResults.score?.percentage}%
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
                                  Number(assessmentResults.score?.percentage)) /
                                  100
                              }
                              transform="rotate(-90 50 50)"
                              className="transition-all duration-1000 ease-out"
                            />
                          </svg>
                          <div className="text-lg font-bold text-center text-orange-500">
                            {assessmentResults.score?.performance}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="p-4 transition-transform duration-300 transform bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl hover:-translate-y-1">
                            <div className="mb-2 font-bold text-center text-orange-600">
                              ✨ Correct ✨
                            </div>
                            <div className="mb-5 text-2xl font-bold text-center text-orange-500">
                              {assessmentResults.score?.correct}
                            </div>
                          </div>
                          <div className="p-4 transition-transform duration-300 transform bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl hover:-translate-y-1">
                            <div className="mb-2 font-bold text-center text-orange-600">
                              🎯 Missed 🎯
                            </div>
                            <div className="text-2xl font-bold text-center text-orange-500">
                              {assessmentResults.score?.total -
                                assessmentResults.score?.correct}
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700">
                        Get detailed insights and personalized feedback from our
                        experts for just ₹15.
                      </p>
                    </div>
                    <button
                      className="block w-full px-6 py-2 mb-4 text-center text-white transition-opacity bg-orange-500 rounded hover:opacity-80"
                      onClick={handleAssessmentPayment}
                    >
                      Get your assessment report @ ₹15
                    </button>
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
