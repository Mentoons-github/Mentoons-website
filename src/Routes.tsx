import { lazy, Suspense, useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import ComicCard from "./components/comics/HoverCardComic";
import ScrollToTop from "./components/comics/ScrollToTop";
import Loader from "./components/common/Loader";
import MainLayout from "./layout/MainLayout";
import Popup from "./layout/Popup";

import OrderSummary from "@/components/OrderSummary";
import AboutMentoons from "./pages/AboutMentoons";
import AssesmentPage from "./pages/AssesmentPage";
import AssesmentQuestions from "./pages/AssesmentQuestions";
import LogIn from "./pages/Auth/LogIn";
import Register from "./pages/Auth/Register";
import CareerPage from "./pages/CareerPage";
import Home from "./pages/Home";
import Membership from "./pages/Membership";
import MentoonsStore from "./pages/MentoonsStore";
import PaymentStatusPage from "./pages/PaymentStatusPage";
import PolicyPage from "./pages/PolicyPage";
import ProductDetails from "./pages/ProductDetails";
import ProductManagement from "./pages/ProductManagement.tsx";
import TermsAndConditions from "./pages/TermsAndConditions";
import { RootState } from "./redux/store";
import ProtectedRoute from "./utils/ProtectedRoute";
import AddaRouter from "./routes/adda/addaRouter.tsx";

const Cart = lazy(() => import("./pages/Cart"));

const ComicsPageV2 = lazy(() => import("./pages/ComicsPageV2"));
const Podcastv2 = lazy(() => import("./pages/Podcastv2"));
const Workshopv2 = lazy(() => import("./pages/Workshopv2"));

const FreeDownload = lazy(() => import("./pages/FreeDownload"))
const FAQ = lazy(() => import("./components/common/FAQ"));
const Plans = lazy(() => import("./components/common/Plans"));
const NotFound = lazy(() => import("./pages/NotFound"));

const routes = [
  { path: "/", element: <Home /> },
  { path: "/sign-up", element: <Register /> },
  { path: "/sign-in", element: <LogIn /> },
  { path: "/about-mentoons", element: <AboutMentoons /> },
  {
    path: "/cart",
    element: (
      <ProtectedRoute>
        <Cart />
      </ProtectedRoute>
    ),
  },
  { path: "/mentoons-comics", element: <ComicsPageV2 /> },
  { path: "/free-download", element: <FreeDownload /> },
  { path: "/mentoons-workshops", element: <Workshopv2 /> },
  { path: "/mentoons-podcast", element: <Podcastv2 /> },
  { path: "/faq", element: <FAQ /> },
  { path: "/website-plans", element: <Plans /> },
  { path: "/mentoons-store", element: <MentoonsStore /> },
  { path: "/mentoons-store/product/:productId", element: <ProductDetails /> },
  { path: "/product-management", element: <ProductManagement /> },
  { path: "/mentoons-privacy-policy", element: <PolicyPage /> },
  { path: "/mentoons-term-conditions", element: <TermsAndConditions /> },
  { path: "/membership", element: <Membership /> },
  { path: "/hiring", element: <CareerPage /> },
  { path: "/assesment-page", element: <AssesmentPage /> },
  { path: "/assesment-questions", element: <AssesmentQuestions /> },
  { path: "/order-summary", element: <OrderSummary /> },
  { path: "/payment-status", element: <PaymentStatusPage /> },
  { path: "*", element: <NotFound /> },
  { path: "/adda/*", element: <AddaRouter /> },
]

const Router = () => {
  const [showPopup, setShowPopup] = useState<boolean>(true);
  const hoverComicCard = useSelector(
    (store: RootState) => store.comics.currentHoverComic
  );

  const userLoggedIn = useSelector(
    (store: RootState) => store.user.userLoggedIn
  );

  console.log(showPopup + " " + userLoggedIn);

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<Loader />}>
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<MainLayout>{route.element}</MainLayout>}
            />
          ))}
        </Routes>
      </Suspense>
      <Toaster position="top-right" />
      {hoverComicCard !== null && <ComicCard item={hoverComicCard} />}
      {/* <ProgressScroller /> */}
      {showPopup && localStorage.getItem("phoneNumber") && (
        <Popup
          item={{
            name: "Electronic Gadgets And Kids",
            image:
              "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-13.jpg",
          }}
          setShowPopup={setShowPopup}
        />
      )}
    </>
  );
};

export default Router;
