import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { WorkshopCategory } from "@/types";

interface CarouselHeaderProps {
  categories: WorkshopCategory[];
  currentCategoryIndex: number;
  currentWorkshopIndex: number;
  currentTheme: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    light: string;
    border: string;
  };
  setCurrentCategoryIndex: (index: number) => void;
  setCurrentWorkshopIndex: (index: number) => void;
  setDirection: (direction: number) => void;
  externalSetCurrentCategoryIndex?: (index: number) => void;
  externalSetCurrentWorkshopIndex?: (index: number) => void;
  externalSetDirection?: (direction: number) => void;
}

const CarouselHeader = ({
  categories,
  currentCategoryIndex,
  currentWorkshopIndex,
  currentTheme,
  setCurrentCategoryIndex,
  setCurrentWorkshopIndex,
  setDirection,
  externalSetCurrentCategoryIndex,
  externalSetCurrentWorkshopIndex,
  externalSetDirection,
}: CarouselHeaderProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 15%"], // Starts earlier, ends later → gentler over longer scroll distance
  });

  // Very subtle movements – nothing disappears or moves dramatically
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -25]);
  const buttonsY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -90]); // decorative image moves more (classic parallax)
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]); // tiny gentle zoom
  const imageRotate = useTransform(scrollYProgress, [0, 1], [-2, 6]); // soft rotation

  const handleCategoryClick = (index: number) => {
    const newDirection = index > currentCategoryIndex ? 1 : -1;
    setDirection(newDirection);
    setCurrentCategoryIndex(index);
    setCurrentWorkshopIndex(0);
    if (externalSetCurrentCategoryIndex) externalSetCurrentCategoryIndex(index);
    if (externalSetCurrentWorkshopIndex) externalSetCurrentWorkshopIndex(0);
    if (externalSetDirection) externalSetDirection(newDirection);
  };

  const handleWorkshopClick = (index: number) => {
    const newDirection = index > currentWorkshopIndex ? 1 : -1;
    setDirection(newDirection);
    setCurrentWorkshopIndex(index);
    if (externalSetCurrentWorkshopIndex) externalSetCurrentWorkshopIndex(index);
    if (externalSetDirection) externalSetDirection(newDirection);
  };

  return (
    <motion.div ref={ref} className="mb-12 relative">
      <motion.h1
        style={{ y: titleY }}
        className="text-4xl md:text-7xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4 text-start"
      >
        {categories[currentCategoryIndex].categoryName}
      </motion.h1>

      {categories[currentCategoryIndex].description ? (
        <motion.p
          style={{ y: contentY }}
          className="text-xl text-slate-600 text-start"
        >
          {categories[currentCategoryIndex].description}
        </motion.p>
      ) : (
        <motion.p
          style={{ y: contentY }}
          className="text-xl text-slate-600 text-start"
        >
          Discover engaging, educational experiences designed to inspire and
          nurture young minds
        </motion.p>
      )}

      {/* Category buttons */}
      <motion.div
        style={{ y: buttonsY }}
        className="flex flex-wrap justify-start gap-3 mt-8"
      >
        {categories.map((_, index) => (
          <button
            key={index}
            onClick={() => handleCategoryClick(index)}
            className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
              currentCategoryIndex === index
                ? `bg-gradient-to-r ${currentTheme.primary} text-white`
                : "bg-slate-200 text-gray-600 hover:bg-slate-300"
            }`}
          >
            {categories[index].categoryName}
          </button>
        ))}
      </motion.div>

      {/* Workshop indicators – kept static so they're always easy to click */}
      <div className="flex flex-wrap justify-start gap-3 mt-4">
        {categories[currentCategoryIndex].workshops.map((_, index) => (
          <button
            key={index}
            onClick={() => handleWorkshopClick(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              currentWorkshopIndex === index
                ? `w-12 bg-gradient-to-r ${currentTheme.primary}`
                : "w-3 bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>

      {/* Decorative image – main parallax hero */}
      <motion.img
        src="/assets/workshopv2/our-children.png"
        alt="Decorative growth sparkle"
        className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 object-contain -mr-4 -mt-8 md:-mr-6 md:-mt-10 pointer-events-none"
        style={{
          y: imageY,
          scale: imageScale,
          rotate: imageRotate,
        }}
        whileHover={{ scale: 1.12, rotate: 12 }}
      />
    </motion.div>
  );
};

export default CarouselHeader;
