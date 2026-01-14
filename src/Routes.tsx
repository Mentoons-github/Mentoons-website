import { lazy, Suspense, useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import ComicCard from "./components/comics/HoverCardComic";
import ScrollToTop from "./components/comics/ScrollToTop";
import Loader from "./components/common/Loader";
import MainLayout from "./layout/MainLayout";

import OrderSummary from "@/components/OrderSummary";
import Popup from "./layout/Popup.tsx";
import AboutMentoons from "./pages/AboutMentoons";

import Membership from "./components/LandingPage/membership/membership.tsx";
import LogIn from "./pages/Auth/LogIn";
import Register from "./pages/Auth/Register";
import CareerPage from "./pages/CareerPage";
import Home from "./pages/Home";
import MentoonsStore from "./pages/MentoonsStore";
import PaymentStatusPage from "./pages/PaymentStatusPage";

import PolicyPage from "./pages/PolicyPage";
import ProductDetails from "./pages/ProductDetails";

import GlobalAuthModal from "./components/adda/global/globalAuthModal.tsx";
import StatusModal from "./components/adda/global/statusModal.tsx";

import HowMentoonsWork from "./components/adda/home/howMentoonsWorks/mentoonsWorks.tsx";
import AssessmentQuestions from "./pages/AssessmentQuestions.tsx";
import TermsAndConditions from "./pages/TermsAndConditions";
import SearchResultsPage from "./pages/v2/adda/globalSearch.tsx";
import OrderHistory from "./pages/v2/orderHistory.tsx";
import Assessment from "./pages/v2/user/assessment.tsx";
import ProductsPage from "./pages/v2/user/products/products.tsx";
import AdvancedBookingSystem from "./pages/v2/user/sessionBooking/sessionBooking.tsx";
import { RootState } from "./redux/store";
import AddaRouter from "./routes/addaRouter.tsx";
import ProtectedRoute from "./utils/ProtectedRoute";
import SubscriptionGuard from "./components/protected/subscriptionGuard.tsx";
import QuizPage from "./pages/quiz/quiz.tsx";
import EmployeeRouter from "./routes/employeeRouter.tsx";
import AdminRouter from "./routes/adminRouter.tsx";
import Profile from "./pages/v2/profile.tsx";
import CommunityPage from "./pages/v2/community/community.tsx";
import CommunityGroups from "./pages/v2/community/groups.tsx";
import MentoonsServices from "./pages/v2/services/service.tsx";
import AddPasswordPage from "./pages/admin/employee/setPasword.tsx";
import WhyComics from "./pages/v2/comics/whyComics.tsx";
import RootRedirect from "./layout/rootRedirect.tsx";
import BlockedGuard from "./components/adda/auth/blockedGuard.tsx";
import BlockedPage from "./components/adda/auth/blockedPage.tsx";
import ImageUploadFormSubmit from "./pages/v2/adda/ImageUploadFormSubmit.tsx";
import Explore from "./pages/v2/chnages.tsx";
import PaymentDetailPage from "./pages/v2/workshop/paymentDetails.tsx";
// import WorkshopV2 from "./pages/v2/workshop/workshopV2.tsx";
import Emi from "./pages/v2/workshop/emi.tsx";
// import WorkshopV2 from "./pages/v2/workshop/workshopV2.tsx";

const Cart = lazy(() => import("./pages/Cart"));
const ComicsPageV2 = lazy(() => import("./pages/ComicsPageV2"));
const Podcastv2 = lazy(() => import("./pages/Podcastv2"));
const Workshopv2 = lazy(() => import("./pages/Workshopv2"));
const FreeDownload = lazy(() => import("./pages/v2/user/freeDownloads.tsx"));
const FAQ = lazy(() => import("./components/common/FAQ"));
const Plans = lazy(() => import("./components/common/Plans"));
const NotFound = lazy(() => import("./pages/NotFound"));
const QuizHome = lazy(() => import("./pages/quiz/quizHome.tsx"));
const ChatPage = lazy(() => import("./pages/v2/adda/chat.tsx"));
const Puzzle = lazy(() => import("./pages/v2/puzzle/puzzle.tsx"));
const PuzzleContent = lazy(() => import("./pages/v2/puzzle/puzzleContent.tsx"));
const WordCrossPuzzle = lazy(() => import("./pages/v2/puzzle/wordCross.tsx"));

const routes = [
  { path: "/", element: <RootRedirect /> },
  { path: "/mentoons", element: <Home /> },
  { path: "/sign-up", element: <Register /> },
  { path: "/sign-in", element: <LogIn /> },
  { path: "/about-mentoons", element: <AboutMentoons /> },
  { path: "/mentoons-works", element: <HowMentoonsWork /> },
  { path: "/products", element: <ProductsPage /> },
  {
    path: "/cart",
    element: (
      <ProtectedRoute>
        <Cart />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mentoons-comics",
    element: (
      <SubscriptionGuard>
        <ComicsPageV2 />
      </SubscriptionGuard>
    ),
  },
  { path: "/free-download", element: <FreeDownload /> },
  { path: "/mentoons-workshops", element: <Workshopv2 /> },
  // { path: "/mentoons-workshopv2", element: <WorkshopV2 /> },
  {
    path: "/mentoons-podcast",
    element: (
      <SubscriptionGuard>
        <Podcastv2 />
      </SubscriptionGuard>
    ),
  },
  { path: "/faq", element: <FAQ /> },
  { path: "/website-plans", element: <Plans /> },
  { path: "/mentoons-store", element: <MentoonsStore /> },
  { path: "/mentoons-store/product/:productId", element: <ProductDetails /> },
  { path: "/mentoons-privacy-policy", element: <PolicyPage /> },
  { path: "/mentoons-term-conditions", element: <TermsAndConditions /> },
  { path: "/join-us/careers", element: <CareerPage /> },
  { path: "/join-us/explore", element: <Explore /> },
  {
    path: "/assessment-page",
    element: (
      <SubscriptionGuard>
        <Assessment />
      </SubscriptionGuard>
    ),
  },
  { path: "/assessment-questions", element: <AssessmentQuestions /> },
  { path: "/order-summary", element: <OrderSummary /> },
  { path: "/payment-status", element: <PaymentStatusPage /> },
  { path: "/adda/*", element: <AddaRouter /> },
  { path: "/bookings", element: <AdvancedBookingSystem /> },
  { path: "/search", element: <SearchResultsPage /> },
  { path: "/membership", element: <Membership /> },
  { path: "/order-history", element: <OrderHistory /> },
  { path: "/chat", element: <ChatPage /> },
  { path: "/chat/:selectedUser", element: <ChatPage /> },
  { path: "/quiz", element: <QuizHome /> },
  { path: "/quiz/category/:categoryId", element: <QuizPage /> },
  { path: "/puzzle", element: <Puzzle /> },
  { path: "/puzzle/play", element: <PuzzleContent /> },
  { path: "/wordCross/:difficulty/:puzzleType", element: <WordCrossPuzzle /> },
  { path: "/employee/*", element: <EmployeeRouter /> },
  { path: "/admin/*", element: <AdminRouter /> },
  { path: "/community", element: <CommunityPage /> },
  { path: "/community/group/:id", element: <CommunityGroups /> },
  { path: "/services", element: <MentoonsServices /> },
  { path: "/prof", element: <Profile /> },
  { path: "/add-password", element: <AddPasswordPage /> },
  { path: "/why-comics", element: <WhyComics /> },
  { path: "payment", element: <PaymentDetailPage /> },
  { path: "/form-submit", element: <ImageUploadFormSubmit /> },
  { path: "/emi", element: <Emi /> }, 
];

const Router = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const openModal = urlSearchParams.get("openModal");
  const isNewUser =
    openModal === "true" || localStorage.getItem("Signed up") === "true";
  const [showPopup, setShowPopup] = useState<boolean>(isNewUser);

  const hoverComicCard = useSelector(
    (store: RootState) => store.comics.currentHoverComic
  );

  const handlePopup = (value: boolean) => {
    localStorage.removeItem("Signed up");
    localStorage.removeItem("isNewUser");
    setShowPopup(value);
  };

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/blocked" element={<BlockedPage />} />

          <Route
            path="/*"
            element={
              <BlockedGuard>
                <Routes>
                  {routes.map((route, index) => (
                    <Route
                      key={index}
                      path={route.path}
                      element={
                        route.path.startsWith("/employee") ||
                        route.path.startsWith("/admin") ||
                        route.path.startsWith("/form-submit") ? (
                          route.element
                        ) : (
                          <MainLayout>{route.element}</MainLayout>
                        )
                      }
                    />
                  ))}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BlockedGuard>
            }
          />
        </Routes>
      </Suspense>

      {hoverComicCard !== null && <ComicCard item={hoverComicCard} />}
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
      <GlobalAuthModal />
      <StatusModal />
    </>
  );
};

export default Router;
