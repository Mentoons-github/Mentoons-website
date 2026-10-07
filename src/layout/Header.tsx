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
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const MENU_BASE_PATHS: Record<string, string> = {
  games: "/mentoons-games",
  products: "/products",
  workshops: "/mentoons-workshops",
  joinus: "/joinus",
};

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

  const containerRef = useRef(null);
  const splashLogoRef = useRef<HTMLDivElement>(null);
  const headerLogoRef = useRef<HTMLDivElement>(null);
  const splashRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const [dropdown, setDropDown] = useState<DropDownInterface>({
    games: false,
    comics: false,
    products: false,
    services: false,
    subscription: false,
    workshops: false,
    joinus: false,
  });

  const [hasAnimated, setHasAnimated] = useState(() => {
    return sessionStorage.getItem("splashAnimationShown") === "true";
  });

  useGSAP(
    () => {
      const splashLogo = splashLogoRef.current;
      const headerLogo = headerLogoRef.current;
      const splash = splashRef.current;
      const text = textRef.current;

      if (!splashLogo || !headerLogo || !splash || !text) return;

      if (hasAnimated) {
        gsap.set(splash, { display: "none", pointerEvents: "none" });
        gsap.set(headerLogo, { opacity: 1 });
        return;
      }

      const headerLogoRect = headerLogo.getBoundingClientRect();
      const splashLogoImg = splashLogo.querySelector("img");

      if (!splashLogoImg) return;

      const splashLogoRect = splashLogoImg.getBoundingClientRect();

      const finalX = headerLogoRect.left + headerLogoRect.width / 2;
      const finalY = headerLogoRect.top + headerLogoRect.height / 2;

      const scaleRatio = headerLogoRect.width / splashLogoRect.width;

      gsap.set(splashLogo, {
        position: "fixed",
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -100,
        scale: 1,
        opacity: 0,
        zIndex: 10002,
      });

      gsap.set(text, {
        position: "fixed",
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: 20,
        opacity: 0,
      });

      gsap.set(headerLogo, { opacity: 0 });

      const chars = text.querySelectorAll("span > span");

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          sessionStorage.setItem("splashAnimationShown", "true");
          setHasAnimated(true);
        },
      });

      tl.to(splashLogo, {
        opacity: 1,
        duration: 0.9,
        ease: "back.out(1.4)",
      })
        .to(
          text,
          {
            opacity: 1,
            duration: 0.6,
          },
          "-=0.3",
        )
        .fromTo(
          chars,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.05 },
          "-=0.6",
        )
        .to(
          splashLogo,
          {
            left: finalX,
            top: finalY,
            xPercent: -50,
            yPercent: -50,
            scale: scaleRatio,
            duration: 1.4,
            ease: "power2.inOut",
          },
          "+=0.3",
        )
        .to(
          text,
          {
            opacity: 0,
            duration: 0.5,
          },
          "-=1.2",
        )
        .to(
          headerLogo,
          {
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.6",
        )
        .to(
          splashLogo,
          {
            opacity: 0,
            duration: 0.4,
            ease: "power2.in",
          },
          "-=0.2",
        )
        .to(
          splash,
          {
            opacity: 0,
            duration: 0.6,
            ease: "power2.in",
          },
          "-=0.4",
        )
        .set(splash, { display: "none", pointerEvents: "none" })
        .set(splashLogo, { clearProps: "all" })
        .set(text, { clearProps: "all" });
    },
    { scope: containerRef, dependencies: [hasAnimated] },
  );

  const { cart } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();

  const filteredNav = COMMON_NAV.filter(
    (item) => item.label !== "Profile" || userId,
  );
  const navLeft = filteredNav.slice(0, 6);
  const navRight = filteredNav.slice(6);

  const isPathActive = (url: string) =>
    location.pathname === url || location.pathname.startsWith(`${url}/`);

  const isMenuActive = (menuKey: string) => {
    const base = MENU_BASE_PATHS[menuKey];
    if (!base) return false;
    return isPathActive(base);
  };

  const handleMenuClick = (menuKey: string) => {
    const base = MENU_BASE_PATHS[menuKey];
    if (base) navigate(base);
  };

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
    navigate("/");
  };

  const handleProfileNavigation = () => {
    setShowProfileDropdown(false);
    navigate("/adda/user-profile");
  };

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

  // Close the search overlay with Escape
  useEffect(() => {
    if (!showSearch) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowSearch(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showSearch]);

  const handleHover = (menu: string) =>
    setDropDown((prev) => ({ ...prev, [menu]: true }));
  const handleMouseLeave = (menu: string) =>
    setDropDown((prev) => ({ ...prev, [menu]: false }));

  const linkClass = (active: boolean) =>
    `hdr-link hdr-font ${active ? "hdr-link-active" : ""}`;

  // Icons are hidden below 2xl so the full menu fits on laptop screens
  const renderIcon = (Icon: any) =>
    Icon && typeof Icon === "function" ? (
      <Icon className="hidden w-5 h-5 2xl:block" />
    ) : null;

  if (location.pathname.startsWith("/employee")) return null;

  return (
    <div ref={containerRef}>
      <style>{`
        .hdr-font {
          font-family: var(--font-comic) !important;
          font-weight: 400 !important;
          letter-spacing: 0.04em;
        }

        .hdr-bar {
          border-bottom: 3px solid #000;
          box-shadow: 0 4px 0 #000;
        }

        .hdr-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          white-space: nowrap;
          color: #fff;
          border: 2px solid transparent;
          border-radius: 999px;
          padding: 0.2rem 0.65rem;
          font-size: 0.875rem;
          line-height: 1.25rem;
          cursor: pointer;
          background: transparent;
          transition: background-color 0.1s ease, box-shadow 0.1s ease, color 0.1s ease;
        }
        @media (min-width: 1536px) {
          .hdr-link { font-size: 1rem; line-height: 1.5rem; padding: 0.25rem 0.9rem; }
        }
        .hdr-link:hover {
          background: #fff;
          color: #000;
          border-color: #000;
          box-shadow: 2px 2px 0 #000;
        }
        .hdr-link-active {
          background: #fde047;
          color: #000;
          border-color: #000;
          box-shadow: 2px 2px 0 #000;
        }
        .hdr-link:focus-visible,
        .hdr-icon:focus-visible,
        .hdr-menu-item:focus-visible {
          outline: 3px solid #000;
          outline-offset: 2px;
        }

        .hdr-icon {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2.25rem;
          height: 2.25rem;
          background: #fff;
          color: #000;
          border: 2px solid #000;
          box-shadow: 2px 2px 0 #000;
          border-radius: 999px;
          cursor: pointer;
          transition: background-color 0.1s ease, box-shadow 0.1s ease;
        }
        @media (min-width: 640px) {
          .hdr-icon { width: 2.5rem; height: 2.5rem; }
        }
        .hdr-icon:hover { background: #fed7aa; box-shadow: 3px 3px 0 #000; }
        .hdr-icon:active { box-shadow: 1px 1px 0 #000; }
        .hdr-icon-active { background: #fde047; }

        .hdr-badge {
          position: absolute;
          top: -0.5rem;
          right: -0.5rem;
          min-width: 1.25rem;
          padding: 0 0.3rem;
          text-align: center;
          font-size: 0.7rem;
          line-height: 1.1rem;
          color: #fff;
          background: #ef4444;
          border: 2px solid #000;
          border-radius: 999px;
        }

        .hdr-menu {
          background: #fff;
          border: 3px solid #000;
          box-shadow: 4px 4px 0 #000;
          border-radius: 12px;
        }
        .hdr-menu-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.6rem 1rem;
          color: #000;
          cursor: pointer;
          background: transparent;
          text-align: left;
        }
        .hdr-menu-item:hover { background: #fed7aa; }
        .hdr-menu-item-danger:hover { background: #fecaca; }

        .hdr-search {
          background-color: #fffbeb;
          background-image: radial-gradient(rgba(249,115,22,0.10) 1.5px, transparent 2px);
          background-size: 16px 16px;
          border: 3px solid #000;
          box-shadow: 6px 6px 0 #000;
          border-radius: 14px;
        }
        .hdr-search-input {
          background: #fff;
          border: 2px solid #000;
          border-radius: 10px;
          box-shadow: 2px 2px 0 #000;
        }
        .hdr-search-input:focus-within { box-shadow: 3px 3px 0 #000; }
      `}</style>

      <div
        ref={splashRef}
        className="fixed inset-0 bg-orange-500 z-[10000] pointer-events-none flex flex-col items-center justify-center overflow-hidden"
        style={{ display: hasAnimated ? "none" : "flex" }}
      >
        <div ref={splashLogoRef}>
          <img
            src="/assets/common/logo/ec9141ccd046aff5a1ffb4fe60f79316.png"
            alt="Mentoons Logo"
            className="w-64 sm:w-80 md:w-96 lg:w-[28rem]"
          />
        </div>

        <div
          ref={textRef}
          className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-center px-6 mt-8"
        >
          {"Welcome to Mentoons".split(" ").map((word, wordIndex) => (
            <span
              key={wordIndex}
              className="inline-block whitespace-nowrap"
              style={{ marginRight: "0.3em" }}
            >
              {word.split("").map((char, charIndex) => (
                <span
                  key={charIndex}
                  className="inline-block"
                  style={{ display: "inline-block" }}
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <header
        className={`${
          isScrolled ? "fixed top-0 left-0 w-full" : "relative"
        } hdr-bar flex justify-between items-center bg-primary h-16 px-3 sm:px-6 xl:px-6 2xl:px-10 transition-all duration-300 z-40 w-full`}
      >
        {/* Left nav */}
        <div className="flex items-center min-w-0 xl:w-[38%] 2xl:w-1/3">
          <nav className="hidden xl:flex items-center gap-0.5 2xl:gap-2">
            {navLeft.map(({ id, label, url, icon: Icon, items }) =>
              label === "Browse Plans" ? (
                <a
                  key={id}
                  href={url}
                  onClick={handleBrowsePlansClick}
                  className={linkClass(isPathActive(url))}
                >
                  {renderIcon(Icon)}
                  {label}
                </a>
              ) : items?.length ? (
                <div key={id} className="relative">
                  <NavButton
                    label={label}
                    active={isMenuActive(label.toLowerCase())}
                    onClick={handleMenuClick}
                    onMouseEnter={() => handleHover(label.toLowerCase())}
                    onMouseLeave={() => handleMouseLeave(label.toLowerCase())}
                  >
                    {dropdown[
                      label.toLowerCase() as keyof DropDownInterface
                    ] && (
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
                  className={({ isActive }) => linkClass(isActive)}
                >
                  {renderIcon(Icon)}
                  {label}
                </NavLink>
              ),
            )}
          </nav>
        </div>

        {/* Centre logo */}
        <div
          ref={headerLogoRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
          style={{ opacity: hasAnimated ? 1 : 0 }}
        >
          <NavLink to="/">
            <img
              src="/assets/common/logo/ec9141ccd046aff5a1ffb4fe60f79316.png"
              alt="Logo"
              className="w-24 sm:w-32 xl:w-28 2xl:w-40"
            />
          </NavLink>
        </div>

        {/* Mobile / tablet actions */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto xl:hidden">
          <motion.button
            type="button"
            aria-label="Search"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleSearchToggle}
            className="hdr-icon"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>

          <SignedIn>
            <NavLink
              to="/cart"
              aria-label="Cart"
              className={({ isActive }) =>
                `hdr-icon ${isActive ? "hdr-icon-active" : ""}`
              }
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              {(cart?.totalItemCount ?? 0) > 0 && (
                <span className="hdr-badge hdr-font">
                  {cart.totalItemCount}
                </span>
              )}
            </NavLink>
          </SignedIn>

          <motion.button
            type="button"
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            aria-expanded={sidebarOpen}
            whileHover={{ scale: 1.08 }}
            whileTap={{ rotate: 90, scale: 0.92 }}
            onClick={() => setSideBarOpen(!sidebarOpen)}
            className="hdr-icon"
          >
            {sidebarOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </motion.button>
        </div>

        {/* Right nav (desktop) */}
        <nav className="hidden xl:flex items-center gap-0.5 2xl:gap-2">
          <motion.button
            type="button"
            aria-label="Search"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleSearchToggle}
            className="hdr-icon mr-1"
          >
            <Search className="w-5 h-5" />
          </motion.button>

          {navRight.map(({ id, label, url, icon: Icon, items }) => {
            if ((label === "Games" || label === "My Library") && !userId)
              return null;

            return label === "Browse Plans" ? (
              <a
                key={id}
                href={url}
                onClick={handleBrowsePlansClick}
                className={linkClass(isPathActive(url))}
              >
                {renderIcon(Icon)}
                {label}
              </a>
            ) : label === "Share" ? (
              <button
                key={id}
                type="button"
                onClick={() => setShowShareModal(true)}
                className={linkClass(false)}
              >
                {renderIcon(Icon)}
                {label}
              </button>
            ) : label === "Profile" ? (
              <div key={id} className="relative" ref={profileDropdownRef}>
                <div
                  onMouseEnter={handleProfileHover}
                  onMouseLeave={handleProfileLeave}
                >
                  <motion.button
                    type="button"
                    aria-label="Profile menu"
                    whileHover={{ scale: 1.08 }}
                    onClick={() => setShowProfileDropdown((v) => !v)}
                    className={`hdr-icon ${
                      isPathActive("/adda/user-profile")
                        ? "hdr-icon-active"
                        : ""
                    }`}
                  >
                    <FaUserCircle className="w-5 h-5" />
                  </motion.button>

                  <AnimatePresence>
                    {showProfileDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="hdr-menu hdr-font absolute right-0 mt-2 w-48 py-1 z-[10001] overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={handleProfileNavigation}
                          className="hdr-menu-item"
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="hdr-menu-item hdr-menu-item-danger"
                          style={{ color: "#b91c1c" }}
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : items?.length ? (
              <div key={id} className="relative">
                <NavButton
                  label={label}
                  active={isMenuActive(label.toLowerCase())}
                  onClick={handleMenuClick}
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
                className={({ isActive }) => linkClass(isActive)}
              >
                {renderIcon(Icon)}
                {label}
              </NavLink>
            );
          })}

          <SignedIn>
            <NavLink
              to="/cart"
              aria-label="Cart"
              className={({ isActive }) =>
                `hdr-icon ml-2 ${isActive ? "hdr-icon-active" : ""}`
              }
            >
              <ShoppingCart className="w-5 h-5" />
              {(cart?.totalItemCount ?? 0) > 0 && (
                <span className="hdr-badge hdr-font">
                  {cart.totalItemCount}
                </span>
              )}
            </NavLink>
          </SignedIn>
        </nav>

        {/* Search overlay */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] flex items-start justify-center pt-16 sm:pt-24"
              onClick={handleSearchToggle}
            >
              <motion.div
                initial={{ y: -50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -50, opacity: 0 }}
                className="w-full max-w-2xl mx-3 sm:mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <form
                  onSubmit={handleSearchSubmit}
                  className="hdr-search p-3 sm:p-5"
                >
                  <div className="hdr-search-input flex items-center">
                    <Search className="w-5 h-5 sm:w-6 sm:h-6 text-black ml-3 sm:ml-4 flex-shrink-0" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search games, comics, podcasts..."
                      className="hdr-font flex-1 min-w-0 py-3 sm:py-4 px-3 text-base sm:text-lg bg-transparent outline-none"
                    />
                    <button
                      type="button"
                      aria-label="Close search"
                      onClick={handleSearchToggle}
                      className="p-2 mr-2 rounded-full hover:bg-orange-100"
                    >
                      <X className="w-5 h-5 text-black" />
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
          // dropdown={dropdown}
          // handleHover={handleHover}
          // handleMouseLeave={handleMouseLeave}
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
    </div>
  );
};

export default Header;
