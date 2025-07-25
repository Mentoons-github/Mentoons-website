import { motion } from "framer-motion";

const CelebrationAnimation = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 100,
            rotate: 0,
          }}
          animate={{
            y: -100,
            rotate: 360,
            x: Math.random() * window.innerWidth,
          }}
          transition={{
            duration: 3,
            delay: Math.random() * 2,
            ease: "easeOut",
          }}
        >
          {
            ["🌟", "🎉", "🎈", "🌈", "⭐", "✨", "🎊"][
              Math.floor(Math.random() * 7)
            ]
          }
        </motion.div>
      ))}
    </div>
  );
};

export default CelebrationAnimation;
