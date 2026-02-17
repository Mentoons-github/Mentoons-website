import { motion, useScroll, useTransform } from "framer-motion";
import { WordRotate } from "../magicui/word-rotate";
import { useEffect, useState, useRef } from "react";
import { WorkshopCategory } from "@/types";

interface AboutWorkshopProps {
  categories: WorkshopCategory[];
}

const AboutWorkshop = ({ categories }: AboutWorkshopProps) => {
  const workshopImages = categories
    .map((category) =>
      category.workshops.map((workshop) =>
        workshop.ageGroups.map((group) => group.image),
      ),
    )
    .flat(2)
    .filter((image): image is string => image !== null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0, 1, 1, 1],
  );
  const titleX = useTransform(scrollYProgress, [0, 0.3], [-100, 0]);

  const rotateOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.4, 0.7, 1],
    [0, 1, 1, 1],
  );
  const rotateY = useTransform(scrollYProgress, [0.1, 0.4], [30, 0]);

  const para1Opacity = useTransform(
    scrollYProgress,
    [0.2, 0.5, 0.7, 1],
    [0, 1, 1, 1],
  );
  const para1Y = useTransform(scrollYProgress, [0.2, 0.5], [40, 0]);

  const para2Opacity = useTransform(
    scrollYProgress,
    [0.3, 0.6, 0.7, 1],
    [0, 1, 1, 1],
  );
  const para2Y = useTransform(scrollYProgress, [0.3, 0.6], [40, 0]);

  const imageOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.5, 0.7, 1],
    [0, 1, 1, 1],
  );
  const imageX = useTransform(scrollYProgress, [0.2, 0.5], [200, 0]);
  const imageRotate = useTransform(scrollYProgress, [0.2, 0.5], [15, 0]);
  const imageScale = useTransform(scrollYProgress, [0.2, 0.5], [0.8, 1]);

  useEffect(() => {
    if (workshopImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % workshopImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [workshopImages.length]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col lg:flex-row justify-between items-center overflow-hidden w-full px-4 lg:px-8 py-8 md:py-12 min-h-screen"
    >
      <div className="flex-1 w-full max-w-4xl px-2 lg:px-8 pt-8 md:pt-12 md:text-left">
        <motion.h1
          style={{ opacity: titleOpacity, x: titleX }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4"
        >
          Workshops At Mentoons
        </motion.h1>

        <motion.div
          style={{ opacity: rotateOpacity, y: rotateY }}
          className="mt-3"
        >
          <WordRotate
            motionProps={{
              initial: { opacity: 1, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.5, ease: "easeInOut" },
            }}
            words={[
              "Fun and Creative Workshops for Kids",
              "Offline and Online Workshops Available",
              "Led By Psychologists and Academicians",
            ]}
            className="text-lg sm:text-xl md:text-2xl w-full md:w-[80%] mx-auto md:mx-0 text-orange-500"
          />
        </motion.div>

        <motion.p
          style={{ opacity: para1Opacity, y: para1Y }}
          className="text-base sm:text-lg md:text-xl w-full md:w-[80%] mt-2 pb-6 mx-auto md:mx-0"
        >
          These are specially designed workshops aimed at social media
          de-addiction, cell-phone de-addiction, and gaming de-addiction by
          improving productivity and overall quality of life.
        </motion.p>

        <motion.p
          style={{ opacity: para2Opacity, y: para2Y }}
          className="text-base sm:text-lg md:text-xl w-full md:w-[80%] pb-6 mx-auto md:mx-0"
        >
          Our team of Psychology Graduates, Certified Career Experts, and Human
          Resources Experts, all trained in child psychology, work together to
          provide a safe and supportive environment for our participants.
        </motion.p>
      </div>

      <motion.div
        style={{
          opacity: imageOpacity,
          x: imageX,
          rotate: imageRotate,
          scale: imageScale,
        }}
        className="flex items-center justify-center w-full max-w-md md:max-w-lg flex-1 mt-6 md:mt-0 relative px-4"
      >
        {workshopImages.length > 0 ? (
          <motion.img
            key={currentIndex}
            src={workshopImages[currentIndex]}
            alt={`workshop-${currentIndex}`}
            className="shadow-2xl object-cover h-64 w-64 sm:h-80 sm:w-80 md:h-96 md:w-96 rounded-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          />
        ) : (
          <img
            src="/assets/workshopv2/workshopNew.png"
            alt="default-workshop"
            className="rounded-2xl shadow-lg object-contain max-h-64 sm:max-h-80 md:max-h-96 w-full"
          />
        )}

        {workshopImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
            {workshopImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 w-2 rounded-full transition-all ${
                  i === currentIndex ? "bg-primary w-4" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AboutWorkshop;
