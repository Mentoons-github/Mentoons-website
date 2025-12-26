import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTopButton: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const firstSectionHeight = window.innerHeight;

      setShowScrollTop(
        scrollPosition > firstSectionHeight && scrollPosition > 100
      );
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`
        z-[100]
        w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
        flex items-center justify-center

        bg-blue-600 text-white rounded-full
        shadow-xl

        transition-all duration-300 ease-out
        hover:scale-110 hover:bg-blue-700

        ${
          showScrollTop
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }
      `}
    >
      <FaArrowUp className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
    </button>
  );
};

export default ScrollToTopButton;
