
export interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
  }
  

  import React, { useState } from 'react';
  
  const questions: Question[] = [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: "Paris"
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ["Jupiter", "Mars", "Venus", "Saturn"],
      correctAnswer: "Mars"
    },
  ];
  
  const AssesmentQuestions: React.FC = () => {
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  
    const handleNext = () => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      }
    };
  
    const handlePrev = () => {
      if (currentQuestion > 0) {
        setCurrentQuestion(prev => prev - 1);
      }
    };
  
    const handleSelect = (option: string) => {
      setSelectedAnswers(prev => ({
        ...prev,
        [currentQuestion]: option
      }));
    };
  
    const handleSubmit = () => {
      console.log('Submitted answers:', selectedAnswers);
    };
  
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-xl">
            {/* Progress */}
            <div className="mb-8">
              <div className="h-1 bg-gray-100 rounded-full">
                <div 
                  className="h-full bg-orange-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
              <div className="mt-2 text-sm text-orange-500 font-medium">
                {currentQuestion + 1} / {questions.length}
              </div>
            </div>
    
            {/* Question */}
            <h2 className="text-2xl sm:text-3xl font-light mb-8">
              {questions[currentQuestion].question}
            </h2>
    
            {/* Options */}
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(option)}
                  className={`w-full p-4 text-left rounded transition-colors
                    ${
                      selectedAnswers[currentQuestion] === option
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-50 hover:bg-orange-50'
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
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-orange-600 hover:bg-orange-50'
                  }
                `}
              >
                Back
              </button>
    
              {currentQuestion === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-orange-500 text-white rounded transition-opacity hover:opacity-80"
                >
                  Submit
                </button>
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
  