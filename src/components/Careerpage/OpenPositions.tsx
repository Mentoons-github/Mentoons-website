import { motion } from "framer-motion";
import PostingContainer from "./PostingContainer";

const OpenPositions = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white">
      <div className="flex flex-col lg:flex-row gap-10 py-10 lg:py-0">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:w-1/2 p-5 lg:p-20"
        >
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block"
            >
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1 rounded-full">
                We're Hiring
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:text-5xl text-3xl font-bold mb-5 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              Current openings
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="lg:text-2xl text-sm text-gray-600 leading-relaxed max-w-xl"
            >
              Join us! Whether you're experienced or just starting, bring your
              passion and make an impact.
            </motion.p>

            <div className="flex gap-4 items-center">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((index) => (
                  <img
                    key={index}
                    className="w-10 h-10 rounded-full border-2 border-white ring-2 ring-gray-100 transition-transform hover:scale-110"
                    src="/avatar.png"
                    alt={`Team member ${index}`}
                  />
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-sm text-gray-500">
                  +3
                </div>
              </div>
              <span className="text-sm text-gray-600 ml-2">
                Join our growing team
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-10"
            >
              <PostingContainer />
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-1/2 p-20 hidden lg:block"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl blur-2xl opacity-30"></div>
            <figure className="relative w-full h-full rounded-2xl overflow-hidden">
              <img
                src="/assets/images/team-Illustration.png"
                alt="team-illustration"
                className="w-full h-full object-cover"
              />
            </figure>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OpenPositions;
