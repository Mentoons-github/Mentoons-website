import { useEffect, useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import { motion } from "framer-motion";

const TopUpArrow = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const firstSection = document.getElementById("first-section");
      if (!firstSection) return;

      const sectionBottom = firstSection.getBoundingClientRect().bottom;
      setIsVisible(sectionBottom <= 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      onClick={scrollToTop}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={
        isVisible
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 0, scale: 0.9, y: 20 }
      }
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ scale: 1.15, y: -3 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-5 right-5 w-14 h-14 flex justify-center items-center rounded-full bg-white/80 backdrop-blur-md border border-gray-300 shadow-[0px_8px_15px_rgba(0,0,0,0.2)] z-50 cursor-pointer"
    >
      <FaChevronUp className="text-gray-700 text-xl" />
    </motion.div>
  );
};

export default TopUpArrow;
