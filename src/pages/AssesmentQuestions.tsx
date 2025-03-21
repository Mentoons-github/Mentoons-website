import React, { useState } from "react";
import Confetti from "react-confetti";
import { useLocation } from "react-router-dom";
interface QuestionGallery {
  id: string;
  imageUrl: string;
  options: string[];
}

const AssesmentQuestions: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
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
    const userResponses = Object.entries(selectedAnswers).map(
      ([questionIndex, answer]) => ({
        questionNumber: parseInt(questionIndex) + 1,
        selectedAnswer: answer,
        questionImage: questionGallery[parseInt(questionIndex)].imageUrl,
      })
    );

    console.log("User Responses:", userResponses);
    console.log("Selected Answers:", selectedAnswers);
  };
  const handleAssessmentPayment = () => {
    alert(" Thank you for your Interest.This Feature is under devlopment!");
  };
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6">
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
          <div className="mt-2 text-sm text-orange-500 font-medium">
            {currentQuestion + 1} / {questionGallery.length}
          </div>
        </div>

        {/* Question */}
        <div className="text-2xl sm:text-3xl font-light mb-8">
          {/* { questions[currentQuestion].question } */}
          {questionGallery && (
            <img
              src={questionGallery[currentQuestion].imageUrl}
              alt="Question"
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
                className="px-6 py-2 bg-orange-500 text-white rounded transition-opacity hover:opacity-80"
              >
                Submit
              </button>

              {showModal && (
                <div className="fixed inset-0 bg-black  backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-[999999]">
                  <div className="bg-white p-6 rounded-lg max-w-md w-full">
                    <h2 className="text-xl font-semibold mb-4">Thank you!</h2>
                    <p className="mb-6">
                      Thank you for taking the assessment. Get your assessment
                      reviewed by our experts at just ₹129.
                    </p>
                    <button
                      className="block w-full text-center px-6 py-2 bg-orange-500 text-white rounded transition-opacity hover:opacity-80 mb-4"
                      onClick={handleAssessmentPayment}
                    >
                      Get your assessment report @ ₹129
                    </button>
                    <a
                      href="/assesment-page"
                      className="block w-full text-center px-6 py-2  border border-orange-500 text-black rounded transition-opacity hover:bg-orange-200"
                    >
                      Go to Assessment Page
                    </a>
                  </div>
                  <Confetti/>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-orange-500 text-white rounded transition-opacity hover:opacity-80"
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
