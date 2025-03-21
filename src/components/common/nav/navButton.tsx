import { AnimatePresence } from "framer-motion";
import React, { JSX } from "react";
import {
  FaBook,
  FaCog,
  FaGamepad,
  FaShoppingCart,
  FaUserShield,
} from "react-icons/fa";

const ICONS: { [key: string]: JSX.Element } = {
  games: <FaGamepad className="text-white text-[12px] sm:text-sm md:text-lg" />,
  comics: <FaBook className="text-white text-[12px] sm:text-sm md:text-lg" />,
  products: (
    <FaShoppingCart className="text-white text-[12px] sm:text-sm md:text-lg" />
  ),
  services: <FaCog className="text-white text-[12px] sm:text-sm md:text-lg" />,
  subscription: (
    <FaUserShield className="text-white text-[12px] sm:text-sm md:text-lg" />
  ),
};

const NavButton = ({
  children,
  label,
  onMouseEnter,
  onMouseLeave,
  icon,
  className = "text-center text-[12px] sm:text-sm md:text-base font-semibold text-white",
}: {
  children: React.ReactNode;
  label: string;
  icon?: false;
  onMouseEnter: (menu: string) => void;
  onMouseLeave: (menu: string) => void;
  className?: string;
}) => {
  const menuKey = label.toLowerCase();
  return (
    <div
      className="relative"
      onMouseEnter={() => onMouseEnter(menuKey)}
      onMouseLeave={() => onMouseLeave(menuKey)}
    >
      <button
        className={`bg-transparent outline-none cursor-pointer ${className} flex items-center gap-1 group relative bg-transparent outline-none cursor-pointer text-center text-[12px] sm:text-sm md:text-base font-semibold text-white flex items-center gap-1 transition-all duration-300 ease-in-out`}
      >
        {icon && <span className="hidden sm:block">{ICONS[menuKey]}</span>}
        {label}
        {label === "Games" && (
          <span className="absolute -top-1/4 -left-1/5 -translate-x-1/5 bg-red-500 rounded-full px-2 text-[10px]">
            Free
          </span>
        )}
        <span className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-white transition-all duration-300 ease-in-out group-hover:w-full"></span>
      </button>
      <AnimatePresence>{children}</AnimatePresence>
    </div>
  );
};

export default NavButton;
