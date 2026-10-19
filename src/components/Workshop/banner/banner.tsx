import { motion } from "framer-motion";
import "./banner.css";

const WorkshopBanner = () => {
  return (
    <div className="relative bg-orange-400 min-h-[50vh] lg:min-h-[80vh] xl:min-h-[82vh] flex items-center justify-center overflow-hidden border-b-4 border-[#1f1308]">
      {/* Halftone dots (comic print texture) */}
      <div className="comic-halftone absolute inset-0 z-0 pointer-events-none" />

      {/* Left sticker */}
      <motion.img
        src="/assets/workshopv2/fillers/pencil_boy.png.png"
        alt="happy-boy"
        className="comic-sticker absolute w-8 h-10 xs:w-10 xs:h-14 sm:w-12 sm:h-16 md:w-16 md:h-20 lg:w-20 lg:h-28 xl:w-24 xl:h-32 left-2 xs:left-3 sm:left-6 md:left-10 lg:left-20 top-4 xs:top-5 sm:top-6 md:top-8 lg:top-10 z-20"
        initial={{ opacity: 0, x: -50, rotate: -10 }}
        animate={{ opacity: 1, x: 0, rotate: [0, 5, -5, 0] }}
        transition={{
          opacity: { duration: 1 },
          x: { duration: 1 },
          rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        }}
        whileHover={{ scale: 1.1, rotate: 10 }}
      />

      {/* Top-right sticker */}
      <motion.img
        src="/assets/workshopv2/Story-telling.png"
        alt="top-right decoration"
        className="comic-sticker absolute w-16 h-16 xs:w-20 xs:h-20 sm:w-28 sm:h-28 xl:w-36 xl:h-36 right-2 xs:right-3 sm:right-6 md:right-10 lg:right-20 top-4 xs:top-5 z-20"
        initial={{ opacity: 0, scale: 0.6, rotate: 15 }}
        animate={{ opacity: 1, scale: 1, rotate: [-5, 10, -5] }}
        transition={{
          opacity: { duration: 1.2 },
          scale: { duration: 1.4, ease: "backOut" },
          rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
        whileHover={{ scale: 1.15, rotate: 0 }}
      />

      {/* Bottom-right sticker */}
      <motion.div className="absolute right-2 xs:right-3 sm:right-6 md:right-10 lg:right-20 bottom-2 xs:bottom-4 sm:bottom-6 md:bottom-10 lg:bottom-20 z-20">
        <motion.img
          src="/assets/workshopv2/fillers/SVG.png"
          alt="decorative-svg"
          className="comic-sticker relative w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-36 xl:h-36"
          initial={{ opacity: 0, scale: 0.5, rotate: 180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, ease: "backOut" }}
          whileHover={{ scale: 1.1, rotate: 15, transition: { duration: 0.3 } }}
        />
      </motion.div>

      {/* Title */}
      <div className="relative z-10 -mt-6 xs:-mt-8 sm:-mt-10 md:-mt-14 lg:-mt-16 px-4 sm:px-6 md:px-8 flex flex-col items-center">
        <motion.h1
          initial={{ y: 0, opacity: 0, rotate: -2 }}
          animate={{ y: [-8, 8, -8], opacity: 1, rotate: -2 }}
          transition={{
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 1 },
          }}
          className="comic-title font-comic text-[3rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[11rem] text-center leading-none"
          whileHover={{ scale: 1.05, rotate: 0, transition: { duration: 0.3 } }}
        >
          WORKSHOPS
        </motion.h1>

       
      </div>

      {/* Small floating accents */}
      <motion.div
        className="absolute top-1/2 left-2 xs:left-3 sm:left-4 md:left-6 lg:left-10 w-2 h-2 xs:w-3 xs:h-3 sm:w-4 sm:h-4 border-2 border-[#1f1308] rounded-full"
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{
          rotate: { duration: 8, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
      />
      <motion.div
        className="absolute top-1/3 right-2 xs:right-3 sm:right-4 md:right-6 lg:right-10 w-3 h-1 xs:w-4 sm:w-6 bg-[#1f1308]/40 rounded-full"
        animate={{ scaleX: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

export default WorkshopBanner;
