import { useState, useEffect } from "react";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateCursorPosition);
    return () => window.removeEventListener("mousemove", updateCursorPosition);
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-50 w-5 h-5 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
      style={{
        left: position.x,
        top: position.y,
        background: "radial-gradient(circle, #ffe390ff, #ffb04fff, #ffc7b2ff)",
        boxShadow:
          "0 0 8px rgba(255, 140, 0, 0.6), 0 0 12px rgba(255, 193, 7, 0.4)",
        opacity: 0.85,
      }}
    />
  );
};

export default CustomCursor;
