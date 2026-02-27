import AboutMentoons from "@/components/adda/about";
import BottomNav from "@/components/adda/home/bottomNav/bottomNav";
import FriendRequest from "@/components/adda/home/friendRequest/friendRequest";
import Influencer from "@/components/adda/home/influencer/influencer";
import Meme from "@/components/adda/home/memeOfTheDay/meme";
import UserStatus from "@/components/adda/home/userStatus/userStatus";
import WhatWeOffer from "@/components/adda/home/whatweExplore/weOffer";
import ViewAllFriends from "@/components/adda/searchFriend/requestButton";
import WelcomeModal from "@/components/adda/welcome/welcome";
import { fetchProducts } from "@/redux/productSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useAuth } from "@clerk/clerk-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import ProductScrollNav from "@/components/Home/productScrollNav";
import { gsap } from "gsap";

const AddaLayout = () => {
  const { isSignedIn, getToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [showWelcome, setShowWelcome] = useState(false);

  const leftSidebarRef = useRef<HTMLDivElement>(null);
  const rightSidebarRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const topNavRef = useRef<HTMLDivElement>(null);
  const userStatusRef = useRef<HTMLDivElement>(null);
  const bottomNavRef = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);

  const { items, loading, page } = useSelector(
    (state: RootState) => state.products,
  );

  const productsData = Array.isArray(items)
    ? items.map((product) => ({ id: product._id, title: product.title }))
    : [];

  const isHomeRoute =
    location.pathname === "/adda/" ||
    location.pathname === "/adda" ||
    location.pathname === "/adda/meme" ||
    location.pathname === "/adda/notifications" ||
    location.pathname === "/adda/user-profile";

  useEffect(() => {
    const loadInitial = async () => {
      const token = await getToken();
      if (token) {
        await dispatch(
          fetchProducts({
            token,
            type: undefined,
            cardType: undefined,
            ageCategory: undefined,
            page: 1,
            append: false,
          }),
        );
      }
    };
    loadInitial();
  }, [dispatch, getToken]);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      topNavRef.current,
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
    )
      .fromTo(
        userStatusRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.3",
      )
      .fromTo(
        leftSidebarRef.current,
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6 },
        "-=0.3",
      )
      .fromTo(
        mainContentRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.4",
      )
      .fromTo(
        rightSidebarRef.current,
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6 },
        "-=0.4",
      );

    if (isSignedIn && bottomNavRef.current) {
      gsap.fromTo(
        bottomNavRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.5 },
      );
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (!isHomeRoute && backButtonRef.current) {
      gsap.fromTo(
        backButtonRef.current,
        { scale: 0, opacity: 0, rotate: -90 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.4,
          ease: "back.out(1.7)",
        },
      );
    }
  }, [isHomeRoute]);

  useEffect(() => {
    if (mainContentRef.current) {
      gsap.fromTo(
        mainContentRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
      );
    }
  }, [location.pathname]);

  const handleGoBack = useCallback(() => {
    if (backButtonRef.current) {
      gsap.to(backButtonRef.current, {
        scale: 0.85,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => navigate(-1),
      });
    } else {
      navigate(-1);
    }
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  }, [navigate]);

  const navigateToFriendRequestsPage = useCallback(
    () => navigate("/adda/search-friend"),
    [navigate],
  );
  const handleActionButtonClick = useCallback(() => setShowWelcome(true), []);

  return (
    <>
      <div className="flex justify-center w-full min-h-screen">
        <div className="w-full max-w-8xl">
          <div ref={topNavRef} className="border-b border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <ProductScrollNav
                productsData={productsData}
                loading={loading}
                currentPage={page}
              />
            </div>
          </div>

          <div
            ref={userStatusRef}
            className="py-3 px-2 bg-white border-b border-gray-100"
          >
            <UserStatus />
          </div>

          <div className="flex flex-col lg:flex-row md:gap-6 lg:gap-8 px-2 md:px-4 lg:px-0">
            <div ref={leftSidebarRef} className="hidden lg:block lg:w-1/4">
              <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hide space-y-6 pr-2">
                <WhatWeOffer onActionButtonClick={handleActionButtonClick} />
                <AboutMentoons />
              </div>
            </div>

            <div
              ref={mainContentRef}
              className="flex-1 lg:max-w-[50%] min-w-0 relative"
            >
              {!isHomeRoute && (
                <button
                  ref={backButtonRef}
                  onClick={handleGoBack}
                  className="absolute z-10 top-4 left-4 flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg hover:bg-gray-50 transition"
                  aria-label="Go back"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 12H5" />
                    <path d="M12 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div className="pt-2" onClick={(e) => e.stopPropagation()}>
                <Outlet />
              </div>
            </div>

            <div ref={rightSidebarRef} className="hidden md:block lg:w-1/4 ">
              <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hide space-y-6 pr-2">
                {isSignedIn && (
                  <div className="bg-white rounded-xl border border-orange-200 p-4 shadow-sm">
                    <FriendRequest />
                    <div className="pt-4 mt-4 border-t border-orange-100">
                      <ViewAllFriends
                        onNavigate={navigateToFriendRequestsPage}
                      />
                    </div>
                  </div>
                )}
                <Influencer />
                <Meme />
              </div>
            </div>
          </div>

          <div className="hidden md:block px-6 py-8">
            <a
              href="https://mentoonsmythos.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/assets/adda/sidebar/Introducing poster.png"
                alt="mentoons-mythos"
                className="max-w-[170px]"
              />
            </a>
          </div>
        </div>
      </div>

      {isSignedIn && (
        <div
          ref={bottomNavRef}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden"
        >
          <BottomNav />
        </div>
      )}

      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
    </>
  );
};

export default AddaLayout;
