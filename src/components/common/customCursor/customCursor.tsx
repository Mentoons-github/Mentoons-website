import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const location = useLocation();

  useEffect(() => {
    let x = 0;
    let y = 0;
    const speed = 0.2;

    const update = (e: MouseEvent) => {
      const targetX = e.clientX;
      const targetY = e.clientY;

      const animate = () => {
        x += (targetX - x) * speed;
        y += (targetY - y) * speed;
        setPosition({ x, y });
        requestAnimationFrame(animate);
      };

      animate();
    };

    window.addEventListener("mousemove", update);
    return () => window.removeEventListener("mousemove", update);
  }, []);

  if (
    location.pathname.includes("/employee") ||
    location.pathname.includes("/admin")
  ) {
    return null;
  }

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
