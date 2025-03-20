import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { useEffect, useCallback, useRef } from "react";

interface MythosSidebarProps {
  isOpen: boolean;
  setSidebar: (val: boolean) => void;
  navItems: string[];
}

const MythosSidebar = ({
  isOpen,
  setSidebar,
  navItems,
}: MythosSidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setSidebar(false);
      }
    },
    [isOpen, setSidebar]
  );

  useEffect(() => {
    const handleBreakPoint = () => {
      if (window.innerWidth >= 1024) {
        setSidebar(false);
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    window.addEventListener("resize", handleBreakPoint);
    document.addEventListener("mousedown", handleClickOutside);

    handleBreakPoint();

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("resize", handleBreakPoint);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setSidebar, handleClickOutside]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 w-full h-full bg-black/80 z-40"
          aria-hidden="true"
        >
          <motion.aside
            ref={sidebarRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full md:w-80 bg-white shadow-xl z-50 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex justify-end p-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="p-2 bg-gray-100 rounded-full shadow hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-gray-400"
                onClick={() => setSidebar(false)}
                aria-label="Close menu"
              >
                <FaTimes size={24} className="text-gray-800" />
              </motion.button>
            </div>

            <nav className="flex-1 flex items-center justify-center">
              <ul className="space-y-8 font-semibold text-2xl md:text-3xl mulish">
                {navItems.map((item, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ scale: 1.05, x: 10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="px-6 py-2 border-l-4 border-transparent hover:border-gray-800"
                  >
                    <Link
                      to={
                        item === "HOME" ? "/" : `/mythos/${item.toLowerCase()}`
                      }
                      className="block transition hover:text-gray-600 focus:outline-none focus:text-gray-600"
                      onClick={() => setSidebar(false)}
                    >
                      {item}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MythosSidebar;
