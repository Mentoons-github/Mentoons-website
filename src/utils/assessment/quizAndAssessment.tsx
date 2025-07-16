import { ICON_SETS } from "@/constant/constants";
import { motion } from "framer-motion";

interface BackgroundIconsProps {
  quizType: string;
  backgroundIcons: Array<{
    id: number;
    x: number;
    y: number;
    rotation: number;
    scale: number;
    delay: number;
  }>;
}

const backgroundIconVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i: number) => ({
    opacity: 0.1,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};


export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

export const getBackgroundIcons = (quizType: string) => {
  return ICON_SETS[quizType as keyof typeof ICON_SETS] || ICON_SETS.mobile;
};

export const generateIconPositions = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    rotation: Math.random() * 360,
    scale: 0.3 + Math.random() * 0.7,
    delay: Math.random() * 2,
  }));
};

export const BackgroundIcons: React.FC<BackgroundIconsProps> = ({
  quizType,
  backgroundIcons,
}) => {
  const icons = getBackgroundIcons(quizType);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {backgroundIcons.map((position, index) => (
        <motion.div
          key={position.id}
          className="absolute text-4xl select-none"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: `rotate(${position.rotation}deg) scale(${position.scale})`,
          }}
          variants={backgroundIconVariants}
          initial="hidden"
          animate="visible"
          custom={index}
        >
          <motion.div
            variants={floatingVariants}
            animate="animate"
            style={{ animationDelay: `${position.delay}s` }}
          >
            {icons[index % icons.length]}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};
