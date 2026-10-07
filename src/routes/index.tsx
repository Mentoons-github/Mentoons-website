import { lazy } from "react";
import OrderSummary from "@/components/OrderSummary";
import Membership from "../components/LandingPage/membership/membership.tsx";
import LogIn from "../pages/Auth/LogIn";
import Register from "../pages/Auth/Register";
// import CareerPage from "../pages/CareerPage";
import MentoonsStore from "../pages/MentoonsStore";
import PaymentStatusPage from "../pages/PaymentStatusPage";
import PolicyPage from "../pages/PolicyPage";
import ProductDetails from "../pages/ProductDetails";
import HowMentoonsWork from "../components/adda/home/howMentoonsWorks/mentoonsWorks.tsx";
import AssessmentQuestions from "../pages/AssessmentQuestions.tsx";
import TermsAndConditions from "../pages/TermsAndConditions";
import SearchResultsPage from "../pages/v2/adda/globalSearch.tsx";
import OrderHistory from "../pages/v2/orderHistory.tsx";
// import Assessment from "../pages/v2/user/assessment.tsx";
// import ProductsPage from "../pages/v2/user/products/products.tsx";
// import AdvancedBookingSystem from "../pages/v2/user/sessionBooking/sessionBooking.tsx";
import AddaRouter from "./addaRouter.tsx";
import ProtectedRoute from "../utils/ProtectedRoute";
import SubscriptionGuard from "../components/protected/subscriptionGuard.tsx";
import QuizPage from "../pages/quiz/quiz.tsx";
import EmployeeRouter from "./employeeRouter.tsx";
import AdminRouter from "./adminRouter.tsx";
import Profile from "../pages/v2/profile.tsx";
import CommunityPage from "../pages/v2/community/community.tsx";
import CommunityGroups from "../pages/v2/community/groups.tsx";
import MentoonsServices from "../pages/v2/services/service.tsx";
import AddPasswordPage from "../pages/admin/employee/setPasword.tsx";
import WhyComics from "../pages/v2/comics/whyComics.tsx";
import RootRedirect from "../layout/rootRedirect.tsx";
import ImageUploadFormSubmit from "../pages/v2/adda/ImageUploadFormSubmit.tsx";
import Explore from "../pages/v2/chnages.tsx";
import PaymentDetailPage from "../pages/v2/workshop/paymentDetails.tsx";
import Emi from "../pages/v2/workshop/emi.tsx";
// import CareerCorner from "../pages/CareerCorner.tsx";
// import AffiliatePage from "../pages/v2/joinus/affiliate/affiliate.tsx";
import Feedback from "../pages/v2/feedback/feedback.tsx";
// import Collaborate from "../pages/v2/joinus/collaborate/collaborate.tsx";
// import BecomeMentor from "../pages/v2/joinus/becomeMentor.tsx";
import MessageFromFounder from "../pages/v2/MessageFromFounder.tsx";
import NewLandingPage from "../pages/v2/newLandingPage.tsx";
import DailyReport from "../components/employee/report/dailyReport.tsx";
import OtherProduct from "../pages/otherProducts/OtherProduct";
import ToonlandProductPage from "../pages/v2/user/products/toonlandProduct.tsx";
import LetsRevive from "../components/community/letsRevive/letsRevive.tsx";
// import NewHomePage from "@/pages/NewHome.tsx";
import MentoonsAboutPage from "@/pages/v2/about.tsx";
// import Meetups from "@/pages/v3/meetups.tsx";
import JoinOurTeam from "@/pages/v3/joinOurTeam.tsx";
import OneOnOneSessionPage from "@/pages/v3/oneOnOneSession.tsx";
import AssessmentsPage from "@/pages/v3/assessment.tsx";
import ProductPageV3 from "@/pages/v3/productPageV3.tsx";
// import ProductPageV3 from "@/pages/v3/productPageV3.tsx";

const Cart = lazy(() => import("../pages/Cart"));
const ComicsPageV2 = lazy(() => import("../pages/ComicsPageV2"));
const Podcastv2 = lazy(() => import("../pages/Podcastv2"));
const Workshopv2 = lazy(() => import("../pages/Workshopv2"));
const FreeDownload = lazy(() => import("../pages/v2/user/freeDownloads.tsx"));
const FAQ = lazy(() => import("../pages/faq.tsx"));
const Plans = lazy(() => import("../components/common/Plans"));
const NotFound = lazy(() => import("../pages/NotFound"));
const QuizHome = lazy(() => import("../pages/quiz/quizHome.tsx"));
const ChatPage = lazy(() => import("../pages/v2/adda/chat.tsx"));
const Puzzle = lazy(() => import("../pages/v2/puzzle/puzzle.tsx"));
const PuzzleContent = lazy(
  () => import("../pages/v2/puzzle/puzzleContent.tsx"),
);
const WordCrossPuzzle = lazy(() => import("../pages/v2/puzzle/wordCross.tsx"));

export const routes = [
  {
    path: "/",
    element: (
      <RootRedirect>
        <NewLandingPage />
      </RootRedirect>
    ),
  },
  { path: "/sign-up", element: <Register /> },
  { path: "/sign-in", element: <LogIn /> },
  { path: "/about-mentoons", element: <MentoonsAboutPage /> },
  { path: "/mentoons-works", element: <HowMentoonsWork /> },
  { path: "/products", element: <ProductPageV3 /> },
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
  {
    path: "/mentoons-store/toonland-product/:productId",
    element: <ToonlandProductPage />,
  },
  { path: "/mentoons-privacy-policy", element: <PolicyPage /> },
  { path: "/mentoons-term-conditions", element: <TermsAndConditions /> },
  // { path: "/join-us/careers", element: <CareerPage /> },
  // { path: "/join-us/explore", element: <Explore /> },
  // { path: "/career-corner", element: <CareerCorner /> },
  // { path: "/joinus/careers", element: <CareerPage /> },
  // { path: "/joinus/careers/:slug", element: <CareerPage /> },
  // { path: "/joinus/affiliate", element: <AffiliatePage /> },
  // { path: "/joinus/affiliate/:slug", element: <AffiliatePage /> },
  // { path: "/joinus/collaborate", element: <Collaborate /> },
  // { path: "/joinus/collaborate/:slug", element: <Collaborate /> },
  // { path: "/joinus/become-mentor", element: <BecomeMentor /> },
  { path: "/joinus/explore", element: <Explore /> },
  {
    path: "/assessment-page",
    element: (
      <SubscriptionGuard>
        <AssessmentsPage />
      </SubscriptionGuard>
    ),
  },
  { path: "/assessment-questions", element: <AssessmentQuestions /> },
  { path: "/order-summary", element: <OrderSummary /> },
  { path: "/payment-status", element: <PaymentStatusPage /> },
  { path: "/adda/*", element: <AddaRouter /> },
  // { path: "/bookings", element: <AdvancedBookingSystem /> },
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
  { path: "/feedback", element: <Feedback /> },
  { path: "/messag-from-founder", element: <MessageFromFounder /> },
  { path: "/report", element: <DailyReport /> },
  { path: "/other-product/:productId", element: <OtherProduct /> },
  { path: "/meetups", element: <LetsRevive /> },
  // { path: "/new-home", element: <NewHomePage /> },
  { path: "/sample", element: <ProductPageV3 /> },
  // { path: "/new-meetups", element: <Meetups /> },
  { path: "/join-us", element: <JoinOurTeam /> },
  { path: "/bookings", element: <OneOnOneSessionPage /> },
  // { path: "/new-assessment", element: <AssessmentsPage /> },
];

export const NotFoundPage = NotFound;
