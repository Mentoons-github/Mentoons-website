import { motion, useScroll, useTransform } from "framer-motion";
import { WorkshopCategory, WorkshopFormValues } from "@/types";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, CSSProperties } from "react";

const INK = "#1f1308";

// ---- inline comic styles ----
const cardStyle: CSSProperties = {
  border: `4px solid ${INK}`,
  boxShadow: `8px 8px 0 ${INK}`,
};

const halftoneStyle: CSSProperties = {
  backgroundImage:
    "radial-gradient(rgba(31,19,8,0.14) 1.5px, transparent 1.6px)",
  backgroundSize: "14px 14px",
};

const titleStyle: CSSProperties = {
  color: "#fff",
  letterSpacing: "0.04em",
  WebkitTextStroke: `clamp(1px, 0.2vw, 3px) ${INK}`,
  paintOrder: "stroke fill",
  textShadow: `3px 3px 0 ${INK}`,
};

const btnBase: CSSProperties = {
  border: `3px solid ${INK}`,
  boxShadow: `3px 3px 0 ${INK}`,
  color: INK,
};

interface WorkshopCardProps {
  category: WorkshopCategory;
  workshop: WorkshopFormValues;
  currentTheme: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    light: string;
    border: string;
  };
  activeSection: "overview" | "ageGroups" | "whyChoose" | "services" | "";
  setActiveSection: (
    section: "overview" | "ageGroups" | "whyChoose" | "services" | "",
  ) => void;
  currentAgeGroup: string;
  setCurrentAgeGroup: (index: string) => void;
  overviewRef: React.RefObject<HTMLDivElement>;
  whyChooseRef: React.RefObject<HTMLDivElement>;
  ageCategoryRef: React.RefObject<HTMLDivElement>;
}

const WorkshopCard = ({
  category,
  workshop,
  currentTheme,
  activeSection,
  setActiveSection,
  currentAgeGroup,
  setCurrentAgeGroup,
  overviewRef,
  whyChooseRef,
  ageCategoryRef,
}: WorkshopCardProps) => {
  const navigate = useNavigate();
  const isFirstRender = useRef(true);
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const cardY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const circleRotate = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const circleRotateReverse = useTransform(scrollYProgress, [0, 1], [0, -180]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (activeSection === "overview") {
      overviewRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    if (activeSection === "whyChoose") {
      whyChooseRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    if (activeSection === "ageGroups") {
      ageCategoryRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeSection]);

  return (
    <motion.div
      ref={cardRef}
      className={`bg-gradient-to-br ${currentTheme.primary} 
                rounded-2xl xs:rounded-3xl 
                p-4 xs:p-6 sm:p-8 
                mb-6 xs:mb-8 
                text-white relative overflow-hidden`}
      layoutId={`workshop-${category.categoryName}-${workshop.workshopName}`}
      style={{ ...cardStyle, y: cardY }}
      initial={{ opacity: 0, scale: 0.9, y: 100 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {/* Halftone dots */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={halftoneStyle}
      />

      {/* Outlined background circles with parallax rotation */}
      <motion.div
        className="absolute top-0 right-0 
                    w-32 h-32 xs:w-48 xs:h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 
                    rounded-full 
                    -translate-y-16 translate-x-16 xs:-translate-y-24 xs:translate-x-24 sm:-translate-y-28 sm:translate-x-28 md:-translate-y-32 md:translate-x-32"
        style={{
          rotate: circleRotate,
          background: "rgba(255,255,255,0.15)",
          border: `3px solid ${INK}`,
        }}
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 1.2, ease: "backOut", delay: 0.2 }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-24 h-24 xs:w-32 xs:h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full 
                    translate-y-12 -translate-x-12 xs:translate-y-16 xs:-translate-x-16 sm:translate-y-20 sm:-translate-x-20 md:translate-y-24 md:-translate-x-24"
        style={{
          rotate: circleRotateReverse,
          background: "rgba(255,255,255,0.15)",
          border: `3px solid ${INK}`,
        }}
        initial={{ scale: 0, rotate: 180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 1.2, ease: "backOut", delay: 0.3 }}
      />

      <div className="relative z-10 lg:flex justify-between">
        <div className="flex flex-col mb-4 xs:mb-6 lg:justify-between lg:min-h-[280px]">
          {/* Workshop title */}
          <motion.h2
            style={titleStyle}
            className="font-comic text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl 
                     leading-tight text-center lg:text-left
                     max-w-full lg:max-w-2xl"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{
              delay: 0.2,
              duration: 0.8,
              ease: [0.25, 0.4, 0.25, 1],
            }}
          >
            {workshop.workshopName}
          </motion.h2>

          <div className="mt-auto">
            {/* Action buttons */}
            <motion.div
              className="flex flex-row flex-wrap justify-center lg:justify-start 
                   gap-2 xs:gap-3 sm:gap-4 mt-6 xs:mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {(["overview", "whyChoose"] as const).map((section, index) => (
                <motion.button
                  key={section}
                  onClick={() => {
                    activeSection === section
                      ? setActiveSection("")
                      : setActiveSection(section);
                    setCurrentAgeGroup("");
                  }}
                  style={{
                    ...btnBase,
                    background: activeSection === section ? "#fde047" : "#fff",
                  }}
                  className="font-comic-chip tracking-wide px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 rounded-xl xs:rounded-2xl text-sm xs:text-base sm:text-lg transition-colors duration-300 
                       min-w-[100px] xs:min-w-[120px] sm:min-w-[140px] text-center"
                  whileHover={{
                    scale: activeSection === section ? 1.05 : 1.03,
                    y: -2,
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{
                    delay: 0.5 + index * 0.1,
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                >
                  {section === "overview" && (
                    <span className="hidden xs:inline">Overview</span>
                  )}
                  {section === "overview" && (
                    <span className="xs:hidden">Info</span>
                  )}
                  {section === "whyChoose" && (
                    <span className="hidden sm:inline">Why Choose Us</span>
                  )}
                  {section === "whyChoose" && (
                    <span className="sm:hidden">Why Us</span>
                  )}
                </motion.button>
              ))}
              {workshop.workshopName
                .toLowerCase()
                .includes("career corner") && (
                <motion.button
                  style={{
                    ...btnBase,
                    color: "#fff",
                    textShadow: `2px 2px 0 ${INK}`,
                  }}
                  className={`font-comic-chip tracking-wide px-6 py-3 rounded-xl bg-gradient-to-r ${currentTheme.accent} hover:opacity-90 transition-all duration-300`}
                  onClick={() => navigate(`/services`)}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                >
                  View Our Services
                </motion.button>
              )}
            </motion.div>

            {/* Indicator dots */}
            <motion.div
              className="mt-4 xs:mt-6 flex justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex gap-2">
                {(["overview", "whyChoose"] as const).map((section, index) => (
                  <motion.div
                    key={section}
                    style={{ border: `2px solid ${INK}` }}
                    className={`w-3 h-3 xs:w-4 xs:h-4 rounded-full transition-all duration-300 ${
                      activeSection === section
                        ? "bg-yellow-300 scale-125"
                        : "bg-white"
                    }`}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: false }}
                    transition={{
                      delay: 0.9 + index * 0.1,
                      type: "spring",
                      stiffness: 300,
                    }}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Age group images */}
        <motion.div
          className="flex items-center justify-center lg:justify-end h-full  
                     gap-2 xs:gap-3 sm:gap-4 
                     flex-wrap lg:flex-nowrap"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {workshop.ageGroups
            .filter((ageGroup) => ageGroup.image)
            .map((ageGroup, index) => (
              <motion.div
                className="h-full flex flex-col justify-between items-center"
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false }}
                transition={{
                  delay: 0.5 + index * 0.15,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                }}
              >
                <motion.img
                  src={ageGroup.image!}
                  alt={`Age group ${ageGroup.ageRange}`}
                  className="h-32 w-32 md:h-40 md:w-40 xl:h-48 xl:w-48 
                           object-cover rounded-lg xs:rounded-xl flex-shrink-0 transition-transform duration-300"
                  style={{
                    border: `3px solid ${INK}`,
                    boxShadow: `4px 4px 0 ${INK}`,
                    background: "#fff",
                  }}
                  title={ageGroup.ageRange}
                  whileHover={{
                    scale: 1.08,
                    rotate: 4,
                    transition: { duration: 0.3 },
                  }}
                  whileTap={{ scale: 0.95 }}
                />
                <div className="flex justify-center mt-6">
                  <motion.button
                    onClick={() => {
                      setCurrentAgeGroup(ageGroup.ageRange);
                      activeSection === "ageGroups" &&
                      currentAgeGroup === ageGroup.ageRange
                        ? setActiveSection("")
                        : setActiveSection("ageGroups");
                    }}
                    style={{
                      ...btnBase,
                      background:
                        currentAgeGroup === ageGroup.ageRange &&
                        activeSection === "ageGroups"
                          ? "#fde047"
                          : "#fff",
                    }}
                    className="font-comic-chip tracking-wide px-6 sm:px-8 py-3 rounded-2xl text-base sm:text-lg transition-colors duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{
                      delay: 0.7 + index * 0.15,
                      type: "spring",
                      stiffness: 150,
                    }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Age {ageGroup.ageRange}
                  </motion.button>
                </div>
              </motion.div>
            ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WorkshopCard;
