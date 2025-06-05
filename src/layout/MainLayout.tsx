import Footer from "@/components/comics/Footer";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import PrimaryHeader from "./primaryHeader";
import Breadcrumbs from "@/components/common/breadCrumbs/breadCrumbs";
import { Outlet } from "react-router-dom";
import { NotificationProvider } from "@/context/adda/provider/notificationProvider";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();

  const isAuthRoute =
    location.pathname === "/sign-up" ||
    location.pathname === "/sign-in" ||
    location.pathname === "/adda";

  return (
    <NotificationProvider>
      <div className="relative w-full h-full">
        <div className="absolute top-[50px] left-10 z-[99] hidden lg:block">
          <Breadcrumbs />
        </div>
        <PrimaryHeader />
        <Header />

        <div className="">
          <Outlet />
          {children}
        </div>
        {!isAuthRoute && <Footer />}
      </div>
    </NotificationProvider>
  );
};

export default MainLayout;
