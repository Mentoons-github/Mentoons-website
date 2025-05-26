import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const WhatWeOffer = ({
  onActionButtonClick,
}: {
  onActionButtonClick: () => void;
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const details = {
    Workshops:
      "Engaging sessions for all ages, including music and art therapy, storytelling, revival of ancient values.",
    "Comics & Audio Comics":
      "Engaging stories that inspire creativity and teach positive values, providing a healthy alternative to excessive screen time and helping children develop focus and imagination.",
    Podcasts:
      "Engaging discussions offering practical advice to manage digital distractions, build self-control, and promote emotional well-being for children and families.",
    Assessments:
      "Tools to identify and address social media and mobile addiction, offering personalized guidance to improve academic focus and overall personal growth.",
  };

  const scrollToSubscription = () => {
    document
      .getElementById("subscription")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBrowsePlansClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (location.pathname !== "/mentoons") {
      navigate("/mentoons");
      setTimeout(scrollToSubscription, 500);
    } else {
      scrollToSubscription();
    }
  };

  return (
    <div className="p-5 font-inter bg-[#FFEDD5]">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="text-[#F97316] text-3xl font-bold">What We Offer</h1>

        <motion.button
          onClick={onActionButtonClick}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          className="flex items-center justify-center bg-orange-400 rounded-full shadow-lg hover:scale-105 transition-transform z-10
            w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
          aria-label="Create new post"
        >
          <img
            src="/assets/home/homepage fillers/sir Illustration.png"
            alt="Action button icon"
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
          />
        </motion.button>
      </div>

      <ul className="mx-auto space-y-4 mt-6">
        {Object.entries(details).map(([key, value], index) => (
          <li key={index}>
            <button
              className="w-full text-left flex items-start gap-2 md:gap-5 bg-white hover:bg-orange-100 text-gray-700 p-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
              onClick={handleBrowsePlansClick}
              aria-label={`Learn more about ${key}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-orange-500 h-5 w-5 md:h-6 md:w-6 flex-shrink-0 mt-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
              <div>
                <span className="text-orange-500 font-bold">{key}</span>:{" "}
                {value}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WhatWeOffer;
