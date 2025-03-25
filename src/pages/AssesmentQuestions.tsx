import React, { useState } from "react";
import Confetti from "react-confetti";
import { useLocation } from "react-router-dom";
interface QuestionGallery {
  id: string;
  imageUrl: string;
  options: string[];
  correctAnswer: string;
}

interface ASSESSMENT_RESULTS {
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
}

const AssesmentQuestions: React.FC = () => {
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
    });
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({}); // { 0: "Paris", 1: "Mars" }

  const location = useLocation();
  const { questionGallery }: { questionGallery: QuestionGallery[] } =
    location.state || {};

  console.log("questionGallery", questionGallery);

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
    });

    console.log("assessmentResults", assessmentResults);
  };

  // Function to handle the assessment payment

  const handleAssessmentPayment = () => {
    alert(" Thank you for your Interest.This Feature is under devlopment!");
  };
  return (
    <div className="flex justify-center items-center p-4 min-h-screen bg-white sm:p-6">
      <div className="w-full max-w-xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="h-1 bg-gray-100 rounded-full">
            <div
              className="h-full bg-orange-500 rounded-full transition-all duration-300"
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
                className="px-6 py-2 text-white bg-orange-500 rounded transition-opacity hover:opacity-80"
              >
                Submit
              </button>

              {showModal && (
                <div className="fixed inset-0 bg-black  backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-[999999]">
                  <div className="p-6 w-full max-w-md bg-white rounded-lg">
                    <h2 className="mb-4 text-xl font-semibold">Thank you!</h2>
                    <div className="mb-6 space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Assessment Results
                      </h3>
                      {/* <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg text-purple-700">
                            Score:
                          </span>
                          <span className="text-xl font-bold text-pink-600">
                            {assessmentResults.score?.percentage}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg text-purple-700">
                            Performance:
                          </span>
                          <span className="text-xl font-bold text-pink-600">
                            {assessmentResults.score?.performance}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
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
                      <div className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl shadow-lg transition-transform duration-300 transform hover:scale-105">
                        <h4 className="mb-4 text-xl font-bold text-center text-orange-600 animate-bounce">
                          Your Amazing Score! 🎉
                        </h4>
                        <div className="relative mb-6 h-32">
                          <div className="flex absolute inset-0 justify-center items-center">
                            <div className="flex justify-center items-center w-24 h-24 bg-white rounded-full border-8 border-orange-200 shadow-inner transition-transform duration-300 transform rotate-3 hover:rotate-0">
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
                          <div className="p-4 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl transition-transform duration-300 transform hover:-translate-y-1">
                            <div className="mb-2 font-bold text-center text-orange-600">
                              ✨ Correct ✨
                            </div>
                            <div className="mb-5 text-2xl font-bold text-center text-orange-500">
                              {assessmentResults.score?.correct}
                            </div>
                          </div>
                          <div className="p-4 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl transition-transform duration-300 transform hover:-translate-y-1">
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
                      className="block px-6 py-2 mb-4 w-full text-center text-white bg-orange-500 rounded transition-opacity hover:opacity-80"
                      onClick={handleAssessmentPayment}
                    >
                      Get your assessment report @ ₹15
                    </button>
                    <a
                      href="/assesment-page"
                      className="block px-6 py-2 w-full text-center text-black rounded border border-orange-500 transition-opacity hover:bg-orange-200"
                    >
                      Take another assessment
                    </a>
                  </div>

                  <Confetti className="w-full" />
                </div>
              )}
            </>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 text-white bg-orange-500 rounded transition-opacity hover:opacity-80"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default AssesmentQuestions;
