import { motion } from "framer-motion";
import { WordRotate } from "../magicui/word-rotate";
import { Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { WorkshopCategory } from "@/types";

interface AboutWorkshopProps {
  headerRef: (node?: Element | null) => void;
  headerInView: boolean;
  fadeIn: Variants;
  fadeInUp: Variants;
  categories: WorkshopCategory[];
}

const AboutWorkshop = ({
  headerRef,
  headerInView,
  fadeIn,
  fadeInUp,
  categories,
}: AboutWorkshopProps) => {
  const workshopImages = categories
    .map((category) =>
      category.workshops.map((workshop) =>
        workshop.ageGroups.map((group) => group.image)
      )
    )
    .flat(2)
    .filter((image): image is string => image !== null);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (workshopImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % workshopImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [workshopImages.length]);

  return (
    <motion.div
      ref={headerRef}
      initial="hidden"
      animate={headerInView ? "visible" : "hidden"}
      variants={fadeIn}
      className="relative flex flex-col md:flex-row justify-between items-center overflow-hidden w-full px-4 sm:px-6 md:px-8 py-8 md:py-12"
    >
      {/* LEFT SECTION */}
      <motion.div
        variants={fadeInUp}
        className="flex-1 w-full max-w-2xl px-4 sm:px-6 md:px-8 pt-8 md:pt-12 text-center md:text-left"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
          Workshops At Mentoons
        </h1>
        <div className="mt-3">
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
            className="text-lg sm:text-xl md:text-2xl w-full md:w-[80%] mx-auto md:mx-0"
          />
        </div>
        <p className="text-base sm:text-lg md:text-xl w-full md:w-[80%] mt-4 pb-4 mx-auto md:mx-0">
          At Mentoons, we conduct informative and interactive workshops that
          provide an effective and transformative experience for our
          participants.
        </p>
        <p className="text-base sm:text-lg md:text-xl w-full md:w-[80%] mt-2 pb-6 mx-auto md:mx-0">
          Our expert-led workshops empower children, teens, and young adults to
          build healthier relationships with technology—without compromising
          fun, connection, or creativity.
        </p>
      </motion.div>

      {/* RIGHT SECTION - IMAGE CAROUSEL */}
      <div className="flex items-center justify-center w-full max-w-md md:max-w-lg flex-1 mt-6 md:mt-0 relative px-4">
        {workshopImages.length > 0 ? (
          <motion.img
            key={currentIndex}
            src={workshopImages[currentIndex]}
            alt={`workshop-${currentIndex}`}
            className="shadow-lg object-cover h-64 w-64 sm:h-80 sm:w-80 md:h-96 md:w-96 rounded-full"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
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
      </div>
    </motion.div>
  );
};

export default AboutWorkshop;
