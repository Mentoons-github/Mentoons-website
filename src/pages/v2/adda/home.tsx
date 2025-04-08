import AddPosts from "@/components/adda/home/addPosts/addPosts";
import Posts from "@/components/adda/home/addPosts/posts/posts";
import FriendRequest from "@/components/adda/home/friendRequest/friendRequest";
import Influencer from "@/components/adda/home/influencer/influencer";
import Meme from "@/components/adda/home/memeOfTheDay/meme";
import UserStatus from "@/components/adda/home/userStatus/userStatus";
import { useEffect, useState } from "react";
// import FounderNote from '../../../components/LandingPage/'
import BottomNav from "@/components/adda/home/bottomNav/bottomNav";
import Notification from "@/components/adda/home/notifications/notification";
import FounderNote from "@/components/common/founderNote";
import { Link } from "react-router-dom";

const AddaHome = () => {
  const [mobile, setMobile] = useState(window.innerWidth < 768);

  const [activeSection, setActiveSection] = useState<
    "home" | "notification" | "memeBanner" | "friendRequest"
  >("home");

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleResize = () => {
      const mobileView = window.innerWidth < 768;

      if (mobileView !== mobile) {
        setActiveSection("home");
      }

      setMobile(mobileView);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [mobile]);

  return (
    <>
      <div className="flex items-start justify-center w-full gap-4 p-4 sm:p-6 sm:gap-8">
        <div className="flex flex-col w-full gap-6 sm:gap-8">
          <div className="flex items-center justify-between">
            <UserStatus />
            <Link to="/mythos" className="hidden md:block">
              <img
                src="/assets/adda/sidebar/Introducing poster.png"
                alt="mentoons-mythos"
                className="max-w-[180px]"
              />
            </Link>
          </div>
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
            <div className="items-start justify-start hidden col-span-1 p-4 bg-white rounded-lg shadow-xl lg:flex h-fit">
              <FounderNote scroll={true} />
            </div>
            {mobile ? (
              <>
                {activeSection === "notification" && <Notification />}
                {activeSection === "friendRequest" && (
                  <div className="p-2 bg-white rounded-lg shadow-lg md:p-4">
                    <FriendRequest />
                  </div>
                )}
                {activeSection === "memeBanner" && (
                  <>
                    <Influencer />
                    <Meme />
                  </>
                )}
                {activeSection === "home" && (
                  <div className="flex flex-col col-span-1 gap-6 sm:col-span-2">
                    <AddPosts />
                    <Posts />
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex flex-col col-span-1 gap-6 sm:col-span-2">
                  <AddPosts />
                  <Posts />
                </div>
                <div className="col-span-1 flex flex-col gap-6 shadow-lg max-h-[80vh] overflow-auto sticky top-24">
                  <div className="p-2 bg-white rounded-lg md:p-4">
                    <FriendRequest />
                  </div>
                  <Influencer />
                  <Meme />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <BottomNav setActive={setActiveSection} />
    </>
  );
};

export default AddaHome;
