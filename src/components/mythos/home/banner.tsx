import { motion } from "framer-motion";
import MythosButton from "./button";

const MythosBanner = () => {
  return (
    <section className="relative w-full h-screen flex justify-center items-center py-6 sm:py-8 md:py-10 bg-[#1A1D3B] mulish px-4 sm:px-8 md:px-12 lg:px-20 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="/background/mythos/banner/Planets 2_1.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <div className="relative space-y-3 sm:space-y-4 md:space-y-5 p-3 sm:p-4 md:p-5 text-center flex flex-col justify-center items-center w-full">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-[#E39712] font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[54px] tracking-[1.5px] sm:tracking-[1.9px] montserrat px-2"
        >
          LET THE PLANETS BE YOUR GUIDING STAR
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl w-full sm:w-4/5 md:w-3/4 lg:w-3/5 xl:w-[45%] text-white"
        >
          Feeling stuck in life? Let your birth sign find solutions to all your
          problems
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="flex justify-center mt-4 sm:mt-6 md:mt-8 lg:mt-10"
        >
          <MythosButton label="FIND YOUR PATH" />
        </motion.div>
      </div>
    </section>
  );
};

export default MythosBanner;
