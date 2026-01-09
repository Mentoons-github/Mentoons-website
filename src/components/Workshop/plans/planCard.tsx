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
    "Storytelling : Wellbeing",
    "Laughter: Wellbeing",
  ];

  if (!plan) return null;

  return (
    <div className="max-w-md w-full h-[710px] p-1 bg-gradient-to-tr from-orange-400 via-yellow-300 to-yellow-500 shadow-lg">
      <div className="relative h-full p-3 bg-white">
        <div className="absolute -right-12 -top-12 w-32 h-32">
          <img
            src="/assets/workshopv2/badge.png"
            alt="badge"
            className="w-full h-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-black">
              {plan.totalSession} Sessions
            </span>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-0 h-0 border-r-[60px] border-r-transparent border-t-[60px] border-t-red-500"></div>

        <span className="absolute top-3 -left-1 text-white text-sm font-bold transform -rotate-45 tracking-widest">
          {plan.age} yrs
        </span>

        <div className="text-center space-y-1 h-[80px] flex flex-col justify-center">
          <h1 className="text-3xl font-extrabold">{plan.duration}</h1>
          <p className="text-sm">Developed and delivered By Psychologists</p>
        </div>

        <div className="border border-gray-700 flex items-center justify-center text-md mt-5 h-[40px]">
          {plan.mode.length > 0 &&
            plan.mode.map((data, i) => (
              <div
                key={i}
                className={`flex items-center justify-center font-extrabold h-full ${
                  data === "Online" ? "bg-green-300" : "bg-blue-400"
                } w-1/2`}
              >
                {data}
              </div>
            ))}
        </div>

        <div className="mt-2 px-5 h-[100px]">
          <div className="flex items-center gap-4">
            <span className="text-lg text-gray-400 line-through decoration-red-500 decoration-2">
              ₹{plan.price.original}
            </span>

            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-green-600 uppercase tracking-wide text-nowrap">
                Introductory Price:
              </span>
              <span className="text-4xl font-bold text-gray-900">
                ₹{plan.price.introductory}
              </span>
            </div>
          </div>

          {plan.price.monthly && (
            <div className="mt-2 text-sm text-gray-600">
              or{" "}
              <span className="font-semibold text-lg text-gray-900">
                ₹{plan.price.monthly}/mo
              </span>{" "}
              for {plan.duration}
            </div>
          )}
        </div>

        <div className="px-5">
          <div className="relative h-[240px]" style={{ perspective: "1000px" }}>
            <div
              className="relative w-full h-full transition-transform duration-700"
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              <div
                className="absolute inset-0 bg-white overflow-y-auto"
                style={{
                  backfaceVisibility: "hidden",
                }}
              >
                <ul className="space-y-4 pr-2">
                  {plan.features.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{item}</span>
                      <CheckCircle className="w-4 h-4 text-green-500 ml-2 flex-shrink-0" />
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="absolute inset-0 bg-white p-4 overflow-y-auto"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <ul className="space-y-4 pr-2">
                  {backContent.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{item}</span>
                      <CheckCircle className="w-4 h-4 text-blue-500 ml-2 flex-shrink-0" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="mt-4 w-full border border-gray-900 bg-gradient-to-r from-blue-500 to-blue-900 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            {isFlipped ? "← Show Features" : "View More →"}
          </button>
        </div>

        <div className="mt-3 px-5 pt-3 border-t h-[165px] flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-2 text-center">
            Workshop Material Included
          </h2>

          <div className="flex-1 overflow-y-auto mb-2">
            <p className="text-sm text-gray-700 text-center leading-relaxed">
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
