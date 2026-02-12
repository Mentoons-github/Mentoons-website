import { useState, useEffect } from "react";
import {
  FaBox,
  FaBriefcase,
  FaUsers,
  FaChevronRight,
  FaChalkboardTeacher,
  FaQuestionCircle,
  FaNewspaper,
  FaTachometerAlt,
} from "react-icons/fa";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { FaPhone } from "react-icons/fa6";

interface SidebarProps {
  onToggle?: (collapsed: boolean) => void;
  collapsed: boolean;
  isMobile: boolean;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const AdminSidebar = ({
  onToggle,
  collapsed,
  isMobile,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  /* ---------- Auto-collapse on mobile resize ---------- */
  useEffect(() => {
    const handleResize = () => {
      if (isMobile && onToggle) onToggle(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile, onToggle]);

  /* ---------- Keep active section expanded (desktop) ---------- */
  useEffect(() => {
    const sections = [
      { title: "Users", paths: ["/admin/users", "/admin/allotted-calls"] },
      {
        title: "Products",
        paths: ["/admin/product-table", "/admin/add-products"],
      },
      {
        title: "Workshops",
        paths: [
          "/admin/workshops",
          "/admin/add-workshop",
          "/admin/workshop-enquiries",
          "/admin/workshop-sessions",
        ],
      },
      {
        title: "Career Corner",
        paths: [
          "/admin/all-jobs",
          "/admin/hiring-form",
          "/admin/view-applications",
        ],
      },
      { title: "General Queries", paths: ["/admin/general-queries"] },
      { title: "Newsletter", paths: ["/admin/newsletter"] },
      {
        title: "Employees",
        paths: [
          "/admin/employee-table",
          "/admin/employee/add",
          "/admin/task-submissions",
          "/admin/employee-attendance",
          "/admin/leave-management",
        ],
      },
      { title: "Session Call", paths: ["/admin/session-enquiry"] },
      { title: "Meetup", paths: ["/admin/meetups", "/admin/add-meetup"] },
      {
        title: "Professional Records",
        paths: ["/admin/psychologists", "/admin/freelancers"],
      },
      {
        title: "Quiz",
        paths: ["/admin/add-quiz", "/admin/quiz"],
      },
    ];

    const active = sections.find((s) =>
      s.paths.some((p) => location.pathname.startsWith(p))
    );

    if (!collapsed && active) setExpandedSection(active.title);
    else if (collapsed) setExpandedSection(null);
  }, [location.pathname, collapsed]);

  const toggleSection = (title: string) => {
    setExpandedSection((prev) => (prev === title ? null : title));
  };

  const handleLinkClick = () => {
    if (isMobile && onMobileClose) onMobileClose();
  };

  return (
    <motion.aside
      initial={false}
      animate={{
        width: collapsed ? 64 : 256,
        x: isMobile && !mobileOpen ? -256 : 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`
        bg-white shadow-lg rounded-r-2xl h-full flex flex-col border-r border-gray-200
        ${isMobile ? "fixed inset-y-0 left-0 z-50" : "relative"}
      `}
    >
      {/* ---------- Logo ---------- */}
      <motion.div
        className={`flex justify-center ${collapsed ? "py-3" : "py-4"}`}
        whileHover={{ scale: 1.02 }}
      >
        <motion.img
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          src="/assets/common/logo/ec9141ccd046aff5a1ffb4fe60f79316.png"
          alt="Logo"
          className={`cursor-pointer object-contain transition-all ${
            collapsed ? "h-10 w-10" : "h-12 w-auto"
          }`}
          onClick={() => {
            navigate("/admin/dashboard");
            handleLinkClick();
          }}
          data-tooltip-id="logo-tooltip"
          data-tooltip-content="Dashboard"
        />
        <Tooltip id="logo-tooltip" place="right" />
      </motion.div>

      {/* ---------- Navigation ---------- */}
      <nav className="flex-1 overflow-y-auto px-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100">
        {/* Dashboard */}
        <motion.div
          whileHover={{ backgroundColor: "#f3f4f6" }}
          whileTap={{ scale: 0.98 }}
          className={`py-3 px-2 rounded-lg ${
            location.pathname === "/admin/dashboard"
              ? "bg-blue-50 text-blue-600"
              : "text-gray-600"
          }`}
        >
          <NavLink
            to="/admin/dashboard"
            onClick={handleLinkClick}
            className="flex items-center"
            data-tooltip-id="section-tooltip"
            data-tooltip-content={collapsed ? "Dashboard" : ""}
          >
            <motion.span
              className={`mr-2 ${
                location.pathname === "/admin/dashboard"
                  ? "text-blue-500"
                  : "text-gray-600"
              }`}
            >
              <FaTachometerAlt size={collapsed ? 20 : 16} />
            </motion.span>
            {!collapsed && (
              <h2
                className={`text-base font-medium ${
                  location.pathname === "/admin/dashboard"
                    ? "text-blue-600"
                    : "text-gray-800"
                }`}
              >
                Dashboard
              </h2>
            )}
          </NavLink>
        </motion.div>

        {/* ---------- ALL SECTIONS (unchanged) ---------- */}
        <SidebarSection
          icon={<FaUsers size={collapsed ? 20 : 16} />}
          title="Users"
          items={[{ href: "/admin/users", label: "All Users" }]}
          isCollapsed={collapsed}
          isExpanded={expandedSection === "Users"}
          toggleSection={() => toggleSection("Users")}
          onItemClick={handleLinkClick}
        />

        <SidebarSection
          icon={<FaBox size={collapsed ? 20 : 16} />}
          title="Products"
          items={[
            { href: "/admin/product-table", label: "All Products" },
            { href: "/admin/add-products", label: "Add Product" },
          ]}
          isCollapsed={collapsed}
          isExpanded={expandedSection === "Products"}
          toggleSection={() => toggleSection("Products")}
          onItemClick={handleLinkClick}
        />

        <SidebarSection
          icon={<FaChalkboardTeacher size={collapsed ? 20 : 16} />}
          title="Workshops"
          items={[
            { href: "/admin/workshops", label: "Workshops" },
            { href: "/admin/add-workshop", label: "Add Workshop" },
            { href: "/admin/workshop-enquiries", label: "Enquiries" },
            { href: "/admin/workshop-sessions", label: "Workshop Sessions" },
          ]}
          isCollapsed={collapsed}
          isExpanded={expandedSection === "Workshops"}
          toggleSection={() => toggleSection("Workshops")}
          onItemClick={handleLinkClick}
        />

        <SidebarSection
          icon={<FaBriefcase size={collapsed ? 20 : 16} />}
          title="Career Corner"
          items={[
            { href: "/admin/all-jobs", label: "All Jobs" },
            { href: "/admin/hiring-form", label: "Add Job" },
            { href: "/admin/view-applications", label: "View Applications" },
          ]}
          isCollapsed={collapsed}
          isExpanded={expandedSection === "Career Corner"}
          toggleSection={() => toggleSection("Career Corner")}
          onItemClick={handleLinkClick}
        />

        <SidebarSection
          icon={<FaQuestionCircle size={collapsed ? 20 : 16} />}
          title="General Queries"
          items={[{ href: "/admin/general-queries", label: "All Queries" }]}
          isCollapsed={collapsed}
          isExpanded={expandedSection === "General Queries"}
          toggleSection={() => toggleSection("General Queries")}
          onItemClick={handleLinkClick}
        />

        <SidebarSection
          icon={<FaNewspaper size={collapsed ? 20 : 16} />}
          title="Newsletter"
          items={[{ href: "/admin/newsletter", label: "All Newsletter" }]}
          isCollapsed={collapsed}
          isExpanded={expandedSection === "Newsletter"}
          toggleSection={() => toggleSection("Newsletter")}
          onItemClick={handleLinkClick}
        />

        <SidebarSection
          icon={<FaUsers size={collapsed ? 20 : 16} />}
          title="Employees"
          items={[
            { href: "/admin/employee-table", label: "Employees Details" },
            { href: "/admin/employee/add", label: "Add Employees" },
            { href: "/admin/task-submissions", label: "Task Submissions" },
            {
              href: "/admin/employee-attendance",
              label: "Employee Attendance",
            },
            { href: "/admin/leave-management", label: "Leave Management" },
          ]}
          isCollapsed={collapsed}
          isExpanded={expandedSection === "Employees"}
          toggleSection={() => toggleSection("Employees")}
          onItemClick={handleLinkClick}
        />

        <SidebarSection
          icon={<FaPhone size={collapsed ? 20 : 16} />}
          title="Meetup"
          items={[
            { href: "/admin/meetups", label: "Meetups" },
            { href: "/admin/add-meetup", label: "Add Meetup" },
          ]}
          isCollapsed={collapsed}
          isExpanded={expandedSection === "Meetup"}
          toggleSection={() => toggleSection("Meetup")}
          onItemClick={handleLinkClick}
        />

        <SidebarSection
          icon={<FaPhone size={collapsed ? 20 : 16} />}
          title="Session Call"
          items={[{ href: "/admin/session-enquiry", label: "Call Enquiry" }]}
          isCollapsed={collapsed}
          isExpanded={expandedSection === "Session Call"}
          toggleSection={() => toggleSection("Session Call")}
          onItemClick={handleLinkClick}
        />

        <SidebarSection
          icon={<FaBriefcase size={collapsed ? 20 : 16} />}
          title="Professional Records"
          items={[
            { href: "/admin/psychologists", label: "Psychologists" },
            { href: "/admin/freelancers", label: "Freelancers" },
          ]}
          isCollapsed={collapsed}
          isExpanded={expandedSection === "Professional Records"}
          toggleSection={() => toggleSection("Professional Records")}
          onItemClick={handleLinkClick}
        />
        <SidebarSection
          icon={<FaBriefcase size={collapsed ? 20 : 16} />}
          title="Quiz"
          items={[
            { href: "/admin/quiz", label: "Quiz" },
            { href: "/admin/add-quiz", label: "Add Quiz" },
          ]}
          isCollapsed={collapsed}
          isExpanded={expandedSection === "Quiz"}
          toggleSection={() => toggleSection("Quiz")}
          onItemClick={handleLinkClick}
        />
      </nav>

      <Tooltip id="section-tooltip" place="right" />
    </motion.aside>
  );
};

/* ---------- SidebarSection (unchanged except onItemClick) ---------- */
interface SidebarSectionProps {
  icon: React.ReactNode;
  title: string;
  items: { href: string; label: string }[];
  isCollapsed: boolean;
  isExpanded: boolean;
  toggleSection: () => void;
  onItemClick?: () => void;
}

const SidebarSection = ({
  icon,
  title,
  items,
  isCollapsed,
  isExpanded,
  toggleSection,
  onItemClick,
}: SidebarSectionProps) => {
  const location = useLocation();
  const isActiveSection = items.some((i) => location.pathname === i.href);

  return (
    <div
      className={`mb-1 overflow-hidden ${
        isCollapsed ? "mx-auto text-center" : ""
      }`}
    >
      {/* Header */}
      <motion.div
        whileHover={{ backgroundColor: isExpanded ? "" : "#f3f4f6" }}
        whileTap={{ scale: 0.98 }}
        className={`
          py-3 px-2 rounded-lg cursor-pointer
          ${
            isCollapsed
              ? "flex justify-center"
              : "flex items-center justify-between"
          }
          ${isExpanded ? "bg-blue-100" : isActiveSection ? "bg-blue-50" : ""}
        `}
        onClick={(e) => {
          e.stopPropagation();
          toggleSection();
        }}
        data-tooltip-id="section-tooltip"
        data-tooltip-content={isCollapsed ? title : ""}
      >
        <div className={`flex items-center ${isCollapsed ? "" : "space-x-3"}`}>
          <motion.span
            animate={{ rotate: isExpanded ? 5 : 0 }}
            className={`${isCollapsed ? "" : "mr-2"} ${
              isExpanded || isActiveSection ? "text-blue-500" : "text-gray-600"
            }`}
          >
            {icon}
          </motion.span>
          {!isCollapsed && (
            <h2
              className={`text-base font-medium ${
                isExpanded || isActiveSection
                  ? "text-blue-600"
                  : "text-gray-800"
              }`}
            >
              {title}
            </h2>
          )}
        </div>
        {!isCollapsed && (
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            className={
              isExpanded || isActiveSection ? "text-blue-500" : "text-gray-500"
            }
          >
            <FaChevronRight />
          </motion.div>
        )}
      </motion.div>

      {/* Dropdown */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={
              isCollapsed
                ? "absolute left-16 bg-white shadow-lg rounded-lg p-2 min-w-48 z-50"
                : ""
            }
          >
            <ul className={`space-y-1 ${isCollapsed ? "py-2" : "pl-8 py-2"}`}>
              {items.map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <NavLink
                    to={item.href}
                    onClick={onItemClick}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm transition-colors ${
                        isActive
                          ? "text-blue-600 font-medium bg-blue-50"
                          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      }`
                    }
                  >
                    <motion.span whileHover={{ x: 3 }}>
                      {item.label}
                    </motion.span>
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminSidebar;
