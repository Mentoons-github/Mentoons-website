import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import { COMMON_NAV } from "@/constant";
import { X, ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";
import { BiChevronRight } from "react-icons/bi";

const Sidebar = ({
  isOpen,
  token,
  setIsOpen,
  handlePlans,
}: {
  isOpen: boolean;
  token: string | null;
  setIsOpen: (val: boolean) => void;
  handlePlans: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const filteredNav = COMMON_NAV.filter((item) => {
    if (item.label?.toLowerCase() === "games") return !!token;
    return true;
  });

  const closeSidebar = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  useEffect(() => {
    closeSidebar();
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setOpenDropdown(null);
    }

    const handleBreakPoint = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };

    window.addEventListener("resize", handleBreakPoint);
    handleBreakPoint();

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("resize", handleBreakPoint);
    };
  }, [isOpen, setIsOpen]);

  const toggleDropdown = (key: string) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const navKey = (label: string) => label.toLowerCase().replace(/\s/g, "");

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    closeSidebar();
    handlePlans(e);
  };

  const handleLinkClick = useCallback(
    (url: string) => {
      closeSidebar();
      setTimeout(() => {
        navigate(url);
      }, 120);
    },
    [closeSidebar, navigate],
  );

  const handleSubItemClick = useCallback(
    (labelType: string, category: string) => {
      closeSidebar();

      setTimeout(() => {
        let basePath = "";
        if (labelType === "products") basePath = "/products";
        else if (labelType === "workshops") basePath = "/mentoons-workshops";
        else basePath = "/mentoons-games";

        navigate(`${basePath}?category=${encodeURIComponent(category)}`);
      }, 120);
    },
    [navigate, closeSidebar],
  );

  const drawerVariants = {
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: { type: "spring", stiffness: 340, damping: 36 },
    },
    exit: { x: "100%", transition: { duration: 0.25, ease: "easeIn" } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05 + 0.08, duration: 0.28, ease: "easeOut" },
    }),
  };

  const subContainerVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.32, ease: "easeOut" },
        opacity: { duration: 0.25 },
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.2, ease: "easeIn" },
        opacity: { duration: 0.15 },
      },
    },
  };

  const subItemVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { delay: i * 0.035, duration: 0.25, ease: "easeOut" },
    }),
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[999998] bg-black/55 backdrop-blur-[2px] lg:hidden"
            onClick={closeSidebar}
          />

          <motion.aside
            key="drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 h-full w-[min(340px,100vw)] z-[999999] lg:hidden flex flex-col font-akshar"
            style={{
              background: "rgb(11, 11, 16)",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="flex items-center justify-end px-5 py-4 shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <button
                onClick={closeSidebar}
                aria-label="Close menu"
                className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:bg-yellow-500/10"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <X size={14} className="text-white/40 hover:text-yellow-400" />
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto overscroll-contain py-3"
              style={{ scrollbarWidth: "none" }}
            >
              {filteredNav.map(({ id, label, url, items }, index) => {
                const key = navKey(label);
                const isExpanded = openDropdown === key;
                const isBrowsePlans = label === "Browse Plans";
                const labelType = label.toLowerCase();

                if (items && items.length > 0) {
                  return (
                    <motion.div
                      key={id ?? label}
                      custom={index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <button
                        onClick={() => toggleDropdown(key)}
                        className="w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors duration-150"
                        style={{
                          color: isExpanded
                            ? "rgba(255,255,255,0.95)"
                            : "rgba(255,255,255,0.55)",
                        }}
                      >
                        <span className="text-[17px] font-medium tracking-wide">
                          {label}
                        </span>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.22, ease: "easeInOut" }}
                        >
                          <ChevronDown
                            size={16}
                            style={{
                              color: isExpanded
                                ? "rgb(234,179,8)"
                                : "rgba(255,255,255,0.25)",
                            }}
                          />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            variants={subContainerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="overflow-hidden px-5 pb-3"
                          >
                            <div
                              className="rounded-2xl overflow-hidden"
                              style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                              }}
                            >
                              <div className="px-4 py-2.5 border-b border-white/10">
                                <p className="text-[10px] font-semibold tracking-[1px] text-white/40 uppercase">
                                  {label}
                                </p>
                              </div>

                              {items.map((item, subIndex) => (
                                <motion.div
                                  key={`${item.id}-${subIndex}`}
                                  custom={subIndex}
                                  variants={subItemVariants}
                                  initial="hidden"
                                  animate="visible"
                                  whileHover={{
                                    backgroundColor: "rgba(255,255,255,0.06)",
                                  }}
                                  className="group relative border-b border-white/5 last:border-none"
                                >
                                  <button
                                    onClick={() =>
                                      handleSubItemClick(labelType, item.label)
                                    }
                                    className="w-full px-4 py-[14px] flex items-center justify-between text-left transition-all duration-200"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/70 group-hover:bg-yellow-400 transition-colors" />
                                      <div className="flex flex-col">
                                        <span className="text-[14.5px] text-white/80 group-hover:text-white transition-colors">
                                          {item.label}
                                        </span>
                                        {label === "Workshops" &&
                                          item.label === "Instant Katha" && (
                                            <span className="text-[11px] text-white/40 group-hover:text-white/60">
                                              Storytelling
                                            </span>
                                          )}
                                        {label === "Workshops" &&
                                          item.label === "Hasyaras" && (
                                            <span className="text-[11px] text-white/40 group-hover:text-white/60">
                                              Laughter
                                            </span>
                                          )}
                                        {/* Add more if needed */}
                                      </div>
                                    </div>

                                    <BiChevronRight
                                      size={18}
                                      className="text-white/30 group-hover:text-yellow-400 transition-colors"
                                    />
                                  </button>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div
                        style={{
                          height: "1px",
                          background: "rgba(255,255,255,0.04)",
                          margin: "0 20px",
                        }}
                      />
                    </motion.div>
                  );
                }

                if (isBrowsePlans) {
                  return (
                    <motion.div
                      key={id ?? label}
                      custom={index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className="px-5 py-2 mt-1"
                    >
                      <Link
                        to={url}
                        onClick={handleClick}
                        className="flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 hover:bg-yellow-500/[0.14] group"
                        style={{
                          background: "rgba(234,179,8,0.08)",
                          border: "1px solid rgba(234,179,8,0.2)",
                          color: "rgba(234,179,8,0.9)",
                        }}
                      >
                        <span className="text-[16px] font-medium tracking-wide">
                          {label}
                        </span>
                        <span className="text-[13px] group-hover:scale-110 transition-transform duration-200">
                          ✦
                        </span>
                      </Link>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    key={id ?? label}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      to={url}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(url);
                      }}
                      className="flex items-center px-5 py-3.5 transition-colors duration-150 hover:text-white/90"
                      style={{ color: "rgba(255,255,255,0.55)" }}
                    >
                      <span className="text-[17px] font-medium tracking-wide">
                        {label}
                      </span>
                    </Link>
                    <div
                      style={{
                        height: "1px",
                        background: "rgba(255,255,255,0.04)",
                        margin: "0 20px",
                      }}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default Sidebar;
