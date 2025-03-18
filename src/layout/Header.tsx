import Sidebar from "@/components/common/sidebar";
import { NAV_LINKS, ADDA_NAV_LINKS } from "@/constant";
import { getCart } from "@/redux/cartSlice";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { AppDispatch, RootState } from "@/redux/store";
import { SignedIn, useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaPhone } from "react-icons/fa6";
import { DropDownInterface } from "@/types";
import NavButton from "@/components/common/nav/navButton";
import DropDown from "@/components/common/nav/dropdown";
import { FaTimes } from "react-icons/fa";
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const title = location.pathname.startsWith("/adda") ? "adda" : "home";
  const [isScrolled, setIsScrolled] = useState(false);
  const [sidebarOpen, setSideBarOpen] = useState(false);
  const [dropdown, setDropDown] = useState<DropDownInterface>({
    games: false,
    comics: false,
    products: false,
    services: false,
    subscription: false,
  });

  const { cart } = useSelector((state: RootState) => state.cart);
  const { getToken, userId } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  const navLeft =
    title === "adda"
      ? ADDA_NAV_LINKS.filter((link) =>
          ["Mythos", "Community"].includes(link.label)
        )
      : NAV_LINKS.filter((link) => ["Mythos", "Products"].includes(link.label));

  const handleBrowsePlansClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToSubscription(), 500);
    } else {
      scrollToSubscription();
    }
  };
  const scrollToSubscription = () =>
    document
      .getElementById("subscription")
      ?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      const token = await getToken();

      if (token && userId) {
        const response = await dispatch(getCart({ token, userId }));
        console.log("Response Data", response);
      }
    };

    fetchCart();
  }, [dispatch, getToken, userId]);

  const handleHover = (menu: string) => {
    setDropDown((prev) => ({ ...prev, [menu]: true }));
  };

  const handleMouseLeave = (menu: string) => {
    setDropDown((prev) => ({ ...prev, [menu]: false }));
  };

  return (
    <div
      className={`h-16 bg-primary border-b-[.5px] border-gray-200 shadow-2xl fixed top-0 w-full z-[999] transition-transform duration-300 ${
        isVisible || lastScrollY < 64 ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between h-full px-4 ">
        {/* Left Section - Hidden on mobile */}
        <div className="items-center flex-1 hidden pl-6 space-x-6 font-semibold text-black lg:flex md:hidden">
          {NAV_LINKS.filter((link) =>
            ["Date", "Call us", "Join Us", "Plans", "Store"].includes(
              link.label,
            ),
          ).map((link) => (
            <div key={link.id} className="text-white whitespace-nowrap">
              {link.label === "Date" ? (
                <span className="px-3 py-2 bg-white rounded-full text-primary whitespace-nowrap ">
                  {new Date().toDateString()}
                </span>
              ) : link.label === "Call us" ? (
                <a
                  href="tel:+91 90360 33300"
                  className="px-3 py-2 bg-white rounded-full text-primary whitespace-nowrap "
                >
                  Call us: +91 90360 33300
                </a>
              ) : (
                <NavLink
                  to={link.url}
                  className="px-3 py-2 text-white transition-all duration-200 border rounded-full hover:text-gray-200 border-primary hover:border-white/20 hover:bg-white/10"
                >
                  {link.label}{" "}
                </NavLink>
              )}
            </div>
          ))}
        </div>

        {/* Middle Section - Logo */}
        <div
          className="items-center hidden lg:flex"
          onClick={() => navigate("/")}
        >
          <img
            src="/assets/common/logo/ec9141ccd046aff5a1ffb4fe60f79316.png"
            alt="mentoons-logo"
            className="w-[120px] md:w-[130px] lg:w-[150px] mx-auto"
          />
        </NavLink>
      </div>
      <motion.div
        className={`${
          title === "adda" ? "lg:hidden block" : "lg:hidden block"
        } cursor-pointer z-50`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ rotate: 90, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={() => setSideBarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          <FaTimes
            size={26}
            className="text-white transition-colors hover:text-gray-300"
          />
        ) : (
          <FaBars
            size={26}
            className="text-white transition-colors hover:text-gray-300"
          />
        )}
      </motion.div>

      <nav
        className={`w-fit lg:w-1/2 ${
          title === "adda" ? "hidden lg:flex" : "hidden lg:flex"
        } justify-evenly items-center gap-2 md:gap-5`}
      >
        {ADDA_NAV_LINKS.filter((data) =>
          ["Browse Plans", "Workshops", "Assessments"].includes(data.label)
        ).map(({ id, label, url, icon: Icon }) =>
          label === "Browse Plans" ? (
            <a
              key={id}
              href={url}
              onClick={handleBrowsePlansClick}
              className="text-white px-4 py-2 rounded-md font-semibold text-[12px] sm:text-sm md:text-base flex items-center gap-1"
            >
              {Icon && typeof Icon === "function" ? (
                <Icon className="sm:text-sm md:text-lg" />
              ) : null}
              {label}
            </a>
          ) : (
            <NavLink
              key={id}
              to={url}
              className="bg-transparent outline-none cursor-pointer text-center text-[12px] sm:text-sm md:text-base font-semibold text-white flex items-center gap-1"
            >
              {Icon && typeof Icon === "function" ? (
                <Icon className="sm:text-sm md:text-lg" />
              ) : null}
              {label}
            </NavLink>
          )
        )}
        <SignedIn>
          <div className="relative cursor-pointer">
            <NavLink to="/cart">
              <ShoppingCart className="w-6 h-6 text-white" />
              {cart.totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cart.totalItemCount}
                </span>
              )}
            </NavLink>
          </div>
        </div>
        {/* Mobile Menu */}
        <div className="flex items-center justify-between w-full sm:flex md:flex lg:hidden">
          <figure className="w-6 h-6">
            <img
              src="/assets/home/home-icn.png"
              alt="home icon"
              className="object-contain w-full h-full "
            />
          </figure>
          <div
            className="flex items-center lg:hidden"
            onClick={() => navigate("/")}
          >
            <img
              src="/assets/images/mentoons-logo.png"
              alt="Company Logo"
              className="max-h-24 pr-1 pt-4 pb-2 bg-primary rounded-full relative z-[999] border-b"
            />
          </div>
          <div className="w-6 h-6" onClick={handleMenuToggle}>
            {menuOpen ? (
              <IoClose className="w-full h-full font-semibold text-white" />
            ) : (
              <IoMenu className="w-full h-full text-white" />
            )}
          </div>
          {isVisible && menuOpen && (
            <div className=" absolute bg-amber-50 border border-gray-200 top-16 left-0 w-full text-center h-[calc(100vh-64px)]  z-50  pt-[100px]">
              <ul>
                {NAV_LINKS.filter(
                  (link) => !["Date", "Call us", "User"].includes(link.label),
                ).map((link) => (
                  <li
                    key={link.id}
                    className="py-2 text-2xl font-semibold text-gray-700 cursor-pointer"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(link.url);
                    }}
                  >
                    {link.label}
                  </li>
                ))}
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
