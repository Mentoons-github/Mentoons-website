import { useEffect, useRef, useState, CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WorkshopCategory } from "@/types";
import { COLOR_THEME } from "@/constant/constants";
import CarouselHeader from "./carousal/header";
import NavigationArrows from "./carousal/navigationArrow";
import WorkshopCard from "./carousal/card";
import OverviewSection from "./carousal/overViewSection";
import AgeGroupSection from "./carousal/ageGroup";
import WhyChooseSection from "./carousal/whyChooseUs";

const INK = "#1f1308";

// ---- inline comic styles ----
const halftoneStyle: CSSProperties = {
  backgroundImage:
    "radial-gradient(rgba(31,19,8,0.12) 1.5px, transparent 1.6px)",
  backgroundSize: "14px 14px",
};

const panelStyle: CSSProperties = {
  background: "#fff",
  border: `3px solid ${INK}`,
  borderRadius: 14,
  boxShadow: `5px 5px 0 ${INK}`,
};

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
    externalCurrentCategoryIndex || 0,
  );
  const [currentWorkshopIndex, setCurrentWorkshopIndex] = useState(
    externalCurrentWorkshopIndex || 0,
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
        categories[newCategoryIndex].workshops.length - 1,
      );
      if (externalSetCurrentCategoryIndex)
        externalSetCurrentCategoryIndex(newCategoryIndex);
      if (externalSetCurrentWorkshopIndex)
        externalSetCurrentWorkshopIndex(
          categories[newCategoryIndex].workshops.length - 1,
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

  if (!categories.length || !currentCategory?.workshops.length) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#fff7e6" }}
      >
        <div className="text-start p-6" style={panelStyle}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-full mb-4"
            style={{
              border: `5px solid ${INK}`,
              borderTopColor: "#fb923c",
            }}
          />
          <h2
            className="font-comic text-3xl tracking-wide"
            style={{ color: INK }}
          >
            No Workshops Available
          </h2>
          <p className="mt-2" style={{ color: INK }}>
            Please check back later for new workshops
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative lg:min-h-screen" style={{ background: "#fff7e6" }}>
      {/* Halftone dots */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={halftoneStyle}
      />

      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
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
