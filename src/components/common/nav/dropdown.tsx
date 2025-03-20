import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BiChevronRight } from "react-icons/bi";
import { NavLink } from "@/constant";

const DropDown = ({
  items = [],
  alignLeft,
  isOpen,
  labelType,
}: {
  items: NavLink[];
  alignLeft?: boolean;
  isOpen?: (val: boolean) => void;
  labelType?: "products" | "games";
}) => {
  const navigate = useNavigate();

  console.log("got itms: ", items);
  const handleClick = (category: string) => {
    console.log("selectedCategory : ", category);
    if (isOpen) isOpen(false);
    const basePath =
      labelType === "products" ? "/mentoons-store" : "/mentoons-games";
    navigate(`${basePath}?category=${encodeURIComponent(category)}`);
  };

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
            <button
              onClick={() => handleClick(data.label)}
              className="text-gray-800 text-sm md:text-base hover:text-black font-medium flex-1"
            >
              {data.label}
            </button>
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
