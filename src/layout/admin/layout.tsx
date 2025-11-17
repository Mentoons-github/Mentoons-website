import { useState, useEffect, ReactNode } from "react";
import AdminHeader from "@/components/admin/header";
import AdminSidebar from "@/components/admin/sidebar";

interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  // ---------- Sidebar state ----------
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // desktop only
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false); // mobile only
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ---------- Detect screen size ----------
  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Force collapsed on mobile
      setSidebarCollapsed(mobile);
      setMobileDrawerOpen(false);
    };

    onResize();
    window.addEventListener("resize", onResize);
    const timer = setTimeout(() => setIsLoading(false), 1000);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(timer);
    };
  }, []);

  // ---------- Toggle helpers ----------
  const toggleDesktop = (collapsed: boolean) => {
    if (!isMobile) setSidebarCollapsed(collapsed);
  };
  const toggleMobile = () => setMobileDrawerOpen((v) => !v);
  const closeMobile = () => setMobileDrawerOpen(false);

  // ---------- Loading screen ----------
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-blue-400 rounded-full animate-pulse mx-auto" />
          </div>
          <p className="mt-4 text-lg font-medium text-gray-600">
            Loading Admin Panel...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* ---------- Sidebar (drawer on mobile) ---------- */}
      <div
        className={`
          ${isMobile ? "fixed inset-y-0 left-0 z-50 w-64" : "relative"}
          transition-transform duration-300 ease-in-out
          ${
            isMobile && !mobileDrawerOpen
              ? "-translate-x-full"
              : "translate-x-0"
          }
          ${!isMobile && sidebarCollapsed ? "w-16" : "w-64"}
        `}
      >
        <AdminSidebar
          onToggle={toggleDesktop}
          collapsed={!isMobile && sidebarCollapsed}
          isMobile={isMobile}
          mobileOpen={mobileDrawerOpen}
          onMobileClose={closeMobile}
        />
      </div>

      {/* ---------- Mobile overlay ---------- */}
      {isMobile && mobileDrawerOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={closeMobile} />
      )}

      {/* ---------- Main area ---------- */}
      <div className="flex flex-col flex-1 min-w-0 bg-gray-50">
        <AdminHeader
          onSidebarToggle={isMobile ? toggleMobile : toggleDesktop}
          isSidebarCollapsed={!isMobile && sidebarCollapsed}
          isMobile={isMobile}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto w-full">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[calc(100vh-200px)]">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* ---------- Toast container ---------- */}
      <div className="fixed top-20 right-6 z-50 space-y-2" />
    </div>
  );
};

export default AdminLayout;
