import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
const AddaHome = lazy(() => import("@/pages/v2/adda/home.tsx"));

const AddaRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<AddaHome />} />
    </Routes>
  );
};

export default AddaRouter;
