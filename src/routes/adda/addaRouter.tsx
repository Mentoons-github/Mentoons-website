import Loader from "@/components/common/Loader";
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
const AddaHome = lazy(() => import("@/pages/v2/adda/home.tsx"));

const AddaRouter = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<AddaHome />} />
      </Routes>
    </Suspense>
  );
};

export default AddaRouter;
