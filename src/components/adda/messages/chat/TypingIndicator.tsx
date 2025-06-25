import { motion } from "framer-motion";

const MorphingBubbleIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      className="flex mb-3"
    >
      <motion.div
        className="px-5 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl shadow-lg"
        animate={{
          borderRadius: ["20px", "25px", "20px"],
          scale: [1, 1.03, 1],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center space-x-2">
          <div className="relative">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-white rounded-full"
                style={{ left: `${i * 5}px`, top: "50%" }}
                animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
            <div className="flex space-x-1">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-2.5 h-2.5 rounded-full bg-white"
                  animate={{ scale: [1, 0.8, 1.2, 1] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: index * 0.3,
                  }}
                />
              ))}
            </div>
          </div>
          <motion.span
            className="text-white text-sm font-medium"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Typing...
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MorphingBubbleIndicator;
