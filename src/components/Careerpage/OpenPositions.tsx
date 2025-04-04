import { motion } from "framer-motion";
import PostingContainer from "./PostingContainer";

const OpenPositions = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white">
      <div className="flex flex-col gap-10 py-10 lg:flex-row lg:py-0">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="p-5 lg:w-1/2 lg:p-20"
        >
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block"
            >
              <span className="px-4 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                We're Hiring
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-5 text-3xl font-bold text-transparent lg:text-5xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text"
            >
              Current openings
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="max-w-xl text-sm leading-relaxed text-gray-600 lg:text-2xl"
            >
              Join us! Whether you're experienced or just starting, bring your
              passion and make an impact.
            </motion.p>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((index) => (
                  <img
                    key={index}
                    className="w-10 h-10 transition-transform border-2 border-white rounded-full ring-2 ring-gray-100 hover:scale-110"
                    src="/avatar.png"
                    alt={`Team member ${index}`}
                  />
                ))}
                <div className="flex items-center justify-center w-10 h-10 text-sm text-gray-500 border-2 border-white rounded-full bg-gray-50">
                  +3
                </div>
              </div>
              <span className="ml-2 text-sm text-gray-600">
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
          className="hidden w-1/2 p-20 lg:block"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl blur-2xl opacity-30"></div>
            <figure className="relative w-full h-full overflow-hidden rounded-2xl">
              <img
                src="/assets/home/team007.png"
                alt="team-illustration"
                className="object-cover w-full h-full"
              />
            </figure>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OpenPositions;
