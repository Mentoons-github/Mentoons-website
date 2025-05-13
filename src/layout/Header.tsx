import DropDown from "@/components/common/nav/dropdown";
import NavButton from "@/components/common/nav/navButton";
import Sidebar from "@/components/common/sidebar";
import ShareModal from "@/components/modals/ShareModal";
import { ADDA_NAV_LINKS, NAV_LINKS } from "@/constant";
import { getCart } from "@/redux/cartSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { DropDownInterface } from "@/types";
import { SignedIn, useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { FaBars, FaPhone } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const title = location.pathname.startsWith("/adda") ? "adda" : "home";
  const [isScrolled, setIsScrolled] = useState(false);
  const [sidebarOpen, setSideBarOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
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
          ["Mythos", "Community", "Collect Coins", "Profile"].includes(
            link.label
          )
        )
      : NAV_LINKS.filter((link) =>
          ["Adda", "Products", "Book Sessions"].includes(link.label)
        );

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
    <header
      className={`${
        isScrolled ? "fixed top-0 left-0 w-full shadow-md" : "relative"
      } flex justify-between items-center bg-primary max-w-screen-full h-16 px-4 md:px-10 transition-all duration-300 z-50 w-auto font-akshar`}
    >
      <a
        href="tel:+919036033300"
        className={`no-underline ${
          title === "adda" ? "lg:hidden block" : "md:hidden block"
        } whitespace-nowrap`}
      >
        <div className="bg-white text-[10px] md:text-[12px] font-semibold rounded-full px-2 md:px-3 py-1 flex justify-center items-center gap-2 text-primary">
          <FaPhone /> <span> +91 90360 33300</span>
        </div>
      </a>
      <nav
        className={`w-auto lg:w-1/2 ${
          title === "adda"
            ? "hidden lg:flex gap-3 md:gap-10"
            : "hidden lg:flex gap-3 md:gap-20"
        } justify-start lg:justify-center items-center `}
      >
        <a href="tel:+919036033300" className="hidden no-underline xl:block">
          <div className="bg-white text-[10px] md:text-[12px] font-semibold rounded-full px-2 md:px-3 py-1 flex justify-center items-center gap-2 text-primary">
            <FaPhone /> <span> +91 90360 33300</span>
          </div>
        </a>
        {navLeft.map(({ icon: Icon, id, label, url, items }) => (
          <div key={id} className="relative">
            {items && items?.length ? (
              <NavButton
                label={label}
                onMouseEnter={() => handleHover(label.toLowerCase())}
                onMouseLeave={() => handleMouseLeave(label.toLowerCase())}
              >
                {dropdown.products && (
                  <DropDown
                    labelType={label.toLowerCase() as "products" | "games"}
                    items={items}
                  />
                )}
              </NavButton>
            ) : (
              <NavLink
                to={url}
                className="group relative bg-transparent outline-none cursor-pointer text-center 
             text-[12px] sm:text-sm md:text-base font-semibold text-white flex 
             items-center gap-1 transition-all duration-300 ease-in-out"
              >
                {typeof Icon === "function" ? (
                  <Icon className="sm:text-sm md:text-lg" />
                ) : null}

                {label}

                {label === "Mythos" && (
                  <span className="absolute -top-1/2 -left-1/2 -translate-x-1/4 bg-red-500 rounded-full px-1 py-0.5 text-[12px] leading-none text-white">
                    Introducing
                  </span>
                )}
                <span
                  className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-white 
                   transition-all duration-300 ease-in-out group-hover:w-full"
                ></span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>
      <div className="flex justify-center px-10">
        <NavLink to="/">
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
          ["Browse Plans", "Workshops", "Assessments", "Share"].includes(
            data.label
          )
        ).map(({ id, label, url, icon: Icon }) =>
          label === "Browse Plans" ? (
            <a
              key={id}
              href={url}
              onClick={handleBrowsePlansClick}
              className="group relative bg-transparent outline-none cursor-pointer text-center 
             text-[12px] sm:text-sm md:text-base font-semibold text-white flex 
             items-center gap-1 transition-all duration-300 ease-in-out"
            >
              {Icon && typeof Icon === "function" ? (
                <Icon className="sm:text-sm md:text-lg" />
              ) : null}
              {label}
              <span
                className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-white 
                   transition-all duration-300 ease-in-out group-hover:w-full"
              ></span>
            </a>
          ) : label === "Share" ? (
            <div
              key={id}
              onClick={() => setShowShareModal(true)}
              className="group relative bg-transparent outline-none cursor-pointer text-center 
             text-[12px] sm:text-sm md:text-base font-semibold text-white flex 
             items-center gap-1 transition-all duration-300 ease-in-out"
            >
              {Icon && <Icon className="sm:text-sm md:text-lg" />}
              {label}
              <span
                className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-white 
                   transition-all duration-300 ease-in-out group-hover:w-full"
              ></span>
              {showShareModal && (
                <ShareModal
                  onClose={() => setShowShareModal((prev) => !prev)}
                  isOpen={showShareModal}
                  link={window.location.href}
                />
              )}
              {/* {showShareModal && (
                <ThankyouModal
                  onClose={() => setShowShareModal(false)}
                  isOpen={showShareModal}
                  message={ModalMessage.ENQUIRY_MESSAGE}
                />
              )} */}
            </div>
          ) : (
            <NavLink
              key={id}
              to={url}
              className="group relative bg-transparent outline-none cursor-pointer text-center 
             text-[12px] sm:text-sm md:text-base font-semibold text-white flex 
             items-center gap-1 transition-all duration-300 ease-in-out"
            >
              {Icon && <Icon className="sm:text-sm md:text-lg" />}
              {label}
              <span
                className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-white 
                   transition-all duration-300 ease-in-out group-hover:w-full"
              ></span>
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
        </SignedIn>
      </nav>
      <Sidebar
        token={userId ?? null}
        isOpen={sidebarOpen}
        title={title}
        dropdown={dropdown}
        handleHover={handleHover}
        handleMouseLeave={handleMouseLeave}
        setIsOpen={setSideBarOpen}
        handlePlans={handleBrowsePlansClick}
      />
    </header>
  );
};

export default Header;
