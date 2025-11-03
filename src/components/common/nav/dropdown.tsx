import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BiChevronRight } from "react-icons/bi";
import { NavLink } from "@/constant";

interface NavLinkWithDescription extends NavLink {
  description?: string;
}

const DropDown = ({
  items = [],
  alignLeft,
  isOpen,
  labelType,
}: {
  items: NavLinkWithDescription[];
  alignLeft?: boolean;
  isOpen?: (val: boolean) => void;
  labelType?: "products" | "games" | "workshops";
}) => {
  const navigate = useNavigate();

  const handleClick = (category: string) => {
    if (isOpen) isOpen(false);

    let basePath = "";
    if (labelType === "products") {
      basePath = "/product";
    } else if (labelType === "workshops") {
      basePath = "/mentoons-workshops";
    } else {
      basePath = "/mentoons-games";
    }

    navigate(`${basePath}?category=${encodeURIComponent(category)}`);
  };

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: -15,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -20,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const hoverVariants = {
    hover: {
      scale: 1.02,
      x: 8,
      backgroundColor: "#f8fafc",
      borderLeftColor: "#3b82f6",
      borderLeftWidth: "4px",
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
      },
    },
  };

  return (
    <div className="relative font-akshar">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`absolute ${
          alignLeft ? "right-0" : "left-0"
        } mt-3 w-40 md:w-56 bg-white shadow-2xl z-50 rounded-xl overflow-hidden border border-gray-100 backdrop-blur-sm`}
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {labelType}
          </h3>
        </div>

        <div className="py-2">
          {items.map((data, index) => {
            // Only for workshops, add a side line based on the label
            let sideLine = "";
            if (labelType === "workshops") {
              if (data.label === "Instant Katha") sideLine = "Storytelling";
              else if (data.label === "Hasyaras") sideLine = "Laughter";
              else if (data.label === "KalaKriti") sideLine = "Art";
              else if (data.label === "Career Corner") sideLine = "Career";
            }

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover="hover"
                whileTap="tap"
                className="group relative"
              >
                <motion.button
                  variants={hoverVariants}
                  onClick={() => handleClick(data.label)}
                  className="w-full px-4 py-3 text-left transition-all duration-200 flex items-center justify-between group border-l-4 border-transparent hover:border-blue-500"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-60 group-hover:opacity-100 transition-opacity duration-200"></div>

                    <span className="flex flex-col">
                      {/* Main Label */}
                      <span className="text-gray-700 text-sm md:text-base font-medium group-hover:text-gray-900 transition-colors duration-200">
                        {data.label}
                      </span>

                      {/* Side line only for workshops */}
                      {sideLine && (
                        <span className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
                          {sideLine}
                        </span>
                      )}
                    </span>
                  </div>

                  <motion.div
                    className="text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
                    animate={{ x: 0 }}
                    whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  >
                    <BiChevronRight size={18} />
                  </motion.div>
                </motion.button>

                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10 rounded-lg mx-2"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
              </motion.div>
            );
          })}
        </div>

        <div className="px-4 py-2 bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            {items.length} {items.length === 1 ? "option" : "options"} available
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default DropDown;
