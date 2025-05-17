import { configureStore } from "@reduxjs/toolkit";
// import cardProductReducer from "./cardProductSlice";
import userStatusReducer from "./adda/statusSlice";
import careerReducer from "./careerSlice";
import cartReducer from "./cartSlice";
import comicsReducer from "./comicSlice";
import fileUploadReducer from "./fileUploadSlice";
import authReducer from "./loginSlice";
import podcastReducer from "./Podcastslice";
import productsReducer from "./productSlice";
import rewardsReducer from "./rewardSlice";
import sessionReducer from "./sessionSlice";
import userReducer from "./userSlice";
import workshopReducer from "./workshopSlice";

export const store = configureStore<{
  comics: ReturnType<typeof comicsReducer>;
  user: ReturnType<typeof userReducer>;
  workshop: ReturnType<typeof workshopReducer>;
  auth: ReturnType<typeof authReducer>;
  career: ReturnType<typeof careerReducer>;
  fileUpload: ReturnType<typeof fileUploadReducer>;
  podcast: ReturnType<typeof podcastReducer>;
  // cardProduct: ReturnType<typeof cardProductReducer>;
  cart: ReturnType<typeof cartReducer>;
  products: ReturnType<typeof productsReducer>;
  userStatus: ReturnType<typeof userStatusReducer>;
  session: ReturnType<typeof sessionReducer>;
  rewards: ReturnType<typeof rewardsReducer>;
}>({
  reducer: {
    comics: comicsReducer,
    user: userReducer,
    workshop: workshopReducer,
    auth: authReducer,
    career: careerReducer,
    fileUpload: fileUploadReducer,
    podcast: podcastReducer,
    // cardProduct: cardProductReducer,
    cart: cartReducer,
    products: productsReducer,
    userStatus: userStatusReducer,
    session: sessionReducer,
    rewards: rewardsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
