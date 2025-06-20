import Footer from "@/components/comics/Footer";
import Breadcrumbs from "@/components/common/breadCrumbs/breadCrumbs";
import { NotificationProvider } from "@/context/adda/provider/notificationProvider";
import { ReactNode } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import PrimaryHeader from "./primaryHeader";
import ScrollToTopButton from "@/components/common/topUpArrow/upArrow";
import NotificationPopup from "@/components/modals/notification";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();

  const isAuthRoute =
    location.pathname === "/sign-up" ||
    location.pathname === "/sign-in" ||
    location.pathname === "/adda" ||
    location.pathname === "/chat";

  return (
    <NotificationProvider>
      <div className="relative w-full h-full">
        <div className="absolute top-0 left-0 right-0 z-[99999]">
          <NotificationPopup />
        </div>
        <div className="absolute top-[115px] left-10 hidden lg:block">
          <Breadcrumbs />
        </div>
        <PrimaryHeader />
        <Header />
        <div className="">
          <Outlet />
          {children}
        </div>
        {!isAuthRoute && <Footer />}
        {!isAuthRoute && <ScrollToTopButton />}
      </div>
    </NotificationProvider>
  );
};

export default MainLayout;
