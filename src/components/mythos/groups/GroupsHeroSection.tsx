import { motion } from "framer-motion";

const GroupsHeroSection = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-10 bg-[#1A1D3B] bg-[url('/assets/mythos/background/section/stars_background.png')] bg-center p-4 sm:p-5 md:p-6 py-12 sm:py-16 md:py-20">
      <motion.div
        className="flex flex-col items-center md:items-start justify-center w-full md:flex-[0.6] px-4 sm:px-8 md:pl-12"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-full">
          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-[#E39712] pb-2 sm:pb-3 md:pb-4 text-center md:text-left"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            CONNECT WITH LIKE-MINDED SOUL
          </motion.h1>
          <motion.p
            className="pb-4 sm:pb-6 md:pb-8 text-base sm:text-lg text-white w-full md:w-[90%] lg:w-[80%] text-center md:text-left"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Mentoons Mythos isn't just about reports; it's a thriving community
            of individuals seeking purpose, clarity, and cosmic guidance.
            Whether you're exploring astrology, psychology, or career growth,
            our groups help you connect with like-minded people who share your
            journey.
          </motion.p>
          <motion.div
            className="mt-2 sm:mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.h3
              className="text-xl font-semibold text-center text-white sm:text-2xl md:text-left"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              🚀 How to join?
            </motion.h3>
            <motion.ul
              className="flex flex-col gap-2 mt-2 text-white sm:gap-3 md:gap-4 sm:mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <motion.li
                className="flex items-center gap-2 pt-2 pl-4 sm:pt-3 md:pt-4 sm:pl-6 md:pl-8"
                initial={{ x: -15, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.9 }}
              >
                <p className="flex items-center gap-2 text-sm sm:gap-3 md:gap-4 sm:text-base">
                  <div className="w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rotate-45 bg-blue-600" />
                  <span>
                    Available for 3-Month and 6-month plan Subscriptions
                  </span>
                </p>
              </motion.li>
              <motion.li
                className="flex items-center gap-2 pt-2 pl-4 sm:pt-3 md:pt-4 sm:pl-6 md:pl-8"
                initial={{ x: -15, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.0 }}
              >
                <p className="flex items-center gap-2 text-sm sm:gap-3 md:gap-4 sm:text-base">
                  <div className="w-[8px] h-[8px] sm:w-2 sm:h-2 rotate-45 bg-blue-600" />
                  <span>Instant access upon sign-up</span>
                </p>
              </motion.li>
              <motion.li
                className="flex items-center gap-2 pt-2 pl-4 sm:pt-3 md:pt-4 sm:pl-6 md:pl-8"
                initial={{ x: -15, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.1 }}
              >
                <p className="flex items-center gap-2 text-sm sm:gap-3 md:gap-4 sm:text-base">
                  <div className="w-[8px] h-[8px] sm:w-2 sm:h-2 rotate-45 bg-blue-600" />
                  <span>Connect via the Mentoons Mythos Portal</span>
                </p>
              </motion.li>
              <motion.li
                className="flex items-center gap-2 pt-2 pl-4 sm:pt-3 md:pt-4 sm:pl-6 md:pl-8"
                initial={{ x: -15, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.2 }}
              >
                <p className="flex items-center gap-2 text-sm sm:gap-3 md:gap-4 sm:text-base">
                  <div className="w-[8px] h-[8px] sm:w-2 sm:h-2 rotate-45 bg-blue-600" />
                  <span>Get notified about exclusive group events</span>
                </p>
              </motion.li>
            </motion.ul>
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        className="flex items-center justify-center w-[80%] sm:w-[60%] md:w-auto md:flex-[0.4] mt-6 md:mt-0"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <motion.img
          src="/assets/mythos/groups/mythos-groups-globe.png"
          alt="Mythos hero globe images"
          className="w-full sm:w-[80%] md:w-[90%] lg:w-[95%] xl:w-[100%] h-auto object-cover"
          initial={{ scale: 0.9, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        />
      </motion.div>
    </div>
  );
};

export default GroupsHeroSection;
