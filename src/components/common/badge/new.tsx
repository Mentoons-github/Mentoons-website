import { motion } from "framer-motion";

const NewBadge = () => {
  return (
    <div className="absolute -top-5 -right-3 transform translate-x-4 -translate-y-4 z-20">
      {/* Glowing red aura */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -inset-2 rounded-lg bg-red-500 blur-xl opacity-40"
      />

      {/* Main badge */}
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 12,
          delay: 0.1,
        }}
        whileHover={{
          scale: 1.05,
          rotate: 2,
          transition: { duration: 0.2 },
        }}
        className="relative"
      >
        {/* Ribbon shape */}
        <div className="relative bg-gradient-to-br from-red-600 via-red-500 to-red-700 px-3 py-1.5 shadow-lg">
          {/* Ribbon cuts */}
          <div className="absolute -left-1 top-0 w-0 h-0 border-t-[14px] border-b-[14px] border-r-[8px] border-t-transparent border-b-transparent border-r-red-800"></div>
          <div className="absolute -right-1 top-0 w-0 h-0 border-t-[14px] border-b-[14px] border-l-[8px] border-t-transparent border-b-transparent border-l-red-800"></div>

          {/* Inner highlight */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white opacity-20"></div>

          {/* Text */}
          <motion.span
            animate={{
              textShadow: [
                "0 1px 3px rgba(0,0,0,0.5)",
                "0 2px 6px rgba(0,0,0,0.7)",
                "0 1px 3px rgba(0,0,0,0.5)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative text-white text-xs font-bold uppercase tracking-wide drop-shadow-lg"
          >
            NEW
          </motion.span>

          {/* Shine effect */}
          <motion.div
            animate={{
              x: ["-100%", "100%"],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 skew-x-12"
          />
        </div>

        {/* Corner accent dots */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="absolute w-1 h-1 bg-white rounded-full shadow-sm"
            style={{
              top: i < 2 ? "-2px" : "calc(100% + 2px)",
              left: i % 2 === 0 ? "-2px" : "calc(100% + 2px)",
            }}
          />
        ))}
      </motion.div>

      {/* Floating particles */}
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [-20, -40, -20],
            x: [0, 10, 0],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1.5,
          }}
          className="absolute w-1 h-1 bg-red-400 rounded-full"
          style={{
            top: "50%",
            left: `${20 + i * 60}%`,
          }}
        />
      ))}
    </div>
  );
};

export default NewBadge;
