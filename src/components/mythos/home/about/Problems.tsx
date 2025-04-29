import { motion } from "framer-motion";

const Problems = () => {
  const problems = [
    {
      imageUrl: "/assets/mythos/about/hardwork.png",
      backgroundColor: "#E39712",
      description: "No results even after enough hardwork",
    },
    {
      imageUrl: "/assets/mythos/about/motivation.png",
      backgroundColor: "#567AE5",
      description: "Lacking motivation and inspiration in life",
    },
    {
      imageUrl: "/assets/mythos/about/guidance.png",
      backgroundColor: "#59DCA3",
      description: "Feeling lost with no proper guidance in life",
    },
  ];
  return (
    <div className="bg-[#1A1D3B] p-4 md:p-6 pb-12 md:pb-24">
      <motion.h2
        className="text-3xl font-semibold text-star text-[#E39712] tracking-widest px-12 pb-12 md:text-4xl lg:text-5xl"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        THE PROBLEMS FACED BY THE PEOPLE{" "}
      </motion.h2>
      <motion.div
        className="flex items-center justify-between gap-4 w-[80%] mx-auto flex-wrap"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true, margin: "-50px" }}
      >
        {problems.map((problem, index) => (
          <motion.div
            key={problem.description}
            className="flex flex-col items-center p-4 transition-transform rounded-lg shadow-md hover:scale-105 w-full sm:w-[30%]"
            style={{ backgroundColor: problem.backgroundColor }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 * (index + 1) }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <motion.div
              className="flex items-center justify-center w-full h-48 mb-4 sm:h-56 md:h-64"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 * (index + 1) }}
              viewport={{ once: true }}
            >
              {problem.imageUrl ? (
                <motion.div
                  className="flex items-center justify-center w-full h-full"
                  whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                  initial={{ y: -20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.4 * (index + 1) }}
                  viewport={{ once: true }}
                >
                  <motion.img
                    src={problem.imageUrl}
                    alt={problem.description}
                    className="object-contain max-w-full max-h-full"
                    style={{ width: "100%" }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 * (index + 1) }}
                    viewport={{ once: true }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  className="flex items-center justify-center w-24 h-24 rounded-full bg-white/20"
                  initial={{ opacity: 0, rotate: 0 }}
                  whileInView={{ opacity: 1, rotate: 360 }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.4 * (index + 1) },
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  }}
                  viewport={{ once: true }}
                >
                  <span className="text-3xl text-white">?</span>
                </motion.div>
              )}
            </motion.div>
            <motion.p
              className="p-2 text-lg font-medium text-center text-black md:text-xl w-[80%]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 * (index + 1) }}
              viewport={{ once: true }}
            >
              {problem.description}
            </motion.p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Problems;
