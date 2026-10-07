import { motion } from "framer-motion";
import { COMIC_COLOR } from "@/constant/products";
import {
  Baby,
  Blocks,
  PartyPopper,
  Gamepad2,
  Headphones,
  Sparkles,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

const AGE_ICONS: Record<string, LucideIcon> = {
  "0-2": Baby,
  "3-5": Blocks,
  "6-9": PartyPopper,
  "10-13": Gamepad2,
  "14-17": Headphones,
  "20+": Sparkles,
};

const AgeButton = ({
  isInView,
  setSelectedCategory,
  selectedCategory,
  className,
  showAll = false,
}: {
  isInView: boolean;
  setSelectedCategory: (val: string) => void;
  className?: string;
  selectedCategory?: string;
  showAll?: boolean;
}) => {
  const handleClick = (val: string) => {
    setSelectedCategory(val);
  };

  return (
    <ul
      className={
        className ??
        "flex overflow-x-auto no-scrollbar gap-2 py-2 px-1 mt-6 md:mt-8 md:grid md:grid-cols-3 md:overflow-visible md:gap-4 lg:grid-cols-5 lg:gap-6"
      }
    >
      {showAll && (
        <motion.li
          key="all"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{
            duration: 0.4,
            type: "spring",
            stiffness: 260,
            damping: 22,
          }}
          className="shrink-0 md:w-full"
        >
          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleClick("all")}
            className={`flex items-center gap-2 md:gap-3 whitespace-nowrap md:w-full px-3 md:px-4 py-2 md:py-3 rounded-2xl border-2 montserrat font-bold text-left transition-colors duration-300 cursor-pointer ${
              selectedCategory === undefined
                ? "bg-yellow-300 border-yellow-500 shadow-[3px_3px_0_0_#ca8a04]"
                : "bg-white border-gray-200 shadow-[2px_2px_0_0_#e5e7eb] hover:border-gray-300"
            }`}
          >
            <span
              className={`flex items-center justify-center w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full shrink-0 ${
                selectedCategory === undefined ? "bg-yellow-100" : "bg-gray-100"
              }`}
            >
              <PartyPopper
                className={`w-4 h-4 md:w-5 md:h-5 ${
                  selectedCategory === undefined
                    ? "text-yellow-900"
                    : "text-gray-600"
                }`}
                strokeWidth={2.2}
              />
            </span>
            <span className="text-xs sm:text-sm md:text-base text-gray-900 leading-tight">
              All Ages
            </span>
          </motion.button>
        </motion.li>
      )}

      {Object.entries(COMIC_COLOR).map(([key, value], index) => {
        const isSelected = selectedCategory === key;
        const Icon = AGE_ICONS[key] ?? BookOpen;

        return (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{
              duration: 0.4,
              delay: index * 0.06,
              type: "spring",
              stiffness: 260,
              damping: 22,
            }}
            className="shrink-0 md:w-full"
          >
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleClick(key)}
              className="relative flex items-center gap-2 md:gap-3 whitespace-nowrap md:w-full px-3 md:px-4 py-2 md:py-3 rounded-2xl border-2 montserrat font-bold text-left transition-colors duration-300 cursor-pointer"
              style={{
                backgroundColor: isSelected ? `${value}22` : "#ffffff",
                borderColor: isSelected ? value : "#e5e7eb",
                boxShadow: isSelected
                  ? `3px 3px 0 0 ${value}`
                  : "2px 2px 0 0 #e5e7eb",
              }}
            >
              <span
                className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full shrink-0"
                style={{ backgroundColor: isSelected ? value : "#f3f4f6" }}
              >
                <Icon
                  className={`w-4 h-4 md:w-5 md:h-5 ${
                    isSelected ? "text-white" : "text-gray-600"
                  }`}
                  strokeWidth={2.2}
                />
              </span>
              <span className="text-xs sm:text-sm md:text-base text-gray-900 leading-tight">
                {key} <span className="text-gray-500 font-semibold">yrs</span>
              </span>

              {isSelected && (
                <motion.span
                  layoutId="rail-dot"
                  className="hidden md:block absolute right-3 md:right-4 w-2 h-2 rounded-full"
                  style={{ backgroundColor: value }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
            </motion.button>
          </motion.li>
        );
      })}
    </ul>
  );
};

export default AgeButton;
