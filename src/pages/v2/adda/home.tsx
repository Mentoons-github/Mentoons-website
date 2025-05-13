import AddPosts from "@/components/adda/home/addPosts/addPosts";
import Posts from "@/components/adda/home/addPosts/posts/posts";
import BottomNav from "@/components/adda/home/bottomNav/bottomNav";
import FriendRequest from "@/components/adda/home/friendRequest/friendRequest";
import Influencer from "@/components/adda/home/influencer/influencer";
import Meme from "@/components/adda/home/memeOfTheDay/meme";
import Notification from "@/components/adda/home/notifications/notification";
import UserStatus from "@/components/adda/home/userStatus/userStatus";
import FounderNote from "@/components/common/founderNote";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AddaHome = () => {
  const [activeSection, setActiveSection] = useState<
    "home" | "notification" | "memeBanner" | "friendRequest" | "userProfile"
  >("home");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="flex items-start justify-center w-full p-2 bg-white max-w-8xl sm:p-3 md:p-4">
        <div className="relative flex flex-col w-full">
          <div className="sticky left-0 flex items-center w-full top-[64px] z-[9] bg-white">
            <div className="flex-grow w-full min-w-0 py-2 ">
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
          <div className="flex flex-col w-full md:flex-row md:gap-4 lg:gap-6 ">
            <div className="flex-shrink-0 hidden lg:block lg:w-1/4">
              <div className="sticky top-[204px] w-full">
                <FounderNote scroll={false} />
              </div>
            </div>
            <div
              className={`flex flex-col gap-4 sm:gap-6 w-full md:flex-1 lg:max-w-[50%] ${
                activeSection !== "home" && activeSection !== "notification"
                  ? "hidden md:flex"
                  : "flex"
              }`}
            >
              {activeSection === "notification" ||
              window.location.pathname === "/adda/notifications" ? (
                <div className="w-full mb-16 bg-white rounded-bl-lg rounded-br-lg">
                  <Notification />
                </div>
              ) : (
                <>
                  <div className="sticky top-[176px] sm:top-[184px] md:top-[200px] z-[5] bg-white rounded-br-lg shadow-sm rounded-bl-lg ">
                    <AddPosts />
                  </div>
                  <div className="w-full mb-16 bg-white rounded-bl-lg rounded-br-lg">
                    <Posts />
                  </div>
                </>
              )}
            </div>
            <div
              className={`w-full md:w-1/3 lg:w-1/4 flex-shrink-0
               ${
                 activeSection === "friendRequest" ||
                 activeSection === "memeBanner"
                   ? "block"
                   : activeSection === "notification"
                   ? "hidden md:block"
                   : activeSection !== "home"
                   ? "hidden"
                   : "hidden md:block"
               }`}
            >
              <div className="md:sticky flex flex-col gap-4 sm:gap-6 md:rounded-lg  md:pt-0 top-[204px] z-[8] w-full ">
                <div className="flex flex-col gap-4 mb-16 md:hidden">
                  {activeSection === "friendRequest" && (
                    <div className="p-3 bg-white rounded-lg sm:p-4 ">
                      <FriendRequest />
                    </div>
                  )}

                  {activeSection === "memeBanner" && (
                    <>
                      <Influencer />
                      <Meme />
                    </>
                  )}
                </div>

                <div className="hidden md:flex md:flex-col md:gap-4 lg:gap-6">
                  <div className="p-3 bg-white border border-orange-200 rounded-lg sm:p-4">
                    <FriendRequest />
                  </div>
                  <Influencer />
                  <Meme />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-[9] bg-white border-t border-gray-200 md:hidden">
        <BottomNav setActive={setActiveSection} />
      </div>
    </>
  );
};

export default AddaHome;
