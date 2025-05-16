import { useAuth, useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { Toaster } from "sonner";
import Router from "./Routes";
import ScrollToTop from "./components/comics/ScrollToTop";
import DailyLoginReward from "./components/rewards/DailyLoginReward";
import RewardIntegrations from "./components/rewards/RewardIntegrations";
import { RewardsProvider } from "./context/RewardsContext";
import { getCart } from "./redux/cartSlice";
import { AppDispatch, store } from "./redux/store";
import { userLoggedIn } from "./redux/userSlice";

const AppContent = () => {
  const { getToken, userId } = useAuth();
  const { isSignedIn } = useUser();
  const dispatch = useDispatch<AppDispatch>();

  // Dispatch userLoggedIn action when Clerk authentication is confirmed
  useEffect(() => {
    if (isSignedIn) {
      dispatch(userLoggedIn());
    }
  }, [isSignedIn, dispatch]);

  React.useEffect(() => {
    const fetchCart = async () => {
      const token = await getToken();
      if (token && userId) {
        const response = await dispatch(getCart({ token, userId }));
        console.log("Response Data", response);
      }
    };

    fetchCart();
  }, [dispatch, getToken, userId]);

  return (
    <>
      <ScrollToTop />
      <Router />
      <Toaster position="top-right" closeButton richColors />

      {/* Reward system components */}
      <RewardIntegrations />
      <DailyLoginReward />
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <RewardsProvider>
        <AppContent />
      </RewardsProvider>
    </Provider>
  );
};

export default App;
