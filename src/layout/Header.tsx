import DropDown from "@/components/common/nav/dropdown";
import NavButton from "@/components/common/nav/navButton";
import Sidebar from "@/components/common/sidebar";
import ShareModal from "@/components/modals/ShareModal";
import { COMMON_NAV } from "@/constant";
import { getCart } from "@/redux/cartSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { DropDownInterface } from "@/types";
import { SignedIn, useAuth } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, X, User, LogOut } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { FaTimes, FaUserCircle } from "react-icons/fa";
import { FaBars, FaPhone } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, signOut } = useAuth();

  const title = location.pathname.startsWith("/adda") ? "adda" : "home";
  const [isScrolled, setIsScrolled] = useState(false);
  const [sidebarOpen, setSideBarOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

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

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery("");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  const handleProfileHover = () => {
    setShowProfileDropdown(true);
  };

  const handleProfileContainerLeave = () => {
    setShowProfileDropdown(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setShowProfileDropdown(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleProfileNavigation = () => {
    setShowProfileDropdown(false);
    navigate("/adda/user-profile");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
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
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2,
        ease: "easeOut",
      },
    }),
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

      <div className="flex justify-end items-center gap-3 lg:w-1/3 justify-end gap-2 pr-0 lg:pr-4 xl:pr-6">
        <motion.div
          className="relative cursor-pointer flex-shrink-0"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div
            onClick={handleSearchToggle}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
        </motion.div>

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
            <div
              ref={profileDropdownRef}
              onMouseEnter={handleProfileHover}
              onMouseLeave={handleProfileContainerLeave}
              className="relative"
            >
              <motion.div whileHover={{ scale: 1.05 }} className="relative">
                <FaUserCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </motion.div>

              <AnimatePresence>
                {showProfileDropdown && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[10001]"
                  >
                    <motion.div
                      custom={0}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      onClick={handleProfileNavigation}
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3 text-gray-700 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">Profile</span>
                    </motion.div>

                    <motion.div
                      custom={1}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      onClick={handleLogout}
                      className="px-4 py-2 hover:bg-red-50 cursor-pointer flex items-center gap-3 text-red-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
            <div key={id} className="relative flex-shrink-0">
              <div
                ref={profileDropdownRef}
                onMouseEnter={handleProfileHover}
                onMouseLeave={handleProfileContainerLeave}
                className="relative"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="group relative bg-transparent outline-none cursor-pointer text-center 
                  flex items-center transition-all duration-300 ease-in-out"
                >
                  <FaUserCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white rounded-full" />
                  <span
                    className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-white 
                    transition-all duration-300 ease-in-out group-hover:w-full"
                  ></span>
                </motion.div>

                <AnimatePresence>
                  {showProfileDropdown && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[10001]"
                    >
                      <motion.div
                        custom={0}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        onClick={handleProfileNavigation}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3 text-gray-700 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm font-medium">Profile</span>
                      </motion.div>

                      <motion.div
                        custom={1}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        onClick={handleLogout}
                        className="px-4 py-2 hover:bg-red-50 cursor-pointer flex items-center gap-3 text-red-600 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Logout</span>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
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

      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-start justify-center pt-20"
            onClick={handleSearchToggle}
          >
            <motion.div
              initial={{ y: -50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -50, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <form
                onSubmit={handleSearchSubmit}
                className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="flex items-center">
                  <div className="pl-6 pr-3 py-4">
                    <Search className="w-6 h-6 text-gray-400" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search for games, comics, products..."
                    className="flex-1 py-4 pr-4 text-lg text-gray-900 placeholder-gray-500 bg-transparent border-none outline-none"
                  />
                  <motion.button
                    type="button"
                    onClick={handleSearchToggle}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 mr-3 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </motion.button>
                </div>

                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-100 p-4"
                  >
                    <p className="text-sm text-gray-500 mb-2">
                      Press Enter to search
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Games", "Comics", "Products", "Subscriptions"].map(
                        (suggestion) => (
                          <motion.button
                            key={suggestion}
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSearchQuery(suggestion);
                              handleSearchSubmit(new Event("submit") as any);
                            }}
                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-primary hover:text-white transition-colors"
                          >
                            {suggestion}
                          </motion.button>
                        )
                      )}
                    </div>
                  </motion.div>
                )}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
