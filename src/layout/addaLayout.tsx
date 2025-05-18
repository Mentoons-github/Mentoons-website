import { useState, useCallback } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import BottomNav from "@/components/adda/home/bottomNav/bottomNav";
import FriendRequest from "@/components/adda/home/friendRequest/friendRequest";
import Influencer from "@/components/adda/home/influencer/influencer";
import Meme from "@/components/adda/home/memeOfTheDay/meme";
import UserStatus from "@/components/adda/home/userStatus/userStatus";
import FounderNote from "@/components/common/founderNote";
import ViewAllFriends from "@/components/adda/searchFriend/requestButton";

const AddaLayout = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<
    "home" | "notification" | "memeBanner" | "friendRequest" | "userProfile"
  >("home");

  const isHomeRoute =
    location.pathname === "/adda/home" ||
    location.pathname === "/adda" ||
    location.pathname === "/adda/meme" ||
    location.pathname === "/adda/notifications" ||
    location.pathname === "/adda/";

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const navigateToFriendRequestsPage = useCallback(() => {
    navigate("/adda/search-friend");
  }, [navigate]);

  return (
    <>
      <div className="flex items-start justify-center w-full p-2 bg-white max-w-8xl sm:p-3 md:p-4">
        <div className="relative flex flex-col w-full">
          <div className="sticky left-0 flex items-center w-full top-[64px] bg-white z-[4]">
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
              <div className="sticky top-[204px] w-full z-4">
                <FounderNote scroll={false} />
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
              <div className="sticky top-[204px] flex flex-col gap-4 sm:gap-6 md:rounded-lg md:pt-0 w-full z-4">
                {isSignedIn && (
                  <div className="p-3 mb-4 bg-white border border-orange-200 rounded-lg sm:p-4">
                    <FriendRequest />
                    <div className="mt-4 border-t border-orange-100 pt-3">
                      <ViewAllFriends
                        onNavigate={navigateToFriendRequestsPage}
                      />
                    </div>
                  </div>
                )}
                <div className="hidden md:flex md:flex-col md:gap-4 lg:gap-6 md:max-h-[calc(100vh-150px)] md:overflow-y-auto md:pr-2">
                  <Influencer />
                  <Meme />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-[9] bg-white border-t border-gray-200 md:hidden">
        <BottomNav
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      </div>
    </>
  );
};

export default AddaLayout;
