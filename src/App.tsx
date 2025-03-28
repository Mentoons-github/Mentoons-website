import { useAuth } from "@clerk/clerk-react";
import React from "react";
import { Provider, useDispatch } from "react-redux";
import { Toaster } from "sonner";
import Router from "./Routes";
import ScrollToTop from "./components/comics/ScrollToTop";
import { getCart } from "./redux/cartSlice";
import { AppDispatch, store } from "./redux/store";


const App = () => {
  const { getToken, userId } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

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
    <Provider store={store}>
      <ScrollToTop />
      <Router />
      <Toaster position="top-right" closeButton richColors />
    </Provider>
  );
};

export default App;
