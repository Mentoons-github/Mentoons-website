import FriendSearch from "@/components/adda/searchFriend/searchFriend";
import Loader from "@/components/common/Loader";
import SubscriptionGuard from "@/components/protected/subscriptionGuard";
import AddaLayout from "@/layout/addaLayout";
import ColorTubeGame from "@/pages/v2/adda/games/colorTubes";
import Instruments from "@/pages/v2/adda/games/Instruments";
import Inventors from "@/pages/v2/adda/games/Inventors";
import OddOneOut from "@/pages/v2/adda/games/OddOneOut";
import Cartoonmoji from "@/pages/v2/adda/games/cartoonmoji";
import Dice from "@/pages/v2/adda/games/dice";
import BrainStack from "@/pages/v2/adda/games/brainStack";
import GameLobby from "@/pages/v2/adda/games/game";
import GridFlash from "@/pages/v2/adda/games/gridFlash";
import PostPage from "@/pages/v2/adda/postPage";
import ContestVotingPage from "@/pages/v2/adda/showCase";
import Profile from "@/pages/v2/profile";
import { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import FlipAndMatch from "@/pages/v2/adda/games/flipAndMatch";
import StickMaster from "@/pages/v2/adda/games/stickMaster";
import LeaderBoard from "@/pages/v2/adda/games/leaderBoard";
import ColorClash from "@/pages/v2/adda/games/colorClash";
import SpeedAdd from "@/pages/v2/adda/games/mindMath";
import WordBuilder from "@/pages/v2/adda/games/wordBuilder";
import SortMyDeck from "@/pages/v2/adda/games/sortMyDeck";

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
        <Route path="game-lobby" element={<GameLobby />} />
        <Route path="user-profile" element={<Profile />} />
        <Route path="game" element={<></>} />
        <Route path="game-lobby/inventors" element={<Inventors />} />
        <Route path="game-lobby/instruments" element={<Instruments />} />
        <Route path="game-lobby/color-tube" element={<ColorTubeGame />} />
        <Route path="game-lobby/odd-one-out" element={<OddOneOut />} />
        <Route path="show-case" element={<ContestVotingPage />} />
        <Route path="game-lobby/dice" element={<Dice />} />
        <Route path="game-lobby/cartoonmoji" element={<Cartoonmoji />} />
        <Route path="game-lobby/grid-flash" element={<GridFlash />} />
        <Route path="game-lobby/mind-stack" element={<BrainStack />} />
        <Route path="game-lobby/flip-and-match" element={<FlipAndMatch />} />
        <Route path="game-lobby/stick-master" element={<StickMaster />} />
        <Route path="game-lobby/color-clash" element={<ColorClash />} />
        <Route path="game-lobby/mind-math" element={<SpeedAdd />} />
        <Route path="game-lobby/word-builder" element={<WordBuilder />} />
        <Route path="game-lobby/sort-my-deck" element={<SortMyDeck />} />
        <Route path="leaderboard" element={<LeaderBoard />} />
      </Routes>
    </Suspense>
  );
};

export default AddaRouter;
