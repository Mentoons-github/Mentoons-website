import BottomNav from "@/components/adda/home/bottomNav/bottomNav";
import FriendRequest from "@/components/adda/home/friendRequest/friendRequest";
import Influencer from "@/components/adda/home/influencer/influencer";
import Meme from "@/components/adda/home/memeOfTheDay/meme";
import UserStatus from "@/components/adda/home/userStatus/userStatus";
import WhatWeOffer from "@/components/adda/home/whatweExplore/weOffer";
import ViewAllFriends from "@/components/adda/searchFriend/requestButton";
import WelcomeModal from "@/components/adda/welcome/welcome";
import { useAuth } from "@clerk/clerk-react";
import { useCallback, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const AddaLayout = () => {
  const { isSignedIn } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHomeRoute =
    location.pathname === "/adda/" ||
    location.pathname === "/adda" ||
    location.pathname === "/adda/meme" ||
    location.pathname === "/adda/notifications" ||
    location.pathname === "/adda/user-profile";

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const navigateToFriendRequestsPage = useCallback(() => {
    navigate("/adda/search-friend");
  }, [navigate]);

  const handleActionButtonClick = useCallback(() => {
    setShowWelcome(true);
  }, []);

  return (
    <>
      <div className="flex items-start justify-center w-full p-2 bg-white max-w-8xl sm:p-3 md:p-4">
        <div className="relative flex flex-col w-full">
          <div className="left-0 flex items-center w-full bg-white">
            <div className="flex items-center w-full bg-white">
              <div className="flex-grow w-full min-w-0 py-2">
                <UserStatus />
              </div>
              <div className="flex-shrink-0 hidden px-4 pt-2 md:block">
                <Link to="/mythos">
                  <img
                    src="/assets/adda/sidebar/Introducing poster.png"
                    alt="mentoons-mythos"
                    className="max-w-[134px] lg:max-w-[170px]"
                  />
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full md:flex-row md:gap-4 lg:gap-6">
            <div className="flex-shrink-0 hidden lg:block lg:w-1/4">
              <div className="sticky top-[104px] w-full z-4">
                <WhatWeOffer onActionButtonClick={handleActionButtonClick} />
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:gap-6 w-full md:flex-1 lg:max-w-[50%] relative">
              {!isHomeRoute && (
                <button
                  onClick={handleGoBack}
                  className="absolute z-10 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md top-2 left-2 hover:bg-gray-100"
                  aria-label="Go back"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 12H5" />
                    <path d="M12 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <Outlet />
            </div>

            <div className="flex-shrink-0 hidden w-1/3 md:block lg:w-1/4">
              <div className="sticky top-[104px] flex flex-col gap-4 sm:gap-6 md:rounded-lg md:pt-0 w-full z-4 max-h-[calc(100vh-204px)] overflow-y-auto">
                {isSignedIn && (
                  <div className="p-3 mb-4 bg-white border border-orange-200 rounded-lg sm:p-4">
                    <FriendRequest />
                    <div className="pt-3 mt-4 border-t border-orange-100">
                      <ViewAllFriends
                        onNavigate={navigateToFriendRequestsPage}
                      />
                    </div>
                  </div>
                )}
                <div className="md:flex md:flex-col md:gap-4 lg:gap-6">
                  <Influencer />
                  <Meme />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isSignedIn && (
        <div className="fixed bottom-0 left-0 right-0 z-[9] bg-white border-t border-gray-200 md:hidden">
          <BottomNav />
        </div>
      )}
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
    </>
  );
};

export default AddaLayout;
