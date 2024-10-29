import { lazy, Suspense, useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import ComicCard from "./components/comics/HoverCardComic";
import ScrollToTop from "./components/comics/ScrollToTop";
import Loader from "./components/common/Loader";
import MainLayout from "./layout/MainLayout";
import Popup from "./layout/Popup";

import LogIn from "./pages/Auth/LogIn";
import Register from "./pages/Auth/Register";
import ComicPdfPage from "./pages/ComicPdfPage";
import { RootState } from "./redux/store";
import ProtectedRoute from "./utils/ProtectedRoute";
import MentoonsStore from "./pages/MentoonsStore";

// Lazy load the pages
const Home = lazy(() => import("./pages/Home"));

const Wishlist = lazy(() => import("./pages/Wishlist"));
const Cart = lazy(() => import("./pages/Cart"));
const ComicsPage = lazy(() => import("./pages/ComicsPage"));
const ComicsHome = lazy(() => import("@/pages/ComicsHome"));
const FreeDownload = lazy(() => import("./pages/FreeDownload"));
const AudioComicPage = lazy(() => import("./pages/AudioComicPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const Career = lazy(() => import("./components/shared/CareerPage/Career"));
const PodCast = lazy(() => import("./pages/PodCast"));
const FAQ = lazy(() => import("./components/common/FAQ"));
const Plans = lazy(() => import("./components/common/Plans"));
const NotFound = lazy(() => import("./pages/NotFound"));
const WorkshopsPage = lazy(() => import("./pages/WorkshopsPage"));

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
    path: "/wishlist",
    element: (
      <MainLayout>
        <Wishlist />
      </MainLayout>
    ),
  },
  {
    path: "/cart",
    element: (
      <MainLayout>
        <Cart />
      </MainLayout>
    ),
  },
  {
    path: "/mentoons-comics",
    element: (
      <MainLayout>
        <ComicsHome />
      </MainLayout>
    ),
  },
  {
    path: "/mentoons-comics/free-download",
    element: (
      <MainLayout>
        <FreeDownload />
      </MainLayout>
    ),
  },
  {
    path: "/mentoons-comics/audio-comics",
    element: (
      <MainLayout>
        <ComicsPage />
      </MainLayout>
    ),
  },
  {
    path: "/mentoons-comics/comics",
    element: (
      <MainLayout>
        <ComicsPage />

        <ComicsPage />
      </MainLayout>
    ),
  },
  // {
  //   path: "/mentoons-comics/comics",
  //   element: (
  //     <MainLayout>
  //       <ComicsPage page='Comics' />
  //     </MainLayout>
  //   ),
  // },
  {
    path: "/mentoons-workshops",
    element: (
      <MainLayout>
        <WorkshopsPage />
      </MainLayout>
    ),
  },
  {
    path: "/mentoons-comics/comics-list",
    element: (
      <MainLayout>
        <ComicsPage />

        <ComicsPage />
      </MainLayout>
    ),
  },
  {
    path: "/mentoons-comics/audio-comics/:comic",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <AudioComicPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/search",
    element: (
      <MainLayout>
        <SearchPage />
      </MainLayout>
    ),
  },
  {
    path: "/hiring",
    element: (
      <MainLayout>
        <Career />
      </MainLayout>
    ),
  },
  {
    path: "/mentoons-podcast",
    element: (
      <MainLayout>
        <PodCast />
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
    path: "/mentoons-comics/comics/:comic",
    element: (
      <MainLayout>
        <ComicPdfPage />
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
      <Toaster position="top-right"/>
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
