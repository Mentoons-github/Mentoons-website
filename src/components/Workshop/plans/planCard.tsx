import { WorkshopPlan } from "@/types/workshopsV2/workshopsV2";
import { CheckCircle } from "lucide-react";
import { ReactNode, useState } from "react";

interface PlanCardProps {
  plan?: WorkshopPlan;
  onPayClick?: (plan: WorkshopPlan) => void;
}

const burstClip =
  "polygon(50% 0%, 61% 15%, 79% 8%, 82% 27%, 100% 32%, 90% 50%, 100% 68%, 82% 73%, 79% 92%, 61% 85%, 50% 100%, 39% 85%, 21% 92%, 18% 73%, 0% 68%, 10% 50%, 0% 32%, 18% 27%, 21% 8%, 39% 15%)";

// Comic "POW" starburst with a black outline
const Burst = ({
  color,
  className = "",
  children,
}: {
  color: string;
  className?: string;
  children: ReactNode;
}) => (
  <div className={`relative ${className}`}>
    <div
      className="absolute inset-0 bg-black"
      style={{ clipPath: burstClip }}
    />
    <div
      className="absolute inset-[4px] flex items-center justify-center text-center"
      style={{ clipPath: burstClip, backgroundColor: color }}
    >
      {children}
    </div>
  </div>
);

const PlanCard = ({ plan, onPayClick }: PlanCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const backContent = [
    "Music: Rhythm and joy",
    "Art: Colors and emotions",
    "Storytelling: Wellbeing",
    "Laughter: Wellbeing",
  ];

  if (!plan) return null;

  const hasEMI = !!plan?.emi?.enabled;

  return (
    <div className="md:grid grid-cols-2">
      <div className="relative w-full max-w-sm sm:max-w-md mx-auto mt-6 bg-white border-4 border-black shadow-[8px_8px_0_#000]">
        {/* Sessions burst */}
        <Burst
          color="#2ea7ff"
          className="absolute -right-6 -top-10 sm:-right-8 w-24 h-24 sm:w-28 sm:h-28 rotate-12 z-10"
        >
          <span className="font-comic-chip text-black leading-none text-lg sm:text-xl">
            {plan.totalSession}
            <br />
            <span className="font-comic text-sm sm:text-base tracking-wider">
              Sessions
            </span>
          </span>
        </Burst>

        {/* Age tag */}
        <span className="absolute -left-4 -top-4 z-10 -rotate-6 bg-[#ff4b3e] text-white border-4 border-black shadow-[3px_3px_0_#000] px-3 py-0.5 font-comic text-base sm:text-lg tracking-wider">
          {plan.age} yrs
        </span>

        {/* Title panel */}
        <div className="bg-[#ffd93d] border-b-4 border-black px-4 pt-8 pb-4 text-center space-y-1">
          <h1 className="font-comic-chip text-3xl sm:text-4xl tracking-wide text-black">
            {plan.duration}
          </h1>
          <p className="font-comic text-base sm:text-lg tracking-wider text-black">
            Developed & delivered by Psychologists
          </p>
        </div>

        <div className="p-4 sm:p-5">
          {/* Mode */}
          <div className="border-4 border-black flex">
            {plan.mode.map((data, i) => (
              <div
                key={i}
                className={`flex-1 text-center py-1 font-comic text-lg tracking-wider text-black ${
                  i > 0 ? "border-l-4 border-black" : ""
                } ${data === "Online" ? "bg-[#2ed47a]" : "bg-[#2ea7ff]"}`}
              >
                {data}
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="mt-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-comic text-xl text-gray-500 line-through decoration-[#ff4b3e] decoration-4">
                ₹{plan.price.original}
              </span>

              <span className="font-comic text-sm sm:text-base tracking-wider bg-[#ff4b3e] text-white border-2 border-black px-2 -rotate-3">
                Intro Price
              </span>

              <span className="font-comic-chip text-4xl sm:text-5xl text-gray-900">
                ₹{plan.price.introductory}
              </span>
            </div>

            {hasEMI && (
              <div className="mt-2 text-xs sm:text-sm text-gray-700">
                or{" "}
                <span className="font-comic text-lg tracking-wider text-gray-900">
                  ₹{plan.emi?.monthlyAmount}/mo
                </span>{" "}
                for {plan.duration} •{" "}
                <span className="font-comic text-base tracking-wider text-green-700">
                  Interest Free
                </span>
              </div>
            )}

            {/* Flip Section */}
            <div
              className="relative mt-5 min-h-[160px] sm:min-h-[200px]"
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
                    <li
                      key={index}
                      className="flex items-center justify-between gap-3 border-b-2 border-dashed border-black/30 pb-2"
                    >
                      <span className="text-xs sm:text-sm">{item}</span>
                      <CheckCircle
                        className="w-5 h-5 text-[#2ed47a] shrink-0"
                        strokeWidth={3}
                      />
                    </li>
                  ))}
                </ul>

                {/* Back */}
                <ul
                  className="absolute top-0 left-0 w-full space-y-3 bg-[#fff3b0] border-2 border-black p-3"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  {backContent.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="text-xs sm:text-sm">{item}</span>
                      <CheckCircle
                        className="w-5 h-5 text-[#2ea7ff] shrink-0"
                        strokeWidth={3}
                      />
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="mt-6 w-full font-comic text-lg tracking-wider bg-[#2ea7ff] text-black border-4 border-black shadow-[4px_4px_0_#000] py-1.5 transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#000] active:translate-y-1 active:shadow-none"
              >
                {isFlipped ? "← Show Features" : "View More →"}
              </button>
            </div>

            {/* Materials */}
            <div className="mt-6 p-3 sm:p-4 border-t-4 border-black border-dashed">
              <h2 className="font-comic text-2xl tracking-wider text-center mb-1">
                Workshop Material Included
              </h2>
              <p className="text-xs sm:text-sm text-center leading-relaxed">
                {plan.materials}
              </p>
            </div>

            <div className="space-y-3">
              {plan.paymentOptions.includes("FULL") && (
                <div className="text-center py-1 bg-[#b9f5d0] border-2 border-black">
                  <p className="font-comic text-base tracking-wider text-black">
                    Full payment plan
                  </p>
                </div>
              )}

              {plan.paymentOptions.includes("EMI") && hasEMI && (
                <div className="text-center py-1 bg-[#ffd2a8] border-2 border-black">
                  <p className="font-comic text-base tracking-wider text-black">
                    Monthly EMI available • Interest Free
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
                className="w-full font-comic text-2xl tracking-widest bg-[#2ed47a] text-black border-4 border-black shadow-[5px_5px_0_#000] py-2 transition hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#000] active:translate-y-1 active:shadow-none"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default PlanCard;
