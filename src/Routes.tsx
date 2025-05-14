import { lazy, Suspense, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import ComicCard from "./components/comics/HoverCardComic";
import ScrollToTop from "./components/comics/ScrollToTop";
import Loader from "./components/common/Loader";
import MainLayout from "./layout/MainLayout";

import OrderSummary from "@/components/OrderSummary";
import Popup from "./layout/Popup.tsx";
import AboutMentoons from "./pages/AboutMentoons";

import LogIn from "./pages/Auth/LogIn";
import Register from "./pages/Auth/Register";
import CareerPage from "./pages/CareerPage";
import Home from "./pages/Home";
import Membership from "./pages/Membership";
import MentoonsStore from "./pages/MentoonsStore";
import PaymentStatusPage from "./pages/PaymentStatusPage";

import PolicyPage from "./pages/PolicyPage";
import ProductDetails from "./pages/ProductDetails";

import AssessmentQuestions from "./pages/AssessmentQuestions.tsx";
import TermsAndConditions from "./pages/TermsAndConditions";
import Assessment from "./pages/v2/user/assessment.tsx";
import ProductsPage from "./pages/v2/user/products/products.tsx";
import AdvancedBookingSystem from "./pages/v2/user/sessionBooking/sessionBooking.tsx";
import { RootState } from "./redux/store";
import AddaRouter from "./routes/addaRouter.tsx";
import MythosRouter from "./routes/mythosRouter.tsx";
import ProtectedRoute from "./utils/ProtectedRoute";

const Cart = lazy(() => import("./pages/Cart"));

const ComicsPageV2 = lazy(() => import("./pages/ComicsPageV2"));
const Podcastv2 = lazy(() => import("./pages/Podcastv2"));
const Workshopv2 = lazy(() => import("./pages/Workshopv2"));

const FreeDownload = lazy(() => import("./pages/FreeDownload"));
const FAQ = lazy(() => import("./components/common/FAQ"));
const Plans = lazy(() => import("./components/common/Plans"));
const NotFound = lazy(() => import("./pages/NotFound"));

const routes = [
  { path: "/", element: <Navigate to="/adda" replace /> },
  { path: "/mentoons", element: <Home /> },
  { path: "/sign-up", element: <Register /> },
  { path: "/sign-in", element: <LogIn /> },
  { path: "/about-mentoons", element: <AboutMentoons /> },
  {
    path: "/product-page",
    element: <ProductsPage />,
  },
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
  { path: "/mentoons-privacy-policy", element: <PolicyPage /> },
  { path: "/mentoons-term-conditions", element: <TermsAndConditions /> },
  { path: "/membership", element: <Membership /> },
  { path: "/hiring", element: <CareerPage /> },
  { path: "/assessment-page", element: <Assessment /> },
  { path: "/assessment-questions", element: <AssessmentQuestions /> },
  { path: "/order-summary", element: <OrderSummary /> },
  { path: "/payment-status", element: <PaymentStatusPage /> },
  { path: "*", element: <NotFound /> },
  { path: "/adda/*", element: <AddaRouter /> },
  { path: "/bookings", element: <AdvancedBookingSystem /> },
  { path: "/mythos/*", element: <MythosRouter /> },
];

const Router = () => {
  //get the openModal from urlsearch
  const urlSearchParams = new URLSearchParams(window.location.search);
  const openModal = urlSearchParams.get("openModal");
  console.log(openModal);
  // Check if user is newly registered
  const isNewUser =
    openModal === "true" || localStorage.getItem("Signed up") === "true";
  const [showPopup, setShowPopup] = useState<boolean>(isNewUser);

  const hoverComicCard = useSelector(
    (store: RootState) => store.comics.currentHoverComic
  );

  const handlePopup = (value: boolean) => {
    localStorage.removeItem("isNewUser");
    setShowPopup(value);
  };

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<Loader />}>
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                route.path.startsWith("/mythos") ? (
                  route.element
                ) : (
                  <MainLayout>{route.element}</MainLayout>
                )
              }
            />
          ))}
        </Routes>
      </Suspense>

      {hoverComicCard !== null && <ComicCard item={hoverComicCard} />}
      {/* <ProgressScroller /> */}
      {showPopup && (
        <Popup
          item={{
            name: "Electronic Gadgets And Kids",
            image:
              "https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-13.jpg",
          }}
          handlePopUp={handlePopup}
        />
      )}
    </>
  );
};

export default Router;
