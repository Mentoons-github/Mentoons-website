import AddaOverlay from "@/layout/addaOverlay";
import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
const AddaHome = lazy(() => import("@/pages/v2/adda/home.tsx"));
const AddaGroups = lazy(() => import("@/pages/v2/adda/groups"));

const AddaRouter = () => {
  return (
    <Routes>
      <Route element={<AddaOverlay />}>
        <Route path="/" element={<AddaHome />} />
        <Route path="/community" element={<AddaGroups />} />
      </Route>
    </Routes>
  );
};

export default AddaRouter;
