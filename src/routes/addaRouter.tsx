// import AddaOverlay from "@/layout/addaOverlay";
import MemePage from "@/pages/v2/adda/MemePage";
import MemeDetails from "@/pages/v2/adda/memeDetails";
import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/components/adda/auth/protectedRoute";

const AddaHome = lazy(() => import("@/pages/v2/adda/home.tsx"));
const AddaGroups = lazy(() => import("@/pages/v2/adda/groups"));
const AddaMessages = lazy(() => import("@/pages/v2/adda/messages"));
const UserProfile = lazy(() => import("@/pages/v2/adda/userProfile"));
const PostDetails = lazy(() => import("@/pages/v2/adda/postDetails"));
const ProfileDetails = lazy(() => import("@/pages/v2/adda/profileDetails"));
const Notification = lazy(
  () => import("@/components/adda/home/notifications/notification")
);

const AddaRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<AddaHome />} />
      <Route
        path="/community"
        element={
          <ProtectedRoute>
            <AddaGroups />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <AddaMessages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/post/:postId"
        element={
          <ProtectedRoute>
            <PostDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notification />
          </ProtectedRoute>
        }
      />
      <Route
        path="/meme"
        element={
          <ProtectedRoute>
            <MemePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/meme/:memeId"
        element={
          <ProtectedRoute>
            <MemeDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/:userId"
        element={
          <ProtectedRoute>
            <ProfileDetails />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AddaRouter;
