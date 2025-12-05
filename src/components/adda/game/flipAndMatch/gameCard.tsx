import { motion } from "framer-motion";

interface GameCardProps {
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
  isDisabled: boolean;
}

const GameCard = ({
  emoji,
  isFlipped,
  isMatched,
  onClick,
  isDisabled,
}: GameCardProps) => {
  const cardClassName = `w-full h-full rounded-xl shadow-lg flex items-center justify-center backface-hidden transition-transform duration-300 ease-in-out absolute`;

  const transition = {
    type: "spring",
    stiffness: 300,
    damping: 25,
    duration: 0.3,
  };

  const handleClick = () => {
    if (!isDisabled && !isFlipped && !isMatched) {
      onClick();
    }
  };

  return (
    <motion.div
      className="aspect-square relative"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: Math.random() * 0.3 + 0.1, ...transition }}
    >
      <motion.div
        className={`w-full h-full relative ${
          isDisabled || isMatched ? "pointer-events-none" : "cursor-pointer"
        }`}
        animate={{ rotateY: isFlipped ? 0 : 180 }}
        transition={transition}
        onClick={handleClick}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className={`${cardClassName} ${
            isMatched
              ? "bg-gradient-to-br from-green-400 to-green-500"
              : "bg-white border-4 border-orange-400"
          }`}
          style={{ transform: "rotateY(0deg)", backfaceVisibility: "hidden" }}
        >
          <div
            className={`text-3xl sm:text-4xl md:text-5xl ${
              isMatched ? "text-white" : "text-gray-800"
            }`}
          >
            {isMatched ? "✓" : emoji}
          </div>
        </div>

        <div
          className={`${cardClassName} bg-gradient-to-br from-blue-500 to-blue-600 hover:shadow-xl hover:scale-105`}
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
        >
          <div className="text-3xl sm:text-4xl md:text-5xl text-white">❓</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameCard;
