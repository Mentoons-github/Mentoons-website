import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Search, ShoppingCart, User, X } from "lucide-react";
import { FaTimes, FaUserCircle, FaBars } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { SignedIn, useAuth } from "@clerk/clerk-react";
import { COMMON_NAV } from "@/constant";
import { getCart } from "@/redux/cartSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { DropDownInterface } from "@/types";
import DropDown from "@/components/common/nav/dropdown";
import NavButton from "@/components/common/nav/navButton";
import Sidebar from "@/components/common/sidebar";
import ShareModal from "@/components/modals/ShareModal";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, signOut, getToken } = useAuth();

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
  const dispatch = useDispatch<AppDispatch>();

  const filteredNav = COMMON_NAV.filter(
    (item) => item.label !== "Profile" || userId
  );
  const navLeft = filteredNav.slice(0, 5);

  const handleBrowsePlansClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    navigate("/membership");
  };

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

  const handleSearchSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    suggestion?: string
  ) => {
    e.preventDefault();
    const query = suggestion || searchQuery.trim();
    const encoded = encodeURIComponent(query);
    if (!encoded) return;

    const currentParams = new URLSearchParams(location.search);
    const currentQ = currentParams.get("q");

    if (currentQ === encoded) {
      navigate(`/search?q=${encoded}`, { replace: true });
      navigate(0);
    } else {
      navigate(`/search?q=${encoded}`);
    }

    setShowSearch(false);
    setSearchQuery("");
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
        await dispatch(getCart({ token, userId }));
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

  if (location.pathname.startsWith("/employee")) {
    return null;
  }

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.15 },
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
      id="header"
      className={`${
        isScrolled ? "fixed top-0 left-0 w-full shadow-md" : "relative"
      } flex justify-between items-center bg-primary max-w-screen-full h-16 px-2 sm:px-4 md:px-6 lg:px-10 transition-all duration-300 z-40 w-full font-akshar`}
    >
      <div className="flex items-center justify-start pl-0 lg:w-1/3 lg:pl-4 xl:pl-6">
        <nav
          className={`w-auto flex-shrink-0 ${
            title === "adda"
              ? "hidden lg:flex gap-4 xl:gap-8"
              : "hidden lg:flex gap-4 xl:gap-8"
          } justify-start items-center`}
        >
          {navLeft.map(({ icon: Icon, id, label, url, items }) =>
            label === "Browse Plans" ? (
              <a
                key={id}
                href={url}
                onClick={handleBrowsePlansClick}
                className="group relative bg-transparent outline-none cursor-pointer text-center text-[12px] sm:text-sm md:text-base font-semibold text-white flex items-center gap-1 transition-all duration-300 ease-in-out"
              >
                {Icon && typeof Icon === "function" && (
                  <Icon className="sm:text-sm md:text-lg" />
                )}
                {label}
                <span className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-white transition-all duration-300 ease-in-out group-hover:w-full" />
              </a>
            ) : (
              <div key={id} className="relative flex-shrink-0">
                {items && items.length ? (
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
                    className="group relative bg-transparent outline-none cursor-pointer text-center text-[11px] sm:text-xs md:text-sm lg:text-base font-semibold text-white flex items-center gap-1 transition-all duration-300 ease-in-out whitespace-nowrap"
                  >
                    {Icon && typeof Icon === "function" && (
                      <Icon className="flex-shrink-0 text-xs md:text-sm" />
                    )}
                    {label}
                    {label === "Mythos" && (
                      <span className="absolute -top-1/2 -left-1/2 -translate-x-1/4 bg-red-500 rounded-full px-1 py-0.5 text-[8px] md:text-[10px] leading-none text-white whitespace-nowrap">
                        Introducing
                      </span>
                    )}
                    <span className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-white transition-all duration-300 ease-in-out group-hover:w-full" />
                  </NavLink>
                )}
              </div>
            )
          )}
        </nav>
      </div>

      <div className="absolute flex-shrink-0 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
        <NavLink to="/">
          <img
            src="/assets/common/logo/ec9141ccd046aff5a1ffb4fe60f79316.png"
            alt="mentoons-logo"
            className="w-[100px] sm:w-[120px] md:w-[130px] lg:w-[150px]"
          />
        </NavLink>
      </div>

      <div className="flex items-center justify-end gap-3 pr-0 lg:w-1/3 lg:pr-4 xl:pr-6">
        <motion.div
          className="relative flex-shrink-0 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div
            onClick={handleSearchToggle}
            className="p-2 transition-colors rounded-full hover:bg-white/10"
          >
            <Search className="w-5 h-5 text-white sm:w-6 sm:h-6" />
          </div>
        </motion.div>

        <SignedIn>
          <div className="relative flex flex-shrink-0 cursor-pointer lg:hidden">
            <NavLink to="/cart">
              <ShoppingCart className="w-5 h-5 text-white sm:w-6 sm:h-6" />
              {(cart?.totalItemCount ?? 0) > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {cart.totalItemCount}
                </span>
              )}
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
        {filteredNav.slice(5).map(({ id, label, url, icon: Icon }) =>
          label === "Browse Plans" ? (
            <a
              key={id}
              href={url}
              onClick={handleBrowsePlansClick}
              className="group relative bg-transparent outline-none cursor-pointer text-center text-[11px] sm:text-xs md:text-sm lg:text-base font-semibold text-white flex items-center gap-1 transition-all duration-300 ease-in-out whitespace-nowrap flex-shrink-0"
            >
              {Icon && typeof Icon === "function" && (
                <Icon className="flex-shrink-0 text-xs md:text-sm" />
              )}
              {label}
              <span className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-white transition-all duration-300 ease-in-out group-hover:w-full" />
            </a>
          ) : label === "Share" ? (
            <div
              key={id}
              onClick={() => setShowShareModal(true)}
              className="group relative bg-transparent outline-none cursor-pointer text-center text-[11px] sm:text-xs md:text-sm lg:text-base font-semibold text-white flex items-center gap-1 transition-all duration-300 ease-in-out whitespace-nowrap flex-shrink-0"
            >
              {Icon && typeof Icon === "function" && (
                <Icon className="flex-shrink-0 text-xs md:text-sm" />
              )}
              {label}
              <span className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-white transition-all duration-300 ease-in-out group-hover:w-full" />
              {showShareModal && (
                <ShareModal
                  onClose={() => setShowShareModal(false)}
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
                  className="relative flex items-center text-center transition-all duration-300 ease-in-out bg-transparent outline-none cursor-pointer group"
                >
                  <FaUserCircle className="w-5 h-5 text-white rounded-full sm:w-6 sm:h-6" />
                  <span className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-white transition-all duration-300 ease-in-out group-hover:w-full" />
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
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 transition-colors cursor-pointer hover:bg-gray-50"
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
                        className="flex items-center gap-3 px-4 py-2 text-red-600 transition-colors cursor-pointer hover:bg-red-50"
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
              className="group relative bg-transparent outline-none cursor-pointer text-center text-[11px] sm:text-xs md:text-sm lg:text-base font-semibold text-white flex items-center gap-1 transition-all duration-300 ease-in-out whitespace-nowrap flex-shrink-0"
            >
              {Icon && typeof Icon === "function" && (
                <Icon className="flex-shrink-0 text-xs md:text-sm" />
              )}
              {label}
              <span className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-white transition-all duration-300 ease-in-out group-hover:w-full" />
            </NavLink>
          )
        )}
        <SignedIn>
          <div className="relative flex-shrink-0 cursor-pointer">
            <NavLink to="/cart">
              <ShoppingCart className="w-5 h-5 text-white sm:w-6 sm:h-6" />
              {(cart?.totalItemCount ?? 0) > 0 && (
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
                className="relative overflow-hidden bg-white shadow-2xl rounded-2xl"
              >
                <div className="flex items-center">
                  <div className="py-4 pl-6 pr-3">
                    <Search className="w-6 h-6 text-gray-400" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search for games, comics, podcasts..."
                    className="flex-1 py-4 pr-4 text-lg text-gray-900 placeholder-gray-500 bg-transparent border-none outline-none"
                  />
                  <motion.button
                    type="button"
                    onClick={handleSearchToggle}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 mr-3 transition-colors rounded-full hover:bg-gray-100"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </motion.button>
                </div>

                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 border-t border-gray-200"
                  >
                    <p className="mb-2 text-sm text-gray-500">
                      Press Enter to search
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Games", "Comics", "Books", "Cards"].map(
                        (suggestion) => (
                          <motion.button
                            key={suggestion}
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSearchQuery(suggestion);
                              handleSearchSubmit(
                                new Event("submit") as any,
                                suggestion
                              );
                            }}
                            className="px-3 py-1 text-sm text-gray-700 transition-colors bg-gray-100 rounded-full hover:bg-primary hover:text-white"
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
