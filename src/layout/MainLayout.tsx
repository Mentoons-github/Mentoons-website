import Footer from "@/components/comics/Footer";
import Breadcrumbs from "@/components/common/BreadCrumbs";
import { ReactNode } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthRoute =
    location.pathname === "/sign-up" || location.pathname === "/sign-in";

  return (
    <>
      <div className="relative h-full w-full">
        <div className="absolute top-[5rem] left-[0.5rem] z-50 lg:hidden">
          <button onClick={() => navigate(-1)} className="flex items-center">
            <FaArrowLeft className="text-xl mr-3" />
          </button>
        </div>
        <div className="absolute top-24 left-10 z-[99] hidden lg:block">
          <Breadcrumbs />
        </div>
        <Header />

        <div className="pt-[64px] ">{children}</div>
        {!isAuthRoute && <Footer />}
      </div>
    </>
  );
};

export default MainLayout;
