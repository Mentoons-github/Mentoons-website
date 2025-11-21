import FriendSearch from "@/components/adda/searchFriend/searchFriend";
import Loader from "@/components/common/Loader";
import SubscriptionGuard from "@/components/protected/subscriptionGuard";
import AddaLayout from "@/layout/addaLayout";
import PostPage from "@/pages/v2/adda/postPage";
import Profile from "@/pages/v2/profile";
import { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

// Lazy-loaded components
const AddaHome = lazy(() => import("@/pages/v2/adda/home.tsx"));
const AddaGroups = lazy(() => import("@/pages/v2/adda/groups"));
const AddaMessages = lazy(() => import("@/pages/v2/adda/messages"));
const PostDetails = lazy(() => import("@/pages/v2/adda/postDetails"));
const ProfileDetails = lazy(() => import("@/pages/v2/adda/profileDetails"));
const Notification = lazy(
  () => import("@/components/adda/home/notifications/notification")
);
const MemePage = lazy(() => import("@/pages/v2/adda/MemePage"));
const MemeDetails = lazy(() => import("@/pages/v2/adda/memeDetails"));

const AddaRouter = () => {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const loadingFallback = (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
      <Loader />
    </div>
  );

  if (!isReady) {
    return loadingFallback;
  }

  return (
    <Suspense fallback={loadingFallback}>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={loadingFallback}>
              <AddaLayout />
            </Suspense>
          }
        >
          <Route
            index
            element={
              <SubscriptionGuard>
                <AddaHome />
              </SubscriptionGuard>
            }
          />
          <Route path="community" element={<AddaGroups />} />
          <Route path="messages" element={<AddaMessages />} />
          <Route path="post/:postId" element={<PostDetails />} />
          <Route path="notifications" element={<Notification />} />
          <Route
            path="meme"
            element={
              <SubscriptionGuard>
                <MemePage />
              </SubscriptionGuard>
            }
          />
          <Route path="meme/:memeId" element={<MemeDetails />} />
          <Route path="user/:userId" element={<ProfileDetails />} />
          <Route path="search-friend" element={<FriendSearch />} />
          <Route path="posts/:postId" element={<PostPage />} />
        </Route>
        <Route path="user-profile" element={<Profile />} />
      </Routes>
    </Suspense>
  );
};

export default AddaRouter;
