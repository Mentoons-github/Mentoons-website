import { motion } from "framer-motion";
import { PuzzleButton } from "./puzzles";

interface PuzzleButtonInterface {
  selectedButton: PuzzleButton;
  setSelectedButton: (val: PuzzleButton) => void;
}

const PuzzleButtons = ({
  selectedButton,
  setSelectedButton,
}: PuzzleButtonInterface) => {
  const options = [
    { id: "socialMedia", label: "Social Media Puzzles", icon: "💬" },
    { id: "career", label: "Career Puzzles", icon: "💼" },
    { id: "icons", label: "Icon Puzzles", icon: "🔍" },
  ];

  return (
    <div className="flex justify-center items-center mt-12">
      <div className="relative bg-gray-100 rounded-full p-2 shadow-inner">
        <div className="flex space-x-2">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedButton(option.id as PuzzleButton)}
              className="relative z-10 px-8 py-4 rounded-full font-medium text-base transition-colors duration-200 flex items-center gap-3"
            >
              {selectedButton === option.id && (
                <motion.div
                  layoutId="activeBackground"
                  className="absolute inset-0 bg-white rounded-full shadow-lg"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
              <motion.span
                className="relative z-10 text-xl"
                animate={{
                  color: selectedButton === option.id ? "#1f2937" : "#6b7280",
                  scale: selectedButton === option.id ? 1.05 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {option.icon}
              </motion.span>
              <motion.span
                className="relative z-10 whitespace-nowrap"
                animate={{
                  color: selectedButton === option.id ? "#1f2937" : "#6b7280",
                  fontWeight: selectedButton === option.id ? 600 : 500,
                }}
                transition={{ duration: 0.2 }}
              >
                {option.label}
              </motion.span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PuzzleButtons;
