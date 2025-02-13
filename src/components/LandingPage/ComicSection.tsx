import { motion } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export const letters = ["M", "E", "N", "T", "O", "O", "N", "S"];
export const colors = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "purple",
  "purple",
];

const ComicSection = () => {
  const [ref, inView] = useInView({ threshold: 0.2 });
  const cloudVariants = {
    hidden: { x: -100, opacity: 0.3 },
    visible: {
      x: [0, 50, -50, 0],
      opacity: 0.5,
      transition: { duration: 10, repeat: Infinity, ease: "linear" },
    },
  };

  const contentVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "tween", duration: 3, ease: "easeInOut" },
    },
  };

  useEffect(() => {
    // This triggers any additional logic when the section enters or exits view
    console.log("ComicSection is in view:", inView);
  }, [inView]);

  return (
    <div
      ref={ref}
      className="w-full relative z-10 overflow-hidden"
      style={{
        background:
          "linear-gradient(177.47deg, #FAFDEE 93.25%, #8CB301 108.11%)",
      }}
    >
      {/* Cloud Animation */}
      <motion.img
        src="/assets/LandingPage/clouds.png"
        alt="comic-bg"
        className="absolute top-0 left-0 w-full object-contain z-20"
        style={{ opacity: 0.5 }}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={cloudVariants}
      />

      {/* Content Animation */}
      <motion.div
        className="flex justify-center items-center w-[80%] mx-auto"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={contentVariants}
      >
        <figure className="max-w-fit relative left-[8%]">
          <img
            src="/assets/LandingPage/comic-bnr.png"
            alt="comic"
            className="w-full h-full object-contain"
          />
          <div className="absolute bottom-[30%] top-1/2 left-[28%] transform -translate-x-1/2 flex flex-col items-center justify-center">
            <h1 className="text-[0.63rem] lg:text-3xl whitespace-nowrap text-center">
              COMIC BASED
              <br />
              <div className="flex justify-center">
                {letters.map((letter, index) => (
                  <motion.span
                    key={index}
                    className={`text-${colors[index]}-500 hover:scale-110 transition-transform`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            </h1>
          </div>
        </figure>
        <figure className="w-[40rem]">
          <img
            src="/assets/LandingPage/plane.png"
            alt="plane"
            className="w-full h-full object-contain"
          />
        </figure>
      </motion.div>

      {/* Grass Image */}
      <img
        src="/assets/LandingPage/grass.png"
        alt="comic-bg"
        className="absolute bottom-0 left-0 w-full object-contain z-20"
      />
    </div>
  );
};

export default ComicSection;
