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

  // Track whether we're on a mobile viewport. Below lg, we skip the
  // scroll-linked fade/translate on the text block entirely, since on
  // short mobile viewports the scroll range needed to reach opacity: 1
  // often isn't fully traversed, leaving text stuck partially hidden.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const titleOpacityRaw = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0, 1, 1, 1],
  );
  const titleXRaw = useTransform(scrollYProgress, [0, 0.3], [-100, 0]);

  const rotateOpacityRaw = useTransform(
    scrollYProgress,
    [0.1, 0.4, 0.7, 1],
    [0, 1, 1, 1],
  );
  const rotateYRaw = useTransform(scrollYProgress, [0.1, 0.4], [30, 0]);

  const para1OpacityRaw = useTransform(
    scrollYProgress,
    [0.2, 0.5, 0.7, 1],
    [0, 1, 1, 1],
  );
  const para1YRaw = useTransform(scrollYProgress, [0.2, 0.5], [40, 0]);

  const para2OpacityRaw = useTransform(
    scrollYProgress,
    [0.3, 0.6, 0.7, 1],
    [0, 1, 1, 1],
  );
  const para2YRaw = useTransform(scrollYProgress, [0.3, 0.6], [40, 0]);

  const imageOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.5, 0.7, 1],
    [0, 1, 1, 1],
  );
  const imageX = useTransform(scrollYProgress, [0.2, 0.5], [200, 0]);
  const imageRotate = useTransform(scrollYProgress, [0.2, 0.5], [15, 0]);
  const imageScale = useTransform(scrollYProgress, [0.2, 0.5], [0.8, 1]);

  // On mobile, force these to static "settled" values (fully visible,
  // no offset) instead of the scroll-driven ones, so the text always shows.
  const titleOpacity = isMobile ? 1 : titleOpacityRaw;
  const titleX = isMobile ? 0 : titleXRaw;
  const rotateOpacity = isMobile ? 1 : rotateOpacityRaw;
  const rotateY = isMobile ? 0 : rotateYRaw;
  const para1Opacity = isMobile ? 1 : para1OpacityRaw;
  const para1Y = isMobile ? 0 : para1YRaw;
  const para2Opacity = isMobile ? 1 : para2OpacityRaw;
  const para2Y = isMobile ? 0 : para2YRaw;

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
        className="flex flex-col items-center justify-center w-full max-w-md md:max-w-lg flex-1 mt-10 md:mt-0 relative px-4"
      >
        {/* soft color blob behind the card */}
        <div className="absolute w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-orange-200/50 rounded-[40%] blur-2xl -z-10" />

        {workshopImages.length > 0 ? (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="relative bg-white p-3 sm:p-4 pb-8 sm:pb-10 rounded-2xl shadow-2xl border border-gray-100 w-64 sm:w-80 md:w-96"
          >
            <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
              <img
                src={workshopImages[currentIndex]}
                alt={`workshop-${currentIndex}`}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rotate-2 bg-orange-500 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-md">
              Workshop Moments
            </span>
          </motion.div>
        ) : (
          <div className="relative bg-white p-3 sm:p-4 rounded-2xl shadow-2xl border border-gray-100 w-64 sm:w-80 md:w-96">
            <img
              src="/assets/workshopv2/workshopNew.png"
              alt="default-workshop"
              className="rounded-xl object-contain w-full aspect-square"
            />
          </div>
        )}

        {workshopImages.length > 1 && (
          <div className="mt-4 sm:mt-5 flex gap-2">
            {workshopImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentIndex
                    ? "bg-orange-500 w-5"
                    : "bg-gray-300 w-2 hover:bg-gray-400"
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
