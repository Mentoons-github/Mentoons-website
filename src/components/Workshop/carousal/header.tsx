import { motion } from "framer-motion";
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
  const handleCategoryClick = (index: number) => {
    const newDirection = index > currentCategoryIndex ? 1 : -1;
    setDirection(newDirection);
    setCurrentCategoryIndex(index);
    setCurrentWorkshopIndex(0);
    // Sync to external
    if (externalSetCurrentCategoryIndex) {
      externalSetCurrentCategoryIndex(index);
    }
    if (externalSetCurrentWorkshopIndex) {
      externalSetCurrentWorkshopIndex(0);
    }
    if (externalSetDirection) {
      externalSetDirection(newDirection);
    }
  };


  const handleWorkshopClick = (index: number) => {
    const newDirection = index > currentWorkshopIndex ? 1 : -1;
    setDirection(newDirection);
    setCurrentWorkshopIndex(index);
    if (externalSetCurrentWorkshopIndex) {
      externalSetCurrentWorkshopIndex(index);
    }
    if (externalSetDirection) {
      externalSetDirection(newDirection);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4 text-start">
        {categories[currentCategoryIndex].categoryName}
      </h1>
      <p className="text-xl text-slate-600 text-start">
        Discover engaging, educational experiences designed to inspire and
        nurture young minds
      </p>

      {/* Workshop indicators */}
      <div className="flex flex-wrap justify-start gap-3 mt-8">
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

      {/* Category buttons */}
      <div className="flex justify-start gap-3 mt-4">
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
      </div>
    </motion.div>
  );
};

export default CarouselHeader;
