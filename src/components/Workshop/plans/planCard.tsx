import { CheckCircle } from "lucide-react";
import { WorkshopPlan } from "@/types/workshop";
import { useState } from "react";

const PlanCard = ({ plan }: { plan: WorkshopPlan }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const backContent = [
    "Music: Rhythm and joy",
    "Art: Colors and emotions",
    "Storytelling : Wellbeing",
    "Laughter: Wellbeing",
  ];

  if (!plan) return null;

  return (
    <div className="max-w-md p-1 bg-gradient-to-tr from-orange-400 via-yellow-300 to-yellow-500 shadow-lg">
      <div className="relative p-3 bg-white">
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
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-extrabold">{plan.duration}</h1>
          <p className="text-sm">Developer and delivered By Psychologists</p>
        </div>
        <div className="border border-gray-700 flex items-center justify-center text-md mt-5">
          {plan.mode.length > 0 &&
            plan.mode.map((data, i) => (
              <div
                key={i}
                className={`flex items-center justify-center font-extrabold ${
                  data === "Online" ? "bg-green-300" : "bg-blue-400"
                } w-1/2`}
              >
                {data}
              </div>
            ))}
        </div>

        <div className="mt-2 p-5">
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

          <div className="mt-2 text-sm text-gray-600">
            or{" "}
            <span className="font-semibold text-lg text-gray-900">
              ₹{plan.price.monthly}/mo
            </span>{" "}
            for {plan.duration}
          </div>

          <div
            className="relative mt-3 min-h-[200px]"
            style={{ perspective: "1000px" }}
          >
            <div
              className="relative w-full transition-transform duration-700"
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              <ul
                className="space-y-4 bg-white"
                style={{
                  backfaceVisibility: "hidden",
                }}
              >
                {plan.features.map((item, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span className="text-sm">{item}</span>
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  </li>
                ))}
              </ul>

              <ul
                className="absolute top-0 left-0 w-full space-y-4 bg-white p-4"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                {backContent.map((item, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span className="text-sm">{item}</span>
                    <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="mt-8 w-full border border-gray-900 bg-gradient-to-r from-blue-500 to-blue-900 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              {isFlipped ? "← Show Features" : "View More →"}
            </button>
          </div>

          <div className="mt-8 p-4 border-t">
            <h2 className="text-lg font-bold text-gray-900 mb-2 text-center">
              Workshop Material Included
            </h2>

            <p className="text-sm text-gray-700 text-center leading-relaxed">
              {plan.materials}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
