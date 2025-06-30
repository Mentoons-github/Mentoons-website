import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { Toaster } from "sonner";
import Router from "./Routes";
import ScrollToTop from "./components/comics/ScrollToTop";
import DailyLoginReward from "./components/rewards/DailyLoginReward";
import RewardIntegrations from "./components/rewards/RewardIntegrations";
import { RewardsProvider } from "./context/RewardsContext";
import { getCart } from "./redux/cartSlice";
import { AppDispatch, RootState, store } from "./redux/store";
import { userLoggedIn } from "./redux/userSlice";
import { SocketProvider } from "./context/adda/provider/socketProvider";
import {
  addNewMessage,
  updateLastMessage,
  resetUnreadCount,
  incrementUnreadCount,
} from "./redux/adda/conversationSlice";
import useSocket from "./hooks/adda/useSocket";
import { Message } from "./types";

const AppContent = () => {
  const { getToken, userId } = useAuth();
  const { isSignedIn } = useUser();
  const dispatch = useDispatch<AppDispatch>();
  const { socket, mongoUserId } = useSocket(); // 👈 your custom hook
  const currentOpenConversationId = useSelector(
    (state: RootState) => state.conversation.conversationId
  );

  useEffect(() => {
    if (isSignedIn) {
      dispatch(userLoggedIn());
    }
  }, [isSignedIn, dispatch]);

  useEffect(() => {
    const fetchCart = async () => {
      const token = await getToken();
      if (token && userId) {
        const response = await dispatch(getCart({ token, userId }));
        console.log("Response Data", response);
      }
    };

    fetchCart();
  }, [dispatch, getToken, userId]);

  // 🔌 GLOBAL SOCKET MESSAGE LISTENER
  useEffect(() => {
    if (!socket) return;
    socket.on("receive_message", (data:Message) => {
      console.log(" Global receive_message:", data);
      dispatch(addNewMessage(data));
      dispatch(
        updateLastMessage({
          conversationId: data.conversationId,
          message: data.message,
          fileType: data.fileType,
          updatedAt: data.createdAt,
        })
      );

      if (data.conversationId === currentOpenConversationId) {
        socket.emit("mark_as_read", { conversationId: data.conversationId });
        dispatch(
          resetUnreadCount({
            conversationId: data.conversationId,
            userId: mongoUserId,
          })
        );
      } else {
        dispatch(
          incrementUnreadCount({
            conversationId: data.conversationId,
            userId: mongoUserId,
          })
        );
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket, currentOpenConversationId, mongoUserId, dispatch]);

  return (
    <>
      <ScrollToTop />
      <Router />
      <Toaster position="top-right" closeButton richColors />
      <RewardIntegrations />
      <DailyLoginReward />
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <SocketProvider>
        <RewardsProvider>
          <AppContent />
        </RewardsProvider>
      </SocketProvider>
    </Provider>
  );
};

export default App;
