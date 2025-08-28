import { useState } from "react";
import { motion } from "framer-motion";

const WorkshopInfoCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const workshops = [
    {
      title: "Workshops Held For Ages 6-12",
      age: "6-12",
      focus: "Reducing screen dependency, encouraging creativity and empathy",
      activities: [
        "Story-based lessons",
        "Digital-free play challenges",
        "Painting & role-playing to understand emotions",
      ],
      image: "/assets/workshopv2/buddycamp/buddy-camp-logo.png",
      color: "#EC9600",
      bgGradient: "from-orange-100 to-yellow-50",
    },
    {
      title: "Workshops Held For Ages 13-19",
      age: "13-19",
      focus: "Breaking free from gaming & social media cycles",
      activities: [
        "Guided journaling",
        "Social detox challenges",
        "Peer-led discussion circles",
      ],
      image: "/assets/workshopv2/teencamp/teen-camp-logo.png",
      color: "#007AFF",
      bgGradient: "from-blue-100 to-sky-50",
    },
    {
      title: "Workshops Held For Ages 20+",
      age: "20+",
      focus:
        "Managing content overload, improving attention & emotional clarity",
      activities: [
        "Digital self-assessment",
        "Dopamine detox exercises",
        "Habit loop rewiring",
      ],
      image: "/assets/workshopv2/careercorner/career-corner-logo.png",
      color: "#DC2626",
      bgGradient: "from-red-100 to-rose-50",
    },
  ];

  return (
    <div className="relative mt-10">
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {workshops.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center md:items-start justify-center gap-4 min-w-full min-h-[500px] px-4 py-8 md:py-0"
            >
              <div className="flex flex-col flex-1 order-2 max-w-2xl gap-4 md:order-1">
                <h3 className="pb-4 text-3xl font-semibold text-center md:pb-8 md:text-5xl md:text-left">
                  Workshops Held for{" "}
                  <span
                    key={`age-${index}`}
                    style={{ color: item.color }}
                    className="inline-block font-bold text-8xl mt-2"
                  >
                    {`Age ${item.age}`.split("").map((char, charIndex) => (
                      <motion.span
                        key={`${index}-${charIndex}`}
                        initial={{ scale: 1 }}
                        animate={{
                          scale: [1, 1.3, 1],
                        }}
                        transition={{
                          duration: 0.6,
                          delay: charIndex * 0.1,
                          repeat: Infinity,
                          repeatDelay: 2,
                          ease: "easeInOut",
                        }}
                        className="inline-block"
                        style={{
                          transformOrigin: "center bottom",
                        }}
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    ))}
                  </span>
                </h3>
                <motion.p
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="pb-4 text-lg font-medium text-center md:text-xl md:text-left"
                >
                  <span className="font-semibold">Focus:</span> {item.focus}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="space-y-2 font-semibold"
                >
                  <h4 className="pb-4 text-xl font-semibold text-center md:text-left">
                    Activities:
                  </h4>
                  {item.activities.map((activity, actIndex) => (
                    <motion.li
                      key={actIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.8 + actIndex * 0.1,
                        duration: 0.4,
                      }}
                      className="pl-4 text-base text-center list-disc list-inside md:text-lg md:text-left"
                    >
                      {activity}
                    </motion.li>
                  ))}
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="flex justify-center flex-1 order-1 w-full max-w-2xl md:justify-end md:order-2 md:w-auto"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="object-contain w-full md:w-auto shadow-lg h-[300px] md:h-[400px] rounded-lg hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : 2))}
          className="absolute z-10 p-2 -translate-y-1/2 rounded-full shadow-lg left-2 md:left-4 top-1/2 bg-white/80 hover:bg-white transition-all duration-200 hover:scale-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 md:w-6 md:h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev < 2 ? prev + 1 : 0))}
          className="absolute z-10 p-2 -translate-y-1/2 rounded-full shadow-lg right-2 md:right-4 top-1/2 bg-white/80 hover:bg-white transition-all duration-200 hover:scale-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 md:w-6 md:h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
        <div className="absolute flex gap-2 -translate-x-1/2 bottom-4 left-1/2">
          {[0, 1, 2].map((index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                currentSlide === index ? "bg-blue-600 shadow-lg" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkshopInfoCarousel;
