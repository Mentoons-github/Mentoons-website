import { motion } from "framer-motion";
import "./hero.css";

const HeroSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      id="first-section"
      className="relative h-fit sm:min-h-screen flex flex-col justify-start lg:justify-center items-center gap-12 px-4 sm:px-8 lg:px-12 p-6 sm:p-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="w-min max-w-4xl text-center scale-105"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="banner-title font-medium text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl p-6 xs:p-0 text-black leading-tight whitespace-nowrap text-center"
        >
          Welcome to <span className="text-[#EC9600]">Mentoons</span>
        </motion.h1>
        <motion.h5
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
          className="banner-subtitle font-normal text-[#0C0A09] pt-3 text-lg sm:text-xl md:text-2xl inter leading-relaxed w-full"
        >
          Join us today and embark on a new world of interactive and meaningful
          parent-child interaction.
        </motion.h5>
        <motion.h6
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
          className="mt-4 text-[#0C0A09] font-semibold text-[15px] md:text-[20px] lg:text-[27px] inter leading-relaxed"
        >
          Start connecting, learning, and growing together.
        </motion.h6>
      </motion.div>

      <motion.img
        src="/assets/home/homepage fillers/sun.png"
        alt="filler"
        initial={{ opacity: 1, scale: 0.9 }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
        }}
        className="absolute hidden sm:block -top-5 lg:top-10 lg:left-24 sm:w-28 md:w-32 lg:w-40 xl:w-48 sm:h-28 md:h-32 lg:h-40 xl:h-48 z-[-1]"
      />

      <div className="relative flex justify-center w-full">
        <motion.img
          src="/assets/home/banner/bg-bot.png"
          alt="hero-bg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="absolute top-[110%] xxs:top-[100%] xs:top-[95%] sm:top-[93%] md:top-[90%] lg:top-[59%] w-full sm:w-[80%] lg:w-auto z-20"
        />

        <motion.img
          src="/assets/home/banner/klement and toonla showing mentoons 1.png"
          alt="klement_and_toonla"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="hero-img relative z-10 max-w-[492px] max-h-[410px] w-3/4 sm:w-1/2 lg:w-auto"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="hero-banner-bg absolute top-[calc(100%+20px)] sm:top-[100%] md:top-[96%] lg:top-[73%] xl:top-[80%] w-full flex justify-center z-30 h-32 sm:h-36 md:h-40 lg:h-48"
        >
          <p className="hero-banner-text text-white font-semibold text-[15px] sm:text-sm md:text-[18px] lg:text-xl xl:text-3xl text-center px-3 sm:px-5 leading-tight sm:leading-normal">
            Dive into a fun and engaging journey to
            <br className="hidden sm:block" />
            expand your knowledge
          </p>
        </motion.div>
      </div>

      <motion.img
        src="/assets/home/homepage fillers/planet 1.png"
        alt="planet-one"
        initial={{ scale: 0.8, rotate: 0 }}
        animate={{
          scale: [0.9, 1, 0.9],
          y: [-10, 10, -10],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
        }}
        className="absolute right-2 sm:right-24 md:right-36 lg:right-40 xl:right-[15rem]
  top-[45%] sm:top-1/4 md:top-1/3 lg:top-1/3 xl:top-30
  w-[100px] md:w-[120px] lg:w-[160px] xl:w-[220px]
  max-w-full h-auto"
      />

      <motion.img
        src="/assets/home/homepage fillers/planet 4.png"
        alt="planet-four"
        initial={{ scale: 0.9 }}
        animate={{
          scale: [1, 1.05, 1],
          x: [0, 10, -10, 0],
          rotate: [-5, 5, -5],
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
        }}
        className="absolute bottom-1/2 left-5 sm:left-auto right-10 xl:right-40 md:right-0 md:bottom-1/5 lg:bottom-26 xl:bottom-32 w-32 sm:w-20 md:w-28 xl:w-48"
      />

      <motion.img
        src="/assets/home/homepage fillers/crafted illustrations.png"
        alt="sun-illustration"
        className="absolute bottom-72 left-10 md:bottom-48 md:lg-12 lg:left-16 lg:bottom-56 xl:left-72 hidden sm:block sm:w-32 md:w-40 lg:w-48 xl:w-56"
      />

      <motion.img
        src="/assets/home/homepage fillers/planet 3.png"
        alt="planet-three"
        initial={{ scale: 0.9 }}
        animate={{
          scale: [1, 1.05, 1],
          y: [-15, 15, -15],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
        }}
        className="absolute bottom-40 right-5 lg:bottom-1/3 lg:right-0 hidden sm:block sm:w-28 md:w-36 lg:w-40 xl:w-48"
      />
    </motion.section>
  );
};

export default HeroSection;
