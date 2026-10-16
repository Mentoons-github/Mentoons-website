import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, CSSProperties } from "react";
import { WorkshopCategory } from "@/types";

const INK = "#1f1308";

// ---- inline comic styles ----
const headingStyle: CSSProperties = {
  color: INK,
  letterSpacing: "0.03em",
  lineHeight: 1.05,
  textShadow: "3px 3px 0 #fb923c",
};

const pillBase: CSSProperties = {
  border: `3px solid ${INK}`,
  boxShadow: `3px 3px 0 ${INK}`,
};

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
    offset: ["start 85%", "end 15%"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -25]);
  const buttonsY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [-2, 6]);

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
        style={{ ...headingStyle, y: titleY }}
        className="font-comic text-5xl md:text-7xl mb-4 text-start"
      >
        {categories[currentCategoryIndex].categoryName}
      </motion.h1>

      {categories[currentCategoryIndex].description ? (
        <motion.p
          style={{ y: contentY, color: INK }}
          className="text-xl text-start font-medium"
        >
          {categories[currentCategoryIndex].description}
        </motion.p>
      ) : (
        <motion.p
          style={{ y: contentY, color: INK }}
          className="text-xl text-start font-medium"
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
            style={{
              ...pillBase,
              color: currentCategoryIndex === index ? "#fff" : INK,
              textShadow:
                currentCategoryIndex === index ? `2px 2px 0 ${INK}` : "none",
            }}
            className={`font-comic-chip tracking-wide px-4 py-2 rounded-full transition-all duration-300 hover:-translate-y-0.5 ${
              currentCategoryIndex === index
                ? `bg-gradient-to-r ${currentTheme.primary}`
                : "bg-white hover:bg-orange-100"
            }`}
          >
            {categories[index].categoryName}
          </button>
        ))}
      </motion.div>

      {/* Workshop indicators */}
      <div className="flex flex-wrap justify-start gap-3 mt-5">
        {categories[currentCategoryIndex].workshops.map((_, index) => (
          <button
            key={index}
            onClick={() => handleWorkshopClick(index)}
            aria-label={`Show workshop ${index + 1}`}
            style={{ border: `2px solid ${INK}` }}
            className={`h-4 rounded-full transition-all duration-300 ${
              currentWorkshopIndex === index
                ? `w-12 bg-gradient-to-r ${currentTheme.primary}`
                : "w-4 bg-white hover:bg-orange-200"
            }`}
          />
        ))}
      </div>

      {/* Decorative image */}
      <motion.img
        src="https://mentoons-products.s3.ap-northeast-1.amazonaws.com/uploads/OpinionJournal/1787297731778-f7efe25d-e02b-4bf0-b9d6-ed6458d8cf66.png"
        alt="Decorative growth sparkle"
        className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 object-contain -mr-4 -mt-8 md:-mr-6 md:-mt-10 pointer-events-none"
        style={{
          y: imageY,
          scale: imageScale,
          rotate: imageRotate,
          filter: `drop-shadow(3px 3px 0 ${INK})`,
        }}
        whileHover={{ scale: 1.12, rotate: 12 }}
      />
    </motion.div>
  );
};

export default CarouselHeader;
