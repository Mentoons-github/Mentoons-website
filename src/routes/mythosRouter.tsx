import MythosLayout from "@/layout/mythos";
import NotFound from "@/pages/NotFound";
import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
const MythosHome = lazy(() => import("@/pages/v2/mythos/home"));
const MythosBlog = lazy(() => import("@/pages/v2/mythos/blogs"));
const MythosAbout = lazy(() => import("@/pages/v2/mythos/about"));

const MythosRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MythosLayout />}>
        <Route index element={<MythosHome />} />
        <Route path="blog" element={<MythosBlog />} />
        <Route path="about" element={<MythosAbout />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default MythosRouter;
