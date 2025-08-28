import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useState } from "react";

const WhatWeOffer = ({
  onActionButtonClick,
}: {
  onActionButtonClick: () => void;
}) => {
  const details = {
    Workshops: {
      description:
        "Engaging sessions for all ages, including music and art therapy, storytelling, revival of ancient values, study skills, and a basic introduction to spirituality.",
      link: "/mentoons-workshops",
    },
    "Comics & Audio Comics": {
      description:
        "Engaging stories that inspire creativity and teach positive values, providing a healthy alternative to excessive screen time and helping children develop focus and imagination.",
      link: "/mentoons-comics?option=comic",
    },
    Podcasts: {
      description:
        "Engaging discussions offering practical advice to manage digital distractions, build self-control, and promote emotional well-being for children and families.",
      link: "/mentoons-podcast",
    },
    Assessments: {
      description:
        "Tools to identify and address social media and mobile addiction, offering personalized guidance to improve academic focus and overall personal growth.",
      link: "/assessment-page",
    },
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleDetails = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="p-5 font-inter bg-[#FFEDD5] rounded-xl">
      <div className="flex items-center justify-between gap-4 mb-4">
        <button
          onClick={toggleDetails}
          className="flex items-center gap-2 text-[#F97316] text-3xl font-bold whitespace-nowrap focus:outline-none focus:ring-0 active:outline-none active:ring-0"
          aria-expanded={isOpen}
          aria-controls="details-section"
        >
          What We Offer
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-orange-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        </button>

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
          className="flex items-center justify-center bg-orange-400 rounded-full shadow-lg hover:scale-105 transition-transform z-10 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 focus:outline-none focus:ring-0 active:outline-none active:ring-0"
          aria-label="Create new post"
        >
          <img
            src="/assets/home/homepage fillers/sir Illustration.png"
            alt="Action button icon"
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
          />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            id="details-section"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mx-auto space-y-4 mt-6 overflow-hidden"
          >
            {Object.entries(details).map(([key, value], index) => (
              <li key={index}>
                <NavLink
                  to={value.link}
                  className="w-full text-left flex items-start gap-2 md:gap-5 bg-white hover:bg-orange-100 text-gray-700 p-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                  <div>
                    <span className="text-orange-500 font-bold">{key}</span>:{" "}
                    {value.description}
                  </div>
                </NavLink>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WhatWeOffer;
