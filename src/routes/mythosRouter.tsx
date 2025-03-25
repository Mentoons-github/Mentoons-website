import MythosLayout from "@/layout/mythos";
import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
const MythosHome = lazy(() => import("@/pages/v2/mythos/home"));
const MythosBlog = lazy(() => import("@/pages/v2/mythos/blogs"));

const MythosRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MythosLayout />}>
        <Route index element={<MythosHome />} />
        <Route path="blog" element={<MythosBlog />} />
      </Route>
    </Routes>
  );
};

export default MythosRouter;
