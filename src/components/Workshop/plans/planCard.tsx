import { CheckCircle } from "lucide-react";
import { WorkshopPlan } from "@/types/workshop";
import { useState } from "react";

interface PlanCardProps {
  plan: WorkshopPlan;
  onPayClick?: (plan: WorkshopPlan) => void;
}

const PlanCard = ({ plan, onPayClick }: PlanCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const backContent = [
    "Music: Rhythm and joy",
    "Art: Colors and emotions",
    "Storytelling: Wellbeing",
    "Laughter: Wellbeing",
  ];

  if (!plan) return null;

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto p-1
      bg-gradient-to-tr from-orange-400 via-yellow-300 to-yellow-500 shadow-lg">
      
      <div className="relative bg-white p-4 sm:p-5">

        {/* Badge */}
        <div className="absolute -right-6 -top-6 sm:-right-10 sm:-top-10 w-20 h-20 sm:w-28 sm:h-28">
          <img
            src="/assets/workshopv2/badge.png"
            alt="badge"
            className="w-full h-full"
          />
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <span className="text-xs sm:text-lg font-bold text-black leading-tight">
              {plan.totalSession}
              <br />
              Sessions
            </span>
          </div>
        </div>

        {/* Age Ribbon */}
        <div className="absolute top-0 left-0 w-0 h-0 border-r-[50px] border-r-transparent border-t-[50px] border-t-red-500" />
        <span className="absolute top-2 left-1 text-[10px] sm:text-sm text-white font-bold transform -rotate-45">
          {plan.age} yrs
        </span>

        {/* Title */}
        <div className="text-center space-y-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold">
            {plan.duration}
          </h1>
          <p className="text-xs sm:text-sm">
            Developed & delivered by Psychologists
          </p>
        </div>

        {/* Mode */}
        <div className="mt-4 border border-gray-700 flex text-sm sm:text-md">
          {plan.mode.map((data, i) => (
            <div
              key={i}
              className={`flex-1 text-center py-1 font-bold ${
                data === "Online" ? "bg-green-300" : "bg-blue-400"
              }`}
            >
              {data}
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="mt-4 p-3 sm:p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm sm:text-lg text-gray-400 line-through decoration-red-500">
              ₹{plan.price.original}
            </span>

            <span className="text-xs sm:text-sm font-semibold text-green-600 uppercase">
              Intro Price
            </span>

            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              ₹{plan.price.introductory}
            </span>
          </div>

          <div className="mt-1 text-xs sm:text-sm text-gray-600">
            or{" "}
            <span className="font-semibold text-gray-900">
              ₹{plan.price.monthly}/mo
            </span>{" "}
            for {plan.duration}
          </div>

          {/* Flip Section */}
          <div
            className="relative mt-4 min-h-[160px] sm:min-h-[200px]"
            style={{ perspective: "1000px" }}
          >
            <div
              className="relative w-full h-full transition-transform duration-700"
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front */}
              <ul
                className="space-y-3 bg-white"
                style={{ backfaceVisibility: "hidden" }}
              >
                {plan.features.map((item, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm">{item}</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </li>
                ))}
              </ul>

              {/* Back */}
              <ul
                className="absolute top-0 left-0 w-full space-y-3 bg-white p-3"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                {backContent.map((item, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm">{item}</span>
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="mt-6 w-full text-sm sm:text-base border border-gray-900
                bg-gradient-to-r from-blue-500 to-blue-900
                text-white py-2 rounded-lg font-semibold"
            >
              {isFlipped ? "← Show Features" : "View More →"}
            </button>
          </div>

          {/* Materials */}
          <div className="mt-6 p-3 sm:p-4 border-t">
            <h2 className="text-base sm:text-lg font-bold text-center mb-1">
              Workshop Material Included
            </h2>
            <p className="text-xs sm:text-sm text-center leading-relaxed">
              {plan.materials}
            </p>
          </div>

          <div className="space-y-2">
            {plan.paymentOption === "fullPayment" && (
              <div className="text-center py-1.5 bg-green-50 border border-green-200 rounded">
                <p className="text-xs font-semibold text-green-700">
                  FULL PAYMENT PLAN
                </p>
              </div>
            )}

            {plan.paymentOption === "twoStep" && (
              <div className="text-center py-1.5 bg-blue-50 border border-blue-200 rounded">
                <p className="text-xs font-semibold text-blue-700">
                  TWO-STEP PAYMENT AVAILABLE
                </p>
              </div>
            )}

            {plan.paymentOption === "emi" && plan.price.monthly && (
              <div className="text-center py-1.5 bg-orange-50 border border-orange-200 rounded">
                <p className="text-xs font-semibold text-orange-700">
                  MONTHLY EMI AVAILABLE
                </p>
              </div>
            )}

            <button
              onClick={() => {
                if (onPayClick) {
                  onPayClick(plan);
                } else {
                  console.log("Processing payment for:", plan);
                }
              }}
              className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-2.5 rounded-lg font-bold text-base hover:from-green-600 hover:to-green-800 transition-all shadow-md hover:shadow-xl"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
