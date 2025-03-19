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

const Cart = lazy(() => import("./pages/Cart"));

const ComicsPageV2 = lazy(() => import("./pages/ComicsPageV2"));
const Podcastv2 = lazy(() => import("./pages/Podcastv2"));
const Workshopv2 = lazy(() => import("./pages/Workshopv2"));

const FreeDownload = lazy(() => import("./pages/FreeDownload"));

const FAQ = lazy(() => import("./components/common/FAQ"));
const Plans = lazy(() => import("./components/common/Plans"));
const NotFound = lazy(() => import("./pages/NotFound"));

const routes = [
  {
    path: "/",
    element: (
      <MainLayout>
        <Home />
      </MainLayout>
    ),
  },
  {
    path: "/sign-up",

    element: (
      <MainLayout>
        <Register />
      </MainLayout>
    ),
  },
  {
    path: "/sign-in",

    element: (
      <MainLayout>
        <LogIn />
      </MainLayout>
    ),
  },
  {
    path: "/about-mentoons",

    element: (
      <MainLayout>
        <AboutMentoons />
      </MainLayout>
    ),
  },

  {
    path: "/cart",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Cart />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/mentoons-comics",
    element: (
      <MainLayout>
        {/* <ComicsHome /> */}

        <ComicsPageV2 />
      </MainLayout>
    ),
  },
  {
    path: "/free-download",
    element: (
      <MainLayout>
        <FreeDownload />
      </MainLayout>
    ),
  },

  {
    path: "/mentoons-workshops",
    element: (
      <MainLayout>
        <Workshopv2 />
      </MainLayout>
    ),
  },

  {
    path: "/mentoons-podcast",
    element: (
      <MainLayout>
        <Podcastv2 />
      </MainLayout>
    ),
  },
  {
    path: "/faq",
    element: (
      <MainLayout>
        <FAQ />
      </MainLayout>
    ),
  },
  {
    path: "/website-plans",
    element: (
      <MainLayout>
        <Plans />
      </MainLayout>
    ),
  },

  {
    path: "/mentoons-store",
    element: (
      <MainLayout>
        <MentoonsStore />
      </MainLayout>
    ),
  },

  {
    path: "/mentoons-store/product/:productId",
    element: (
      <MainLayout>
        <ProductDetails />
      </MainLayout>
    ),
  },
  {
    path: "/product-management",
    element: (
      <MainLayout>
        <ProductManagement />
      </MainLayout>
    ),
  },
  {
    path: "/mentoons-privacy-policy",
    element: (
      <MainLayout>
        <PolicyPage />
      </MainLayout>
    ),
  },
  {
    path: "/mentoons-term-conditions",
    element: (
      <MainLayout>
        <TermsAndConditions />
      </MainLayout>
    ),
  },
  {
    path: "/membership",
    element: (
      <MainLayout>
        <Membership />
      </MainLayout>
    ),
  },
  {
    path: "/hiring",
    element: (
      <MainLayout>
        <CareerPage />
      </MainLayout>
    ),
  },

  {
    path: "/assesment-page",
    element: (
      <MainLayout>
        <AssesmentPage />
      </MainLayout>
    ),
  },
  {
    path: "/assesment-questions",
    element: (
      <MainLayout>
        <AssesmentQuestions />
      </MainLayout>
    ),
  },

  {
    path: "/order-summary",
    element: (
      <MainLayout>
        <OrderSummary />
      </MainLayout>
    ),
  },

  {
    path: "/payment-status",
    element: (
      <MainLayout>
        <PaymentStatusPage />
      </MainLayout>
    ),
  },

  {
    path: "*",
    element: (
      <MainLayout>
        <NotFound />
      </MainLayout>
    ),
  },
];

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
            <Route key={index} path={route.path} element={route.element} />
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
