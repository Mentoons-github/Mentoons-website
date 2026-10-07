import Lottie from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface BadgeViewProps {
  badge: {
    _id: string;
    name: string;
    animation: any;
  };
  onClose: () => void;
}

const MOTIVATIONAL_TEXTS = [
  "You're on fire! Keep it up! 🔥",
  "Unstoppable! What's next? 💪",
  "Legend status unlocked! 🚀",
  "You crushed it! 👊",
];

const CONFETTI_COLORS = [
  "#FF6B9D",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#C77DFF",
  "#FF6B6B",
  "#FF9F43",
  "#00D2D3",
];

const SHAPES = ["circle", "rect", "star"];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

const BadgeViewModal = ({ badge, onClose }: BadgeViewProps) => {
  const [confetti, setConfetti] = useState<any[]>([]);
  const [motivText, setMotivText] = useState(MOTIVATIONAL_TEXTS[0]);
  const [burstParticles, setBurstParticles] = useState<any[]>([]);

  useEffect(() => {
    const pieces = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: randomBetween(0, 100),
      delay: randomBetween(0, 3),
      duration: randomBetween(3, 6),
      size: randomBetween(6, 14),
      color:
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      rotation: randomBetween(0, 360),
      drift: randomBetween(-60, 60),
    }));
    setConfetti(pieces);

    const particles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      angle: (i / 20) * 360,
      distance: randomBetween(80, 200),
      color:
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: randomBetween(4, 10),
      delay: randomBetween(0, 0.3),
    }));
    setBurstParticles(particles);

    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % MOTIVATIONAL_TEXTS.length;
      setMotivText(MOTIVATIONAL_TEXTS[idx]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-950/90 z-[99999] overflow-hidden">
      {/* Falling Confetti */}
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute pointer-events-none"
          style={{
            left: `${piece.x}%`,
            top: -20,
            width: piece.size,
            height: piece.shape === "rect" ? piece.size * 0.5 : piece.size,
            backgroundColor: piece.color,
            borderRadius: piece.shape === "circle" ? "50%" : "2px",
            rotate: piece.rotation,
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, piece.drift, -piece.drift / 2, piece.drift / 3],
            rotate: [piece.rotation, piece.rotation + 540],
            opacity: [1, 1, 0.8, 0],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Burst particles */}
      {burstParticles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        return (
          <motion.div
            key={p.id}
            className="absolute pointer-events-none rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              left: "50%",
              top: "50%",
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(rad) * p.distance,
              y: Math.sin(rad) * p.distance,
              opacity: 0,
              scale: 0,
            }}
            transition={{ duration: 0.8, delay: p.delay, ease: "easeOut" }}
          />
        );
      })}

      {/* Main Modal */}
      <div className="relative flex flex-col items-center">
        {/* Lottie Container — no border/rings */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }}
          className="relative w-[420px] h-[420px] md:w-[500px] md:h-[500px]"
        >
          {/* Lottie Animation */}
          <Lottie
            animationData={badge.animation}
            className="w-full h-full"
            loop={true}
            autoplay={true}
          />

          {/* Floating stars around Lottie */}
          {["⭐", "✨", "🌟", "💫", "⭐", "✨"].map((star, i) => (
            <motion.span
              key={i}
              className="absolute text-lg pointer-events-none select-none"
              style={{
                top: `${[5, 5, 35, 30, 80, 75][i]}%`,
                left: `${[-6, 94, -8, 100, -4, 96][i]}%`,
              }}
              animate={{
                y: [0, -10, 0],
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
            >
              {star}
            </motion.span>
          ))}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/60 hover:bg-black/80
                       text-white p-2 rounded-full transition-all duration-200
                       hover:scale-110 active:scale-95 z-20"
            aria-label="Close badge"
          >
            <X size={24} strokeWidth={3} />
          </button>

          {/* Text inside Lottie — bottom center */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-center w-full px-4">
            <p className="text-orange-400 text-sm font-medium tracking-widest uppercase mb-1">
              🎉 New Badge Unlocked!
            </p>
            <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-lg">
              {badge.name}
            </h3>

            {/* Motivational text inside Lottie */}
            <div className="mt-2">
              <AnimatePresence mode="wait">
                <motion.p
                  key={motivText}
                  className="text-white/80 text-sm font-medium"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35 }}
                >
                  {motivText}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Keep Going button — below Lottie only */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="-mt-4"
        >
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500
                       text-white font-semibold text-sm tracking-wide
                       hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg"
          >
            Keep Going! 🚀
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default BadgeViewModal;
