import DropDown from "@/components/common/nav/dropdown";
import NavButton from "@/components/common/nav/navButton";
import Sidebar from "@/components/common/sidebar";
import ShareModal from "@/components/modals/ShareModal";
import { COMMON_NAV } from "@/constant";
import { getCart } from "@/redux/cartSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { DropDownInterface } from "@/types";
import { SignedIn, useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { FaTimes, FaUserCircle } from "react-icons/fa";
import { FaBars, FaPhone } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useAuth();

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
  const { getToken } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  const filteredNav = COMMON_NAV.filter(
    (item) => item.label !== "Profile" || userId
  );
  const navLeft = filteredNav.slice(0, 4);

  const handleBrowsePlansClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/mentoons");
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
      } flex justify-between items-center bg-primary max-w-screen-full h-16 px-2 sm:px-4 md:px-6 lg:px-10 transition-all duration-300 z-[9999] w-full font-akshar`}
    >
      <div className="flex items-center lg:w-1/3 justify-start pl-0 lg:pl-4 xl:pl-6">
        <a
          href="tel:+919036033300"
          className={`no-underline ${
            title === "adda" ? "lg:hidden flex" : "md:hidden flex"
          } whitespace-nowrap flex-shrink-0`}
        >
          <div className="bg-white text-[10px] md:text-[12px] font-semibold rounded-full px-2 py-1 flex justify-center items-center gap-1 text-primary">
            <FaPhone className="flex-shrink-0" />{" "}
            <span className="flex-shrink-0">+91 90360 33300</span>
          </div>
        </a>

        <nav
          className={`w-auto flex-shrink-0 ${
            title === "adda"
              ? "hidden lg:flex gap-4 xl:gap-8"
              : "hidden lg:flex gap-4 xl:gap-8"
          } justify-start items-center`}
        >
          <a
            href="tel:+919036033300"
            className="hidden no-underline xl:block flex-shrink-0"
          >
            <div className="bg-white text-[10px] md:text-[12px] font-semibold rounded-full px-2 md:px-3 py-1 flex justify-center items-center gap-1 text-primary whitespace-nowrap">
              <FaPhone className="flex-shrink-0" />{" "}
              <span className="flex-shrink-0">+91 90360 33300</span>
            </div>
          </a>
          {navLeft.map(({ icon: Icon, id, label, url, items }) =>
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
            ) : (
              <div key={id} className="relative flex-shrink-0">
                {items && items?.length ? (
                  <NavButton
                    label={label}
                    onMouseEnter={() => handleHover(label.toLowerCase())}
                    onMouseLeave={() => handleMouseLeave(label.toLowerCase())}
                  >
                    {dropdown[
                      label.toLowerCase() as keyof DropDownInterface
                    ] && (
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
                    text-[11px] sm:text-xs md:text-sm lg:text-base font-semibold text-white flex 
                    items-center gap-1 transition-all duration-300 ease-in-out whitespace-nowrap"
                  >
                    {typeof Icon === "function" ? (
                      <Icon className="text-xs md:text-sm flex-shrink-0" />
                    ) : null}
                    {label}
                    {label === "Mythos" && (
                      <span className="absolute -top-1/2 -left-1/2 -translate-x-1/4 bg-red-500 rounded-full px-1 py-0.5 text-[8px] md:text-[10px] leading-none text-white whitespace-nowrap">
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
            )
          )}
        </nav>
      </div>

      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex-shrink-0">
        <NavLink to="/">
          <img
            src="/assets/common/logo/ec9141ccd046aff5a1ffb4fe60f79316.png"
            alt="mentoons-logo"
            className="w-[100px] sm:w-[120px] md:w-[130px] lg:w-[150px]"
          />
        </NavLink>
      </div>

      <div className="flex items-end gap-3 lg:w-1/3 justify-end gap-2 pr-0 lg:pr-4 xl:pr-6">
        <SignedIn>
          <div className="relative cursor-pointer lg:hidden flex flex-shrink-0">
            <NavLink to="/cart">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              {cart.totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {cart.totalItemCount}
                </span>
              )}
            </NavLink>
          </div>
          <div className="relative cursor-pointer lg:hidden flex flex-shrink-0">
            <NavLink to="/adda/user-profile">
              <FaUserCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </NavLink>
          </div>
        </SignedIn>

        <motion.div
          className={`${
            title === "adda" ? "lg:hidden flex" : "lg:hidden flex"
          } cursor-pointer z-50 flex-shrink-0 ml-2`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ rotate: 90, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={() => setSideBarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <FaTimes
              size={24}
              className="text-white transition-colors hover:text-gray-300"
            />
          ) : (
            <FaBars
              size={24}
              className="text-white transition-colors hover:text-gray-300"
            />
          )}
        </motion.div>
      </div>

      <nav
        className={`${
          title === "adda" ? "hidden lg:flex" : "hidden lg:flex"
        } items-center gap-4 xl:gap-8 justify-end`}
      >
        {filteredNav.slice(4).map(({ id, label, url, icon: Icon }) =>
          label === "Browse Plans" ? (
            <a
              key={id}
              href={url}
              onClick={handleBrowsePlansClick}
              className="group relative bg-transparent outline-none cursor-pointer text-center 
              text-[11px] sm:text-xs md:text-sm lg:text-base font-semibold text-white flex 
              items-center gap-1 transition-all duration-300 ease-in-out whitespace-nowrap flex-shrink-0"
            >
              {Icon && typeof Icon === "function" ? (
                <Icon className="text-xs md:text-sm flex-shrink-0" />
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
              text-[11px] sm:text-xs md:text-sm lg:text-base font-semibold text-white flex 
              items-center gap-1 transition-all duration-300 ease-in-out whitespace-nowrap flex-shrink-0"
            >
              {Icon && <Icon className="text-xs md:text-sm flex-shrink-0" />}
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
            </div>
          ) : label === "Profile" ? (
            <NavLink
              key={id}
              to={url}
              className="group relative bg-transparent outline-none cursor-pointer text-center 
              flex items-center transition-all duration-300 ease-in-out flex-shrink-0"
            >
              <FaUserCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white rounded-full" />
              <span
                className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-white 
                transition-all duration-300 ease-in-out group-hover:w-full"
              ></span>
            </NavLink>
          ) : (
            <NavLink
              key={id}
              to={url}
              className="group relative bg-transparent outline-none cursor-pointer text-center 
              text-[11px] sm:text-xs md:text-sm lg:text-base font-semibold text-white flex 
              items-center gap-1 transition-all duration-300 ease-in-out whitespace-nowrap flex-shrink-0"
            >
              {Icon && <Icon className="text-xs md:text-sm flex-shrink-0" />}
              {label}
              <span
                className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-white 
                transition-all duration-300 ease-in-out group-hover:w-full"
              ></span>
            </NavLink>
          )
        )}
        <SignedIn>
          <div className="relative cursor-pointer flex-shrink-0">
            <NavLink to="/cart">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              {cart.totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
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
