import Footer from "@/components/comics/Footer";
import { ReactNode } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "./Header";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // const navigate = useNavigate();
  const location = useLocation();
  const isAuthRoute =
    location.pathname === "/sign-up" ||
    location.pathname === "/sign-in" ||
    location.pathname === "/adda";

  return (
    <>
      <div className="relative w-full h-full">
        {/* <div className="top-[5rem] left-[0.5rem] z-50 hidden md:absolute">
          <button onClick={() => navigate(-1)} className="flex items-center">
            <FaArrowLeft className="mr-3 text-xl" />
          </button>
        </div>
        <div className="top-[5rem] right-[0.5rem] z-50 hidden md:absolute">
          <button onClick={() => navigate(1)} className="flex items-center">
            <FaArrowRight className="mr-3 text-xl" />
          </button>
        </div> */}
        {/* <div className="absolute top-24 left-10 z-[99] hidden lg:block">
          <Breadcrumbs />
        </div> */}
        <Header />

        <div className="pt-[64px] ">{children}</div>
        {!isAuthRoute && <Footer />}
      </div>
    </>
  );
};

export default MainLayout;
