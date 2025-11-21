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
import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import ProductScrollNav from "@/components/Home/productScrollNav";

const AddaLayout = () => {
  const { isSignedIn, getToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [showWelcome, setShowWelcome] = useState(false);

  const { items, loading, page } = useSelector(
    (state: RootState) => state.products
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
          })
        );
      }
    };
    loadInitial();
  }, [dispatch, getToken]);

  const handleGoBack = useCallback(() => navigate(-1), [navigate]);
  const navigateToFriendRequestsPage = useCallback(
    () => navigate("/adda/search-friend"),
    [navigate]
  );
  const handleActionButtonClick = useCallback(() => setShowWelcome(true), []);

  return (
    <>
      <div className="flex justify-center w-full min-h-screen">
        <div className="w-full max-w-8xl">
          <div className="border-b border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <ProductScrollNav
                productsData={productsData}
                loading={loading}
                currentPage={page}
              />
            </div>
          </div>

          <div className="py-3 px-2 bg-white border-b border-gray-100">
            <UserStatus />
          </div>

          <div className="flex flex-col md:flex-row md:gap-6 lg:gap-8 px-2 md:px-4 lg:px-0">
            <div className="hidden lg:block lg:w-1/4">
              <div className="sticky top-20 space-y-6">
                <WhatWeOffer onActionButtonClick={handleActionButtonClick} />
                <AboutMentoons />
              </div>
            </div>

            <div className="flex-1 lg:max-w-[50%] min-w-0 relative">
              {!isHomeRoute && (
                <button
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
              <div className="pt-2">
                <Outlet />
              </div>
            </div>

            <div className="hidden md:block lg:w-1/4">
              <div className="sticky top-20 space-y-6">
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
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
          <BottomNav />
        </div>
      )}

      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
    </>
  );
};

export default AddaLayout;
