import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BiChevronRight } from "react-icons/bi";
import { NavLink } from "@/constant";

const DropDown = ({
  items = [],
  alignLeft,
  isOpen,
}: {
  items: NavLink[];
  alignLeft?: boolean;
  isOpen?: (val: boolean) => void;
}) => {
  return (
    <div className="relative font-akshar">
      <motion.ul
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`absolute ${
          alignLeft ? "right-0" : "left-0"
        } mt-2 w-32 md:w-48 bg-white shadow-lg z-50 rounded-md overflow-hidden text-center border border-gray-200`}
      >
        {items.map((data, index) => (
          <motion.li
            key={index}
            whileHover={{
              scale: 1.05,
              borderBottomWidth: "3px",
              borderColor: "#FBBF24",
              transition: { duration: 0.2 },
            }}
            className="p-2 transform transition-all duration-200 border-b border-gray-300 hover:border-yellow-400 hover:bg-gray-100 rounded-md flex justify-between items-center"
          >
            <Link
              to={data.url}
              onClick={() => isOpen && isOpen(false)}
              className="text-gray-800 text-sm md:text-base hover:text-black font-medium flex-1"
            >
              {data.label}
            </Link>
            <BiChevronRight
              className="text-gray-500 text-sm md:text-base group-hover:text-gray-800 transition duration-200"
              size={18}
            />
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};

export default DropDown;
