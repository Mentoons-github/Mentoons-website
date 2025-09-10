import { useState, useEffect, useRef } from "react";
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
}

const AdminSidebar = ({ onToggle, collapsed, isMobile }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const shouldCollapse = window.innerWidth <= 768;
      if (onToggle) {
        onToggle(shouldCollapse);
      }
    };

    if (isMobile !== undefined) {
      setExpandedSection(null);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [onToggle, isMobile]);

  useEffect(() => {
    const sections = [
      { title: "Users", paths: ["/admin/users", "/admin/allotted-calls"] },
      {
        title: "Products",
        paths: ["/admin/product-table", "/admin/add-products"],
      },
      { title: "Workshops", paths: ["/admin/workshop-enquiries"] },
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
          "/admin/task-assign",
          "/admin/task-submissions",
        ],
      },
      {
        title: "Session Call",
        paths: ["/admin/session-enquiry"],
      },
    ];

    const activeSection = sections.find((section) =>
      section.paths.some((path) => location.pathname === path)
    );

    if (activeSection && !collapsed) {
      setExpandedSection(activeSection.title);
    } else if (collapsed) {
      setExpandedSection(null);
    }
  }, [location.pathname, collapsed]);

  const toggleSection = (title: string) => {
    if (title === expandedSection) {
      setExpandedSection(null);
    } else {
      setExpandedSection(title);
    }
  };

  return (
    <motion.aside
      initial={{ width: collapsed ? 64 : 256 }}
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`bg-white shadow-lg rounded-r-2xl h-screen relative flex flex-col border-r border-gray-200
      ${collapsed ? "w-16" : "w-64"} 
      [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100
      ${isMobile ? "z-50" : "z-10"}`}
    >
      {/* Logo */}
      <motion.div
        className={`flex justify-center ${collapsed ? "py-3" : "py-4"}`}
        whileHover={{ scale: 1.02 }}
      >
        <motion.img
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          src="/assets/common/logo/ec9141ccd046aff5a1ffb4fe60f79316.png"
          alt="Logo"
          className={`cursor-pointer transition-all duration-300 object-contain ${
            collapsed ? "h-10 w-10" : "h-12 w-auto"
          }`}
          onClick={() => navigate("/admin/dashboard")}
          data-tooltip-id="logo-tooltip"
          data-tooltip-content="Go to Dashboard"
        />
        <Tooltip id="logo-tooltip" place="right" />
      </motion.div>

      {/* Navigation */}
      <nav className="flex-grow overflow-y-auto px-2">
        {/* Dashboard Single Link */}
        <motion.div
          whileHover={{ backgroundColor: "#f3f4f6" }}
          whileTap={{ scale: 0.98 }}
          className={`py-3 px-2 rounded-lg transition-all duration-200 ${
            location.pathname === "/admin/dashboard"
              ? "bg-blue-50 text-blue-600"
              : "text-gray-600"
          }`}
        >
          <NavLink
            to="/admin/dashboard"
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

        {/* Other Sections (Dropdowns) */}
        <SidebarSection
          icon={<FaUsers size={collapsed ? 20 : 16} />}
          title="Users"
          items={[
            { href: "/admin/users", label: "All Users" },
            { href: "/admin/allotted-calls", label: "Allotted Calls" },
          ]}
          isCollapsed={collapsed}
          isExpanded={expandedSection === "Users"}
          toggleSection={() => toggleSection("Users")}
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
        />
        <SidebarSection
          icon={<FaChalkboardTeacher size={collapsed ? 20 : 16} />}
          title="Workshops"
          items={[{ href: "/admin/workshop-enquiries", label: "Enquiries" }]}
          isCollapsed={collapsed}
          isExpanded={expandedSection === "Workshops"}
          toggleSection={() => toggleSection("Workshops")}
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
        />
        <SidebarSection
          icon={<FaQuestionCircle size={collapsed ? 20 : 16} />}
          title="General Queries"
          items={[{ href: "/admin/general-queries", label: "All Queries" }]}
          isCollapsed={collapsed}
          isExpanded={expandedSection === "General Queries"}
          toggleSection={() => toggleSection("General Queries")}
        />
        <SidebarSection
          icon={<FaNewspaper size={collapsed ? 20 : 16} />}
          title="Newsletter"
          items={[{ href: "/admin/newsletter", label: "All Newsletter" }]}
          isCollapsed={collapsed}
          isExpanded={expandedSection === "Newsletter"}
          toggleSection={() => toggleSection("Newsletter")}
        />
        <SidebarSection
          icon={<FaUsers size={collapsed ? 20 : 16} />}
          title="Employees"
          items={[
            { href: "/admin/employee-table", label: "Employees Details" },
            { href: "/admin/employee/add", label: "Add Employees" },
            { href: "/admin/task-assign", label: "Assign Task" },
            { href: "/admin/task-submissions", label: "Task Submissions" },
          ]}
          isCollapsed={collapsed}
          isExpanded={expandedSection === "Employees"}
          toggleSection={() => toggleSection("Employees")}
        />
        <SidebarSection
          icon={<FaPhone size={collapsed ? 20 : 16} />}
          title="Session Call"
          items={[{ href: "/admin/session-enquiry", label: "Call Enquiry" }]}
          isCollapsed={collapsed}
          isExpanded={expandedSection === "Session Call"}
          toggleSection={() => toggleSection("Session Call")}
        />
      </nav>

      <Tooltip id="section-tooltip" place="right" />
    </motion.aside>
  );
};

interface SidebarSectionProps {
  icon: React.ReactNode;
  title: string;
  items: { href: string; label: string }[];
  isCollapsed: boolean;
  isExpanded: boolean;
  toggleSection: () => void;
}

const SidebarSection = ({
  icon,
  title,
  items,
  isCollapsed,
  isExpanded,
  toggleSection,
}: SidebarSectionProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const isActiveSection = items.some((item) => location.pathname === item.href);

  const sectionContent = (
    <motion.div
      whileHover={{ backgroundColor: isExpanded ? "" : "#f3f4f6" }}
      whileTap={{ scale: 0.98 }}
      className={`
        py-3 px-2 
        ${
          isCollapsed
            ? "flex justify-center"
            : "flex items-center justify-between"
        }
        ${isExpanded ? "bg-blue-100" : isActiveSection ? "bg-blue-50" : ""}
        cursor-pointer rounded-lg transition-all duration-200
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
              isExpanded || isActiveSection ? "text-blue-600" : "text-gray-800"
            }`}
          >
            {title}
          </h2>
        )}
      </div>
      {!isCollapsed && (
        <motion.div
          animate={{
            rotate: isExpanded ? 90 : 0,
          }}
          transition={{ duration: 0.2 }}
          className={
            isExpanded || isActiveSection ? "text-blue-500" : "text-gray-500"
          }
        >
          <FaChevronRight />
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <div
      ref={menuRef}
      className={`mb-1 overflow-hidden ${
        isCollapsed ? "mx-auto text-center" : ""
      }`}
    >
      {sectionContent}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`
              overflow-hidden
              ${
                isCollapsed
                  ? "absolute left-16 top-auto bg-white shadow-lg rounded-lg p-2 min-w-48 z-50"
                  : ""
              }
            `}
          >
            <ul className={`space-y-1 ${isCollapsed ? "py-2" : "pl-8 py-2"}`}>
              {items.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="py-1"
                >
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md transition-colors duration-200 text-sm ${
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
