import { motion } from "framer-motion";
import "./banner.css";
import { WorkshopCategory } from "@/types";
import { WORKSHOP_TYPE_IMAGES } from "@/constant/workshops/colorTheme";

interface WorkshopBannerProps {
  categories: WorkshopCategory[];
  onWorkshopClick: (categoryIndex: number, workshopName: string) => void;
}

const WorkshopBanner = ({
  categories,
  onWorkshopClick,
}: WorkshopBannerProps) => {
  return (
    <div
      className="relative bg-orange-400 min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] xl:min-h-[82vh] flex items-center justify-center overflow-hidden border-0 outline-none"
      style={{ border: "none", boxShadow: "none" }}
    >
      <motion.img
        src="/assets/workshopv2/fillers/pencil_boy.png.png"
        alt="happy-boy"
        className="absolute w-8 h-10 xs:w-10 xs:h-14 sm:w-12 sm:h-16 md:w-16 md:h-20 lg:w-20 lg:h-28 xl:w-24 xl:h-32 
                   left-2 xs:left-3 sm:left-6 md:left-10 lg:left-20 
                   top-4 xs:top-5 sm:top-6 md:top-8 lg:top-10 z-20"
        initial={{ opacity: 0, x: -50, rotate: -10 }}
        animate={{
          opacity: 1,
          x: 0,
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          opacity: { duration: 1 },
          x: { duration: 1 },
          rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        }}
        whileHover={{ scale: 1.1, rotate: 10 }}
      />

      {/* SVG decoration - better responsive positioning */}
      <motion.div
        className="absolute right-2 xs:right-3 sm:right-6 md:right-10 lg:right-20 
                             bottom-2 xs:bottom-4 sm:bottom-6 md:bottom-10 lg:bottom-20 z-20"
      >
        <motion.img
          src="/assets/workshopv2/fillers/SVG.png"
          alt="decorative-svg"
          className="relative w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-36 xl:h-36"
          initial={{ opacity: 0, scale: 0.5, rotate: 180 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: 0,
          }}
          transition={{ duration: 1.5, ease: "backOut" }}
          whileHover={{
            scale: 1.1,
            rotate: 15,
            transition: { duration: 0.3 },
          }}
        />
      </motion.div>

      {/* Main content container */}
      <div className="relative z-10 mt-8 xs:mt-10 sm:mt-12 md:mt-16 lg:mt-20 px-4 sm:px-6 md:px-8">
        {/* Background text effect - better responsive typography */}
        <motion.div
          className="absolute inset-0 text-[2rem] xs:text-[2.5rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[12rem] 
                     font-extrabold font-sans text-white/10 blur-sm flex items-center justify-center"
          initial={{ y: 10 }}
          animate={{
            y: [-15, 25, -15],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          WORKSHOPS
        </motion.div>

        {/* Main title - improved responsive sizing */}
        <motion.h1
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: [-20, 20, -20],
            backgroundPositionY: ["40%", "60%", "40%"],
            opacity: 1,
          }}
          transition={{
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            backgroundPositionY: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            },
            opacity: { duration: 1.5 },
          }}
          className="relative text-transparent text-[2rem] xs:text-[2.5rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[12rem] 
                     font-extrabold font-sans bg-[url('/assets/assesments/Exercise/exercise-02.jpg')] bg-clip-text bg-cover bg-center
                     text-center leading-none"
          style={{
            filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))",
            textShadow: "0 0 20px rgba(255,255,255,0.3)",
          }}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.3 },
          }}
        >
          WORKSHOPS
        </motion.h1>

        {/* Blur overlay effect */}
        <motion.div
          className="absolute inset-0 text-[2rem] xs:text-[2.5rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[12rem] 
                     font-extrabold font-sans text-white/5 blur-2xl flex items-center justify-center"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          WORKSHOPS
        </motion.div>
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-8
             relative z-30 max-w-5xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
        >
          {WORKSHOP_TYPE_IMAGES.map((ele, ind) => (
            <motion.div
              key={ele.workshop}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              whileHover={{
                scale: 1.08,
                rotate: 1,
                boxShadow: "0 15px 30px rgba(0,0,0,0.25)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 160, damping: 14 }}
              onClick={() => onWorkshopClick(ind, ele.workshop)}
              className="
        cursor-pointer rounded-2xl overflow-hidden
        bg-white/10 backdrop-blur-md
        border border-white/20
        p-3 sm:p-4
        flex items-center justify-center
        group
      "
            >
              <motion.img
                src={ele.img}
                alt={ele.workshop}
                className="
          w-full h-24 sm:h-28 md:h-32
          object-contain
          transition-transform duration-300
          group-hover:scale-110
        "
                whileHover={{ y: -4 }}
              />

              {/* subtle glow overlay */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-white/10 opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* <motion.div
          className="flex items-center justify-center gap-2 xs:gap-3 sm:gap-4 md:gap-6 
                     mt-6 xs:mt-8 sm:mt-10 md:mt-12 
                     flex-wrap max-w-xs xs:max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 
                     mx-auto px-2 xs:px-3 sm:px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          {categories.map((category, catIndex) =>
            category.workshops.map((workshop, workshopIndex) => {
              const themeIndex =
                (catIndex * category.workshops.length + workshopIndex) %
                COLOR_THEME.length;
              const theme = COLOR_THEME[themeIndex];

              const subheadingMap: Record<string, string> = {
                "Music Therapy": "KalaKriti",
                "Art Therapy": "KalaKriti",
                "Story Telling Therapy": "Instant Katha",
                "Laughter Therapy": "Hasyaras",
              };

              const subheading = subheadingMap[workshop.workshopName] || "";

              return (
                <motion.button
                  key={`${catIndex}-${workshopIndex}`}
                  // onClick={() => onWorkshopClick(catIndex, workshopIndex)}
                  className={`
                    relative px-2 xs:px-3 sm:px-4 md:px-6 
                    py-2 xs:py-2.5 sm:py-3 md:py-4 
                    rounded-lg xs:rounded-xl 
                    font-semibold text-xs xs:text-sm sm:text-base md:text-lg
                    bg-gradient-to-r ${theme.primary} ${theme.text} ${theme.border}
                    border-2 shadow-lg hover:shadow-xl
                    transition-all duration-300 transform-gpu
                    hover:scale-105 active:scale-95
                    backdrop-blur-sm overflow-hidden group
                    min-w-[80px] xs:min-w-[100px] sm:min-w-[120px] md:min-w-[140px] lg:min-w-[160px]
                    flex-shrink-0
                  `}
                  initial={{ opacity: 0, y: 20, scale: 0.9, rotateX: -15 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                  transition={{
                    duration: 0.6,
                    delay:
                      1.4 +
                      (catIndex * category.workshops.length + workshopIndex) *
                        0.1,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                    y: -2,
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${theme.secondary} opacity-0`}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 opacity-0"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%", opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <motion.div
                    className={`absolute inset-0 ${theme.accent} rounded-lg xs:rounded-xl opacity-20`}
                    animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.1, 0.2] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay:
                        (catIndex * category.workshops.length + workshopIndex) *
                        0.2,
                    }}
                  />

                  <span className="relative z-10 flex flex-col items-center justify-center gap-0.5 xs:gap-1">
                    <motion.span
                      className="truncate max-w-[70px] xs:max-w-[80px] sm:max-w-[100px] md:max-w-none text-center leading-tight"
                      whileHover={{ scale: 1.05 }}
                    >
                      {workshop.workshopName}
                    </motion.span>

                    {subheading && (
                      <motion.span
                        className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs 
                                   font-normal opacity-80 text-center leading-tight
                                   hidden xs:block"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        {subheading}
                      </motion.span>
                    )}
                  </span>

                  <motion.div
                    className={`absolute inset-0 rounded-lg xs:rounded-xl border-2 ${theme.border} opacity-0`}
                    whileHover={{
                      opacity: 1,
                      boxShadow: `0 0 20px rgba(59, 130, 246, 0.3)`,
                    }}
                  />
                </motion.button>
              );
            })
          )}
        </motion.div> */}

        {/* Workshop count - responsive text */}
        {categories.reduce(
          (count, category) => count + category.workshops.length,
          0
        ) > 0 && (
          <motion.p
            className="text-center text-white/80 text-[10px] xs:text-xs sm:text-sm md:text-base 
                       mt-3 xs:mt-4 sm:mt-6 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            {categories.reduce(
              (count, category) => count + category.workshops.length,
              0
            )}{" "}
            Workshop
            {categories.reduce(
              (count, category) => count + category.workshops.length,
              0
            ) > 1
              ? "s"
              : ""}{" "}
            Available
          </motion.p>
        )}
      </div>

      {/* Wave divider - responsive height */}
      <div className="custom-shape-divider-bottom-1756203234 absolute bottom-0 w-full">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-[40px] xs:h-[50px] sm:h-[60px] md:h-[80px] lg:h-[100px] xl:h-[120px]"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="shape-fill"
          ></path>
        </svg>
      </div>

      {/* Decorative elements - responsive positioning and sizing */}
      <motion.div
        className="absolute top-1/2 left-2 xs:left-3 sm:left-4 md:left-6 lg:left-10 
                   w-2 h-2 xs:w-3 xs:h-3 sm:w-4 sm:h-4 
                   border-2 border-white/30 rounded-full"
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: { duration: 8, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      <motion.div
        className="absolute top-1/3 right-2 xs:right-3 sm:right-4 md:right-6 lg:right-10 
                   w-3 h-0.5 xs:w-4 xs:h-1 sm:w-6 sm:h-1 
                   bg-white/20 rounded-full"
        animate={{
          scaleX: [1, 1.5, 1],
          opacity: [0.2, 0.8, 0.2],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

export default WorkshopBanner;
