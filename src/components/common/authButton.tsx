import { FaMoneyCheckAlt, FaUser, FaUserCircle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { FaBox } from "react-icons/fa6";
// You can choose a better icon for EMI if you want (optional)
import { MdPayment } from "react-icons/md"; // ← nice choice for EMI/payments

const AuthButton = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleDropdownMouseEnter = () => {
    setShowProfileDropdown(true);
  };

  const handleDropdownMouseLeave = () => {
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

  const handleNavigation = (nav: "profile" | "order" | "emi") => {
    setShowProfileDropdown(false);

    if (nav === "profile") {
      navigate("/adda/user-profile");
    } else if (nav === "order") {
      navigate("/order-history");
    } else if (nav === "emi") {
      navigate("/emi");
    }
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

  const dropdownVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.9, transformOrigin: "top right" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transformOrigin: "top right",
      transition: {
        duration: 0.3,
        ease: [0, 0, 0.2, 1],
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.9,
      transformOrigin: "top right",
      transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: [0, 0, 0.2, 1] },
    },
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.02, transition: { duration: 0.2, ease: "easeOut" } },
    tap: { scale: 0.98, transition: { duration: 0.1 } },
  };

  return (
    <motion.div
      className="relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <SignedIn>
        <div
          className="relative"
          ref={profileDropdownRef}
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleDropdownMouseLeave}
        >
          <motion.div
            variants={buttonVariants}
            initial="idle"
            animate={isHovered ? "hover" : "idle"}
            whileTap="tap"
            onClick={handleProfileClick}
            className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 hover:from-slate-700 hover:via-slate-600 hover:to-slate-700 border border-slate-600/50 hover:border-slate-500/70 rounded-xl cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
          >
            {/* ... profile avatar + name + chevron ... (unchanged) */}
            <div className="relative flex-shrink-0">
              <motion.div
                animate={isHovered ? { rotate: [0, -5, 5, 0] } : { rotate: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-emerald-400/60 shadow-sm ring-2 ring-slate-600/30"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center shadow-sm ring-2 ring-slate-600/30">
                    <FaUserCircle className="w-5 h-5 text-white" />
                  </div>
                )}
              </motion.div>
              <motion.div
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-800 rounded-full"
                animate={isHovered ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </div>
            <div className="flex-1 min-w-0 hidden sm:block">
              <p className="text-sm font-semibold text-white truncate">
                {user?.fullName || user?.firstName || "User"}
              </p>
              <p className="text-xs text-slate-300 truncate">
                {user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
                  "Account"}
              </p>
            </div>
            <motion.div
              animate={{ rotate: showProfileDropdown ? 180 : 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <ChevronDown className="w-4 h-4 text-slate-300" />
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {showProfileDropdown && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute right-0 top-full mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden z-[10001]"
                style={{
                  boxShadow:
                    "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                }}
              >
                {/* Profile header section (unchanged) */}
                <motion.div
                  variants={itemVariants}
                  className="px-6 py-5 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border-b border-slate-200/80"
                >
                  {/* ... profile image + name + email ... */}
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      {user?.imageUrl ? (
                        <motion.img
                          whileHover={{ scale: 1.05 }}
                          src={user.imageUrl}
                          alt="Profile"
                          className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-lg ring-4 ring-blue-100/60"
                        />
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-blue-100/60"
                        >
                          <FaUserCircle className="w-9 h-9 text-white" />
                        </motion.div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 border-3 border-white rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xl font-bold text-slate-900 truncate mb-1">
                        {user?.fullName || user?.firstName || "User"}
                      </p>
                      <p className="text-sm text-slate-600 truncate mb-2">
                        {user?.primaryEmailAddress?.emailAddress || "No email"}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <div className="py-2">
                  {/* View Profile */}
                  <motion.div
                    variants={itemVariants}
                    onClick={() => handleNavigation("profile")}
                    whileHover={{ x: 4 }}
                    className="px-6 py-4 hover:bg-blue-50/80 cursor-pointer flex items-center gap-4 text-slate-700 transition-all duration-200 group"
                  >
                    <div className="w-11 h-11 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-200 shadow-sm">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-slate-900 block">
                        View Profile
                      </span>
                      <p className="text-xs text-slate-500">
                        Manage your personal information
                      </p>
                    </div>
                  </motion.div>

                  <div className="mx-4 my-2 border-t border-slate-200/60"></div>

                  {/* Orders */}
                  <motion.div
                    variants={itemVariants}
                    onClick={() => handleNavigation("emi")}
                    whileHover={{ x: 4 }}
                    className="px-6 py-4 hover:bg-orange-50/80 cursor-pointer flex items-center gap-4 text-slate-700 transition-all duration-200 group"
                  >
                    <div className="w-11 h-11 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center group-hover:from-orange-200 group-hover:to-orange-300 transition-all duration-200 shadow-sm">
                      <FaMoneyCheckAlt className="w-5 h-5 text-orange-600" />
                    </div>

                    <div className="flex-1">
                      <span className="text-sm font-semibold text-slate-900 block">
                        EMI Plans
                      </span>
                      <p className="text-xs text-slate-500">
                        View & manage monthly installments
                      </p>
                    </div>
                  </motion.div>

                  <div className="mx-4 my-2 border-t border-slate-200/60"></div>

                  <motion.div
                    variants={itemVariants}
                    onClick={() => handleNavigation("order")}
                    whileHover={{ x: 4 }}
                    className="px-6 py-4 hover:bg-blue-50/80 cursor-pointer flex items-center gap-4 text-slate-700 transition-all duration-200 group"
                  >
                    <div className="w-11 h-11 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-200 shadow-sm">
                      <FaBox className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-slate-900 block">
                        Orders
                      </span>
                      <p className="text-xs text-slate-500">
                        Manage your Orders
                      </p>
                    </div>
                  </motion.div>

                  <div className="mx-4 my-2 border-t border-slate-200/60"></div>

                  {/* ← New EMI option */}
                  <motion.div
                    variants={itemVariants}
                    onClick={() => handleNavigation("emi")}
                    whileHover={{ x: 4 }}
                    className="px-6 py-4 hover:bg-indigo-50/80 cursor-pointer flex items-center gap-4 text-slate-700 transition-all duration-200 group"
                  >
                    <div className="w-11 h-11 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center group-hover:from-indigo-200 group-hover:to-indigo-300 transition-all duration-200 shadow-sm">
                      <MdPayment className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-slate-900 block">
                        EMI / Payments
                      </span>
                      <p className="text-xs text-slate-500">
                        View your EMI plans & payments
                      </p>
                    </div>
                  </motion.div>

                  <div className="mx-4 my-2 border-t border-slate-200/60"></div>

                  {/* Sign Out */}
                  <motion.div
                    variants={itemVariants}
                    onClick={handleLogout}
                    whileHover={{ x: 4 }}
                    className="px-6 py-4 hover:bg-red-50/80 cursor-pointer flex items-center gap-4 text-slate-700 transition-all duration-200 group"
                  >
                    <div className="w-11 h-11 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center group-hover:from-red-200 group-hover:to-red-300 transition-all duration-200 shadow-sm">
                      <LogOut className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-slate-900 block">
                        Sign Out
                      </span>
                      <p className="text-xs text-slate-500">
                        Securely logout of your account
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SignedIn>

      <SignedOut>
        {/* ... sign in button unchanged ... */}
        <NavLink to="/sign-in" state={{ from: window.location.pathname }}>
          <motion.div
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
          >
            <div className="w-8 h-8 bg-white/20 rounded-full flex-shrink-0 flex items-center justify-center">
              <FaUser className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold text-sm truncate">
              Sign In / Sign Up
            </span>
          </motion.div>
        </NavLink>
      </SignedOut>
    </motion.div>
  );
};

export default AuthButton;
