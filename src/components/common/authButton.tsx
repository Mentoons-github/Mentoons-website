import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  LogOut,
  ChevronDown,
  SquareUserRound,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { FaBox } from "react-icons/fa6";
import { MdPayment } from "react-icons/md";

const AuthButton = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleDropdownMouseEnter = () => {
    setShowProfileDropdown(true);
  };

  const handleDropdownMouseLeave = () => {
    setShowProfileDropdown(false);
  };

  const handleAccountClick = () => {
    setShowAccountDropdown(!showAccountDropdown);
  };

  const handleAccountDropdownMouseEnter = () => {
    setShowAccountDropdown(true);
  };

  const handleAccountDropdownMouseLeave = () => {
    setShowAccountDropdown(false);
  };

  const handleAccountNavigation = (page: "sign-in" | "sign-up") => {
    setShowAccountDropdown(false);
    navigate(`/${page}`, { state: { from: window.location.pathname } });
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
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target as Node)
      ) {
        setShowAccountDropdown(false);
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

  const role = user?.publicMetadata?.role as string;

  const handleRoleAccess = () => {
    if (role === "ADMIN") {
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    if (role === "EMPLOYEE") {
      navigate("/employee/dashboard", { replace: true });
      return;
    }
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
                <motion.div
                  variants={itemVariants}
                  className="px-6 py-5 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border-b border-slate-200/80"
                >
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

                  {(role === "EMPLOYEE" || role === "ADMIN") && (
                    <motion.div
                      variants={itemVariants}
                      onClick={handleRoleAccess}
                      whileHover={{ x: 4 }}
                      className="px-6 py-4 hover:bg-blue-50/80 cursor-pointer flex items-center gap-4 text-slate-700 transition-all duration-200 group"
                    >
                      <div className="w-11 h-11 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-200 shadow-sm">
                        <SquareUserRound className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-semibold text-slate-900 block">
                          {role.charAt(0).toUpperCase() +
                            role.slice(1).toLowerCase()}{" "}
                          Panel
                        </span>
                        <p className="text-xs text-slate-500">
                          Go to your {role.toLocaleLowerCase()} panel
                        </p>
                      </div>
                    </motion.div>
                  )}

                  <div className="mx-4 my-2 border-t border-slate-200/60"></div>

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
        <div
          className="relative"
          ref={accountDropdownRef}
          onMouseEnter={handleAccountDropdownMouseEnter}
          onMouseLeave={handleAccountDropdownMouseLeave}
        >
          <motion.button
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            onClick={handleAccountClick}
            className="flex items-center gap-1.5 px-4 h-[38px] rounded-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-sm font-medium text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            Account
            <motion.span
              animate={{ rotate: showAccountDropdown ? 180 : 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="flex items-center"
            >
              <ChevronDown className="w-4 h-4 text-white/80" />
            </motion.span>
          </motion.button>

          <AnimatePresence>
            {showAccountDropdown && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-[10001] p-1.5"
              >
                <motion.div
                  variants={itemVariants}
                  onClick={() => handleAccountNavigation("sign-in")}
                  whileHover={{ x: 2 }}
                  className="px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer flex items-center gap-2 text-slate-700 text-sm"
                >
                  <LogIn className="w-4 h-4 text-slate-500" />
                  Sign in
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  onClick={() => handleAccountNavigation("sign-up")}
                  whileHover={{ x: 2 }}
                  className="px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer flex items-center gap-2 text-slate-700 text-sm"
                >
                  <UserPlus className="w-4 h-4 text-slate-500" />
                  Sign up
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SignedOut>
    </motion.div>
  );
};

export default AuthButton;
