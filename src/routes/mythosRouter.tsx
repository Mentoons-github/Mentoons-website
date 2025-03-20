import MythosLayout from "@/layout/mythos";
import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
const MythosHome = lazy(() => import("@/pages/v2/mythos/home"));

const MythosRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MythosLayout />}>
        <Route index element={<MythosHome />} />
      </Route>
    </Routes>
  );
};

export default MythosRouter;
