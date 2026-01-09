import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WorkshopCategory } from "@/types";
import { COLOR_THEME } from "@/constant/constants";
import CarouselHeader from "./carousal/header";
import NavigationArrows from "./carousal/navigationArrow";
import WorkshopCard from "./carousal/card";
import OverviewSection from "./carousal/overViewSection";
import AgeGroupSection from "./carousal/ageGroup";
import WhyChooseSection from "./carousal/whyChooseUs";

interface WorkshopInfoCarouselProps {
  categories: WorkshopCategory[];
  currentCategoryIndex?: number;
  currentWorkshopIndex?: number;
  setCurrentCategoryIndex?: (index: number) => void;
  setCurrentWorkshopIndex?: (index: number) => void;
  direction?: number;
  setDirection?: (direction: number) => void;
}

const WorkshopInfoCarousel = ({
  categories,
  currentCategoryIndex: externalCurrentCategoryIndex,
  currentWorkshopIndex: externalCurrentWorkshopIndex,
  setCurrentCategoryIndex: externalSetCurrentCategoryIndex,
  setCurrentWorkshopIndex: externalSetCurrentWorkshopIndex,
  direction: externalDirection,
  setDirection: externalSetDirection,
}: WorkshopInfoCarouselProps) => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(
    externalCurrentCategoryIndex || 0
  );
  const [currentWorkshopIndex, setCurrentWorkshopIndex] = useState(
    externalCurrentWorkshopIndex || 0
  );
  const [currentAgeGroup, setCurrentAgeGroup] = useState<string>("");
  const [activeSection, setActiveSection] = useState<
    "overview" | "ageGroups" | "whyChoose" | "services" | ""
  >("");
  const [direction, setDirection] = useState(externalDirection || 0);
  const overviewRef = useRef<HTMLDivElement>(null);
  const whyChooseRef = useRef<HTMLDivElement>(null);
  const ageCategoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      externalCurrentCategoryIndex !== undefined &&
      externalCurrentCategoryIndex !== currentCategoryIndex
    ) {
      setCurrentCategoryIndex(externalCurrentCategoryIndex);
      if (
        externalSetDirection &&
        externalCurrentCategoryIndex !== currentCategoryIndex
      ) {
        const newDir =
          externalCurrentCategoryIndex > currentCategoryIndex ? 1 : -1;
        setDirection(newDir);
        externalSetDirection(newDir);
      }
    }
  }, [
    externalCurrentCategoryIndex,
    externalSetDirection,
    currentCategoryIndex,
  ]);

  useEffect(() => {
    if (
      externalCurrentWorkshopIndex !== undefined &&
      externalCurrentWorkshopIndex !== currentWorkshopIndex
    ) {
      setCurrentWorkshopIndex(externalCurrentWorkshopIndex);
      if (
        externalSetDirection &&
        externalCurrentWorkshopIndex !== currentWorkshopIndex
      ) {
        const newDir =
          externalCurrentWorkshopIndex > currentWorkshopIndex ? 1 : -1;
        setDirection(newDir);
        externalSetDirection(newDir);
      }
    }
  }, [
    externalCurrentWorkshopIndex,
    externalSetDirection,
    currentWorkshopIndex,
  ]);

  useEffect(() => {
    setCurrentAgeGroup("");
    setActiveSection("");
  }, [currentCategoryIndex, currentWorkshopIndex]);

  const currentCategory = categories[currentCategoryIndex];
  const currentWorkshop = currentCategory?.workshops[currentWorkshopIndex];
  const currentTheme = COLOR_THEME[currentCategoryIndex % COLOR_THEME.length];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100vw" : "-100vw",
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      zIndex: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100vw" : "-100vw",
      opacity: 0,
      scale: 0.95,
      zIndex: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    if (
      currentWorkshopIndex === currentCategory.workshops.length - 1 &&
      newDirection === 1
    ) {
      const newCategoryIndex =
        currentCategoryIndex === categories.length - 1
          ? 0
          : currentCategoryIndex + 1;
      setCurrentCategoryIndex(newCategoryIndex);
      setCurrentWorkshopIndex(0);
      if (externalSetCurrentCategoryIndex)
        externalSetCurrentCategoryIndex(newCategoryIndex);
      if (externalSetCurrentWorkshopIndex) externalSetCurrentWorkshopIndex(0);
    } else if (currentWorkshopIndex === 0 && newDirection === -1) {
      const newCategoryIndex =
        currentCategoryIndex === 0
          ? categories.length - 1
          : currentCategoryIndex - 1;
      setCurrentCategoryIndex(newCategoryIndex);
      setCurrentWorkshopIndex(
        categories[newCategoryIndex].workshops.length - 1
      );
      if (externalSetCurrentCategoryIndex)
        externalSetCurrentCategoryIndex(newCategoryIndex);
      if (externalSetCurrentWorkshopIndex)
        externalSetCurrentWorkshopIndex(
          categories[newCategoryIndex].workshops.length - 1
        );
    } else {
      const newWorkshopIndex =
        newDirection === 1
          ? currentWorkshopIndex + 1
          : currentWorkshopIndex - 1;
      setCurrentWorkshopIndex(newWorkshopIndex);
      if (externalSetCurrentWorkshopIndex)
        externalSetCurrentWorkshopIndex(newWorkshopIndex);
    }
    if (externalSetDirection) externalSetDirection(newDirection);
  };

  console.log(activeSection, "activvvv");

  if (!categories.length || !currentCategory?.workshops.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-start">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-800">
            No Workshops Available
          </h2>
          <p className="text-gray-600 mt-2">
            Please check back later for new workshops
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl relative">
        <CarouselHeader
          categories={categories}
          currentCategoryIndex={currentCategoryIndex}
          currentWorkshopIndex={currentWorkshopIndex}
          currentTheme={currentTheme}
          setCurrentCategoryIndex={setCurrentCategoryIndex}
          setCurrentWorkshopIndex={setCurrentWorkshopIndex}
          setDirection={setDirection}
          externalSetCurrentCategoryIndex={externalSetCurrentCategoryIndex}
          externalSetCurrentWorkshopIndex={externalSetCurrentWorkshopIndex}
          externalSetDirection={externalSetDirection}
        />
        <div className="relative">
          {categories.length > 1 && <NavigationArrows paginate={paginate} />}
          <div className="md:px-4">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={`${currentCategoryIndex}-${currentWorkshopIndex}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.5 },
                  scale: { duration: 0.5 },
                }}
              >
                <WorkshopCard
                  category={currentCategory}
                  workshop={currentWorkshop}
                  currentTheme={currentTheme}
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  currentAgeGroup={currentAgeGroup}
                  setCurrentAgeGroup={setCurrentAgeGroup}
                  overviewRef={overviewRef}
                  whyChooseRef={whyChooseRef}
                  ageCategoryRef={ageCategoryRef}
                />
                <AnimatePresence mode="wait">
                  {activeSection === "overview" && (
                    <OverviewSection
                      workshop={currentWorkshop}
                      currentTheme={currentTheme}
                      setActiveSection={setActiveSection}
                      setCurrentAgeGroup={setCurrentAgeGroup}
                      overviewRef={overviewRef}
                    />
                  )}
                  {activeSection === "ageGroups" && (
                    <AgeGroupSection
                      workshop={currentWorkshop}
                      currentTheme={currentTheme}
                      currentAgeGroup={currentAgeGroup}
                      setCurrentAgeGroup={setCurrentAgeGroup}
                      ageCategoryRef={ageCategoryRef}
                      setActiveSection={setActiveSection}
                    />
                  )}
                  {activeSection === "whyChoose" && (
                    <WhyChooseSection
                      workshop={currentWorkshop}
                      currentTheme={currentTheme}
                      whyChooseRef={whyChooseRef}
                      setActiveSection={setActiveSection}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopInfoCarousel;
