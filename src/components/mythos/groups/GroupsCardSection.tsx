import { motion } from "framer-motion";

const GroupsCardSection = () => {
  return (
    <div className="relative bg-[#1A1D3B] px-4 py-16 overflow-hidden md:px-6">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 w-64 h-64 bg-pink-500 rounded-full left-1/2 mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Astrologers Card - Left Side */}
          <motion.div
            className="group relative bg-gradient-to-br from-[#E39712] to-[#FFA726] rounded-2xl p-6 md:p-8 flex flex-col shadow-xl backdrop-blur-sm border border-yellow-400/20 hover:shadow-2xl hover:border-yellow-400/40 transition-all duration-300 h-full"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
            <motion.h2
              className="text-2xl font-bold text-transparent md:text-3xl bg-clip-text bg-gradient-to-r from-yellow-100 to-white"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Astrologers
            </motion.h2>
            <motion.p
              className="py-4 text-base md:text-lg text-yellow-50/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Astrologers study how celestial bodies influence human behavior,
              using birth charts to predict events and provide guidance.
            </motion.p>
              <motion.div
                className="flex items-center justify-center pt-4 mt-auto transition-transform duration-300 group-hover:scale-105"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                <img
                  src="/assets/mythos/groups/astro-magic-ball.png"
                  alt="astro-magic-ball"
                  className="w-1/2 md:w-3/5 drop-shadow-2xl"
                />
              </motion.div>
          </motion.div>

          {/* Right Side Stack */}
          <div className="flex flex-col gap-8">
            {/* Tarot Card Readers */}
            <motion.div
              className="group relative bg-gradient-to-br from-[#567ae5] to-[#7B8FFF] rounded-2xl p-6 md:p-8 flex flex-col shadow-xl backdrop-blur-sm border border-blue-400/20 hover:shadow-2xl hover:border-blue-400/40 transition-all duration-300 md:flex-row"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
              <div className="flex flex-col flex-1">
                <motion.h2
                  className="text-2xl font-bold text-transparent md:text-3xl bg-clip-text bg-gradient-to-r from-blue-100 to-white"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Tarot Card Readers
                </motion.h2>
                <motion.p
                  className="py-4 text-base md:text-lg text-blue-50/90"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  Tarot card readers use symbolic cards to offer guidance and
                  predictions in areas like relationships, career, and personal
                  growth.
                </motion.p>
              </div>
              <motion.div
                className="flex justify-center flex-1 pt-4 mt-auto transition-transform duration-300 group-hover:scale-105"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.7 }}
              >
                <img
                  src="/assets/mythos/groups/tarot-card-reader.png"
                  alt="tarot-card-reader"
                  className="w-[350%] md:w-[180%] drop-shadow-2xl"
                />
              </motion.div>
            </motion.div>

            {/* Reiki Healers */}
            <motion.div
              className="group relative bg-gradient-to-br from-[#59dca3] to-[#6EFFC1] rounded-2xl p-6 md:p-8 flex flex-col shadow-xl backdrop-blur-sm border border-green-400/20 hover:shadow-2xl hover:border-green-400/40 transition-all duration-300 md:flex-row"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
              <div className="flex flex-col flex-1">
                <motion.h2
                  className="text-2xl font-bold text-transparent md:text-3xl bg-clip-text bg-gradient-to-r from-green-100 to-white"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  Reiki Healers
                </motion.h2>
                <motion.p
                  className="py-4 text-base md:text-lg text-green-50/90"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  Reiki healers use hands-on energy healing to promote
                  relaxation and healing. By rebalancing energy centers, they
                  aim to reduce stress, alleviate pain, and improve overall
                  well-being.
                </motion.p>
              </div>
              <motion.div
                className="flex justify-center flex-1 pt-4 mt-auto transition-transform duration-300 group-hover:scale-105"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.9 }}
              >
                <img
                  src="/assets/mythos/groups/reiki-healers.png"
                  alt="reiki-healer"
                  className="w-[350%] md:w-[180%] drop-shadow-2xl"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupsCardSection;
