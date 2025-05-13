import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import DropDown from "./nav/dropdown";
import NavButton from "./nav/navButton";
import { useEffect } from "react";
import { ADDA_NAV_LINKS, NAV_LINKS } from "@/constant";

const Sidebar = ({
  isOpen,
  title,
  dropdown,
  handleHover,
  handleMouseLeave,
  setIsOpen,
  handlePlans,
}: {
  isOpen: boolean;
  title: string;
  token: string | null;
  dropdown: {
    comics: boolean;
    games: boolean;
    products: boolean;
    services: boolean;
  };
  handleHover: (key: string) => void;
  handleMouseLeave: (key: string) => void;
  setIsOpen: (val: boolean) => void;
  handlePlans: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}) => {
  const navLinks =
    title === "adda"
      ? ADDA_NAV_LINKS.filter((data) =>
          [
            "Mythos",
            "Products",
            "Community",
            "Browse Plans",
            "Workshops",
          ].includes(data.label)
        )
      : NAV_LINKS.filter((data) =>
          [
            "Adda",
            "Products",
            "Browse Plans",
            "Workshops",
            "Assessments",
          ].includes(data.label)
        );

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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    console.log("clicked");
    setIsOpen(false);
    handlePlans(e);
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : "100%" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={`fixed inset-0 w-full h-full bg-gray-900 bg-opacity-100 flex flex-col items-center justify-center gap-8 transition-opacity font-akshar ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      } lg:hidden`}
    >
      <div className="flex flex-col items-center gap-12">
        {navLinks.map(({ id, label, url, items }) =>
          items ? (
            <NavButton
              className="text-white text-2xl sm:text-3xl md:text-4xl"
              label={label}
              icon={false}
              onMouseEnter={() => handleHover(label.toLowerCase())}
              onMouseLeave={() => handleMouseLeave(label.toLowerCase())}
            >
              {label === "Products" && dropdown.products && (
                <DropDown
                  isOpen={setIsOpen}
                  items={items}
                  labelType="products"
                />
              )}
            </NavButton>
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
          )
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
