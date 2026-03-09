import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import DropDown from "./nav/dropdown";
import NavButton from "./nav/navButton";
import { useEffect, useState } from "react";
import { COMMON_NAV } from "@/constant";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

const Sidebar = ({
  isOpen,
  dropdown,
  handleHover,
  handleMouseLeave,
  setIsOpen,
  handlePlans,
}: {
  isOpen: boolean;
  token: string | null;
  dropdown: {
    comics: boolean;
    games: boolean;
    products: boolean;
    services: boolean;
    workshops: boolean;
    joinus: boolean;
  };
  handleHover: (key: string) => void;
  handleMouseLeave: (key: string) => void;
  setIsOpen: (val: boolean) => void;
  handlePlans: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}) => {
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const handleBreakPoint = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    window.addEventListener("resize", handleBreakPoint);
    handleBreakPoint();

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("resize", handleBreakPoint);
    };
  }, [isOpen, setIsOpen]);

  const handleSubNav = (label: string) => {
    if (isClicked) {
      handleMouseLeave(label.toLowerCase().replace(/\s/g, ""));
    } else {
      handleHover(label.toLowerCase().replace(/\s/g, ""));
    }
    setIsClicked((prev) => !prev);
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    console.log("clicked");
    setIsOpen(false);
    handlePlans(e);
  };

  return createPortal(
    <motion.aside
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : "100%" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={`fixed inset-0 w-full h-full bg-gray-900 bg-opacity-100 flex flex-col items-center justify-center gap-8 transition-opacity font-akshar  z-[999999] ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      } lg:hidden`}
    >
      <X
        className="absolute top-2 left-2 font-bold text-white"
        onClick={() => setIsOpen(false)}
      />
      <div className="flex flex-col items-center gap-8">
        {COMMON_NAV.map(({ id, label, url, items }) =>
          items ? (
            label === "Products" ? (
              <NavButton
                key={id ? id : label}
                className="text-white text-2xl sm:text-3xl md:text-4xl"
                label={label}
                icon={false}
                onMouseEnter={() => handleHover(label.toLowerCase())}
                onMouseLeave={() => handleMouseLeave(label.toLowerCase())}
                onClick={() => handleSubNav(label)}
              >
                {label === "Products" && dropdown.products && (
                  <DropDown
                    isOpen={setIsOpen}
                    items={items}
                    labelType="products"
                  />
                )}
              </NavButton>
            ) : label === "Join Us" ? (
              <NavButton
                key={id ? id : label}
                className="text-white text-2xl sm:text-3xl md:text-4xl"
                label={label}
                icon={false}
                onMouseEnter={() => handleHover(label.toLowerCase())}
                onMouseLeave={() => handleMouseLeave(label.toLowerCase())}
                onClick={() => handleSubNav(label)}
              >
                {label === "Join Us" && dropdown.joinus && (
                  <DropDown
                    isOpen={setIsOpen}
                    items={items}
                    labelType="joinus"
                  />
                )}
              </NavButton>
            ) : (
              <NavButton
                key={id ? id : label}
                className="text-white text-2xl sm:text-3xl md:text-4xl"
                label={label}
                icon={false}
                onMouseEnter={() => handleHover(label.toLowerCase())}
                onMouseLeave={() => handleMouseLeave(label.toLowerCase())}
                onClick={() => handleSubNav(label)}
              >
                {label === "Workshops" && dropdown.workshops && (
                  <DropDown
                    isOpen={setIsOpen}
                    items={items}
                    labelType="workshops"
                  />
                )}
              </NavButton>
            )
          ) : (
            <Link
              key={id}
              to={url}
              onClick={
                label === "Browse Plans"
                  ? (e) => handleClick(e)
                  : () => setIsOpen(false)
              }
              className="text-white text-2xl sm:text-3xl md:text-4xl flex items-center gap-2 transition duration-300 ease-in-out hover:text-yellow-500"
            >
              {label}
            </Link>
          ),
        )}
      </div>
    </motion.aside>,
    document.body,
  );
};

export default Sidebar;
