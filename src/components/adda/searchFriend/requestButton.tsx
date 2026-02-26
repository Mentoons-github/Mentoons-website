import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

const ViewAllFriends = ({ onNavigate }: { onNavigate: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    gsap.fromTo(
      buttonRef.current,
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
    );
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    gsap.to(buttonRef.current, {
      scale: 1.03,
      duration: 0.2,
      ease: "power2.out",
    });
    gsap.to(arrowRef.current, { x: 5, duration: 0.22, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    gsap.to(buttonRef.current, { scale: 1, duration: 0.2, ease: "power2.out" });
    gsap.to(arrowRef.current, { x: 0, duration: 0.22, ease: "power2.out" });
  };

  const handleClick = () => {
    gsap.to(buttonRef.current, {
      scale: 0.93,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
      onComplete: onNavigate,
    });
  };

  return (
    <div className="w-full flex justify-center mt-2">
      <button
        ref={buttonRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          relative py-2 px-4 rounded-lg font-medium
          transition-all duration-300 ease-in-out
          border border-orange-300
          ${
            isHovered
              ? "bg-orange-100 text-orange-700"
              : "bg-white text-orange-500"
          }
          hover:shadow-md
          flex items-center justify-center gap-2
          w-full md:w-auto
        `}
      >
        <div
          className={`
          flex items-center justify-center
          transition-transform duration-300
          ${isHovered ? "translate-x-1" : ""}
        `}
        >
          <span className="font-medium">Search Friends</span>
          <svg
            ref={arrowRef}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`ml-1 transition-transform duration-300 ${
              isHovered ? "translate-x-1" : ""
            }`}
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default ViewAllFriends;
