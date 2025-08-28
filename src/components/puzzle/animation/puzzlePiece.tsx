import { useEffect, useState } from "react";
import { FaPuzzlePiece } from "react-icons/fa";

const AnimatedPuzzlePiece = ({
  size = 40,
  color = "#FFA500",
  delay = 0,
  initialX = 0,
  initialY = 0,
  rotation = 0,
}) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [currentRotation, setCurrentRotation] = useState(rotation);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => ({
        x: prev.x + (Math.random() - 0.5) * 2,
        y: prev.y + (Math.random() - 0.5) * 2,
      }));
      setCurrentRotation((prev) => prev + (Math.random() - 0.5) * 4);
    }, 3000 + delay * 100);

    return () => clearInterval(interval);
  }, [delay]);

  return (
    <div
      className="absolute pointer-events-none opacity-20 transition-all duration-[3000ms] ease-in-out"
      style={{
        transform: `translate(${position.x}px, ${position.y}px) rotate(${currentRotation}deg)`,
        animationDelay: `${delay}ms`,
      }}
    >
      <FaPuzzlePiece
        size={size}
        color={color}
        className="drop-shadow-sm animate-pulse"
      />
    </div>
  );
};

export default AnimatedPuzzlePiece;
