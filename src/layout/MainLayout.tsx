import Footer from "@/components/comics/Footer";
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

  const hideLayout =
    location.pathname === "/sign-up" ||
    location.pathname === "/sign-in" ||
    location.pathname === "/chat" ||
    location.pathname === "/puzzle/play" ||
    location.pathname.startsWith("/employee") ||
    location.pathname === "/add-password" ||
    location.pathname.startsWith("/adda/game")

    console.log(hideLayout)

  const isChatPage = location.pathname.startsWith("/chat");

  const showFooter = !hideLayout && !isChatPage;

  return (
    <NotificationProvider>
      <div className="relative w-full h-full">
        <div className="absolute top-0 left-0 right-0 z-[99999]">
          <NotificationPopup />
        </div>

        {!hideLayout && (
          <>
            <PrimaryHeader />
            <Header />
          </>
        )}

        <div className="">
          <Outlet />
          {children}
        </div>

        {showFooter && <Footer />}
        {showFooter && <ScrollToTopButton />}
      </div>
    </NotificationProvider>
  );
};

export default MainLayout;
