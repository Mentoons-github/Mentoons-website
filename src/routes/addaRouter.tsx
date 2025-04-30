// import AddaOverlay from "@/layout/addaOverlay";
import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
const AddaHome = lazy(() => import("@/pages/v2/adda/home.tsx"));
const AddaGroups = lazy(() => import("@/pages/v2/adda/groups"));
const AddaMessages = lazy(() => import("@/pages/v2/adda/messages"));

const AddaRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<AddaHome />} />
      <Route path="/community" element={<AddaGroups />} />
      <Route path="/messages" element={<AddaMessages />} />
    </Routes>
  );
};

export default AddaRouter;
