import MythosFooter from "@/components/mythos/home/footer";
import { lazy } from "react";
import { Outlet } from "react-router-dom";
const Header = lazy(() => import("@/components/mythos/home/nav"));

const MythosLayout = () => {
  return (
    <main>
      <Header />
      <Outlet />
      <MythosFooter />
    </main>
  );
};

export default MythosLayout;
