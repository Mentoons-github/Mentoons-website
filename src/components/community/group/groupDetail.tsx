import { Group } from "@/types";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

const GroupBanner = ({ group }: { group: Group }) => {
  const headingText = group.name.toUpperCase();
  const paragraphText = group.details.subTitle;
  const headingWords = headingText.split(" ");
  const paragraphWords = paragraphText.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const paragraphContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 1.2,
      },
    },
  };

  const wordVariants = {
    hidden: {
      x: -100,
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
        duration: 0.6,
      },
    },
  };

  const paragraphWordVariants = {
    hidden: {
      x: -60,
      opacity: 0,
      y: 20,
    },
    visible: {
      x: 0,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 300,
        duration: 0.5,
      },
    },
  };

  const videoContainerVariants = {
    hidden: {
      opacity: 0,
      x: 100,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
        delay: 2,
        duration: 0.8,
      },
    },
  };

  return (
    <div className="relative flex items-center justify-between h-[80vh] bg-orange-400 p-10 overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[calc(151%+1.3px)] h-[172px]"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-white"
          />
        </svg>
      </div>

      {/* Left side - Text content */}
      <div className="relative z-10 space-y-5 ml-10 flex-1">
        {/* Animated Heading with word velocity */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-7xl font-extrabold tracking-wider text-shadow-xl text-white max-w-4xl"
        >
          {headingWords.map((word, index) => (
            <motion.span
              key={index}
              variants={wordVariants}
              className="inline-block mr-4"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>
        <motion.p
          variants={paragraphContainerVariants}
          initial="hidden"
          animate="visible"
          className="text-2xl tracking-wider max-w-2xl font-semibold text-white"
        >
          {paragraphWords.map((word, index) => (
            <motion.span
              key={index}
              variants={paragraphWordVariants}
              className="inline-block mr-2"
            >
              {word}
            </motion.span>
          ))}
        </motion.p>
      </div>

      {/* Right side - Video section */}
      <motion.div
        variants={videoContainerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mr-16 flex-shrink-0"
      >
        <div className="relative w-96 h-64 bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          {/* Video element */}
          <video
            className="w-full h-full object-cover"
            controls
            src="https://res.cloudinary.com/dacwu8tri/video/upload/v1741671026/We_know_THE_STRUGGLES_our_youth_is_facing_03_ebzeuu.mp4"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute inset-0 w-20 h-20 m-auto bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all duration-300"
            >
              <Play className="w-8 h-8 text-white ml-1" fill="white" />
            </motion.button>
          </video>

          {/* Video title overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
            <h3 className="text-white font-semibold text-lg">
              Understanding {group.name}
            </h3>
            <p className="text-white/80 text-sm">Watch our expert insights</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GroupBanner;
