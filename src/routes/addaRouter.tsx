import FriendSearch from "@/components/adda/searchFriend/searchFriend";
import AddaLayout from "@/layout/addaLayout";
import PostPage from "@/pages/v2/adda/postPage";
import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const AddaHome = lazy(() => import("@/pages/v2/adda/home.tsx"));
const AddaGroups = lazy(() => import("@/pages/v2/adda/groups"));
const AddaMessages = lazy(() => import("@/pages/v2/adda/messages"));
const UserProfile = lazy(() => import("@/pages/v2/adda/userProfile/profile"));
const PostDetails = lazy(() => import("@/pages/v2/adda/postDetails"));
const ProfileDetails = lazy(() => import("@/pages/v2/adda/profileDetails"));
const Notification = lazy(
  () => import("@/components/adda/home/notifications/notification")
);
const MemePage = lazy(() => import("@/pages/v2/adda/MemePage"));
const MemeDetails = lazy(() => import("@/pages/v2/adda/memeDetails"));

const AddaRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<AddaLayout />}>
        <Route index element={<AddaHome />} />
        <Route path="community" element={<AddaGroups />} />
        <Route path="messages" element={<AddaMessages />} />
        <Route path="post/:postId" element={<PostDetails />} />
        <Route path="notifications" element={<Notification />} />
        <Route path="meme" element={<MemePage />} />
        <Route path="meme/:memeId" element={<MemeDetails />} />
        <Route path="user/:userId" element={<ProfileDetails />} />
        <Route path="search-friend" element={<FriendSearch />} />
        <Route path="posts/:postId" element={<PostPage />} />
      </Route>
      <Route path="user-profile" element={<UserProfile />} />
    </Routes>
  );
};

export default AddaRouter;
