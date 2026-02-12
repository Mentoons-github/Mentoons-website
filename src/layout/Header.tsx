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
    workshops: false,
    joinus: false,
  });

  const { cart } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();

  const filteredNav = COMMON_NAV.filter(
    (item) => item.label !== "Profile" || userId,
  );
  const navLeft = filteredNav.slice(0, 5);
  const navRight = filteredNav.slice(5);

  const handleBrowsePlansClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate("/membership");
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery("");
    }
  };

  const handleSearchSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    suggestion?: string,
  ) => {
    e.preventDefault();
    const query = suggestion || searchQuery.trim();
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setShowSearch(false);
    setSearchQuery("");
  };

  const handleProfileHover = () => setShowProfileDropdown(true);
  const handleProfileLeave = () => setShowProfileDropdown(false);

  const handleLogout = async () => {
    setShowProfileDropdown(false);
    await signOut();
    navigate("/adda");
  };

  const handleProfileNavigation = () => {
    setShowProfileDropdown(false);
    navigate("/adda/user-profile");
  };

  // Fixed: Proper async handling of getToken()
  useEffect(() => {
    const fetchCartData = async () => {
      if (!userId) return;
      try {
        const token = await getToken();
        if (token) {
          dispatch(getCart({ token, userId }));
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };

    fetchCartData();
  }, [userId, getToken, dispatch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleHover = (menu: string) =>
    setDropDown((prev) => ({ ...prev, [menu]: true }));
  const handleMouseLeave = (menu: string) =>
    setDropDown((prev) => ({ ...prev, [menu]: false }));

  if (location.pathname.startsWith("/employee")) return null;

  return (
    <header
      className={`${
        isScrolled ? "fixed top-0 left-0 w-full shadow-md" : "relative"
      } flex justify-between items-center bg-primary h-16 px-4 sm:px-6 lg:px-10 transition-all duration-300 z-40 w-full font-akshar`}
    >
      {/* Left Nav */}
      <div className="flex items-center lg:w-1/3">
        <nav className="hidden lg:flex gap-6 xl:gap-8">
          {navLeft.map(({ id, label, url, icon: Icon, items }) =>
            label === "Browse Plans" ? (
              <a
                key={id}
                href={url}
                onClick={handleBrowsePlansClick}
                className="group relative text-white flex items-center gap-2 text-sm lg:text-base font-semibold"
              >
                {Icon && typeof Icon === "function" && (
                  <Icon className="w-5 h-5" />
                )}
                {label}
                <span className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-white transition-all group-hover:w-full" />
              </a>
            ) : items?.length ? (
              <div key={id} className="relative">
                <NavButton
                  label={label}
                  onMouseEnter={() => handleHover(label.toLowerCase())}
                  onMouseLeave={() => handleMouseLeave(label.toLowerCase())}
                >
                  {dropdown[label.toLowerCase() as keyof DropDownInterface] && (
                    <DropDown
                      labelType={label.toLowerCase() as any}
                      items={items}
                    />
                  )}
                </NavButton>
              </div>
            ) : (
              <NavLink
                key={id}
                to={url}
                className="group relative text-white flex items-center gap-2 text-sm lg:text-base font-semibold"
              >
                {Icon && typeof Icon === "function" && (
                  <Icon className="w-5 h-5" />
                )}
                {label}
                <span className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-white transition-all group-hover:w-full" />
              </NavLink>
            ),
          )}
        </nav>
      </div>

      {/* Logo */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <NavLink to="/adda">
          <img
            src="/assets/common/logo/ec9141ccd046aff5a1ffb4fe60f79316.png"
            alt="Logo"
            className="w-28 sm:w-32 lg:w-40"
          />
        </NavLink>
      </div>

      {/* Mobile Right Icons */}
      <div className="flex items-center gap-4 lg:hidden">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <div
            onClick={handleSearchToggle}
            className="p-2 rounded-full hover:bg-white/10 cursor-pointer"
          >
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
        </motion.div>

        <SignedIn>
          <NavLink to="/cart" className="relative">
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            {(cart?.totalItemCount ?? 0) > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {cart.totalItemCount}
              </span>
            )}
          </NavLink>
        </SignedIn>

        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ rotate: 90, scale: 0.9 }}
          onClick={() => setSideBarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <FaTimes size={24} className="text-white" />
          ) : (
            <FaBars size={24} className="text-white" />
          )}
        </motion.div>
      </div>

      {/* Desktop Right Nav + Cart at the END */}
      <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <div
            onClick={handleSearchToggle}
            className="p-2 rounded-full hover:bg-white/10 cursor-pointer"
          >
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
        </motion.div>
        {navRight.map(({ id, label, url, icon: Icon, items }) => {
          if ((label === "Games" || label === "My Library") && !userId)
            return null;

          return label === "Browse Plans" ? (
            <a
              key={id}
              href={url}
              onClick={handleBrowsePlansClick}
              className="group relative text-white flex items-center gap-2 text-base font-semibold"
            >
              {Icon && typeof Icon === "function" && (
                <Icon className="w-5 h-5" />
              )}
              {label}
              <span className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-white transition-all group-hover:w-full" />
            </a>
          ) : label === "Share" ? (
            <div
              key={id}
              onClick={() => setShowShareModal(true)}
              className="group relative text-white flex items-center gap-2 text-base font-semibold cursor-pointer"
            >
              {Icon && typeof Icon === "function" && (
                <Icon className="w-5 h-5" />
              )}
              {label}
              <span className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-white transition-all group-hover:w-full" />
            </div>
          ) : label === "Profile" ? (
            <div key={id} className="relative" ref={profileDropdownRef}>
              <div
                onMouseEnter={handleProfileHover}
                onMouseLeave={handleProfileLeave}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="cursor-pointer"
                >
                  <FaUserCircle className="w-7 h-7 text-white" />
                </motion.div>

                <AnimatePresence>
                  {showProfileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-xl py-2 z-[10001] border"
                    >
                      <div
                        onClick={handleProfileNavigation}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </div>
                      <div
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : items?.length ? (
            <div key={id} className="relative">
              <NavButton
                label={label}
                onMouseEnter={() => handleHover(label.toLowerCase())}
                onMouseLeave={() => handleMouseLeave(label.toLowerCase())}
              >
                {dropdown[label.toLowerCase() as keyof DropDownInterface] && (
                  <DropDown labelType={"joinus"} items={items} />
                )}
              </NavButton>
            </div>
          ) : (
            <NavLink
              key={id}
              to={url}
              className="group relative text-white flex items-center gap-2 text-base font-semibold"
            >
              {Icon && typeof Icon === "function" && (
                <Icon className="w-5 h-5" />
              )}
              {label}
              <span className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-white transition-all group-hover:w-full" />
            </NavLink>
          );
        })}

        {/* CART AT THE VERY END */}
        <SignedIn>
          <NavLink to="/cart" className="relative ml-6">
            <ShoppingCart className="w-7 h-7 text-white" />
            {(cart?.totalItemCount ?? 0) > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {cart.totalItemCount}
              </span>
            )}
          </NavLink>
        </SignedIn>
      </nav>

      {/* Search Modal & Sidebar & Share Modal */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] flex items-start justify-center pt-24"
            onClick={handleSearchToggle}
          >
            <motion.div
              initial={{ y: -50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <form
                onSubmit={handleSearchSubmit}
                className="bg-white rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="flex items-center">
                  <Search className="w-6 h-6 text-gray-400 ml-6" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search games, comics, podcasts..."
                    className="flex-1 py-5 px-4 text-lg outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSearchToggle}
                    className="p-3 mr-4 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
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

      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          link={window.location.href}
        />
      )}
    </header>
  );
};

export default Header;
