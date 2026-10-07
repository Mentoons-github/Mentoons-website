import { Suspense, useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import ComicCard from "./components/comics/HoverCardComic";
import ScrollToTop from "./components/comics/ScrollToTop";
import Loader from "./components/common/Loader";
import MainLayout from "./layout/MainLayout";
import Popup from "./layout/Popup.tsx";
import GlobalAuthModal from "./components/adda/global/globalAuthModal.tsx";
import StatusModal from "./components/adda/global/statusModal.tsx";
import BlockedGuard from "./components/adda/auth/blockedGuard.tsx";
import BlockedPage from "./components/adda/auth/blockedPage.tsx";
import { RootState } from "./redux/store";
import { routes, NotFoundPage } from "./routes/index.tsx";

const Router = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const openModal = urlSearchParams.get("openModal");
  const isNewUser =
    openModal === "true" || localStorage.getItem("Signed up") === "true";
  const [showPopup, setShowPopup] = useState<boolean>(isNewUser);

  const hoverComicCard = useSelector(
    (store: RootState) => store.comics.currentHoverComic,
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
                  <Route path="*" element={<NotFoundPage />} />
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
