import { useState, useEffect, ReactNode } from "react"; 
import AdminHeader from "@/components/admin/header";
import AdminSidebar from "@/components/admin/sidebar";
import { MessageCircle, X } from "lucide-react";

interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsSidebarCollapsed(mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const timer = setTimeout(() => setIsLoading(false), 1000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  const handleSidebarToggle = (collapsed: boolean): void => {
    setIsSidebarCollapsed(collapsed);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-blue-400 rounded-full animate-pulse mx-auto"></div>
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
      {/* Sidebar */}
      <div
        className={`${
          isMobile ? "fixed inset-y-0 left-0 z-50" : "relative"
        } transition-all duration-300 ease-in-out ${
          isSidebarCollapsed && isMobile ? "-translate-x-full" : "translate-x-0"
        } ${isSidebarCollapsed && !isMobile ? "w-16" : "w-64"}`}
      >
        <AdminSidebar
          onToggle={handleSidebarToggle}
          collapsed={isSidebarCollapsed}
          isMobile={isMobile}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobile && !isSidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarCollapsed(true)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-grow min-w-0 bg-gray-50">
        {/* Header */}
        <AdminHeader
          onSidebarToggle={handleSidebarToggle}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Main Content */}
        <main className="flex-grow overflow-y-auto relative">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto w-full">
            {/* Page Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[calc(100vh-200px)]">
              {children} 
            </div>
          </div>

          {/* Floating Action Button - Chatbot */}
          <div className="fixed bottom-6 right-6 z-30">
            <button
              onClick={() => setIsChatbotOpen(!isChatbotOpen)}
              className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
              title="Open Chat Support"
            >
              {isChatbotOpen ? (
                <X
                  size={24}
                  className="group-hover:scale-110 transition-transform"
                />
              ) : (
                <MessageCircle
                  size={24}
                  className="group-hover:scale-110 transition-transform"
                />
              )}
            </button>
          </div>

          {/* Chatbot Widget */}
          {isChatbotOpen && (
            <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-30 flex flex-col animate-in slide-in-from-bottom-4 fade-in duration-300">
              {/* Chat Header */}
              <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-sm">Admin Support</h3>
                  <p className="text-xs opacity-90">How can we help you?</p>
                </div>
                <button
                  onClick={() => setIsChatbotOpen(false)}
                  className="text-white hover:bg-blue-700 rounded-full p-1 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Chat Content */}
              <div className="flex-grow p-4 overflow-y-auto">
                <div className="space-y-3">
                  <div className="bg-gray-100 rounded-lg p-3 text-sm">
                    <p className="text-gray-800">
                      Welcome! I'm here to help you navigate the admin panel.
                      What would you like to know about?
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button className="bg-blue-50 text-blue-700 text-xs px-3 py-2 rounded-full hover:bg-blue-100 transition-colors">
                      User Management
                    </button>
                    <button className="bg-blue-50 text-blue-700 text-xs px-3 py-2 rounded-full hover:bg-blue-100 transition-colors">
                      Reports
                    </button>
                    <button className="bg-blue-50 text-blue-700 text-xs px-3 py-2 rounded-full hover:bg-blue-100 transition-colors">
                      Settings
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-grow text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Toast Notifications Container */}
      <div className="fixed top-20 right-6 z-50 space-y-2">
        {/* Toast notifications would be rendered here */}
      </div>
    </div>
  );
};

export default AdminLayout;
