import Footer from "@/components/comics/Footer";
import { NotificationProvider } from "@/context/adda/provider/notificationProvider";
import { ReactNode } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import PrimaryHeader from "./primaryHeader";
import ScrollToTopButton from "@/components/common/topUpArrow/upArrow";
import NotificationPopup from "@/components/modals/notification";
import GlobalProgressBar from "@/components/common/globalProgressBar";
import WhatsappGroup from "@/components/adda/whatsapp/whatsappGroup";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/sign-up" ||
    location.pathname === "/sign-in" ||
    location.pathname.startsWith("/chat") ||
    location.pathname === "/puzzle/play" ||
    location.pathname.startsWith("/employee") ||
    location.pathname === "/add-password" ||
    (location.pathname !== "/adda/game-lobby" &&
      location.pathname.startsWith("/adda/game-lobby"));

  const isAddaGamePage = location.pathname === "/adda";

  // const isChatPage = location.pathname.startsWith("/chat");
  const showFooter = !hideLayout;

  return (
    <NotificationProvider>
      <div className="relative min-h-screen">
        <GlobalProgressBar />
        <div className="absolute top-0 left-0 right-0 z-[99999]">
          <NotificationPopup />
        </div>
        {!hideLayout && (
          <>
            <PrimaryHeader />
            <Header />
          </>
        )}
        <div className={!isAddaGamePage ? "" : "pt-[20px] md:pt-[30px]"}>
          <Outlet />
          {children}
        </div>
        {showFooter && <Footer />}
        <div className="fixed bottom-20 right-8 flex flex-col items-center justify-center gap-4">
          <WhatsappGroup />
          {showFooter && <ScrollToTopButton />}
        </div>
      </div>
    </NotificationProvider>
  );
};

export default MainLayout;
