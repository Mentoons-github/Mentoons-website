import { motion } from "framer-motion";

const FlipAndMatchLobby = ({
  showDifficultyModal,
}: {
  showDifficultyModal: () => void;
}) => {
  const buttonVariants = {
    initial: {
      scale: 0.8,
      opacity: 0,
      y: 20,
    },
    animate: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 1.5,
        type: "spring",
        stiffness: 150,
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 8px 15px rgba(255, 60, 60, 0.5)",
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.95,
      y: 2,
      boxShadow: "0 2px 10px rgba(255, 60, 60, 0.4)",
      transition: {
        duration: 0.1,
      },
    },
  };

  return (
    <div className="h-screen bg-[url('/assets/games/flipAndMatch/bg.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center overflow-hidden relative">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-white/75 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50,
          }}
          animate={{
            y: -50,
            x: Math.random() * window.innerWidth,
          }}
          transition={{
            duration: Math.random() * 3 + 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "linear",
          }}
        />
      ))}
      <div className="flex flex-col items-center justify-center z-20">
        <motion.img
          src="/assets/games/flipAndMatch/title.png"
          alt="title"
          className="w-100 relative z-10"
          initial={{ scale: 0 }}
          animate={{
            scale: 1,
            y: [0, -15, 0],
          }}
          transition={{
            scale: {
              duration: 0.8,
              type: "spring",
              stiffness: 100,
            },
            y: {
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8,
            },
          }}
        />
        <motion.button
          onClick={showDifficultyModal}
          className="
            bg-red-600
            px-12 py-5
            mt-8
            rounded-full
            text-white
            text-2xl
            font-bold tracking-wider
            shadow-xl shadow-red-900/50
            border-b-4 border-red-800
            hover:border-b-2
            active:border-b-0
            transition-all
            cursor-pointer
          "
          variants={buttonVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
        >
          Play Now
        </motion.button>
      </div>

      <motion.div
        className="absolute w-96 h-96 bg-gradient-radial from-yellow-300/30 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default FlipAndMatchLobby;
