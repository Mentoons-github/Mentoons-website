// import MythosFooter from "@/components/mythos/home/footer";
import Footer from "@/components/comics/Footer";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import PrimaryHeader from "./primaryHeader";

const MythosLayout = () => {
  return (
    <main>
      <PrimaryHeader />
      <Header />
      <Outlet />
      <Footer />
    </main>
  );
};

export default MythosLayout;
