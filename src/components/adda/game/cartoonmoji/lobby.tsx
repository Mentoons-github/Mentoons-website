import { useState } from "react";
import { motion } from "framer-motion";

const CartoonmojiLobby = ({
  selectTheDifficulty,
}: {
  selectTheDifficulty: () => void;
}) => {
  const emojis = [
    "/assets/games/cartoonmoji/bg-emoji/blast-Photoroom.png",
    "/assets/games/cartoonmoji/bg-emoji/blue-like.png",
    "/assets/games/cartoonmoji/bg-emoji/green-heart-Photoroom.png",
    "/assets/games/cartoonmoji/bg-emoji/lightning.png",
    "/assets/games/cartoonmoji/bg-emoji/love-heart-Photoroom-Photoroom.png",
    "/assets/games/cartoonmoji/bg-emoji/smiling-heart-Photoroom.png",
  ];

  const [emojiPositions] = useState(() => {
    const positions = [];
    const leftPositions = [15, 10, 12];
    const rightPositions = [75, 80, 85];

    for (let i = 0; i < 3; i++) {
      positions.push({
        top: 20 + i * 25,
        left: leftPositions[i],
        delay: i * 0.3,
        duration: 4 + Math.random() * 2,
        rotateRange: Math.random() > 0.5 ? [-8, 8] : [8, -8],
      });
    }

    for (let i = 0; i < 3; i++) {
      positions.push({
        top: 20 + i * 25,
        left: rightPositions[i],
        delay: (i + 3) * 0.3,
        duration: 4 + Math.random() * 2,
        rotateRange: Math.random() > 0.5 ? [-8, 8] : [8, -8],
      });
    }

    return positions;
  });

  return (
    <div className="relative h-screen w-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 overflow-hidden flex items-center justify-center">
      {/* Static background - no animation */}
      <div
        className="absolute inset-0 bg-[url('/assets/games/cartoonmoji/bg.png')] bg-cover bg-center bg-no-repeat opacity-80"
        style={{ willChange: "auto" }}
      />

      {/* Optimized emoji animations - combined transform properties */}
      {emojis.map((emoji, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            top: `${emojiPositions[index].top}%`,
            left: `${emojiPositions[index].left}%`,
            willChange: "transform",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: emojiPositions[index].delay,
            type: "spring",
            stiffness: 150,
          }}
        >
          <motion.img
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 drop-shadow-lg"
            alt={`emoji-${index}`}
            src={emoji}
            animate={{
              // Combined into single transform - more efficient
              y: [-25, -15, -25],
              rotate: [
                emojiPositions[index].rotateRange[0],
                emojiPositions[index].rotateRange[1],
                emojiPositions[index].rotateRange[0],
              ],
            }}
            transition={{
              duration: emojiPositions[index].duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{
              scale: 1.3,
              rotate: 360,
              transition: { duration: 0.4 },
            }}
            style={{ willChange: "transform" }}
          />
        </motion.div>
      ))}

      <motion.div className="z-10 w-[85%] max-w-[700px] px-4">
        <motion.img
          className="w-full drop-shadow-2xl"
          alt="title"
          src="/assets/games/cartoonmoji/cartoonmoji-title.png"
          initial={{ scale: 0, opacity: 0, rotate: -10 }}
          animate={{
            scale: 1,
            opacity: 1,
            rotate: 0,
          }}
          transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 120,
            damping: 10,
          }}
        />
        {/* Static glow - no animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 opacity-20 blur-3xl -z-10" />
      </motion.div>

      <motion.button
        className="absolute bottom-10 left-50 transform bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-black text-xl sm:text-2xl md:text-3xl px-10 sm:px-12 md:px-16 py-3 sm:py-4 rounded-full shadow-2xl z-20 border-4 border-white"
        onClick={selectTheDifficulty}
        whileHover={{
          scale: 1.15,
          boxShadow: "0 0 30px rgba(251, 191, 36, 0.8)",
        }}
        whileTap={{ scale: 0.9 }}
        initial={{ y: 100, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
          delay: 0.4,
          type: "spring",
          stiffness: 200,
        }}
        style={{ willChange: "transform" }}
      >
        {/* Static text - no shadow animation */}
        <span className="drop-shadow-lg">PLAY</span>
      </motion.button>

      {/* Reduced sparkles from 8 to 4 */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-2 h-2 bg-white rounded-full"
          style={{
            top: `${10 + Math.random() * 80}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

export default CartoonmojiLobby;
