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
  games: <FaGamepad className="text-[12px] sm:text-sm md:text-lg" />,
  comics: <FaBook className="text-[12px] sm:text-sm md:text-lg" />,
  products: <FaShoppingCart className="text-[12px] sm:text-sm md:text-lg" />,
  services: <FaCog className="text-[12px] sm:text-sm md:text-lg" />,
  subscription: <FaUserShield className="text-[12px] sm:text-sm md:text-lg" />,
};

const NavButton = ({
  children,
  label,
  onMouseEnter,
  onMouseLeave,
  icon = false,
  className = "",
  onClick,
  active = false,
}: {
  children?: React.ReactNode;
  label: string;
  icon?: boolean;
  onMouseEnter?: (menu: string) => void;
  onMouseLeave?: (menu: string) => void;
  className?: string;
  onClick?: (menu: string) => void;
  active?: boolean;
}) => {
  const menuKey = label.toLowerCase();

  return (
    <div
      className="relative flex h-16 items-center"
      onMouseEnter={() => onMouseEnter?.(menuKey)}
      onMouseLeave={() => onMouseLeave?.(menuKey)}
    >
      <button
        type="button"
        onClick={() => onClick?.(menuKey)}
        className={`hdr-link hdr-font relative ${
          active ? "hdr-link-active" : ""
        } ${className}`}
      >
        {icon && <span className="hidden sm:block">{ICONS[menuKey]}</span>}
        {label}
        {label === "Games" && (
          <span className="absolute -right-2 -top-2 rounded-full border-2 border-black bg-red-500 px-1.5 text-[10px] leading-4 text-white">
            Free
          </span>
        )}
      </button>

      <div className="absolute left-0 top-full h-3 w-full" />

      <div className="absolute left-0 top-full">
        <AnimatePresence>{children}</AnimatePresence>
      </div>
    </div>
  );
};

export default NavButton;
