import { useEffect, useState } from "react";
import FriendRequest from "@/components/adda/home/friendRequest/friendRequest";
import Meme from "@/components/adda/home/memeOfTheDay/meme";
import UserStatus from "@/components/adda/home/userStatus/userStatus";
import AddPosts from "@/components/adda/home/addPosts/addPosts";
import Posts from "@/components/adda/home/addPosts/posts/posts";
import Influencer from "@/components/adda/home/influencer/influencer";
// import FounderNote from '../../../components/LandingPage/'
import BottomNav from "@/components/adda/home/bottomNav/bottomNav";
import Notification from "@/components/adda/home/notifications/notification";
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
      <main className="flex justify-center items-start w-full p-4 sm:p-6 gap-4 sm:gap-8">
        <div className="flex flex-col w-full gap-6 sm:gap-8">
          <div className="flex justify-between items-center">
            <UserStatus />
            <Link to="/mythos" className="hidden md:block">
              <img
                src="/assets/adda/sidebar/Introducing poster.png"
                alt="mentoons-mythos"
                className="w-full"
              />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
            <div className="hidden lg:flex col-span-1 items-start justify-start p-4 bg-white rounded-lg shadow-xl h-fit">
              {/* <FounderNote scroll={true} /> */}{" "}
              {/*Add founders note here after merging*/}
            </div>
            {mobile ? (
              <>
                {activeSection === "notification" && <Notification />}
                {activeSection === "friendRequest" && (
                  <div className="shadow-lg p-2 md:p-4 rounded-lg bg-white">
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
                  <div className="col-span-1 sm:col-span-2 flex flex-col gap-6">
                    <AddPosts />
                    <Posts />
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="col-span-1 sm:col-span-2 flex flex-col gap-6">
                  <AddPosts />
                  <Posts />
                </div>
                <div className="col-span-1 flex flex-col gap-6 shadow-lg max-h-[80vh] overflow-auto sticky top-24">
                  <div className="p-2 md:p-4 rounded-lg bg-white">
                    <FriendRequest />
                  </div>
                  <Influencer />
                  <Meme />
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <BottomNav setActive={setActiveSection} />
    </>
  );
};

export default AddaHome;
