import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import MythosSidebar from "./sidebar";
import { useEffect, useState } from "react";

const MythosHeader = () => {
  const headerText = ["HOME", "GROUPS", "BLOG", "ABOUT"];
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full p-2 bg-[#E39712] z-50 ${
        isScrolled ? "fixed top-0 left-0 shadow-lg" : "relative"
      }`}
    >
      <nav className="max-w-full px-6 md:px-10 flex justify-between items-center">
        <ul className="hidden lg:flex items-center gap-6 xl:gap-8 mulish text-white">
          {headerText.map((text, index) => (
            <li
              key={index}
              className="relative font-bold text-sm tracking-[1.5px] group"
            >
              <Link
                to={text === "HOME" ? "/" : `/mythos/${text.toLowerCase()}`}
                className="relative"
              >
                {text}
                <span className="absolute left-1/2 -bottom-2 h-[2px] w-0 bg-gray-500 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
              </Link>
            </li>
          ))}
        </ul>

        <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
          <img
            src="https://mentoons-website.s3.ap-northeast-1.amazonaws.com/logo/ec9141ccd046aff5a1ffb4fe60f79316.png "
            alt="company logo"
            className="w-[120px] md:w-[130px] lg:w-[150px] mx-auto"
          />
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <motion.button
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2, ease: "easeIn" }}
            aria-label="Search"
            className="flex justify-center items-center rounded-full w-10 h-10 sm:w-12 sm:h-12 outline-dashed outline-2 outline-gray-600 cursor-pointer"
          >
            <img
              src="/assets/mythos/icons/Vector.png"
              alt="search-icon"
              className="w-5 sm:w-6 h-5 sm:h-6"
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2, ease: "easeIn" }}
            aria-label="View cart"
            className="relative flex justify-center items-center rounded-full w-10 h-10 sm:w-12 sm:h-12 outline-dashed outline-2 outline-gray-600 cursor-pointer"
          >
            <img
              src="/assets/mythos/icons/Vector (1).png"
              alt="cart-icon"
              className="w-5 sm:w-6 h-5 sm:h-6"
            />
            <span className="absolute -top-2 right-0 border-[#E39712] w-4 sm:w-5 h-4 sm:h-5 bg-[#E39712] rounded-full text-white flex items-center justify-center text-xs">
              0
            </span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2, ease: "easeIn" }}
            aria-label="View more"
            className="flex justify-center items-center rounded-full w-10 h-10 sm:w-12 sm:h-12 outline-dashed outline-2 outline-gray-600 cursor-pointer"
          >
            <img
              src="/assets/mythos/icons/Vector (2).png"
              alt="view-icon"
              className="w-6 sm:w-8 h-6 sm:h-8"
            />
          </motion.button>
          <motion.button
            whileHover={{ rotate: 360 }}
            whileTap={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
            aria-label="Toggle menu"
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="lg:hidden flex justify-center items-center rounded-full w-10 h-10 sm:w-12 sm:h-12 outline-dashed outline-2 outline-gray-600 cursor-pointer text-white"
          >
            <FaBars className="text-lg sm:text-xl" />
          </motion.button>
        </div>
      </nav>
      <MythosSidebar
        isOpen={isSidebarOpen}
        navItems={headerText}
        setSidebar={setSidebarOpen}
      />
    </header>
  );
};

export default MythosHeader;
